import { visit } from "unist-util-visit"
import type { Node, Parent } from "unist"

/**
 * Two small authoring conveniences, applied to the mdast before rendering.
 * Both lean on `data.hName`, which mdast-util-to-hast honours, so they end up
 * as the exact elements the stylesheet already targets.
 */

interface TextNode extends Node {
  type: "text"
  value: string
}

function asElement(tagName: string, className: string, children: Node[]): Node {
  return {
    type: "emphasis",
    data: { hName: tagName, hProperties: className ? { className } : {} },
    children,
  } as unknown as Node
}

/** `++Ctrl++` renders as a keycap. */
export function remarkKbd() {
  return (tree: Node) => {
    visit(tree, "text", (node: TextNode, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || index === undefined || !node.value.includes("++")) return

      const parts = node.value.split(/\+\+([^+\n]+)\+\+/g)
      if (parts.length === 1) return

      const replacement: Node[] = []
      parts.forEach((part, i) => {
        if (!part) return
        if (i % 2 === 1) {
          replacement.push(asElement("span", "kbd", [{ type: "text", value: part } as Node]))
        } else {
          replacement.push({ type: "text", value: part } as Node)
        }
      })

      parent.children.splice(index, 1, ...(replacement as Parent["children"]))
      return index + replacement.length
    })
  }
}

/** The dash that opens an attribution line, e.g. "— someone, somewhere". */
const CREDIT_LINE = /\n[ \t]*(?:—|–|--)[ \t]*/

/**
 * A blockquote's closing line may attribute the quote:
 *
 *   > Everything can always be improved.
 *   > — the rule I picked up at my first job
 *
 * That last line becomes a <cite>, which the design styles as a small caps
 * credit under the pull quote. The attribution can arrive three ways —
 * inside one text node after a soft line break, after a hard break node, or
 * as a paragraph of its own — so all three are handled here.
 */
export function remarkQuoteCite() {
  return (tree: Node) => {
    visit(tree, "blockquote", (node: Parent) => {
      const last = node.children[node.children.length - 1] as Parent | undefined
      if (!last || last.type !== "paragraph") return

      const children = last.children as Node[]

      // 1. Soft line break: remark keeps it as a newline inside one text node.
      for (let i = children.length - 1; i >= 0; i--) {
        const child = children[i]
        if (child.type !== "text") continue

        const text = child as TextNode
        const match = text.value.match(CREDIT_LINE)
        if (match?.index === undefined) continue

        const head = text.value.slice(0, match.index)
        const credit = text.value.slice(match.index + match[0].length)
        const trailing = children.splice(i + 1)

        text.value = head
        if (!head) children.splice(i, 1)

        node.children.push(
          asElement("cite", "", [{ type: "text", value: credit } as Node, ...trailing]) as never,
        )
        return
      }

      // 2. Hard break, then the attribution.
      for (let i = children.length - 1; i >= 0; i--) {
        if (children[i].type !== "break") continue

        const after = children[i + 1] as TextNode | undefined
        if (!after || after.type !== "text") return

        const match = after.value.match(/^[ \t]*(?:—|–|--)[ \t]*([\s\S]*)$/)
        if (!match) return

        after.value = match[1]
        const credit = children.splice(i + 1)
        children.splice(i, 1)
        node.children.push(asElement("cite", "", credit) as never)
        return
      }

      // 3. The attribution stands alone as the closing paragraph.
      const first = children[0] as TextNode | undefined
      if (!first || first.type !== "text" || node.children.length < 2) return

      const match = first.value.match(/^[ \t]*(?:—|–|--)[ \t]*([\s\S]*)$/)
      if (!match) return

      first.value = match[1]
      node.children[node.children.length - 1] = asElement("cite", "", children) as never
    })
  }
}
