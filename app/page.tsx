import { PrankGame } from "@/components/prank-game"
import { SoundProvider, MuteButton } from "@/components/sound-manager"

export default function Home() {
  return (
    <main className="min-h-dvh bg-background">
      <SoundProvider>
        <MuteButton />
        <PrankGame />
      </SoundProvider>
    </main>
  )
}
