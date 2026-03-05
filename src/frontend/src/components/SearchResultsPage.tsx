import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Copy, Search, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { Prompt } from "../backend.d";
import { useSearchPrompts } from "../hooks/useQueries";
import { Footer } from "./Footer";

interface SearchResultsPageProps {
  query: string;
  onBack: () => void;
  onSelectCategory: (id: string) => void;
}

export function SearchResultsPage({
  query,
  onBack,
  onSelectCategory,
}: SearchResultsPageProps) {
  const { data: results, isLoading, isError } = useSearchPrompts(query);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-1 font-cabinet"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>

          <div className="h-4 w-px bg-border" />

          <div className="flex items-center gap-2 min-w-0">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="font-cabinet text-sm text-foreground truncate">
              Results for{" "}
              <span className="text-gold font-semibold">"{query}"</span>
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Title */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-1.5">
            Search Results
          </h1>
          {!isLoading && (
            <p className="text-muted-foreground text-sm">
              {results?.length ?? 0} prompts matching{" "}
              <span className="text-gold/90">"{query}"</span>
            </p>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            data-ocid="search.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {(
              ["r1", "r2", "r3", "r4", "r5", "r6", "r7", "r8", "r9"] as const
            ).map((k) => (
              <Skeleton key={k} className="h-32 rounded-lg bg-secondary/40" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-center py-16 text-muted-foreground">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-display text-lg font-medium mb-1 text-foreground">
              Search failed
            </p>
            <p className="text-sm">Please try again</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !isError && (!results || results.length === 0) && (
          <div
            data-ocid="search.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <div className="w-14 h-14 rounded-full bg-secondary border border-border/60 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6 text-gold/40" />
            </div>
            <p className="font-display text-xl font-semibold text-foreground mb-2">
              No results found
            </p>
            <p className="text-sm max-w-xs mx-auto">
              No prompts matched <span className="text-gold/80">"{query}"</span>
              . Try different keywords or browse a category.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="mt-6 border-primary/30 text-gold hover:bg-primary/10 font-cabinet"
            >
              Browse Categories
            </Button>
          </div>
        )}

        {/* Results grid */}
        {!isLoading && results && results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {results.map((prompt, idx) => {
              const isCopied = copiedId === prompt.id;
              return (
                <div
                  key={prompt.id}
                  className="prompt-card rounded-lg p-4 group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <button
                      type="button"
                      onClick={() => onSelectCategory(prompt.categoryId)}
                      className="badge-gold text-[0.6rem] hover:bg-primary/25 transition-colors cursor-pointer flex-shrink-0"
                    >
                      {prompt.categoryId
                        .replace(/-/g, " ")
                        .replace(/\b\w/g, (c) => c.toUpperCase())}
                    </button>
                    <span className="text-[0.6rem] text-muted-foreground/50 shrink-0">
                      {prompt.section}
                    </span>
                  </div>

                  <h4 className="font-cabinet text-sm font-semibold text-foreground mb-2 group-hover:text-gold/90 transition-colors leading-snug line-clamp-2">
                    {prompt.title}
                  </h4>
                  <p className="text-xs text-muted-foreground/75 leading-relaxed line-clamp-3 mb-3">
                    {prompt.promptText}
                  </p>

                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-border/40">
                    <button
                      type="button"
                      onClick={() => onSelectCategory(prompt.categoryId)}
                      className="text-xs text-muted-foreground/60 hover:text-gold transition-colors font-cabinet"
                    >
                      View category →
                    </button>
                    <Button
                      data-ocid={`prompt.copy_button.${idx + 1}`}
                      variant="ghost"
                      size="icon"
                      onClick={() => copyPrompt(prompt)}
                      className={`w-7 h-7 transition-all ${
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
      </main>

      <Footer />
    </div>
  );
}
