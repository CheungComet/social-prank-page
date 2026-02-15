"use client"

import { motion } from "framer-motion"

interface YesButtonProps {
  growCount: number
  onClick: () => void
}

export function YesButton({ growCount, onClick }: YesButtonProps) {
  const scale = Math.min(8, Math.pow(1.25, growCount))

  return (
    <motion.button
      className="px-6 py-3 bg-accent text-accent-foreground pixel-border font-mono cursor-pointer select-none"
      style={{ fontSize: "clamp(10px, 3vw, 16px)" }}
      animate={{ scale }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      onClick={onClick}
      whileHover={{ brightness: 1.2 }}
      whileTap={{ scale: scale * 0.95 }}
      aria-label="要按钮"
    >
      {'要'}
    </motion.button>
  )
}
