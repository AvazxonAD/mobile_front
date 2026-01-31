import { DailyChallenge } from "../../../components/challenges/daily-challenge"
import { MobileHeader } from "../../../components/layout/mobile-header"
import { MobileNav } from "../../../components/layout/mobile-nav"

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="px-4 py-6">
        <DailyChallenge />
      </main>
      <MobileNav />
    </div>
  )
}
