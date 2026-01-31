import { MobileHeader } from "../../../components/layout/mobile-header";
import { MobileNav } from "../../../components/layout/mobile-nav";
import { ArticleHub } from "../../../components/articles/article-hub";

export default function ArticlesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />
      <main className="px-4 py-6">
        <ArticleHub />
      </main>
      <MobileNav />
    </div>
  );
}


