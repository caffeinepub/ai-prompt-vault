import Map "mo:core/Map";
import Text "mo:core/Text";

module {
  type OldCategory = {
    id : Text;
    name : Text;
    icon : Text;
    description : Text;
    useCase : Text;
    beginnerInstructions : Text;
    monetizationTips : Text;
  };

  type OldPrompt = {
    id : Text;
    categoryId : Text;
    section : Text;
    title : Text;
    promptText : Text;
  };

  type OldPurchaseOrder = {
    id : Text;
    customerName : Text;
    customerEmail : Text;
    packageType : Text; // "starter" | "growth" | "all_in_one"
    selectedCategories : [Text];
    timestamp : Int;
    status : Text; // "pending" | "confirmed"
  };

  type OldActor = {
    categoryData : Map.Map<Text, OldCategory>;
    promptData : Map.Map<Text, OldPrompt>;
    orderData : Map.Map<Text, OldPurchaseOrder>;
  };

  // New types (same as current main.mo)
  type NewCategory = OldCategory;
  type NewPrompt = OldPrompt;
  type NewPurchaseOrder = OldPurchaseOrder;
  type NewActor = {
    categoryData : Map.Map<Text, NewCategory>;
    promptData : Map.Map<Text, NewPrompt>;
    orderData : Map.Map<Text, NewPurchaseOrder>;
  };

  public func run(old : OldActor) : NewActor {
    // Seed new categories (no seed prompts for new categories)
    let newCategories = old.categoryData.clone();
    newCategories.add(
      "content-creation",
      {
        id = "content-creation";
        name = "Content Creation";
        icon = "🎬";
        description = "Master the art of creating scroll-stopping content for YouTube, TikTok, Reels, podcasts, and beyond with AI-powered ideation and scripting prompts.";
        useCase = "Content creators, YouTubers, podcasters, and video marketers use these prompts to generate video ideas, write compelling scripts, craft hooks, plan content calendars, repurpose content across platforms, and build a loyal audience at scale.";
        beginnerInstructions = "1. Start with the Content Ideation section to generate niche-relevant video ideas.\n2. Use Hook Writing prompts to craft attention-grabbing openers.\n3. Explore Script Structure prompts to outline full videos.\n4. Apply Repurposing prompts to turn one piece of content into 5+ formats.\n5. Use Audience Growth prompts to craft CTAs and community-building strategies.";
        monetizationTips = "1. Offer done-for-you content scripting as a service on Fiverr or Upwork.\n2. Build a content-creation agency using AI to deliver at scale.\n3. Sell a Content Calendar in a Day template bundle.\n4. Teach a course on AI-powered content creation.\n5. Monetize a YouTube channel faster by optimizing titles and scripts with these prompts.";
      },
    );

    newCategories.add(
      "all-in-one-vault",
      {
        id = "all-in-one-vault";
        name = "All-in-One Prompt Vault";
        icon = "🔐";
        description = "The master collection — a curated selection of the highest-impact prompts from every category, organized for maximum productivity and instant deployment.";
        useCase = "Power users, AI enthusiasts, entrepreneurs, and professionals who want the single best prompt from every domain use this vault as their daily AI command center for rapid ideation, problem-solving, writing, and decision-making.";
        beginnerInstructions = "1. Browse section by section — each section maps to a core life or business domain.\n2. Pick the prompt closest to your current goal and paste it into ChatGPT, Claude, or Gemini.\n3. Replace bracketed placeholders with your specific details.\n4. Iterate: ask the AI to refine, expand, or simplify its output.\n5. Save your top 10 most-used prompts in a personal document for daily access.";
        monetizationTips = "1. Use prompts from multiple categories together to build a full business system.\n2. Sell curated prompt packs to clients in specific niches.\n3. Build AI-powered service packages combining prompts from 3+ categories.\n4. Create a prompt of the day newsletter monetized via sponsorship.\n5. License your curated prompt workflow as a productized consulting offer.";
      },
    );

    {
      old with
      categoryData = newCategories
    };
  };
};
