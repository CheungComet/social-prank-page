"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useCallback, useEffect } from "react"
import { useSoundManager } from "./sound-manager"

/**
 * ShareButton renders two pixel-styled actions at the end of each ending:
 * 1. "Generate Secret Code" - creates a random funny code string
 * 2. "Save Screenshot" - uses html2canvas-style capture (framework placeholder)
 *
 * The secret code is a randomized string users can screenshot and share.
 */
export function ShareButton() {
  const { play } = useSoundManager()
  const [secretCode, setSecretCode] = useState<string | null>(null)
  const [showCopied, setShowCopied] = useState(false)

  const FUNNY_PREFIXES = [
    "被骗编号",
    "上当证书",
    "冤大头",
    "韭菜认证",
    "社死通知",
  ]
  const FUNNY_SUFFIXES = [
    "号受害者",
    "级别: 纯真小白",
    "等级: SSR",
    "认证通过",
    "已入档",
  ]

  const generateCode = useCallback(() => {
    play("screenshot")
    const prefix = FUNNY_PREFIXES[Math.floor(Math.random() * FUNNY_PREFIXES.length)]
    const suffix = FUNNY_SUFFIXES[Math.floor(Math.random() * FUNNY_SUFFIXES.length)]
    const num = String(Math.floor(Math.random() * 9000) + 1000)
    setSecretCode(`${prefix} #${num} ${suffix}`)
  }, [play])

  const copyCode = useCallback(() => {
    if (!secretCode) return
    navigator.clipboard.writeText(secretCode).then(() => {
      setShowCopied(true)
    }).catch(() => {
      // Clipboard API not available, just show the code
    })
  }, [secretCode])

  useEffect(() => {
    if (showCopied) {
      const t = setTimeout(() => setShowCopied(false), 2000)
      return () => clearTimeout(t)
    }
  }, [showCopied])

  return (
    <motion.div
      className="flex flex-col items-center gap-3 w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5 }}
    >
      {/* Divider */}
      <div className="flex items-center gap-2 w-full max-w-xs">
        <div className="flex-1 h-px bg-border" />
        <span className="text-muted-foreground" style={{ fontSize: "clamp(6px, 1.2vw, 8px)" }}>
          {'SHARE'}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Buttons row */}
      <div className="flex gap-3">
        <motion.button
          className="px-3 py-2 bg-accent text-accent-foreground pixel-border cursor-pointer select-none"
          style={{ fontSize: "clamp(7px, 1.8vw, 10px)" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={generateCode}
        >
          {'生成暗号'}
        </motion.button>

        <motion.button
          className="px-3 py-2 bg-secondary text-secondary-foreground pixel-border cursor-pointer select-none"
          style={{ fontSize: "clamp(7px, 1.8vw, 10px)" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            play("screenshot")
            // Framework: trigger screenshot capture
            // Replace with html2canvas or dom-to-image when ready:
            // import html2canvas from 'html2canvas'
            // html2canvas(document.getElementById('capture-area')).then(canvas => {
            //   const link = document.createElement('a')
            //   link.download = 'prank-result.png'
            //   link.href = canvas.toDataURL()
            //   link.click()
            // })
            window.alert("截图功能: 请长按屏幕截图保存")
          }}
        >
          {'截图保存'}
        </motion.button>
      </div>

      {/* Secret code display */}
      <AnimatePresence>
        {secretCode && (
          <motion.div
            className="bg-card pixel-border p-3 max-w-xs w-full relative"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <p
              className="text-foreground text-center leading-relaxed"
              style={{ fontSize: "clamp(8px, 2vw, 11px)" }}
            >
              {secretCode}
            </p>
            <motion.button
              className="mt-2 mx-auto block px-2 py-1 bg-muted text-muted-foreground cursor-pointer"
              style={{ fontSize: "clamp(6px, 1.2vw, 8px)" }}
              whileTap={{ scale: 0.9 }}
              onClick={copyCode}
            >
              {showCopied ? '已复制!' : '点击复制'}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
