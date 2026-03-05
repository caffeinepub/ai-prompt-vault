import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

// ─── Razorpay ─────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

// TODO: Replace with your live Razorpay key before going to production
const RAZORPAY_KEY_ID = "rzp_test_YourKeyHere";

const PACKAGE_AMOUNTS: Record<string, number> = {
  starter: 9900, // ₹99 in paise
  growth: 29900, // ₹299 in paise
  all_in_one: 49900, // ₹499 in paise
};

// ─── Data ─────────────────────────────────────────────────────────────────────

type PackageType = "starter" | "growth" | "all_in_one";

interface Package {
  packageType: PackageType;
  medal: string;
  name: string;
  price: string;
  tagline: string;
  features: string[];
  footer: string;
  badge?: string;
  tier: "bronze" | "silver" | "gold";
}

const PACKAGES: Package[] = [
  {
    packageType: "starter",
    medal: "🥉",
    name: "Starter Pack",
    price: "₹99",
    tagline: "Perfect if you want to focus on one specific area.",
    features: [
      "Choose any 1 category",
      "80–100 high-quality prompts",
      "Structured & organized format",
      "PDF download",
      "Instant email delivery",
      "Beginner-friendly instructions",
    ],
    footer: "Best for individuals testing AI-powered growth.",
    tier: "bronze",
  },
  {
    packageType: "growth",
    medal: "🥈",
    name: "Growth Bundle",
    price: "₹299",
    tagline: "Ideal for creators, freelancers, and professionals.",
    features: [
      "Choose any 3 categories",
      "250–300 powerful prompts",
      "PDF + Excel formats included",
      "Monetization-focused prompts",
      "Instant download + email delivery",
      "Lifetime access",
    ],
    footer: "Perfect balance between value and price.",
    tier: "silver",
  },
  {
    packageType: "all_in_one",
    medal: "🥇",
    name: "All-In-One AI Prompt Vault",
    price: "₹499",
    tagline: "The complete system for serious growth.",
    features: [
      "All 14 categories included",
      "1400+ premium prompts",
      "PDF + Excel formats",
      "Beginner AI usage guide",
      "Monetization strategy section",
      "Organized & ready to copy-paste",
      "Instant delivery to your email",
      "Lifetime access",
      "Future updates included",
    ],
    footer: "Best value option — save more and unlock everything.",
    badge: "Most Popular",
    tier: "gold",
  },
];

const CATEGORIES = [
  { id: "startup-ideas", name: "Startup Ideas" },
  { id: "digital-marketing", name: "Digital Marketing" },
  { id: "productivity", name: "Productivity" },
  { id: "real-estate", name: "Real Estate" },
  { id: "online-money", name: "Online Money" },
  { id: "study", name: "Study" },
  { id: "instagram-growth", name: "Instagram Growth" },
  { id: "fitness", name: "Fitness" },
  { id: "relationships", name: "Relationships" },
  { id: "dating", name: "Dating" },
  { id: "email-marketing", name: "Email Marketing" },
  { id: "blogging", name: "Blogging" },
  { id: "content-creation", name: "Content Creation" },
  { id: "all-in-one-vault", name: "All-in-One Prompt Vault" },
];

// ─── Tier Styles ──────────────────────────────────────────────────────────────

const TIER_STYLES: Record<
  Package["tier"],
  {
    border: string;
    glow: string;
    badge: string;
    accent: string;
    checkColor: string;
    priceColor: string;
    headerGradient: string;
    cardGradient: string;
  }
> = {
  bronze: {
    border: "border-amber-700/40 hover:border-amber-600/60",
    glow: "",
    badge: "bg-amber-900/40 text-amber-400 border-amber-700/50",
    accent: "text-amber-400",
    checkColor: "text-amber-400",
    priceColor: "text-amber-400",
    headerGradient: "from-amber-950/60 via-amber-900/20 to-transparent",
    cardGradient: "from-amber-950/30 via-background to-background",
  },
  silver: {
    border: "border-slate-500/40 hover:border-slate-400/60",
    glow: "",
    badge: "bg-slate-800/60 text-slate-300 border-slate-600/50",
    accent: "text-slate-300",
    checkColor: "text-slate-300",
    priceColor: "text-slate-200",
    headerGradient: "from-slate-800/60 via-slate-700/20 to-transparent",
    cardGradient: "from-slate-900/30 via-background to-background",
  },
  gold: {
    border: "border-primary/50 hover:border-primary/80",
    glow: "shadow-[0_0_32px_oklch(0.75_0.14_76_/_0.22),0_0_2px_oklch(0.75_0.14_76_/_0.5)]",
    badge: "bg-primary/20 text-gold border-primary/40",
    accent: "text-gold",
    checkColor: "text-gold",
    priceColor: "text-gold",
    headerGradient: "from-yellow-950/60 via-amber-900/20 to-transparent",
    cardGradient: "from-yellow-950/20 via-background to-background",
  },
};

