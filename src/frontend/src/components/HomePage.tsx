import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ChevronRight,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import type { Category } from "../backend.d";
import { useGetCategories } from "../hooks/useQueries";
import { Footer } from "./Footer";
import { PricingSection } from "./PricingSection";

const CATEGORY_ICONS: Record<string, string> = {
  "startup-ideas": "🚀",
  "digital-marketing": "📣",
  productivity: "⚡",
  "real-estate": "🏠",
  "online-money": "💰",
  study: "📚",
  "instagram-growth": "📸",
  fitness: "💪",
  relationships: "❤️",
  dating: "💫",
  "email-marketing": "✉️",
  blogging: "✍️",
  "content-creation": "🎬",
  "all-in-one-vault": "🔐",
};

const CATEGORY_COLORS: Record<
  string,
  { from: string; to: string; border: string }
> = {
  "startup-ideas": {
    from: "oklch(0.22 0.04 265)",
    to: "oklch(0.15 0.02 265)",
    border: "oklch(0.45 0.12 265 / 0.5)",
  },
  "digital-marketing": {
    from: "oklch(0.20 0.04 170)",
    to: "oklch(0.14 0.02 170)",
    border: "oklch(0.55 0.14 160 / 0.4)",
  },
  productivity: {
    from: "oklch(0.22 0.05 60)",
    to: "oklch(0.14 0.03 60)",
    border: "oklch(0.70 0.16 68 / 0.4)",
  },
  "real-estate": {
    from: "oklch(0.20 0.04 130)",
    to: "oklch(0.14 0.02 130)",
    border: "oklch(0.55 0.13 145 / 0.4)",
  },
  "online-money": {
    from: "oklch(0.22 0.06 80)",
    to: "oklch(0.15 0.04 80)",
    border: "oklch(0.75 0.14 76 / 0.5)",
  },
  study: {
    from: "oklch(0.20 0.04 230)",
    to: "oklch(0.14 0.02 230)",
    border: "oklch(0.55 0.12 240 / 0.4)",
  },
  "instagram-growth": {
    from: "oklch(0.20 0.06 340)",
    to: "oklch(0.14 0.04 340)",
    border: "oklch(0.60 0.18 340 / 0.4)",
  },
  fitness: {
    from: "oklch(0.20 0.06 20)",
    to: "oklch(0.14 0.04 20)",
    border: "oklch(0.65 0.18 25 / 0.4)",
  },
  relationships: {
    from: "oklch(0.20 0.06 0)",
    to: "oklch(0.14 0.04 0)",
    border: "oklch(0.62 0.20 15 / 0.4)",
  },
  dating: {
    from: "oklch(0.20 0.05 310)",
    to: "oklch(0.14 0.03 310)",
    border: "oklch(0.58 0.18 320 / 0.4)",
  },
  "email-marketing": {
    from: "oklch(0.20 0.04 200)",
    to: "oklch(0.14 0.02 200)",
    border: "oklch(0.55 0.14 210 / 0.4)",
  },
  blogging: {
    from: "oklch(0.20 0.04 100)",
    to: "oklch(0.14 0.02 100)",
    border: "oklch(0.60 0.14 110 / 0.4)",
  },
  "content-creation": {
    from: "oklch(0.20 0.05 290)",
    to: "oklch(0.14 0.03 290)",
    border: "oklch(0.58 0.16 290 / 0.4)",
  },
  "all-in-one-vault": {
    from: "oklch(0.18 0.04 45)",
    to: "oklch(0.13 0.02 45)",
    border: "oklch(0.70 0.14 50 / 0.5)",
  },
};

const DEFAULT_COLOR = {
  from: "oklch(0.18 0.016 265)",
  to: "oklch(0.13 0.010 265)",
  border: "oklch(0.75 0.14 76 / 0.3)",
};

interface HomePageProps {
  onSelectCategory: (id: string) => void;
  onSearch: (query: string) => void;
  globalSearch: string;
  onGlobalSearchChange: (v: string) => void;
}

