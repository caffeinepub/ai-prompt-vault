import { Toaster } from "@/components/ui/sonner";
import { useCallback, useState } from "react";
import { CategoryDetailPage } from "./components/CategoryDetailPage";
import { HomePage } from "./components/HomePage";
import { SearchResultsPage } from "./components/SearchResultsPage";

type View =
  | { type: "home" }
  | { type: "category"; categoryId: string }
  | { type: "search"; query: string };

export default function App() {
  const [view, setView] = useState<View>({ type: "home" });
  const [globalSearch, setGlobalSearch] = useState("");

  const navigateToCategory = useCallback((id: string) => {
    setView({ type: "category", categoryId: id });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateHome = useCallback(() => {
    setView({ type: "home" });
    setGlobalSearch("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigateToSearch = useCallback((query: string) => {
    if (query.trim().length > 1) {
      setView({ type: "search", query });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background font-cabinet grain-overlay">
      {view.type === "home" && (
        <HomePage
          onSelectCategory={navigateToCategory}
          onSearch={navigateToSearch}
          globalSearch={globalSearch}
          onGlobalSearchChange={setGlobalSearch}
        />
      )}
      {view.type === "category" && (
        <CategoryDetailPage
          categoryId={view.categoryId}
          onBack={navigateHome}
        />
      )}
      {view.type === "search" && (
        <SearchResultsPage
          query={view.query}
          onBack={navigateHome}
          onSelectCategory={navigateToCategory}
        />
      )}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "oklch(0.18 0.016 265)",
            border: "1px solid oklch(0.75 0.14 76 / 0.4)",
            color: "oklch(0.94 0.010 85)",
            fontFamily: "Cabinet Grotesk, sans-serif",
          },
        }}
      />
    </div>
  );
}
