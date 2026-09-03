===
{
  "title": "Hello, World",
  "date": "2026-08-31",
  "author": "Robert Johnson",
  "excerpt": "The first dispatch. What this blog is for, and a tour of every kind of note you'll find here.",
  "summary": "The first dispatch. What this blog is for, and a tour of every kind of note you'll find here.",
  "location": "New York, NY",
  "featured": true,
  "category": "Blog",
  "tags": ["Field Notes", "Meta"],
  "blogColor": "#1d3a5f"
}
===

Every project I ship teaches me something that never makes it into the repo. A network quirk, a PLC fault that only happens on Tuesdays, a design decision that looked wrong until it was right. This blog is where those notes go, **written up properly** instead of living in my head. Expect posts about *software, networks, control systems*, and the occasional detour into trains.

Since this is the first post, it doubles as a field guide to the formatting you'll see around here. Consider it a test page I get to keep.

## Headings and structure

Big sections get the heavy uppercase treatment with a rule, like the one above. Subsections step down politely:

### A subsection looks like this

Good for a change of angle inside a section without a hard break.

#### A labelled aside

Small mono labels like that one mark asides, dates, or spec callouts.

## Lists

Unordered, for things without a sequence:

- Networks that fail politely instead of loudly
- Documentation written before the incident, not after
- Tools that do one thing well

Ordered, for things that must happen in order:

1. Reproduce the problem
2. Change one thing
3. Write down what happened

## Quotes and callouts

> Everything can always be improved.
> — The rule I picked up at my first job and never put down

Callouts come in four flavours. Open one with `:::note`, `:::tip`, `:::warn` or `:::danger`, give it a title, and close it with `:::`.

:::note Field note
Green boxes like this hold tips, warnings, and the stuff I wish someone had told me earlier. They read fast on purpose.
:::

:::warn Before you touch the panel
Lock it out. Every shortcut I've regretted started with "it'll only take a second."
:::

## Code

Inline references look like `vlan 40` or `npm run build`. Longer samples get the full terminal card:

```cisco
# label a switchport the way you'll grep for it later
interface GigabitEthernet1/0/12
 description PACKAGING-LINE-2 "east PLC"
 switchport access vlan 40
 spanning-tree portfast
```

Keyboard shortcuts render as keys: press ++Ctrl++ + ++Shift++ + ++P++.

## Tables

| Line   | Category | Status     |
| ------ | -------- | ---------- |
| Red    | Software | In service |
| Yellow | Network  | Boarding   |
| Green  | Controls | Scheduled  |

## Images

![The board that started it all](/images/safelysds/home-page.png "Figures get a caption strip like this one")

Click any figure to open it full size.

## Rich embeds

A video, a demo, a design file, a track: drop the link on its own line and it becomes a player. These all work — YouTube, Vimeo, Loom, CodePen, CodeSandbox, Figma, Spotify and GitHub gists:

https://www.youtube.com/watch?v=dQw4w9WgXcQ

If you want a caption, or you're embedding something the auto-detector doesn't know, be explicit:

```
::youtube[https://youtu.be/dQw4w9WgXcQ]{caption="Product walkthrough"}
::video[/media/demo.mp4]{poster="/media/demo.jpg" caption="Line 2, first run"}
::embed[https://example.com/dashboard]{title="Live dashboard" ratio="4/3"}
::figure[/images/safelysds/sds-page.png]{caption="A single data sheet" alt="SDS detail view"}
::gallery
```

`::gallery` drops in every image from the post's own metadata, so a photo-heavy post needs one line instead of twenty.

---

That's the whole toolbox. Real posts start soon: first up, notes from wiring a manufacturing floor without stopping the line. If you want to talk before then, [the contact page is open](#contact).
