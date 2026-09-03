===
{
	"title": "Post Title",
	"date": "2026-02-16",
	"summary": "Short summary shown on the postcard and under the headline.",
	"author": "Robert Johnson",
	"location": "Thomasville, NC",
	"featured": false,
	"category": "Blog",
	"tags": ["Systems", "Design"],
	"blogColor": "#10b981",
	"coverImage": "/images/blog/cover.jpg",
	"gallery": [
		{ "url": "/images/blog/one.png", "title": "First shot", "caption": "What it shows", "alt": "Alt text" }
	]
}
===

# Post Title

Ordinary markdown works: **bold**, *italic*, `inline code`, [links](https://example.com),
lists, tables (GFM), footnote-style rules, and fenced code blocks with a language
for syntax colouring.

Beyond that, a few directives expand into the site's own components.

## Callouts

:::note Field note
`:::note`, `:::tip`, `:::warn` and `:::danger`. The text after the keyword is the
title, and the body is full markdown. Close with `:::`.
:::

## Quotes with attribution

A closing line that starts with an em dash becomes the credit under the quote.

> Everything can always be improved.
> — the rule I picked up at my first job

## Keycaps

Wrap a key in double plus signs: press ++Ctrl++ + ++K++.

## Images and rich embeds

A standalone image becomes a captioned figure; the title (in quotes) is the caption.

![Alt text](/images/blog/one.png "Caption under the figure")

Paste a bare URL on its own line and it becomes a player — YouTube, Vimeo, Loom,
CodePen, CodeSandbox, Figma, Spotify and GitHub gists are recognised:

	https://www.youtube.com/watch?v=VIDEO_ID

Or be explicit, which also lets you add a caption:

	::youtube[https://youtu.be/VIDEO_ID]{caption="Walkthrough"}
	::video[/media/demo.mp4]{poster="/media/demo.jpg" caption="First run"}
	::embed[https://example.com/dashboard]{title="Live dashboard" ratio="4/3"}
	::figure[/images/blog/two.png]{caption="A figure" alt="Alt text"}
	::gallery

`::gallery` renders every image from this file's own `gallery` metadata as a
clickable strip that opens the lightbox.

Linking to `#work`, `#writing`, `#about` or `#contact` moves the reader to that
panel instead of following a dead anchor.

---

Files in this folder are published. Move a file into `in-process/` to keep it as
a draft: it stays out of the site until it comes back up a level.
