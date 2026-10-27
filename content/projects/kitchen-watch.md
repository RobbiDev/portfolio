===
{
	"title": "KitchenWatch",
	"date": "2024-07-27",
	"summary": "A full-stack task-tracking system built for a high-volume Chick-fil-A kitchen: glanceable timers, SMS alerts, and analytics that hold up during the lunch rush.",
	"category": ["SOFTWARE"],
	"technologies": ["Next.js", "Tailwind CSS", "Express.js", "MongoDB"],
	"role": "Design & development, end to end",
	"client": "Chick-fil-A · Grandover Village, NC",
	"timeline": "2023 - 2024",
	"status": "Retired",
	"githubUrl": "https://github.com/RobbiDev/KitchenWatch",
	"projectColor": "#E51636",
	"coverImage": "/images/kitchenwatch/cover.png",
	"features": [
		"Time-sensitive trackers — countdowns for the tasks a kitchen can't afford to miss",
		"Custom trackers — each store models its own routines",
		"SMS alerts — reach the right person when something slips, screen or no screen",
		"Activity log — a record of what was done, and when",
		"Analytics — year-over-year comparisons for the same week last year",
		"Accounts — login and sign-up for each store's team"
	],
	"gallery": []
}
===

<!--
STARTER: facts here come from the KitchenWatch README and the "Shipping KitchenWatch" post.
CHECK: timeline, status (is it still running?), and whether "Retired" is right.
ADD: screenshots to public/images/kitchenwatch/ and list them in "gallery".
Published while in progress: the prompts below show on the site until you replace them.
-->

:::problem The Problem & The Approach
**The problem.** In a high-volume Chick-fil-A kitchen, the friction wasn't how fast
the team worked; it was how information was tracked. Time-sensitive tasks lived in
people's heads and on paper, and when visibility broke down, ticket times and stress
climbed together.

<!-- Put a number on it if you can: missed tasks per shift, minutes lost, audit findings. -->

---

**The approach.** A web app built for the line, not the office: glanceable on a screen
across the station, one tap per action, and able to recover from a network hiccup
without anyone reaching over to refresh it. Off-the-shelf tools didn't fit one store's
kitchen floor, so I built one that did.

<!-- What else did you consider (paper checklists, an existing app) and why did you rule it out? -->
:::

## Context

I was Back of House Supervisor at Chick-fil-A Grandover Village, running food prep and
fixing the store's POS and hardware issues. KitchenWatch grew out of watching where the
kitchen lost time.

<!-- Describe the store's volume, the stations involved, and who used KitchenWatch day to day. -->

## What I Built

- **The rush-hour test** — every screen had to be readable from across the station in
  half a second, or it wasn't done.
- **Alerts that leave the screen** — SMS reaches a manager even when nobody is watching
  the display.
- **Stores define their own trackers** — custom trackers instead of a fixed checklist.

<!-- Add a screenshot: ![Tracker screen](/images/kitchenwatch/trackers.png "The tracker view on the line") -->

## Under the Hood

Next.js and Tailwind CSS on the front end; an Express API over MongoDB behind it.

<!--
Worth explaining: how timers stay accurate across devices, how SMS is sent (Twilio?),
how the app recovers when the connection drops, how the year-over-year analytics are stored.
-->

:::note The hardest part
<!-- The bug or constraint that took longest to solve, and what fixed it. -->
:::

## Results

<!-- What changed once it shipped? Fewer missed tasks, faster tickets, a quote from a manager. -->

| Measure | Before | After |
| --- | --- | --- |
| — | — | — |

## What I'd Do Differently

<!-- One or two honest lessons. The post's line works well here: "Classroom assignments teach
you how to build software right; shipping teaches you how to build the right software." -->
