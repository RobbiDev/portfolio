===
{
	"title": "Project Name",
	"summary": "One or two sentences shown on the board and at the top of the detail panel.",
	"category": ["SOFTWARE"],
	"technologies": ["Next.js", "TypeScript"],
	"role": "Design & development, end to end",
	"client": "Client or Personal Project",
	"timeline": "January 2026 - March 2026",
	"status": "Live · in service since 2026",
	"liveUrl": "https://example.com",
	"githubUrl": "https://github.com/RobbiDev/example",
	"projectColor": "#3e6fb8",
	"coverImage": "/images/project/thumbnail.png",
	"features": [
		"Feature name — the sentence explaining it after an em dash"
	],
	"gallery": [
		{ "url": "/images/project/one.png", "title": "Dashboard", "caption": "What it shows", "alt": "Alt text" }
	]
}
===

# Project Name

This body is the **case study**: it renders behind the "Full Case Study" button on
the project's detail panel, using the same rich markdown as blog posts (callouts,
embeds, galleries, code, tables — see content/blog.template.md for the full list).

A `:::problem` block becomes the two-column spread the case study numbers as a
section of its own. Three or more dashes on their own line break the columns:

```
:::problem The Problem & The Approach
What was wrong, in the left column.

---

What the project does about it, in the right column.
:::
```

The heading after `:::problem` is optional and defaults to "The Problem & The
Approach"; `:::split` and `:::columns` are the same block without that default.

The metadata above drives the rest of the UI:

- `category` picks the transit line (software → red, network → yellow, controls →
  green, IT/infrastructure → blue).
- `features` become the route list on the detail panel; text after an em dash is
  the stop's description.
- `gallery` becomes the card stack and the lightbox.
- `coverImage` becomes the board thumbnail. Leave it out and the board falls back
  to the design's lettered block.

Files in this folder are published. Move a file into `in-process/` to keep it as a
draft: it stays out of the site until it comes back up a level.
