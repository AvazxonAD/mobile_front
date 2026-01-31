import { KnowledgeHub } from "../../../components/knowledge/knowledge-hub"
import { MobileHeader } from "../../../components/layout/mobile-header"
import { MobileNav } from "../../../components/layout/mobile-nav"

export default function KnowledgePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="px-4 py-6">
        <KnowledgeHub />
      </main>
      <MobileNav />
    </div>
  )
}
