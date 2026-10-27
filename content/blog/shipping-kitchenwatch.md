===
{
	"title": "Shipping KitchenWatch",
	"date": "2026-10-27",
	"summary": "What building real software for a Chick-fil-A kitchen at the height of the lunch rush taught me about production engineering.",
	"author": "Robert Johnson",
	"location": "Charlotte, NC",
	"category": "Blog",
	"tags": ["Software Engineering", "Systems", "Product", "KitchenWatch"],
	"blogColor": "#E51636",
	"project": "kitchen-watch"
}
===

Writing code that passes a unit test in a quiet dorm room is one thing. Writing software that has to survive a Chick-fil-A kitchen at 12:30 on a weekday, with the drive-thru wrapped around the building, is a completely different sport. That gap is where KitchenWatch came from.

## The Setup

If you have ever seen the inside of a high-volume Chick-fil-A kitchen, you know every second counts. The line moves at full speed, the margin for error is razor-thin, and every station depends on knowing what the others are doing. When visibility breaks down, ticket times climb and so does the stress.

Working back of house, I noticed that most of the friction wasn't coming from how fast the team worked. It came from how information was tracked and surfaced: what needed to be done, by when, and whether it had actually happened. Off-the-shelf software rarely accounts for the split-second details of one store's kitchen floor.

That was the moment I stopped building toy apps. KitchenWatch was going to be a real system for a real operational problem.

## What I Built

KitchenWatch is a full-stack web app built with Next.js and Tailwind CSS on the front end, and Express and MongoDB behind it. At its core it does a few things well:

- **Time-sensitive trackers** that count down the tasks a kitchen can't afford to miss.
- **Custom trackers** so each store can model its own routines instead of bending to mine.
- **SMS alerts** that reach the right person when something slips, even when nobody is looking at a screen.
- **An activity log** that records what was done, and when.
- **Analytics with year-over-year comparisons**, so a manager can see whether this week is actually better than the same week last year.

## What Happened

Building KitchenWatch forced me to throw out the textbook way of thinking and design strictly for the person on the line.

In a kitchen, nobody has time to dig through nested menus, wait three seconds for a loading spinner, or decode a dense dashboard while wearing gloves. The software had to be glanceable, resilient, and dead simple.

### The rush-hour test

Every UI decision had to pass one test: does it still work during the rush?

- Can a team member read this from across the station in half a second?
- If the Wi-Fi drops for a moment, does the screen recover on its own, without anyone reaching over to refresh it?
- Does it take one tap, or two?

If the answer was wrong, the feature wasn't done.

### Feedback from the floor

The most humbling part of building KitchenWatch was watching real people use it. With a class project, you submit the repo and never look at the code again. Here the feedback was immediate and unfiltered. If a workflow took two taps instead of one, I heard about it that shift. I went home that night, refactored it, and shipped the fix before the next one.

> Real users don't care how clever your backend is. They care whether your software makes the hardest hour of their day easier.

:::tip Takeaway
The best spec isn't written at a desk. It's found by standing where the work happens and watching where the friction lives.
:::

## What I Learned

KitchenWatch changed how I think about software engineering. It closed the gap between knowing how to write code and being an engineer who builds solutions.

The best technical decisions didn't come from guessing what users wanted. They came from watching the work, finding the friction, and iterating until the tool disappeared into the workflow. Classroom assignments teach you how to build software right. Shipping something like KitchenWatch teaches you how to build the right software.

---

Questions or thoughts? [Get in touch](#contact).
