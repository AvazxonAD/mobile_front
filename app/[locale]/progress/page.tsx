
import { MobileHeader } from "../../../components/layout/mobile-header"
import { MobileNav } from "../../../components/layout/mobile-nav"
import { ProgressOverview } from "../../../components/gamification/progress-overview"

export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="px-4 py-6">
        <ProgressOverview />
      </main>
      <MobileNav />
    </div>
  )
}
