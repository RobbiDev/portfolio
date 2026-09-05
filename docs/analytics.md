# Analytics & visit attribution

Two things are wired up: Vercel's own analytics, and a small attribution layer
that answers the question the dashboard can't — *who sent this person here?*

## 1. Turn it on in Vercel

The code is in place, but both products are opt-in per project:

1. Vercel dashboard → the project → **Analytics** tab → **Enable**.
2. Same project → **Speed Insights** tab → **Enable**.

Then redeploy. Numbers start arriving within a minute of the first visit;
nothing shows up on `localhost` because the `/_vercel/insights/*` endpoints
only exist on Vercel's edge.

`<Analytics />` and `<SpeedInsights />` are mounted once in `app/layout.tsx`.

## 2. What each plan actually gives you

| Signal | Hobby | Pro |
| --- | --- | --- |
| Pageviews, top pages, countries, devices | ✅ | ✅ |
| **Referrers** (the site they clicked from) | ✅ | ✅ |
| `/v/<tag>` tagged-link pages (see below) | ✅ | ✅ |
| Attribution on contact-form emails | ✅ | ✅ |
| Custom events (`resume_download`, `contact_send`…) | ❌ | ✅ |
| UTM parameter breakdown | ❌ | Plus/Enterprise |

Custom events are a paid feature, so `lib/analytics.ts` degrades quietly: on
Hobby every `track()` call is a no-op and the tagged paths carry the story
instead. Nothing needs changing if the plan changes later — the events are
already instrumented and will simply start showing up.

## 3. Spotting recruiters

There is no honest way to *identify* an individual visitor, and anything that
claims to (reverse-IP company lookup services like Clearbit Reveal or RB2B)
guesses at a company from an IP address, misses anyone on home wifi or a phone,
and drags a third-party tracker into the page. This site does it the reliable
way instead: **control the links, and read the referrer.**

### a. The referrer tells you the channel

`lib/analytics.ts` files every referring hostname into a channel. Anything
arriving from LinkedIn, Indeed, Glassdoor, Dice, Handshake, Wellfound, or an
applicant-tracking system (Greenhouse, Lever, Ashby, Workday, iCIMS,
SmartRecruiters…) is marked `channel: "job-board"` and `recruiter: true`. That
covers the case where someone clicks through from a job application.

### b. Tagged links tell you the exact source

Give every place your link lives its own path. Each one shows up as a separate
row in **Analytics → Pages**, on any plan:

```
https://robbyj.dev/v/linkedin-profile     ← the website field on your profile
https://robbyj.dev/v/linkedin-dm          ← links you paste into DMs
https://robbyj.dev/v/resume-pdf           ← printed in the resume header
https://robbyj.dev/v/email-signature      ← your mail signature
https://robbyj.dev/v/github-bio           ← GitHub profile
https://robbyj.dev/v/acme-application     ← one per company you apply to
```

The tag is free-form (letters, numbers, `-`), so mint a new one per
application. `/v/acme-application` in the Pages list means someone at Acme
opened your portfolio — that is as close to "a recruiter visited" as you can
honestly get, and it tells you *which* recruiter.

Point a tag at a specific panel with `?p=`:
`/v/acme-application?p=work` opens straight into Projects.

`?ref=` works identically for links you'd rather keep on the root path:
`https://robbyj.dev/?ref=acme-application`. Standard `utm_source`,
`utm_medium` and `utm_campaign` are read too. All of them are stripped from the
address bar a moment after landing, so a visitor who copies the URL doesn't
pass your tag on.

### c. Contact messages arrive pre-attributed

Every contact-form email now ends with:

```
--- where they came from ---
source: acme-application
channel: tagged
referrer: linkedin.com
landing: /v/acme-application
recruiter: likely
```

This works on every plan — it is a server-side email, not analytics — and it is
the single most useful piece of the setup.

## 4. Events being tracked (Pro)

| Event | Fires when |
| --- | --- |
| `visit` | first page of a session, carries source/channel/tag |
| `panel_view` | Projects / Writing / About / Contact opened |
| `project_view`, `post_view` | a project or a post is opened |
| `file_view` | an About-panel file is opened |
| `resume_view` | the resume file or the quick-look sheet is opened |
| `resume_download` | the PDF link is clicked — the strongest hiring signal |
| `contact_link` | the email / LinkedIn / GitHub cards are clicked |
| `contact_send` | the form is actually submitted |
| `engaged` | still on the page after 90 seconds |

Every event carries `source`, `channel` and `recruiter`, so in the dashboard you
can filter `resume_download` by `channel = job-board` and see how many
applications turn into someone actually reading the resume.

## 5. Privacy

No cookies, no fingerprinting, no identifiers. Attribution lives in
`sessionStorage` and dies with the tab; only hostnames and tags you chose
yourself are ever stored or sent. Vercel Web Analytics is itself cookieless.

## Files

- `app/layout.tsx` — mounts `<Analytics />` and `<SpeedInsights />`
- `lib/analytics.ts` — attribution, referrer classification, `track()` wrapper
- `components/site/visit-tracker.tsx` — records the visit, cleans the URL
- `app/v/[tag]/` — tagged entry points
- `app/api/contact/route.ts` — appends attribution to the notification email
