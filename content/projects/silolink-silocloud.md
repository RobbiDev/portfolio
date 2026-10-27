===
{
	"title": "SiloLink & SiloCloud",
	"date": "2026-02-01",
	"summary": "Live inventory for 18 production silos at Imaflex USA, read from radar level sensors and shown on screens across the plant and online, cutting incorrect silo pulls by 80%.",
	"category": ["SOFTWARE", "AUTOMATION"],
	"technologies": ["SQL", "Express.js", "TypeScript", "Tailwind CSS"],
	"role": "Design & development, end to end",
	"client": "Imaflex USA",
	"timeline": "February 2026 - Present",
	"status": "Live · in production",
	"githubUrl": "https://github.com/RobbiDev/SiloLink-SiloCloud",
	"projectColor": "#5170ff",
	"coverImage": "/images/silo-sync/thumbnail.png",
	"features": [
		"SiloLink — a plant web server that reads BinMaster radar sensor data from a Windows SQL database and shows live inventory for all 18 silos on screens around the facility",
		"SiloCloud — syncs plant telemetry to an online dashboard, so silo levels can be checked from anywhere, 24/7",
		"Automated reports — scheduled email reports on silo inventory",
		"Results — an 80% drop in incorrect silo pulls"
	],
	"gallery": []
}
===

<!--
Facts here come from the résumé (Sep 2026). Still to do: the sections below the
problem/approach, a new thumbnail (the current one still says "Silo Sync"), and the
GitHub repo only has a README so far; push the code or remove "githubUrl".
Published while in progress: the prompts below show on the site until you replace them.
-->

:::problem The Problem & The Approach
**The problem.** Imaflex runs 18 silos of raw material in an active production
environment. When an operator can't see what's in each one, material gets pulled from
the wrong silo, and an incorrect pull means cross-contamination on the line.

<!-- Add how levels were tracked before, and how often wrong pulls happened. -->

---

**The approach.** Read the BinMaster radar sensors the silos already have and put
their numbers where people make the decision. **SiloLink** is a web server on the
plant network that pulls the sensor metrics out of a Windows SQL database and shows
live inventory for every silo on screens across the facility. **SiloCloud**
securely syncs that local telemetry to an online dashboard with automated email
reports, so the same picture is available 24/7 from anywhere.

The result: an **80% drop in incorrect silo pulls**.
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
