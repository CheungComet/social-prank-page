"use client"

import { motion } from "framer-motion"
import { useCallback, useState } from "react"

interface RunawayButtonProps {
  onShrink: () => void
  onCaught: () => void
  shrinkCount: number
}

export function RunawayButton({ onShrink, onCaught, shrinkCount }: RunawayButtonProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const maxShrinks = 10

  const scale = Math.max(0.05, Math.pow(0.85, shrinkCount))
  const isMicroscopic = shrinkCount >= maxShrinks

  const teleport = useCallback(() => {
    if (isMicroscopic) return

    const vw = window.innerWidth
    const vh = window.innerHeight
    const padding = 40

    const newX = Math.random() * (vw - padding * 2) - vw / 2 + padding
    const newY = Math.random() * (vh - padding * 2) - vh / 2 + padding

    setPosition({ x: newX, y: newY })
    onShrink()
  }, [isMicroscopic, onShrink])

  const handleInteraction = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (isMicroscopic) {
        onCaught()
      } else {
        teleport()
      }
    },
    [isMicroscopic, onCaught, teleport]
  )

  // Teleport on hover/touch approach (before click)
  const handleHoverOrTouch = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault()
      if (!isMicroscopic) {
        teleport()
      }
    },
    [isMicroscopic, teleport]
  )

  return (
    <motion.button
      className="px-6 py-3 bg-secondary text-secondary-foreground pixel-border-accent font-mono cursor-pointer select-none touch-none"
      style={{ fontSize: "clamp(10px, 3vw, 16px)" }}
      animate={{
        x: position.x,
        y: position.y,
        scale,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 25,
        mass: 0.5,
      }}
      onMouseEnter={handleHoverOrTouch}
      onTouchStart={handleHoverOrTouch}
      onClick={handleInteraction}
      whileTap={{ scale: scale * 0.9 }}
      aria-label="不要按钮"
    >
      {'不要'}
    </motion.button>
  )
}
