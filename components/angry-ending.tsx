"use client"

import { motion } from "framer-motion"
import { useEffect } from "react"
import { AngryPixelEmoji } from "./pixel-emoji"
import { ShareButton } from "./share-button"
import { VisitorCounter } from "./visitor-counter"
import { useSoundManager } from "./sound-manager"

export function AngryEnding() {
  const { play } = useSoundManager()

  useEffect(() => {
    play("fail")
  }, [play])

  return (
    <motion.div
      id="capture-area"
      className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 p-6 overflow-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center gap-5">
        {/* Angry emoji */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <AngryPixelEmoji size={100} />
        </motion.div>

        {/* Angry text */}
        <motion.div
          className="bg-card pixel-border p-4 md:p-6 max-w-md mx-auto relative scanlines"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <p
            className="text-accent leading-relaxed text-center"
            style={{ fontSize: "clamp(11px, 2.5vw, 14px)" }}
          >
            {'点点点，点这么准，你去拼夕夕帮我砍一万刀的时候手怎么没这么灵光？'}
          </p>
        </motion.div>

        {/* Bouncing pixel indicators */}
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-accent"
              animate={{ y: [0, -12, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          ))}
        </div>

        {/* Visitor counter */}
        <VisitorCounter />

        {/* Share button */}
        <ShareButton />
      </div>
    </motion.div>
  )
}
