"use client"

export function AngryPixelEmoji({ size = 80 }: { size?: number }) {
  const pixelSize = size / 10

  // 10x10 pixel grid for an angry face
  // 0 = transparent, 1 = outline (dark), 2 = face (yellow), 3 = angry (red), 4 = eye (dark)
  const grid = [
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [1, 2, 3, 2, 2, 2, 2, 3, 2, 1],
    [1, 2, 2, 4, 2, 2, 4, 2, 2, 1],
    [1, 2, 2, 4, 2, 2, 4, 2, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 2, 2, 1, 1, 2, 2, 2, 1],
    [1, 2, 2, 1, 2, 2, 1, 2, 2, 1],
    [0, 1, 2, 2, 2, 2, 2, 2, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  ]

  const colors: Record<number, string> = {
    0: "transparent",
    1: "#1a0a2e",
    2: "#ffe400",
    3: "#ff3366",
    4: "#1a0a2e",
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Angry pixel emoji">
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell !== 0 ? (
            <rect
              key={`${x}-${y}`}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={colors[cell]}
            />
          ) : null
        )
      )}
    </svg>
  )
}

export function PonyWithEnvelope({ size = 120 }: { size?: number }) {
  const p = size / 16

  // 16x16 pixel grid for a cute pony holding a red envelope
  // 0=transparent, 1=outline, 2=body(pink), 3=mane(purple), 4=envelope(red), 5=envelope detail(gold)
  const grid = [
    [0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 1, 2, 2, 1, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 2, 2, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 2, 4, 4, 4, 2, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 4, 4, 5, 4, 4, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 4, 4, 4, 4, 4, 2, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 2, 1, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
  ]

  const colors: Record<number, string> = {
    0: "transparent",
    1: "#1a0a2e",
    2: "#ffb6d9",
    3: "#a855f7",
    4: "#ff2222",
    5: "#ffe400",
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Pixel pony holding red envelope">
      {grid.map((row, y) =>
        row.map((cell, x) =>
          cell !== 0 ? (
            <rect
              key={`${x}-${y}`}
              x={x * p}
              y={y * p}
              width={p}
              height={p}
              fill={colors[cell]}
            />
          ) : null
        )
      )}
    </svg>
  )
}
