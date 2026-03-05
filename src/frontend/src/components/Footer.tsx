import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const utmLink = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border/40 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-gold" />
            </div>
            <span className="font-display text-sm font-semibold text-foreground">
              AI Prompt Vault
            </span>
          </div>

          {/* Caption */}
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1.5">
            © {year}. Built with{" "}
            <Heart className="w-3 h-3 text-red-400/70 inline" /> using{" "}
            <a
              href={utmLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold/70 hover:text-gold transition-colors underline-offset-2 hover:underline"
            >
              caffeine.ai
            </a>
          </p>

          {/* Tagline */}
          <p className="text-xs text-muted-foreground/40 font-serif-accent italic">
            2,400+ premium AI prompts
          </p>
        </div>
      </div>
    </footer>
  );
}
