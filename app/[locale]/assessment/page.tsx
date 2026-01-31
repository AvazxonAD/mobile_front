import { DiagnosticTest } from "../../../components/diagnostic/diagnostic-test"
import { MobileHeader } from "../../../components/layout/mobile-header"
import { MobileNav } from "../../../components/layout/mobile-nav"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="px-4 py-6">
        <DiagnosticTest />
      </main>
      <MobileNav />
    </div>
  )
}
