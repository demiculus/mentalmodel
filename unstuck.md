<!DOCTYPE html>
<html>
<head>
  <title>Random Text Display</title>
</head>
<body>
  <p id="randomText"></p>

  <script>
    // Array of three random texts
    var texts = [
      "Text 1: This is the first random text.",
      "Text 2: Here's the second random text.",
      "Text 3: And this is the third random text."
    ];

    // Get a random text from the array
    var randomText = texts[Math.floor(Math.random() * texts.length)];

    // Display the random text on the page
    document.getElementById("randomText").innerText = randomText;
  </script>
</body>
</html>

<!-- 
# Get Unstuck

Refresh page for another tip.



What would your closest friend do?
What is the simplest solution?

<p id="unstuckText"></p>

<script>
// Array of three random texts
var texts = [
    "Text 1: This is the first random text.",
    "Text 2: Here's the second random text.",
    "Text 3: And this is the third random text."
];

// Get a random index from 0 to 2
var randomText = texts[Math.floor(Math.random() * texts.length)];

// Display the random text on the page
document.getElementById("unstuckText").innerText = randomText;
</script> -->