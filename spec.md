# AI Prompt Vault

## Current State
- 12 categories exist: Startup Ideas, Digital Marketing, Productivity, Real Estate, Online Money, Study, Instagram Growth, Fitness, Relationships, Dating, Email Marketing, Blogging
- 3 pricing packages (Starter ₹99, Growth ₹299, All-In-One ₹499) with a buy modal that submits an order to the backend
- No real payment gateway — orders are stored as "pending" with no actual payment flow
- Frontend has CATEGORY_ICONS, CATEGORY_COLORS, and CATEGORIES arrays that need updating for new categories

## Requested Changes (Diff)

### Add
- 2 new categories: "Content Creation" (🎬) and "All-in-One Prompt Vault" (🔐), bringing total to 14
- Razorpay payment gateway integration in PurchaseModal: load Razorpay script, open Razorpay checkout on "Pay Now", confirm order in backend only after successful payment callback
- Razorpay key config (test key placeholder) in frontend env or hardcoded constant
- New CATEGORY_ICONS and CATEGORY_COLORS entries for the 2 new categories

### Modify
- CATEGORIES array in PricingSection to include the 2 new categories
- Hero stats: "12 Categories" → "14 Categories", "2,400+" prompts → "2,800+"
- All-In-One package features text updated to reference "All 14 categories" and "1400+ prompts"
- PurchaseModal submit button: replaces direct backend call with Razorpay checkout; backend submitOrder called only in Razorpay success handler
- "All-in-one" note in modal updated to say "All 14 categories"
- Backend: add 2 new category entries with prompts (seed data populated at init time or via first-access logic using existing pattern)

### Remove
- Nothing removed

## Implementation Plan
1. Update backend main.mo to include the 2 new categories and their prompts in the data store
2. Update HomePage.tsx: add CATEGORY_ICONS and CATEGORY_COLORS entries for content-creation and all-in-one-vault; update hero stats text
3. Update PricingSection.tsx: add 2 new entries to CATEGORIES array; update All-In-One feature list; integrate Razorpay checkout — load script dynamically, open checkout on form submit, call submitOrder in success handler
4. Update all references to "12 categories" and "2400+ prompts" across the UI
