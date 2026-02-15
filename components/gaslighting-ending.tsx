"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { PonyWithEnvelope } from "./pixel-emoji"
import { ShareButton } from "./share-button"
import { VisitorCounter } from "./visitor-counter"
import { useSoundManager } from "./sound-manager"

const GASLIGHTING_SCRIPT = `我有钱我能不给你花吗？我还想给你提路虎揽胜呢，我这不是现在正好处于低谷期吗！你早认识我两年就好了。我之前给前任也没少花，他不还是离开我了吗？说白了你就是没瞧得起我。我可以给你买，但你不能主动要，我就不想惯你这毛病。等你跟我结婚了不都是你的吗？不要这么物质，我们之间是爱。不要一直钱钱钱的，我心都给你了宝贝。`

export function GaslightingEnding() {
  const { play } = useSoundManager()
  const [stars, setStars] = useState<{ left: string; top: string; dur: number; delay: number }[]>([])

  useEffect(() => {
    play("success")
    setStars(
      Array.from({ length: 30 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        dur: 1 + Math.random() * 2,
        delay: Math.random() * 2,
      }))
    )
  }, [play])

  return (
    <motion.div
      id="capture-area"
      className="fixed inset-0 bg-background flex flex-col items-center justify-center overflow-auto z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Starfield background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {stars.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground"
            style={{ left: s.left, top: s.top }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
          />
        ))}
      </div>

      <div className="relative z-20 flex flex-col items-center py-8 gap-4 w-full">
        {/* Pony */}
        <motion.div
          className="mb-2"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.3 }}
        >
          <PonyWithEnvelope size={120} />
        </motion.div>

        {/* Speech bubble with scrolling text */}
        <motion.div
          className="w-[85vw] max-w-md mx-auto"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.8 }}
        >
          {/* Bubble tail */}
          <div
            className="mx-auto w-4 h-4 bg-card -mb-px"
            style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
          />

          {/* Bubble body */}
          <div className="bg-card pixel-border p-4 md:p-6 h-[35vh] max-h-[280px] overflow-hidden relative scanlines">
            <motion.div
              className="animate-scroll-up"
              initial={{ y: "100%" }}
            >
              <p
                className="text-card-foreground leading-relaxed"
                style={{ fontSize: "clamp(11px, 2.5vw, 14px)" }}
              >
                {GASLIGHTING_SCRIPT}
              </p>
            </motion.div>
          </div>

          {/* Label */}
          <motion.p
            className="text-center mt-3 text-accent"
            style={{ fontSize: "clamp(9px, 2vw, 12px)" }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {'~ 莫欺少年穷莫欺中年穷莫欺老年穷 ~'}
          </motion.p>
        </motion.div>

        {/* Visitor counter */}
        <div className="mt-2">
          <VisitorCounter />
        </div>

        {/* Share button */}
        <div className="mt-2 px-4">
          <ShareButton />
        </div>
      </div>
    </motion.div>
  )
}