// ─── Purchase Modal ────────────────────────────────────────────────────────────

interface PurchaseModalProps {
  pkg: Package | null;
  onClose: () => void;
  onSuccess: (name: string, email: string, pkgName: string) => void;
}

function PurchaseModal({ pkg, onClose, onSuccess }: PurchaseModalProps) {
  const { actor } = useActor();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load Razorpay script on mount
  useEffect(() => {
    if (document.getElementById("razorpay-script")) return;
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => {
      toast.error(
        "Failed to load payment gateway. Please refresh and try again.",
      );
    };
    document.head.appendChild(script);
  }, []);

  function resetForm() {
    setName("");
    setEmail("");
    setSelectedCategory("");
    setSelectedCategories([]);
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function toggleCategory(catId: string) {
    setSelectedCategories((prev) => {
      if (prev.includes(catId)) return prev.filter((c) => c !== catId);
      if (prev.length >= 3) return prev; // max 3
      return [...prev, catId];
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pkg) return;

    setError("");

    // Validation
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (pkg.packageType === "starter" && !selectedCategory) {
      setError("Please choose a category.");
      return;
    }
    if (pkg.packageType === "growth" && selectedCategories.length !== 3) {
      setError("Please select exactly 3 categories.");
      return;
    }

    const cats =
      pkg.packageType === "starter"
        ? [selectedCategory]
        : pkg.packageType === "growth"
          ? selectedCategories
          : CATEGORIES.map((c) => c.id);

    if (!actor) {
      setError("Connection not ready. Please try again in a moment.");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      const razorpay = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: PACKAGE_AMOUNTS[pkg.packageType],
        currency: "INR",
        name: "AI Prompt Vault",
        description: pkg.name,
        prefill: {
          name: name.trim(),
          email: email.trim(),
        },
        theme: {
          color: "#b8860b",
        },
        handler: async (response: Record<string, string>) => {
          try {
            await actor.submitOrderWithPayment(
              name.trim(),
              email.trim(),
              pkg.packageType,
              cats,
              response.razorpay_payment_id ?? "",
              response.razorpay_order_id ?? "",
            );
            resetForm();
            onSuccess(name.trim(), email.trim(), pkg.name);
          } catch (err) {
            console.error(err);
            toast.error(
              "Payment received but order save failed. Please contact support.",
            );
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsSubmitting(false);
          },
        },
      });
      razorpay.open();
    } catch (err) {
      console.error(err);
      toast.error("Failed to open payment. Please try again.");
      setIsSubmitting(false);
    }
  }

  const isOpen = pkg !== null;
  const tierStyle = pkg ? TIER_STYLES[pkg.tier] : TIER_STYLES.bronze;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent
        data-ocid="pricing.modal.dialog"
        className="max-w-lg bg-card border-border/60 max-h-[90vh] overflow-y-auto scrollbar-vault"
      >
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-foreground flex items-center gap-2">
            <span>{pkg?.medal}</span>
            <span>{pkg?.name}</span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Complete your order — your PDF will be delivered to your email
            instantly.
          </DialogDescription>
        </DialogHeader>

        {/* Price chip */}
        {pkg && (
          <div className="flex items-center gap-3 mb-1">
            <span
              className={`font-display text-3xl font-bold ${tierStyle.priceColor}`}
            >
              {pkg.price}
            </span>
            <span className="text-muted-foreground text-sm">{pkg.tagline}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 mt-1">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="purchase-name"
              className="text-sm text-foreground/80 font-cabinet font-medium"
            >
              Full Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="purchase-name"
              data-ocid="pricing.name.input"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-secondary/50 border-border/60 focus:border-primary/50 h-10"
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label
              htmlFor="purchase-email"
              className="text-sm text-foreground/80 font-cabinet font-medium"
            >
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="purchase-email"
              data-ocid="pricing.email.input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-secondary/50 border-border/60 focus:border-primary/50 h-10"
              disabled={isSubmitting}
            />
          </div>

          {/* Category Selection — Starter */}
          {pkg?.packageType === "starter" && (
            <div className="space-y-1.5">
              <Label
                htmlFor="purchase-category"
                className="text-sm text-foreground/80 font-cabinet font-medium"
              >
                Choose Your Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  id="purchase-category"
                  data-ocid="pricing.category.select"
                  className="bg-secondary/50 border-border/60 h-10"
                >
                  <SelectValue placeholder="Pick 1 category…" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border/60">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category Selection — Growth */}
          {pkg?.packageType === "growth" && (
            <div className="space-y-2">
              <Label className="text-sm text-foreground/80 font-cabinet font-medium">
                Choose 3 Categories{" "}
                <span className="text-muted-foreground">
                  ({selectedCategories.length}/3 selected)
                </span>{" "}
                <span className="text-destructive">*</span>
              </Label>
              <div
                data-ocid="pricing.category.select"
                className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-secondary/30 border border-border/40"
              >
                {CATEGORIES.map((cat) => {
                  const checked = selectedCategories.includes(cat.id);
                  const disabled =
                    isSubmitting ||
                    (!checked && selectedCategories.length >= 3);
                  return (
                    <div
                      key={cat.id}
                      className={`flex items-center gap-2 p-1.5 rounded-md transition-colors ${
                        checked ? "bg-primary/10" : ""
                      } ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <Checkbox
                        id={`cat-${cat.id}`}
                        checked={checked}
                        onCheckedChange={() =>
                          !disabled && toggleCategory(cat.id)
                        }
                        disabled={disabled}
                        className="border-border/60 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <label
                        htmlFor={`cat-${cat.id}`}
                        className={`text-sm font-cabinet leading-none cursor-pointer select-none ${
                          checked ? "text-gold" : "text-foreground/70"
                        } ${disabled ? "cursor-not-allowed" : ""}`}
                      >
                        {cat.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* All-in-one: show included note */}
          {pkg?.packageType === "all_in_one" && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/10 border border-primary/25">
              <Sparkles className="w-4 h-4 text-gold shrink-0" />
              <p className="text-sm text-gold/90 font-cabinet">
                All 14 categories are included with your purchase.
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              data-ocid="pricing.modal.error_state"
              className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-destructive/10 border border-destructive/30"
            >
              <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              data-ocid="pricing.modal.cancel_button"
              className="border-border/60 hover:border-border text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              data-ocid="pricing.modal.submit_button"
              disabled={isSubmitting}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet font-semibold min-w-[130px]"
            >
              {isSubmitting ? (
                <span
                  data-ocid="pricing.modal.loading_state"
                  className="flex items-center gap-2"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Opening Payment…
                </span>
              ) : (
                `Pay Now — ${pkg?.price ?? ""}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Confirmation Dialog ───────────────────────────────────────────────────────

interface ConfirmationDialogProps {
  isOpen: boolean;
  name: string;
  email: string;
  packageName: string;
  onClose: () => void;
}

function ConfirmationDialog({
  isOpen,
  name,
  email,
  packageName,
  onClose,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        data-ocid="pricing.confirm.dialog"
        className="max-w-md bg-card border-border/60 text-center"
      >
        <DialogHeader className="items-center">
          <div className="text-5xl mb-2">🎉</div>
          <DialogTitle className="font-display text-2xl text-foreground">
            Order Received!
          </DialogTitle>
          <DialogDescription className="text-muted-foreground leading-relaxed mt-2 text-base">
            Thank you,{" "}
            <span className="text-foreground font-semibold">{name}</span>! Your
            order for{" "}
            <span className="text-gold font-semibold">{packageName}</span> has
            been received.
            <br />
            <br />
            Your PDF will be delivered to{" "}
            <span className="text-foreground font-semibold">{email}</span>{" "}
            shortly. Please check your inbox (and spam folder) within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center mt-4 mb-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full badge-gold text-sm">
            <Check className="w-4 h-4" />
            <span>Order Confirmed</span>
          </div>
        </div>

        <DialogFooter className="justify-center sm:justify-center mt-2">
          <Button
            data-ocid="pricing.confirm.close_button"
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-cabinet font-semibold px-8"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Pricing Card ──────────────────────────────────────────────────────────────

interface PricingCardProps {
  pkg: Package;
  ocid: string;
  onBuy: (pkg: Package) => void;
}

function PricingCard({ pkg, ocid, onBuy }: PricingCardProps) {
  const style = TIER_STYLES[pkg.tier];

  return (
    <div
      className={`relative flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden ${style.border} ${style.glow} ${
        pkg.tier === "gold"
          ? "bg-gradient-to-b from-yellow-950/20 via-card to-card scale-[1.02]"
          : "bg-card hover:translate-y-[-2px]"
      }`}
    >
      {/* Most Popular badge */}
      {pkg.badge && (
        <div className="absolute top-0 left-0 right-0 flex justify-center -translate-y-0">
          <div
            className={`px-4 py-1 text-xs font-cabinet font-bold tracking-widest uppercase rounded-b-lg ${style.badge} border-x border-b`}
          >
            ✦ {pkg.badge} ✦
          </div>
        </div>
      )}

      {/* Header gradient band */}
      <div
        className={`h-1.5 w-full bg-gradient-to-r ${
          pkg.tier === "bronze"
            ? "from-transparent via-amber-600/60 to-transparent"
            : pkg.tier === "silver"
              ? "from-transparent via-slate-400/60 to-transparent"
              : "from-transparent via-primary to-transparent"
        }`}
      />

      <div
        className={`flex flex-col flex-1 p-6 ${pkg.badge ? "pt-8" : "pt-6"}`}
      >
        {/* Medal + Name */}
        <div className="flex items-center gap-2.5 mb-1">
          <span className="text-3xl leading-none">{pkg.medal}</span>
          <h3
            className={`font-display text-xl font-bold leading-tight ${style.accent}`}
          >
            {pkg.name}
          </h3>
        </div>

        {/* Price */}
        <div className="my-4 flex items-end gap-1.5">
          <span
            className={`font-display text-5xl font-black leading-none ${style.priceColor}`}
          >
            {pkg.price}
          </span>
          <span className="text-muted-foreground text-sm mb-1.5 font-cabinet">
            / one-time
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-muted-foreground font-cabinet leading-relaxed mb-5">
          {pkg.tagline}
        </p>

        {/* Features */}
        <ul className="space-y-2.5 mb-6 flex-1">
          {pkg.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm font-cabinet"
            >
              <Check
                className={`w-4 h-4 shrink-0 mt-0.5 ${style.checkColor}`}
              />
              <span className="text-foreground/85 leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Buy Button */}
        <Button
          data-ocid={ocid}
          onClick={() => onBuy(pkg)}
          className={`w-full font-cabinet font-bold text-base h-11 mt-auto transition-all duration-200 ${
            pkg.tier === "gold"
              ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_16px_oklch(0.75_0.14_76_/_0.3)] hover:shadow-[0_0_24px_oklch(0.75_0.14_76_/_0.5)]"
              : pkg.tier === "silver"
                ? "bg-slate-700/60 text-slate-100 hover:bg-slate-600/80 border border-slate-500/40"
                : "bg-amber-900/50 text-amber-200 hover:bg-amber-800/70 border border-amber-700/40"
          }`}
        >
          Buy Now — {pkg.price}
        </Button>

        {/* Footer note */}
        <p className="text-xs text-muted-foreground/60 text-center mt-3 font-cabinet italic">
          {pkg.footer}
        </p>
      </div>
    </div>
  );
}

// ─── Main PricingSection ──────────────────────────────────────────────────────

export function PricingSection() {
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [confirmation, setConfirmation] = useState<{
    name: string;
    email: string;
    packageName: string;
  } | null>(null);

  function handleBuy(pkg: Package) {
    setSelectedPkg(pkg);
  }

  function handleModalClose() {
    setSelectedPkg(null);
  }

  function handleSuccess(name: string, email: string, packageName: string) {
    setSelectedPkg(null);
    setConfirmation({ name, email, packageName });
  }

  function handleConfirmationClose() {
    setConfirmation(null);
  }

  return (
    <section
      id="pricing"
      data-ocid="pricing.section"
      className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-4"
    >
      {/* Section header */}
      <div className="text-center mb-14">
        <div className="inline-flex items-center gap-2 badge-gold mb-5">
          <span>💎</span>
          <span>Choose Your Access Level</span>
          <span>💎</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3">
          Unlock Your{" "}
          <span className="text-gold [text-shadow:0_0_30px_oklch(0.75_0.14_76_/_0.35)]">
            AI Prompt Vault
          </span>
        </h2>
        <p className="text-muted-foreground text-base sm:text-lg font-cabinet max-w-xl mx-auto">
          Get instant PDF delivery to your email. Lifetime access. Zero
          subscriptions.
        </p>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <PricingCard
          pkg={PACKAGES[0]}
          ocid="pricing.starter.button"
          onBuy={handleBuy}
        />
        <PricingCard
          pkg={PACKAGES[1]}
          ocid="pricing.growth.button"
          onBuy={handleBuy}
        />
        <PricingCard
          pkg={PACKAGES[2]}
          ocid="pricing.all_in_one.button"
          onBuy={handleBuy}
        />
      </div>

      {/* Trust signals */}
      <div className="flex flex-wrap justify-center gap-6 mt-10">
        {[
          { icon: "📧", label: "Instant Email Delivery" },
          { icon: "♾️", label: "Lifetime Access" },
          { icon: "📄", label: "PDF + Excel Formats" },
          { icon: "🔒", label: "Razorpay Secured" },
        ].map(({ icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-sm text-muted-foreground/70 font-cabinet"
          >
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        pkg={selectedPkg}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation !== null}
        name={confirmation?.name ?? ""}
        email={confirmation?.email ?? ""}
        packageName={confirmation?.packageName ?? ""}
        onClose={handleConfirmationClose}
      />
    </section>
  );
}
