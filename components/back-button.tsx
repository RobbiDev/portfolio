"use client"

import { useRouter } from "next/navigation"

interface BackButtonProps {
  className?: string
  label?: string
}

export default function BackButton({ className, label = "Go Back" }: BackButtonProps) {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()} className={className}>
      {label}
    </button>
  )
}
