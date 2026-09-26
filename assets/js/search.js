// Full-text search for mental models.
// Loads /search.json on first open, splits each page into sections by heading,
// and shows where each match comes from (page, section, highlighted text).
(function () {
  var modal = $('#searchModal');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var status = document.getElementById('search-status');
  if (!modal.length || !input) return;

  var MAX_RESULTS = 20;
  var SNIPPET_LENGTH = 160;
  var docs = null;
  var loading = null;
  var activeIndex = -1;

  function load() {
    if (!loading) {
      loading = fetch((window.siteBaseUrl || '') + '/search.json')
        .then(function (response) { return response.json(); })
        .then(function (raw) { docs = raw.map(prepareDoc); })
        .catch(function () {
          loading = null;
          showMessage('Search could not load. Please try again.');
        });
    }
    return loading;
  }

  function clean(text) {
    return (text || '').replace(/\s+/g, ' ').trim();
  }

  // Split page HTML into text blocks, each tagged with the heading above it.
  function prepareDoc(doc) {
    var body = new DOMParser().parseFromString(doc.html || '', 'text/html').body;
    var section = 'Intro';
    var sectionId = '';
    var blocks = [];

    function push(el) {
      var text = clean(el.textContent);
      if (text) blocks.push({ section: section, id: sectionId, text: text, lower: text.toLowerCase() });
    }

    Array.prototype.forEach.call(body.children, function (el) {
      if (/^H[1-6]$/.test(el.tagName)) {
        section = clean(el.textContent);
        sectionId = el.id || '';
      } else if (el.tagName === 'UL' || el.tagName === 'OL') {
        Array.prototype.forEach.call(el.children, push);
      } else {
        push(el);
      }
    });

    var name = clean(doc.name);
    var meta = clean(doc.benefit) + ' ' + clean(doc.summary);
    return {
      name: name,
      url: doc.url,
      summary: clean(doc.summary),
      nameLower: name.toLowerCase(),
      metaLower: meta.toLowerCase(),
      blocks: blocks,
      all: (name + ' ' + meta + ' ' + blocks.map(function (b) { return b.lower; }).join(' ')).toLowerCase()
    };
  }

  function countHits(text, words) {
    return words.filter(function (w) { return text.indexOf(w) !== -1; }).length;
  }

  function search(query) {
    var words = query.toLowerCase().split(/\s+/).filter(Boolean);
    var matches = [];

    docs.forEach(function (doc) {
      // Every word has to appear somewhere on the page
      if (countHits(doc.all, words) < words.length) return;

      var phrase = words.join(' ');
      var best = null;
      var bestHits = 0;
      doc.blocks.forEach(function (block) {
        // The exact phrase counts extra, so "warren buffett" beats a URL with both words
        var hits = countHits(block.lower, words) + (words.length > 1 && block.lower.indexOf(phrase) !== -1 ? 2 : 0);
        if (hits > bestHits) {
          best = block;
          bestHits = hits;
        }
      });

      var score = countHits(doc.nameLower, words) * 10 + countHits(doc.metaLower, words) * 3 + bestHits;
      matches.push({ doc: doc, block: best, score: score });
    });

    matches.sort(function (a, b) {
      return b.score - a.score || a.doc.name.localeCompare(b.doc.name);
    });
    return { words: words, matches: matches.slice(0, MAX_RESULTS), total: matches.length };
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function wordsPattern(words, escape) {
    return words
      .slice()
      .sort(function (a, b) { return b.length - a.length; })
      .map(function (w) { return escapeRegExp(escape ? escapeHtml(w) : w); })
      .join('|');
  }

  function highlight(text, words) {
    return escapeHtml(text).replace(new RegExp('(' + wordsPattern(words, true) + ')', 'gi'), '<mark>$1</mark>');
  }

  function firstMatchIndex(lower, words) {
    var first = -1;
    words.forEach(function (w) {
      var i = lower.indexOf(w);
      if (i !== -1 && (first === -1 || i < first)) first = i;
    });
    return first;
  }

  // Cut a window of text around the first match, starting on a word boundary
  function snippet(block, words) {
    var text = block.text;
    var index = Math.max(0, firstMatchIndex(block.lower, words));
    var start = Math.max(0, index - 50);
    if (start > 0) {
      var space = text.indexOf(' ', start);
      start = space !== -1 && space < index ? space + 1 : start;
    }
    var end = Math.min(text.length, start + SNIPPET_LENGTH);
    if (end < text.length) {
      var lastSpace = text.lastIndexOf(' ', end);
      end = lastSpace > index ? lastSpace : end;
    }
    return (start > 0 ? '… ' : '') + text.slice(start, end) + (end < text.length ? ' …' : '');
  }

  // Link to the section, with the search words so the page can highlight them
  function resultUrl(match, words) {
    var block = match.block;
    var url = match.doc.url + '?highlight=' + encodeURIComponent(words.join(' '));
    return block && block.id ? url + '#' + block.id : url;
  }

  function showMessage(text) {
    results.innerHTML = '<p class="search-empty">' + escapeHtml(text) + '</p>';
    status.textContent = text;
    activeIndex = -1;
    input.removeAttribute('aria-activedescendant');
  }

  function render() {
    var query = input.value.trim();
    if (!query) {
      showMessage('Type to search names and the text inside every mental model.');
      return;
    }
    if (!docs) {
      showMessage('Loading…');
      return;
    }

    var found = search(query);
    if (!found.matches.length) {
      showMessage('No results for "' + query + '"');
      return;
    }

    results.innerHTML = found.matches.map(function (match, i) {
      var block = match.block;
      var section = block ? block.section : 'Summary';
      var text = block ? snippet(block, found.words) : match.doc.summary;
      return '<a class="search-result" role="option" id="search-result-' + i + '" href="' + escapeHtml(resultUrl(match, found.words)) + '">' +
        '<span class="search-result-title">' + highlight(match.doc.name, found.words) +
        '<span class="search-result-section"><span class="fa fa-angle-right" aria-hidden="true"></span> ' + escapeHtml(section) + '</span></span>' +
        '<span class="search-result-snippet">' + highlight(text, found.words) + '</span>' +
        '</a>';
    }).join('');

    status.textContent = found.total + (found.total === 1 ? ' result' : ' results');
    setActive(0);
  }

  function setActive(index) {
    var items = results.querySelectorAll('.search-result');
    if (!items.length) return;
    activeIndex = (index + items.length) % items.length;
    Array.prototype.forEach.call(items, function (item, i) {
      var active = i === activeIndex;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    items[activeIndex].scrollIntoView({ block: 'nearest' });
    input.setAttribute('aria-activedescendant', items[activeIndex].id);
  }

  function open() {
    modal.modal('show');
  }

  input.addEventListener('input', render);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIndex + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIndex - 1);
    } else if (e.key === 'Enter') {
      var active = results.querySelectorAll('.search-result')[activeIndex];
      if (active) {
        e.preventDefault();
        window.location.href = active.href;
      }
    }
  });

  results.addEventListener('mousemove', function (e) {
    var item = e.target.closest('.search-result');
    if (item) setActive(Array.prototype.indexOf.call(results.children, item));
  });

  modal.on('shown.bs.modal', function () {
    input.focus();
    input.select();
    render();
    load().then(render);
  });

  $(document).on('click', '[data-search-open]', open);

  // On a mental model page opened from search, highlight the search words
  // and scroll to the first one in the linked section
  function highlightPage() {
    var root = document.querySelector('.mental-model-content');
    var query = new URLSearchParams(window.location.search).get('highlight');
    if (!root || !query) return;

    var words = query.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 1; });
    if (!words.length) return;
    var pattern = new RegExp('(' + wordsPattern(words, false) + ')', 'gi');

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) {
      pattern.lastIndex = 0;
      if (pattern.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
    }

    nodes.forEach(function (node) {
      var fragment = document.createDocumentFragment();
      node.nodeValue.split(pattern).forEach(function (part, i) {
        if (!part) return;
        if (i % 2) {
          var mark = document.createElement('mark');
          mark.className = 'search-hit';
          mark.textContent = part;
          fragment.appendChild(mark);
        } else {
          fragment.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(fragment, node);
    });

    var marks = root.querySelectorAll('mark.search-hit');
    if (!marks.length) return;
    var section = window.location.hash ? document.getElementById(decodeURIComponent(window.location.hash.slice(1))) : null;
    var target = marks[0];
    if (section) {
      for (var i = 0; i < marks.length; i++) {
        if (section.compareDocumentPosition(marks[i]) & Node.DOCUMENT_POSITION_FOLLOWING) {
          target = marks[i];
          break;
        }
      }
    }
    // Wait for the browser's own jump to the #section, then center the match
    window.addEventListener('load', function () {
      target.scrollIntoView({ block: 'center' });
    });
  }

  highlightPage();

  // Show the Mac shortcut on Macs
  if (/Mac|iPhone|iPad/.test(navigator.platform)) {
    $('.search-launcher kbd').text('⌘ K');
    $('[data-search-open][title]').attr('title', 'Search (⌘K)');
  }

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
      e.preventDefault();
      open();
    }
  });
})();
