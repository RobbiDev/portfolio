===
{
	"title": "SiloLink & SiloCloud",
	"date": "2025-03-01",
	"summary": "TODO: one or two sentences on what SiloLink and SiloCloud do, who uses them, and the result.",
	"category": ["SOFTWARE", "AUTOMATION"],
	"technologies": ["SQL", "Express.js", "TypeScript", "Tailwind CSS"],
	"role": "Design & development, end to end",
	"client": "Personal Project & Imaflex USA",
	"timeline": "January 2025 - March 2025",
	"status": "TODO",
	"githubUrl": "https://github.com/RobbiDev/SiloLink-SiloCloud",
	"projectColor": "#5170ff",
	"coverImage": "/images/silo-sync/thumbnail.png",
	"features": [
		"SiloLink — TODO: what it does",
		"SiloCloud — TODO: what it does"
	],
	"gallery": []
}
===

<!--
STARTER: renamed from the old "Silo Sync" draft (same tech, client, timeline and thumbnail).
If SiloLink/SiloCloud is a different project from Silo Sync, say so and I'll split them.
The GitHub repo only has a README so far; push the code or remove "githubUrl".
When it's ready, move this file up to content/projects/ to publish it.
-->

:::problem The Problem & The Approach
**The problem.** What was happening with the silos at Imaflex before this? How was
material level / status tracked, who needed that information, and what went wrong
when they didn't have it?

---

**The approach.** How the pieces split: what SiloLink does on the plant floor, what
SiloCloud does on top of it, and why you separated them.
:::

## Context

Where this runs at Imaflex, what equipment it talks to (PLCs, sensors, the network), and
who looks at it.

## What I Built

- **SiloLink** — the decision behind it and the trade-off you accepted.
- **SiloCloud** — the decision behind it and the trade-off you accepted.

## Under the Hood

How data gets from the silo to the screen: the protocol, the database (SQL), the
Express/TypeScript API, and how often it updates.

:::note The hardest part
The integration problem that took longest, and what fixed it.
:::

## Results

| Measure | Before | After |
| --- | --- | --- |
| TODO | TODO | TODO |

## What I'd Do Differently

One or two honest lessons, and what's next.
