"use client"

import { createContext, useContext, useRef, useCallback, useState } from "react"

type SoundType = "bgm" | "click" | "dodge" | "success" | "fail" | "screenshot"

interface SoundManagerContextValue {
  play: (sound: SoundType) => void
  stopBgm: () => void
  isMuted: boolean
  toggleMute: () => void
}

const SoundManagerContext = createContext<SoundManagerContextValue>({
  play: () => {},
  stopBgm: () => {},
  isMuted: false,
  toggleMute: () => {},
})

export function useSoundManager() {
  return useContext(SoundManagerContext)
}

/**
 * 8-bit synthesized sounds using Web Audio API.
 * No external files needed -- everything is generated with oscillators.
 *
 * To replace with real audio files later:
 *  1. Place .mp3/.wav files in /public/sounds/
 *  2. Replace the synth functions below with new Audio("/sounds/xxx.mp3").play()
 */

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null
  const w = window as unknown as { _prankAudioCtx?: AudioContext }
  if (!w._prankAudioCtx) {
    w._prankAudioCtx = new AudioContext()
  }
  return w._prankAudioCtx
}

/** Play a short tone: freq in Hz, duration in seconds, waveform type */
function playTone(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType = "square",
  volume = 0.15
) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + duration)
}

/** Quick ascending two-note "click" boop */
function synthClick(ctx: AudioContext) {
  playTone(ctx, 600, 0.06, "square", 0.12)
  setTimeout(() => playTone(ctx, 900, 0.06, "square", 0.1), 50)
}

/** Descending "womp" dodge sound */
function synthDodge(ctx: AudioContext) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = "sawtooth"
  osc.frequency.setValueAtTime(800, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2)
  gain.gain.setValueAtTime(0.12, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(ctx.currentTime)
  osc.stop(ctx.currentTime + 0.25)
}

/** Triumphant ascending arpeggio for "success" / yes click */
function synthSuccess(ctx: AudioContext) {
  const notes = [523, 659, 784, 1047] // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(ctx, freq, 0.15, "square", 0.1), i * 80)
  })
}

/** Sad descending trombone for "fail" / angry ending */
function synthFail(ctx: AudioContext) {
  const notes = [400, 350, 300, 200]
  notes.forEach((freq, i) => {
    setTimeout(() => playTone(ctx, freq, 0.25, "sawtooth", 0.1), i * 150)
  })
}

/** Camera shutter click for screenshot */
function synthScreenshot(ctx: AudioContext) {
  // White-noise burst
  const bufferSize = ctx.sampleRate * 0.08
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.3
  }
  const source = ctx.createBufferSource()
  source.buffer = buffer
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0.15, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
  source.connect(gain)
  gain.connect(ctx.destination)
  source.start(ctx.currentTime)
}

/**
 * Simple looping 8-bit BGM pattern using oscillators.
 * Returns a stop function.
 */
function startBgmLoop(ctx: AudioContext): () => void {
  let stopped = false
  // C minor pentatonic melody loop
  const melody = [262, 311, 349, 392, 466, 392, 349, 311]
  const noteDuration = 0.22
  const gap = 0.28 // total beat = 0.5s

  function playNote(index: number) {
    if (stopped) return
    const freq = melody[index % melody.length]
    playTone(ctx, freq, noteDuration, "square", 0.06)
    // Soft bass note on beats 0 and 4
    if (index % 4 === 0) {
      playTone(ctx, freq / 2, noteDuration * 1.5, "triangle", 0.05)
    }
    setTimeout(() => playNote(index + 1), (noteDuration + gap) * 1000)
  }

  playNote(0)
  return () => {
    stopped = true
  }
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false)
  const bgmStopRef = useRef<(() => void) | null>(null)
  const bgmPlayingRef = useRef(false)

  const play = useCallback(
    (sound: SoundType) => {
      if (isMuted) return
      const ctx = getAudioContext()
      if (!ctx) return

      // Resume context if suspended (browser autoplay policy)
      if (ctx.state === "suspended") {
        ctx.resume()
      }

      switch (sound) {
        case "bgm":
          if (!bgmPlayingRef.current) {
            bgmStopRef.current = startBgmLoop(ctx)
            bgmPlayingRef.current = true
          }
          break
        case "click":
          synthClick(ctx)
          break
        case "dodge":
          synthDodge(ctx)
          break
        case "success":
          synthSuccess(ctx)
          break
        case "fail":
          synthFail(ctx)
          break
        case "screenshot":
          synthScreenshot(ctx)
          break
      }
    },
    [isMuted]
  )

  const stopBgm = useCallback(() => {
    bgmStopRef.current?.()
    bgmStopRef.current = null
    bgmPlayingRef.current = false
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      if (next) {
        bgmStopRef.current?.()
        bgmStopRef.current = null
        bgmPlayingRef.current = false
      }
      return next
    })
  }, [])

  return (
    <SoundManagerContext.Provider value={{ play, stopBgm, isMuted, toggleMute }}>
      {children}
    </SoundManagerContext.Provider>
  )
}

/** Mute toggle button - pixel styled */
export function MuteButton() {
  const { isMuted, toggleMute } = useSoundManager()

  return (
    <button
      onClick={toggleMute}
      className="fixed top-3 right-3 z-50 w-8 h-8 bg-card pixel-border flex items-center justify-center text-foreground cursor-pointer"
      style={{ fontSize: "10px" }}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="2" y="2" width="2" height="2" fill="currentColor" />
          <rect x="4" y="4" width="2" height="2" fill="currentColor" />
          <rect x="6" y="6" width="2" height="2" fill="currentColor" />
          <rect x="8" y="4" width="2" height="2" fill="currentColor" />
          <rect x="10" y="2" width="2" height="2" fill="currentColor" />
          <rect x="8" y="8" width="2" height="2" fill="currentColor" />
          <rect x="10" y="10" width="2" height="2" fill="currentColor" />
          <rect x="4" y="8" width="2" height="2" fill="currentColor" />
          <rect x="2" y="10" width="2" height="2" fill="currentColor" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <rect x="1" y="5" width="2" height="4" fill="currentColor" />
          <rect x="3" y="4" width="2" height="6" fill="currentColor" />
          <rect x="5" y="3" width="2" height="8" fill="currentColor" />
          <rect x="9" y="4" width="1" height="1" fill="currentColor" />
          <rect x="9" y="9" width="1" height="1" fill="currentColor" />
          <rect x="11" y="3" width="1" height="1" fill="currentColor" />
          <rect x="11" y="10" width="1" height="1" fill="currentColor" />
          <rect x="12" y="5" width="1" height="4" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
