"use client"

import { useEffect } from "react"

/**
 * The design's pointer treatment: a dot that tracks the cursor exactly, a ring
 * that lags behind it, gentle parallax on the hero, and a light/dark cursor
 * inversion based on whatever is under the pointer. Fine pointers only —
 * touch devices keep the native behaviour.
 */
export default function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia("(pointer:fine)").matches) return

    const body = document.body
    body.classList.add("fine")

    const dot = document.createElement("div")
    dot.id = "cur"
    const ring = document.createElement("div")
    ring.id = "curring"
    body.append(dot, ring)

    const fan = document.getElementById("fan")
    const giant = document.getElementById("giant")

    // The entrance animations leave transforms behind; clear them so the
    // parallax has somewhere to write.
    const clearAnimation = (event: AnimationEvent) => {
      const target = event.target as HTMLElement
      if (target === fan || target === giant) target.style.animation = "none"
    }
    fan?.addEventListener("animationend", clearAnimation)
    giant?.addEventListener("animationend", clearAnimation)

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY
    let ringScale = 1
    let hovering = false
    let lastLuminanceCheck = 0

    /** Walk up from an element until we find an opaque background colour. */
    const luminance = (element: Element | null): number => {
      let node: Element | null = element
      while (node && node !== document.documentElement) {
        const background = getComputedStyle(node).backgroundColor
        const parts = background?.match(/rgba?\(([\d.]+)[, ]+([\d.]+)[, ]+([\d.]+)(?:[, /]+([\d.]+))?\)/)
        if (parts && (parts[4] === undefined || parseFloat(parts[4]) > 0.4)) {
          return (0.2126 * +parts[1] + 0.7152 * +parts[2] + 0.0722 * +parts[3]) / 255
        }
        node = node.parentElement
      }
      return 0.9
    }

    const onMouseMove = (event: MouseEvent) => {
      if (!body.classList.contains("curon")) {
        body.classList.add("curon")
        ringX = event.clientX
        ringY = event.clientY
      }

      mouseX = event.clientX
      mouseY = event.clientY
      dot.style.transform = `translate(${event.clientX}px,${event.clientY}px)`

      const normalX = event.clientX / window.innerWidth - 0.5
      const normalY = event.clientY / window.innerHeight - 0.5
      if (fan) fan.style.transform = `translate(${(normalX * 14).toFixed(1)}px,${(normalY * 10).toFixed(1)}px)`
      if (giant) giant.style.transform = `translate(${(normalX * -9).toFixed(1)}px,${(normalY * -6).toFixed(1)}px)`

      const now = Date.now()
      if (now - lastLuminanceCheck >= 120) {
        lastLuminanceCheck = now
        const under = document.elementFromPoint(event.clientX, event.clientY)
        if (under) {
          const value = luminance(under)
          body.classList.toggle("curdark", value >= 0.55)
          body.classList.toggle("curlight", value < 0.55)
        }
      }
    }

    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      hovering = Boolean(target.closest("a,button,.fw,.mo,[role='button']"))
      body.classList.toggle("curtype", Boolean(target.closest("input,textarea")))
    }

    let frame = 0
    const loop = () => {
      ringX += (mouseX - ringX) * 0.3
      ringY += (mouseY - ringY) * 0.3
      ringScale += ((hovering ? 1.7 : 1) - ringScale) * 0.16
      ring.style.transform = `translate(${ringX.toFixed(1)}px,${ringY.toFixed(1)}px) scale(${ringScale.toFixed(3)})`
      frame = requestAnimationFrame(loop)
    }
    frame = requestAnimationFrame(loop)

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("mouseover", onMouseOver)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("mouseover", onMouseOver)
      fan?.removeEventListener("animationend", clearAnimation)
      giant?.removeEventListener("animationend", clearAnimation)
      dot.remove()
      ring.remove()
      body.classList.remove("fine", "curon", "curdark", "curlight", "curtype")
    }
  }, [])

  return null
}
