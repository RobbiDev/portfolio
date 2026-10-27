===
{
	"title": "Project Name",
	"date": "2026-01-01",
	"summary": "One or two sentences: what it is, who it's for, and the result. Shown on the board and atop the detail panel.",
	"category": ["SOFTWARE"],
	"technologies": ["Next.js", "TypeScript"],
	"role": "Design & development, end to end",
	"client": "Client name, or Personal Project",
	"timeline": "January 2026 - March 2026",
	"status": "Live · in service since 2026",
	"liveUrl": "https://example.com",
	"githubUrl": "https://github.com/RobbiDev/example",
	"projectColor": "#3e6fb8",
	"coverImage": "/images/project-name/thumbnail.png",
	"features": [
		"Feature one — what it does and why it matters",
		"Feature two — what it does and why it matters",
		"Feature three — what it does and why it matters"
	],
	"gallery": [
		{ "url": "/images/project-name/one.png", "title": "Screen name", "caption": "What this shot shows", "alt": "Describe the image" }
	]
}
===

<!--
HOW TO USE
1. Copy this file to content/projects/in-process/<slug>.md (the filename is the URL slug).
2. Fill in the metadata above. Delete any field you don't have (liveUrl, githubUrl,
   coverImage, gallery…) rather than leaving the placeholder.
   category: SOFTWARE, NETWORK, CONTROLS or IT — it picks the transit line colour.
3. Put images in public/images/<slug>/.
4. Write the sections below, deleting the prompts as you go.
5. When it's ready, move the file up a level to content/projects/ to publish it.

The case study page already shows Project Data (from the metadata), Where It's Headed
(liveUrl/githubUrl) and The Gallery — don't repeat those here.
-->

:::problem The Problem & The Approach
**The problem.** What was broken, slow, risky or missing? Who felt it, and how often?
Put a number on it if you can: hours lost a week, error rate, cost.

What made it hard: constraints, budget, existing systems, people, deadlines.

---

**The approach.** What you decided to build and why, in a sentence or two.

What you considered and ruled out, and the reason. This is the part that shows
judgement.
:::

## Context

Where this lives: the business, the team, the environment. Give a reader with no
background just enough to understand why the problem mattered.

## What I Built

Walk through the solution at the level of decisions, not a feature list (the route
list on the detail panel already covers features).

- **Decision one** — what you chose and the trade-off you accepted.
- **Decision two** — what you chose and the trade-off you accepted.

![Describe the screen](/images/project-name/one.png "Caption under the figure")

## Under the Hood

The technical part: architecture, data flow, the tricky bit and how you solved it.

```ts
// A short snippet that shows the interesting part, if there is one.
```

:::note The hardest part
The bug, edge case or constraint that took the longest, and what finally fixed it.
:::

## Results

What changed once it shipped. Numbers beat adjectives.

| Measure | Before | After |
| --- | --- | --- |
| Example metric | 20 min | 30 sec |

> A line of feedback from someone who uses it.
> — Name, role

## What I'd Do Differently

One or two honest lessons, and what's next for the project.
