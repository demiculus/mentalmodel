---
layout: mental-model
name: Understanding
benefit: Take correct actions
summary: Increasing understanding makes us able to control it
prerequisites:
---

## Description

Majority of the time we overcome a problem we don't fully understand why. Because of that, in the future when a similar problem happens again it isn't easier to solve it. 

For the times we fully understand the root cause of the problem, the next time we see it, it becomes a piece of cake to solve it. For this reason we should seek understanding rather than satisfying problems. 

## Examples:

### Software Development

When there is a problem we can take 2 approaches

#### Focus on fixing it by trying out stuff, eventually one of the solutions work so we can move on. 

<img src="https://pbs.twimg.com/media/DMes69xXkAA4-7z.jpg"
     alt="Markdown Monster icon"
     style="width: 49%" />
<img src="https://i.redd.it/4r9efz3e9sez.jpg"
     alt="Markdown Monster icon"
     style="width: 49%" />

#### Focus on understanding how it works.

Here is an example of how my co-worker solves this issue.

> I was trying to solve the user taking action bug. Then I got curious and wrote queries on how many users were running into this bug. I saw that it was only 5% but another 10% were not taking action for a different reason. Then I dived into why that was and turns out we have this logic. I looked at the submission that created the logic and it was based on an assumption. Then I asked 5 players their thoughts and turns out none of them want this feature. Then I ran this poll in the community to verify it. I solved the initial bug, I created design tasks for the second bug and I saved the queries so it'll be easy for us to run them in the future.

Here the developer has acquired a good understanding of user behavior, how the company runs, its history and created systems making it easier for future developers.

Another time he said something like this:

> I was trying to solve the rendering problem. But I didn't know how rendering worked so I spent 20 minutes learning about it. Then I realized I didn't understand how our library rendered so I spent 20 minutes on that. Then I got curious how we are using the library and spent 20 minutes understanding that. I realized we can change 1 line of code to solve our rendering problem. On top of that our rendering process is not optimized so I created this submission refactoring our rendering engine which cleans up our codebase. I created 2 other tasks which are lower impact but will optimize rendering further when we need to.

Here the developer not only solved the problem but became an expert in it. So any future rendering problems he will be able to handle it easily. 

Read the memes again. The developer who understands why it works will 
- spend less time solving the same bugs
- create better solutions

### UX Design

Same as developer, 2 approaches.

1. Creates 5 types of button designs, PM selects one of the design and asks specific parts to change. Designer changes it submits it, after 3 iterations it gets approved. Short term problem solved. But next time something similar happens designer will still waste time with the wrong stuff and need iterations.

2. Creates 5 types of button designs. Says `Design A` is the best. PM selects `Design B` and asks for iterations. The designer gets curious why that was selected. Reads case studies. Ask the PM for the reason. Talks to users. And understands fully what needs to be done and why. Then does 1 iteration and it gets approved.

Here the designer spent time understanding what needs to be done and why. In the future the designer won't be needing feedback from the PM.

### Management

Lets say a team member messed up somewhere.

1. The manager gives feedbacks, asks it to be fixed and moved on.
2. The manager asks the following 

> I’m guessing you are aware we’re not super happy about your work. And I want to understand why that is. I think you’re smart and conscientious.
> 
> So here are my assumptions
> 
> 1. You don’t fully grasp what we need.
> 
> There are so many projects going on. We need any extra time that we can get. When we give a task we expect it to be delivered fully on the first submission. We can't spend time giving feedbacks. We can’t train, we expect self training. Our time here is the bottleneck. We need people who will reduce the time we put into things.
> 
> 2. Your last job, your boss was okay with mid level submissions
> 
> I know its hard to change what you’re used to. But we’re aiming high. We’ve got a culture of perfectionism. We seek 5star work from everyone. 
> 
> 3. You don't really want or enjoy this job. So you don't optimize every aspect of your submission
> 
> This would also make sense. I would still advise to do perfect.
> 
> 4. You haven’t seen a good submission, a good level of work so your best is what you’re currently doing
> 
> Let me know if this is the case
> 
> 5. Something else?
> 
> Please let me know your thoughts on this.

If the manager doesn't understand what is wrong. He will dig deeper understanding how the employee works. What temperature he is working at, what devices he uses, what environment, what hours, is he getting enough sleep, is he rushing things, is he organized, is he taking notes etc. until the manager knows what makes this person be this person. 

### Relationship

1. Your SO(significant other) is frowning for the past week, you take them out on a dinner they become happy, you go home and sleep.
2. You ask your SO why they are frowning. How it works. Would they also be frowning of X reason? What about Y reason? What if X & Y together? Would doing a solve it or postpone it? Do they need it solved right now or is it okay if its later? How much later is fine? Anything else you can do to support them? Should you drop your plans? How confident are they to believe this method would work? What if this method doesn't work? What is the backup plan?

Your goal is understanding how things work. 

#### Practice

1. Select one thing you're working on
2. Book 60 minutes in your calendar
3. Spend 15 minutes diving to understand a core thing
4. Spend another 15 minutes for the next related thing
5. Repeat 15 minutes 2 more times
6. Now you can solve the problem

Whatever you dive in 4x15 minutes you should become a semi-expert in 4 components of that thing.
