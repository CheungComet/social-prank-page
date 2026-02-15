"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback, useEffect } from "react"
import { Sparkles, Swords } from "lucide-react"
import { RunawayButton } from "./runaway-button"
import { YesButton } from "./yes-button"
import { GaslightingEnding } from "./gaslighting-ending"
import { AngryEnding } from "./angry-ending"
import { VisitorCounter } from "./visitor-counter"
import { useSoundManager } from "./sound-manager"
import { supabase } from "@/lib/supabase"

type GameState = "playing" | "gaslighting" | "angry"

export function PrankGame() {
  const { play } = useSoundManager()
  const [shrinkCount, setShrinkCount] = useState(0)
  const [gameState, setGameState] = useState<GameState>("playing")
  const [isShaking, setIsShaking] = useState(false)
  const [sparkles, setSparkles] = useState<{ left: string; top: string; delay: string }[]>([])

  useEffect(() => {
    setSparkles(
      Array.from({ length: 20 }, () => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        delay: `${Math.random() * 3}s`,
      }))
    )
  }, [])

  // Try to start BGM on first user interaction
  useEffect(() => {
    const startBgm = () => {
      play("bgm")
      window.removeEventListener("click", startBgm)
      window.removeEventListener("touchstart", startBgm)
    }
    window.addEventListener("click", startBgm)
    window.addEventListener("touchstart", startBgm)
    return () => {
      window.removeEventListener("click", startBgm)
      window.removeEventListener("touchstart", startBgm)
    }
  }, [play])

  const handleShrink = useCallback(() => {
    play("dodge")
    setShrinkCount((prev) => prev + 1)
  }, [play])
  
const handleCaughtNo = useCallback(() => {
  setIsShaking(true)
  play("click")
  // 发送数据到 Supabase，不等待结果直接继续，防止 UI 卡顿
  supabase?.from("interactions").insert([{ type: "friend_no" }]).then(() => {})
  setTimeout(() => {
    setIsShaking(false)
    setGameState("angry")
  }, 600)
}, [play])

const handleYes = useCallback(() => {
  play("click")
  // 同理发送
  supabase?.from("interactions").insert([{ type: "friend_yes" }]).then(() => {})
  setGameState("gaslighting")
}, [play])

  return (
    <div className={`relative w-screen h-dvh overflow-hidden ${isShaking ? "animate-shake" : ""}`}>
      <AnimatePresence mode="wait">
        {gameState === "playing" && (
          <motion.div
            key="playing"
            className="flex flex-col items-center justify-center h-full w-full relative"
            exit={{ opacity: 0 }}
          >
            {/* Decorative pixel stars */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {sparkles.map((s, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-foreground pixel-sparkle"
                  style={{
                    left: s.left,
                    top: s.top,
                    animationDelay: s.delay,
                  }}
                />
              ))}
            </div>

            {/* Main card container */}
            <motion.div
              className="relative bg-card pixel-border p-6 md:p-10 mx-4 max-w-lg w-full scanlines"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {/* Header icon */}
              <motion.div
                className="flex justify-center mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
              >
                <Swords className="w-10 h-10 md:w-14 md:h-14 text-accent" />
              </motion.div>

              {/* Question text */}
              <h1
                className="text-foreground text-center leading-relaxed mb-8 text-balance"
                style={{ fontSize: "clamp(13px, 3.5vw, 18px)" }}
              >
                {'你要给转发你这个链接的朋友转一万🔪吗？'}
              </h1>

              {/* Buttons area */}
              <div className="relative flex items-center justify-center gap-8 min-h-[120px]">
                <YesButton growCount={shrinkCount} onClick={handleYes} />
                <RunawayButton
                  shrinkCount={shrinkCount}
                  onShrink={handleShrink}
                  onCaught={handleCaughtNo}
                />
              </div>

              {/* Hint text */}
              <AnimatePresence>
                {shrinkCount >= 3 && (
                  <motion.p
                    className="text-center text-muted-foreground mt-6 flex items-center justify-center gap-2"
                    style={{ fontSize: "clamp(8px, 2vw, 11px)" }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    {'提示：那个按钮好像在跑诶，可以放过它吗...'}
                    <Sparkles className="w-3 h-3" />
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Visitor counter below card */}
            <div className="mt-6">
              <VisitorCounter />
            </div>

            {/* Bottom decorative text */}
            <motion.p
              className="absolute bottom-4 text-muted-foreground text-center px-4"
              style={{ fontSize: "clamp(7px, 1.5vw, 9px)" }}
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {'>>> SOCIAL PRANK v1.0 <<<'}
            </motion.p>
          </motion.div>
        )}

        {gameState === "gaslighting" && (
          <motion.div key="gaslighting">
            <GaslightingEnding />
          </motion.div>
        )}

        {gameState === "angry" && (
          <motion.div key="angry">
            <AngryEnding />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
