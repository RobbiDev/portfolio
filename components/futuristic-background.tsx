"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

export default function FuturisticBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    // Grid setup
    const gridSize = 20
    const gridDivisions = 20
    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, 0x00ff00, 0x222222)
    gridHelper.position.y = -2
    scene.add(gridHelper)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 2000

    const posArray = new Float32Array(particlesCount * 3)

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 20
    }

    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xa3e635,
      transparent: true,
      opacity: 0.8,
    })

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Add lines
    const linesCount = 50
    const lines: THREE.Line[] = []

    for (let i = 0; i < linesCount; i++) {
      const lineGeometry = new THREE.BufferGeometry()
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xa3e635,
        transparent: true,
        opacity: Math.random() * 0.5 + 0.1,
      })

      const points = []
      const x = (Math.random() - 0.5) * 20
      const z = (Math.random() - 0.5) * 20

      points.push(new THREE.Vector3(x, -2, z))
      points.push(new THREE.Vector3(x, Math.random() * 4 - 2, z))

      lineGeometry.setFromPoints(points)
      const line = new THREE.Line(lineGeometry, lineMaterial)
      scene.add(line)
      lines.push(line)
    }

    // Add text coordinates
    const createTextSprite = (text: string, position: THREE.Vector3) => {
      const canvas = document.createElement("canvas")
      const context = canvas.getContext("2d")
      if (!context) return

      canvas.width = 256
      canvas.height = 128

      context.font = "12px monospace"
      context.fillStyle = "rgba(163, 230, 53, 0.5)"
      context.fillText(text, 0, 20)
      context.fillText("SYSTEM.STATUS", 0, 40)
      context.fillText("COORDINATES (X,Y)", 0, 60)

      const texture = new THREE.CanvasTexture(canvas)

      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
      })

      const sprite = new THREE.Sprite(spriteMaterial)
      sprite.position.copy(position)
      sprite.scale.set(2, 1, 1)

      scene.add(sprite)
      return sprite
    }

    const textSprites = []
    for (let i = 0; i < 10; i++) {
      const position = new THREE.Vector3(
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 15,
      )
      const sprite = createTextSprite(`DEV.PATH ${Math.floor(Math.random() * 100)}`, position)
      if (sprite) textSprites.push(sprite)
    }

    // Animation
    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate grid slightly based on mouse position
      gridHelper.rotation.y += 0.001
      gridHelper.rotation.x = mouseY * 0.05
      gridHelper.rotation.z = mouseX * 0.05

      // Animate particles
      particlesMesh.rotation.y += 0.0005
      particlesMesh.rotation.x = mouseY * 0.02
      particlesMesh.rotation.z = mouseX * 0.02

      // Animate lines
      lines.forEach((line) => {
        line.rotation.y = gridHelper.rotation.y
      })

      // Render
      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }

      // Dispose resources
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      lines.forEach((line) => {
        line.geometry.dispose()
        ;(line.material as THREE.Material).dispose()
      })
    }
  }, [])

  return <div ref={containerRef} className="fixed inset-0 z-0" />
}
