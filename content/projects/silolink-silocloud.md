===
{
	"title": "SiloLink & SiloCloud",
	"date": "2025-03-01",
	"summary": "Connecting the silos at Imaflex USA to the network and the cloud, so material levels and status are visible from anywhere.",
	"category": ["SOFTWARE", "AUTOMATION"],
	"technologies": ["SQL", "Express.js", "TypeScript", "Tailwind CSS"],
	"role": "Design & development, end to end",
	"client": "Personal Project & Imaflex USA",
	"timeline": "January 2025 - March 2025",
	"status": "In development",
	"githubUrl": "https://github.com/RobbiDev/SiloLink-SiloCloud",
	"projectColor": "#5170ff",
	"coverImage": "/images/silo-sync/thumbnail.png",
	"features": [
		"SiloLink — the link between the silos and the network",
		"SiloCloud — the cloud view of every silo"
	],
	"gallery": []
}
===

<!--
STARTER: the summary and features are placeholder guesses; replace them.
Renamed from the old "Silo Sync" draft (same tech, client, timeline and thumbnail).
If SiloLink/SiloCloud is a different project from Silo Sync, say so and I'll split them.
The GitHub repo only has a README so far; push the code or remove "githubUrl".
Published while in progress: the prompts below show on the site until you replace them.
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
| — | — | — |

## What I'd Do Differently

One or two honest lessons, and what's next.