export function HomePage({
  onSelectCategory,
  onSearch,
  globalSearch,
  onGlobalSearchChange,
}: HomePageProps) {
  const { data: categories, isLoading } = useGetCategories();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60);
    return () => clearTimeout(t);
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch(globalSearch);
  }

  const getCatColor = (cat: Category) =>
    CATEGORY_COLORS[cat.id] ?? DEFAULT_COLOR;
  const getCatIcon = (cat: Category) =>
    cat.icon || CATEGORY_ICONS[cat.id] || "✨";

  return (
    <div
      className={`transition-opacity duration-700 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.home_link"
            onClick={() => {}}
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/40 flex items-center justify-center glow-gold-sm">
              <Sparkles className="w-4 h-4 text-gold" />
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-semibold text-foreground leading-none tracking-tight">
                AI Prompt
              </span>
              <span className="font-display text-lg font-semibold text-gold leading-none tracking-tight ml-1.5">
                Vault
              </span>
            </div>
          </button>

          {/* Global Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-lg relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              data-ocid="nav.search_input"
              value={globalSearch}
              onChange={(e) => onGlobalSearchChange(e.target.value)}
              placeholder="Search 2,800+ prompts across all categories…"
              className="pl-9 pr-4 bg-secondary/60 border-border/80 focus:border-primary/50 focus:ring-0 h-9 text-sm placeholder:text-muted-foreground/60"
            />
          </form>

          {/* View Pricing nav link */}
          <a
            href="#pricing"
            data-ocid="nav.pricing_link"
            className="hidden sm:flex items-center gap-1 text-sm font-cabinet font-semibold text-gold/80 hover:text-gold transition-colors shrink-0 whitespace-nowrap"
          >
            💎 Pricing
          </a>

          {/* CTA */}
          <Button
            onClick={() => globalSearch.trim() && onSearch(globalSearch)}
            size="sm"
            className="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet font-semibold shrink-0"
          >
            Search
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url(/assets/generated/hero-bg.dim_1600x900.jpg)",
          }}
        />
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0 hero-glow" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 badge-gold mb-6 animate-fade-in">
            <Sparkles className="w-3 h-3" />
            <span>2,800 Premium AI Prompts</span>
            <Sparkles className="w-3 h-3" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[0.95] tracking-tight mb-4 animate-fade-in-up">
            AI Prompt
            <br />
            <span className="text-gold [text-shadow:0_0_40px_oklch(0.75_0.14_76_/_0.4)]">
              Vault
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="font-serif-accent text-xl sm:text-2xl text-muted-foreground/90 max-w-2xl mx-auto leading-relaxed mb-8 animate-fade-in-up"
            style={{ animationDelay: "0.1s" }}
          >
            Your complete collection of expertly crafted prompts for business
            growth, lifestyle optimization, and digital income streams.
          </p>

          {/* Stats */}
          <div
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            {[
              { icon: BookOpen, value: "2,800+", label: "Prompts" },
              { icon: Zap, value: "14", label: "Categories" },
              { icon: TrendingUp, value: "200", label: "Per Category" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2.5 group">
                <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-gold" />
                </div>
                <div className="text-left">
                  <div className="font-display text-xl font-bold text-foreground leading-none">
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section divider ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="section-divider" />
      </div>

      {/* ── Category Grid ──────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Browse by Category
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Each category includes 200 prompts organized by section, with
            use-case guidance and monetization tips.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(
              [
                "c01",
                "c02",
                "c03",
                "c04",
                "c05",
                "c06",
                "c07",
                "c08",
                "c09",
                "c10",
                "c11",
                "c12",
                "c13",
                "c14",
              ] as const
            ).map((k) => (
              <Skeleton key={k} className="h-48 rounded-xl bg-secondary/40" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {(categories ?? []).map((cat, idx) => {
              const color = getCatColor(cat);
              const icon = getCatIcon(cat);
              const ocidIndex = (idx + 1) as number;

              return (
                <button
                  type="button"
                  key={cat.id}
                  data-ocid={`home.category.item.${ocidIndex}`}
                  onClick={() => onSelectCategory(cat.id)}
                  className="card-vault rounded-xl p-5 text-left group cursor-pointer w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                  style={{
                    background: `linear-gradient(145deg, ${color.from}, ${color.to})`,
                    borderColor: color.border,
                  }}
                >
                  {/* Icon */}
                  <div className="text-3xl mb-3 leading-none">{icon}</div>

                  {/* Category name */}
                  <h3 className="font-display text-base font-semibold text-foreground mb-1.5 group-hover:text-gold transition-colors leading-tight">
                    {cat.name}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {cat.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span className="badge-gold text-[0.65rem]">
                      200 prompts
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/60 group-hover:text-gold group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Pricing Section ────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="section-divider" />
      </div>
      <PricingSection />

      <Footer />
    </div>
  );
}
