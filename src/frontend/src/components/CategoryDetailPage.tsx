import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  DollarSign,
  GraduationCap,
  Lightbulb,
  Search,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Prompt } from "../backend.d";
import {
  useGetCategoryById,
  useGetPromptsByCategory,
} from "../hooks/useQueries";
import { Footer } from "./Footer";

interface CategoryDetailPageProps {
  categoryId: string;
  onBack: () => void;
}

export function CategoryDetailPage({
  categoryId,
  onBack,
}: CategoryDetailPageProps) {
  const { data: category, isLoading: loadingCat } =
    useGetCategoryById(categoryId);
  const { data: prompts, isLoading: loadingPrompts } =
    useGetPromptsByCategory(categoryId);

  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  const filteredPrompts = useMemo(() => {
    if (!prompts) return [];
    const q = searchQuery.toLowerCase().trim();
    if (!q) return prompts;
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.promptText.toLowerCase().includes(q) ||
        p.section.toLowerCase().includes(q),
    );
  }, [prompts, searchQuery]);

  const groupedBySection = useMemo(() => {
    const groups: Record<string, Prompt[]> = {};
    for (const p of filteredPrompts) {
      if (!groups[p.section]) groups[p.section] = [];
      groups[p.section].push(p);
    }
    return groups;
  }, [filteredPrompts]);

  const sections = Object.keys(groupedBySection);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const isSectionExpanded = (section: string) =>
    expandedSections[section] !== false; // default expanded

  const copyPrompt = useCallback(async (prompt: Prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.promptText);
      setCopiedId(prompt.id);
      toast.success("Prompt copied!", {
        description: prompt.title,
        duration: 2000,
      });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy prompt");
    }
  }, []);

  // Count visible prompts per section for deterministic markers
  let promptIndex = 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Header ───────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Button
            data-ocid="category.back_button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-1 font-cabinet"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">All Categories</span>
          </Button>

          <div className="h-4 w-px bg-border" />

          {loadingCat ? (
            <Skeleton className="h-5 w-48 bg-secondary/50" />
          ) : (
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl leading-none shrink-0">
                {category?.icon || "✨"}
              </span>
              <span className="font-display font-semibold text-foreground truncate">
                {category?.name}
              </span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Category Hero ─────────────────────────────────────────── */}
        {loadingCat ? (
          <div className="mb-10 space-y-3">
            <Skeleton className="h-12 w-64 bg-secondary/50" />
            <Skeleton className="h-5 w-96 bg-secondary/40" />
            <Skeleton className="h-5 w-80 bg-secondary/30" />
          </div>
        ) : category ? (
          <div className="mb-10 animate-fade-in">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl leading-none shrink-0 mt-1">
                {category.icon || "✨"}
              </div>
              <div>
                <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-2 leading-tight">
                  {category.name}
                </h1>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {category.description}
                </p>
              </div>
            </div>

            {/* Prompt count badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 badge-gold">
                <BookOpen className="w-3 h-3" />
                <span>{prompts?.length ?? 200} Prompts</span>
              </div>
            </div>
          </div>
        ) : null}

        {/* ── Info Tabs ─────────────────────────────────────────────── */}
        <div
          className="mb-10 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <Tabs defaultValue="usecase" className="w-full">
            <TabsList className="bg-secondary/60 border border-border/60 h-10 p-1 mb-6 gap-1 w-full sm:w-auto">
              <TabsTrigger
                data-ocid="category.use_case.tab"
                value="usecase"
                className="flex items-center gap-1.5 text-xs font-cabinet font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Use Case
              </TabsTrigger>
              <TabsTrigger
                data-ocid="category.beginner.tab"
                value="beginner"
                className="flex items-center gap-1.5 text-xs font-cabinet font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Beginner Guide
              </TabsTrigger>
              <TabsTrigger
                data-ocid="category.monetization.tab"
                value="monetization"
                className="flex items-center gap-1.5 text-xs font-cabinet font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-none transition-all"
              >
                <DollarSign className="w-3.5 h-3.5" />
                Monetize
              </TabsTrigger>
            </TabsList>

            {loadingCat ? (
              <Skeleton className="h-32 rounded-xl bg-secondary/40" />
            ) : category ? (
              <>
                <TabsContent value="usecase" className="mt-0 animate-scale-in">
                  <InfoPanel
                    icon={<Lightbulb className="w-5 h-5 text-gold" />}
                    title="Use Case"
                    content={category.useCase}
                    accentColor="oklch(0.75 0.14 76)"
                  />
                </TabsContent>
                <TabsContent value="beginner" className="mt-0 animate-scale-in">
                  <InfoPanel
                    icon={<GraduationCap className="w-5 h-5 text-gold" />}
                    title="Beginner Instructions"
                    content={category.beginnerInstructions}
                    accentColor="oklch(0.55 0.14 265)"
                  />
                </TabsContent>
                <TabsContent
                  value="monetization"
                  className="mt-0 animate-scale-in"
                >
                  <InfoPanel
                    icon={<DollarSign className="w-5 h-5 text-gold" />}
                    title="Monetization Tips"
                    content={category.monetizationTips}
                    accentColor="oklch(0.60 0.16 145)"
                  />
                </TabsContent>
              </>
            ) : null}
          </Tabs>
        </div>

        {/* ── Section divider ───────────────────────────────────────── */}
        <div className="section-divider mb-8" />

        {/* ── Prompts Section ───────────────────────────────────────── */}
        <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Prompts header + search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
            <div className="flex-1">
              <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-0.5">
                All Prompts
              </h2>
              <p className="text-xs text-muted-foreground">
                {filteredPrompts.length} of {prompts?.length ?? 0} prompts
                {searchQuery ? ` matching "${searchQuery}"` : ""}
              </p>
            </div>
            <div className="relative sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                data-ocid="category.search_input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter prompts…"
                className="pl-9 bg-secondary/60 border-border/80 focus:border-primary/50 text-sm h-9"
              />
            </div>
          </div>

          {/* Empty state */}
          {!loadingPrompts && filteredPrompts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-display text-lg font-medium mb-1">
                No prompts found
              </p>
              <p className="text-sm">Try a different search term</p>
            </div>
          )}

          {/* Loading skeletons */}
          {loadingPrompts && (
            <div className="space-y-6">
              {(["s0", "s1", "s2"] as const).map((sk) => (
                <div key={sk} className="space-y-3">
                  <Skeleton className="h-6 w-48 bg-secondary/50" />
                  <div className="space-y-2">
                    {(["p0", "p1", "p2", "p3"] as const).map((pk) => (
                      <Skeleton
                        key={`${sk}-${pk}`}
                        className="h-24 rounded-lg bg-secondary/30"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sections */}
          {!loadingPrompts &&
            sections.map((section) => {
              const sectionPrompts = groupedBySection[section];
              const isExpanded = isSectionExpanded(section);

              return (
                <div key={section} className="mb-8">
                  {/* Section heading */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section)}
                    className="w-full flex items-center justify-between gap-3 group mb-4 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 rounded"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-none w-8 bg-primary/50" />
                      <h3 className="font-display text-base font-semibold text-foreground group-hover:text-gold transition-colors tracking-tight">
                        {section}
                      </h3>
                      <span className="text-[0.65rem] text-muted-foreground/70 font-cabinet">
                        {sectionPrompts.length} prompts
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-muted-foreground/60 group-hover:text-gold transition-colors shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-muted-foreground/60 group-hover:text-gold transition-colors shrink-0" />
                    )}
                  </button>

                  {/* Prompt cards */}
                  {isExpanded && (
                    <div className="space-y-3 pl-11">
                      {sectionPrompts.map((prompt) => {
                        promptIndex += 1;
                        const isCopied = copiedId === prompt.id;
                        return (
                          <div
                            key={prompt.id}
                            className="prompt-card rounded-lg p-4 group/card"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-cabinet text-sm font-semibold text-foreground mb-2 group-hover/card:text-gold/90 transition-colors leading-snug">
                                  {prompt.title}
                                </h4>
                                <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-3 group-hover/card:line-clamp-none transition-all">
                                  {prompt.promptText}
                                </p>
                              </div>
                              <Button
                                data-ocid={`prompt.copy_button.${promptIndex}`}
                                variant="ghost"
                                size="icon"
                                onClick={() => copyPrompt(prompt)}
                                className={`shrink-0 w-8 h-8 transition-all ${
                                  isCopied
                                    ? "text-green-400 bg-green-400/10"
                                    : "text-muted-foreground/60 hover:text-gold hover:bg-primary/10"
                                }`}
                                title="Copy prompt"
                              >
                                {isCopied ? (
                                  <Check className="w-3.5 h-3.5" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function InfoPanel({
  icon,
  title,
  content,
  accentColor,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  accentColor: string;
}) {
  return (
    <div
      className="rounded-xl p-5 sm:p-6 border"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.15 0.014 265) 0%, oklch(0.13 0.010 265) 100%)",
        borderColor: `${accentColor.replace(")", " / 0.3)")}`,
      }}
    >
      <div className="flex items-center gap-2.5 mb-4">
        {icon}
        <h3 className="font-display text-base font-semibold text-foreground">
          {title}
        </h3>
      </div>
      <div className="text-sm text-muted-foreground/90 leading-relaxed whitespace-pre-line prose-invert max-w-none">
        {content}
      </div>
    </div>
  );
}
