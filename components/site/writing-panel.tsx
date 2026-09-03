"use client"

import PostcardArt from "./postcard-art"
import type { ContentItem } from "@/lib/content"

function districtClass(item: ContentItem): string {
  const category = (item.categories[0] || "").toLowerCase()
  if (category.includes("news")) return "news"
  if (category.includes("talk") || category.includes("speak")) return "talk"
  return "blog"
}

function note(item: ContentItem, isFeature: boolean): string {
  if (item.draft) return "In the mailbag"
  if (isFeature) return "Latest dispatch"
  return "Read the post"
}

interface WritingPanelProps {
  posts: ContentItem[]
  panelRef: React.RefObject<HTMLDivElement>
  open: boolean
  reveal: boolean
  onOpenPost: (slug: string) => void
}

export default function WritingPanel({ posts, panelRef, open, reveal, onOpenPost }: WritingPanelProps) {
  // The newest published post takes the "postcard of the month" slot.
  const feature = posts.find((post) => !post.draft) ?? posts[0] ?? null
  const rest = posts.filter((post) => post !== feature)

  return (
    <section className={`panel${open ? " on" : ""}${reveal ? " reveal" : ""}`} id="panel-writing" aria-hidden={!open}>
      <div className="panel-scroll" ref={panelRef}>
        <div className="skyline" aria-hidden="true">
          <svg viewBox="0 0 1200 150" preserveAspectRatio="xMidYMax slice">
            <g fill="#1e2726">
              <rect x="0" y="90" width="70" height="60" />
              <rect x="80" y="60" width="50" height="90" />
              <rect x="140" y="100" width="64" height="50" />
              <rect x="214" y="74" width="40" height="76" />
              <polygon points="330,10 322,34 322,150 338,150 338,34" />
              <rect x="290" y="118" width="120" height="32" />
              <rect x="430" y="84" width="56" height="66" />
              <rect x="496" y="104" width="44" height="46" />
              <path d="M600 66 a44 44 0 0 1 44 44 l0 40 -88 0 0 -40 a44 44 0 0 1 44 -44" />
              <rect x="596" y="44" width="8" height="24" />
              <rect x="540" y="126" width="120" height="24" />
              <rect x="700" y="70" width="46" height="80" />
              <rect x="756" y="96" width="60" height="54" />
              <rect x="830" y="56" width="38" height="94" />
              <polygon points="900,150 900,70 920,40 940,70 940,150" />
              <rect x="960" y="88" width="54" height="62" />
              <rect x="1024" y="66" width="42" height="84" />
              <rect x="1076" y="104" width="70" height="46" />
              <rect x="1156" y="80" width="44" height="70" />
            </g>
          </svg>
        </div>

        <div className="panel-in">
          <h2 className="wp-title stagger s1">
            Field <span>Notes</span>
          </h2>
          <p className="wp-sub stagger s2">
            News, blog posts, and talks. Postcards from wherever the work takes me.
          </p>

          {feature ? (
            <article
              className="feature stagger s2"
              role="button"
              tabIndex={0}
              style={{ cursor: "pointer" }}
              onClick={() => onOpenPost(feature.slug)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  onOpenPost(feature.slug)
                }
              }}
            >
              <span className="ribbon">Postcard of the Month</span>
              <PostcardArt item={feature} index={0} />
              <div className="pc-body">
                <h3 className="pc-t">{feature.title}</h3>
                <div className="pc-meta">
                  <span className={`district ${districtClass(feature)}`}>{feature.categories[0] || "Blog"}</span>
                  <span className="pc-note">{note(feature, true)}</span>
                </div>
              </div>
            </article>
          ) : null}

          <div className="pcards stagger s3">
            {rest.map((post, index) => (
              <article
                className={`pcard${post.draft ? " dim" : ""}`}
                key={post.slug}
                role="button"
                tabIndex={0}
                style={{ cursor: "pointer" }}
                onClick={() => onOpenPost(post.slug)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onOpenPost(post.slug)
                  }
                }}
              >
                <PostcardArt item={post} index={index + 1} />
                <div className="pc-body">
                  <h3 className="pc-t">{post.title}</h3>
                  <div className="pc-meta">
                    <span className={`district ${districtClass(post)}`}>{post.categories[0] || "Blog"}</span>
                    <span className="pc-note">{note(post, false)}</span>
                  </div>
                </div>
              </article>
            ))}

            <article className="pcard dim">
              <div className="pc-art gen g3">
                <span className="pc-city">Somewhere</span>
                <span className="postmark">
                  <span>Soon</span>
                </span>
              </div>
              <div className="pc-body">
                <h3 className="pc-t">Notes from the field: next dispatch loading</h3>
                <div className="pc-meta">
                  <span className="district blog">Blog</span>
                  <span className="pc-note">In the mailbag</span>
                </div>
              </div>
            </article>
          </div>

          <div className="wp-foot stagger s4">More postcards as the journey continues</div>
        </div>
      </div>
    </section>
  )
}
