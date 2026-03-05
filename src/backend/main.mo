import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Category = {
    id : Text;
    name : Text;
    icon : Text;
    description : Text;
    useCase : Text;
    beginnerInstructions : Text;
    monetizationTips : Text;
  };

  type Prompt = {
    id : Text;
    categoryId : Text;
    section : Text;
    title : Text;
    promptText : Text;
  };

  type PurchaseOrder = {
    id : Text;
    customerName : Text;
    customerEmail : Text;
    packageType : Text; // "starter" | "growth" | "all_in_one"
    selectedCategories : [Text];
    timestamp : Int;
    status : Text; // "pending" | "confirmed" | "paid"
  };

  let categoryData = Map.empty<Text, Category>();
  let promptData = Map.empty<Text, Prompt>();
  let orderData = Map.empty<Text, PurchaseOrder>();

  // Seed Categories (only new ones)
  categoryData.add(
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

  categoryData.add(
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

  // Seed Prompts - Content Creation
  promptData.add(
    "cc-001",
    {
      id = "cc-001";
      categoryId = "content-creation";
      section = "Content Ideation";
      title = "Viral Video Idea Generator";
      promptText = "Generate 10 viral YouTube video ideas for a [niche] channel targeting [audience]. Each idea should have a curiosity gap title, a one-sentence hook, and a reason why it would get clicks.";
    },
  );

  promptData.add(
    "cc-002",
    {
      id = "cc-002";
      categoryId = "content-creation";
      section = "Content Ideation";
      title = "Weekly Content Calendar";
      promptText = "Create a 7-day content calendar for a [platform] account in the [niche] space. Include content type, topic, caption angle, and best posting time for each day.";
    },
  );

  promptData.add(
    "cc-003",
    {
      id = "cc-003";
      categoryId = "content-creation";
      section = "Hook Writing";
      title = "3-Second Hook Formula";
      promptText = "Write 10 attention-grabbing opening hooks (under 15 words each) for a video about [topic]. Use curiosity, controversy, urgency, and personal story as angles.";
    },
  );

  promptData.add(
    "cc-004",
    {
      id = "cc-004";
      categoryId = "content-creation";
      section = "Hook Writing";
      title = "Thumbnail Text Copy";
      promptText = "Generate 8 thumbnail text options for a YouTube video titled [title]. Each option should be 3-5 words, emotionally charged, and designed to maximize CTR.";
    },
  );

  promptData.add(
    "cc-005",
    {
      id = "cc-005";
      categoryId = "content-creation";
      section = "Script Writing";
      title = "Full YouTube Script";
      promptText = "Write a complete 8-minute YouTube script for a video titled [title]. Include: hook (30s), intro (1min), 3 main sections with transitions, and a strong CTA outro.";
    },
  );

  promptData.add(
    "cc-006",
    {
      id = "cc-006";
      categoryId = "content-creation";
      section = "Script Writing";
      title = "Short-Form Script (60s)";
      promptText = "Write a 60-second TikTok/Reel script about [topic] for [niche]. Use a hook, rapid value delivery, and a CTA. Format it with timestamps for each section.";
    },
  );

  promptData.add(
    "cc-007",
    {
      id = "cc-007";
      categoryId = "content-creation";
      section = "Repurposing Content";
      title = "Blog to Video Script";
      promptText = "Convert this blog post into a YouTube video script: [paste blog]. Rewrite it for spoken delivery, add visual cue notes, and restructure for maximum viewer retention.";
    },
  );

  promptData.add(
    "cc-008",
    {
      id = "cc-008";
      categoryId = "content-creation";
      section = "Repurposing Content";
      title = "Video to 5 Platforms";
      promptText = "I have a YouTube video about [topic]. Repurpose its core message into: a Twitter thread, LinkedIn post, Instagram caption, newsletter paragraph, and Pinterest pin description.";
    },
  );

  promptData.add(
    "cc-009",
    {
      id = "cc-009";
      categoryId = "content-creation";
      section = "SEO & Titles";
      title = "SEO-Optimized YouTube Title Pack";
      promptText = "Write 10 SEO-optimized YouTube titles for a video about [topic] targeting the keyword [keyword]. Balance search volume with click-worthiness for each title.";
    },
  );

  promptData.add(
    "cc-010",
    {
      id = "cc-010";
      categoryId = "content-creation";
      section = "SEO & Titles";
      title = "Video Description Template";
      promptText = "Write a YouTube video description for [title] that includes: a keyword-rich opening paragraph, timestamps, links section, and a subscribe CTA. Target keyword: [keyword].";
    },
  );

  // Seed Prompts - All-in-One Vault
  promptData.add(
    "aio-001",
    {
      id = "aio-001";
      categoryId = "all-in-one-vault";
      section = "Business & Strategy";
      title = "One-Page Business Plan";
      promptText = "Create a concise one-page business plan for [business idea]. Include: problem, solution, target audience, revenue model, key differentiator, and 90-day action plan.";
    },
  );

  promptData.add(
    "aio-002",
    {
      id = "aio-002";
      categoryId = "all-in-one-vault";
      section = "Business & Strategy";
      title = "SWOT Analysis Generator";
      promptText = "Conduct a detailed SWOT analysis for [business/idea]. For each quadrant, list 5 specific points with actionable implications for each weakness and threat.";
    },
  );

  promptData.add(
    "aio-003",
    {
      id = "aio-003";
      categoryId = "all-in-one-vault";
      section = "Marketing & Growth";
      title = "Go-to-Market Strategy";
      promptText = "Create a go-to-market strategy for [product] launching in [market]. Include: target segment, channels, messaging, pricing, launch sequence, and 30-60-90 day milestones.";
    },
  );

  promptData.add(
    "aio-004",
    {
      id = "aio-004";
      categoryId = "all-in-one-vault";
      section = "Marketing & Growth";
      title = "Viral Marketing Campaign";
      promptText = "Design a viral marketing campaign for [product/brand]. Include: core shareable mechanic, target trigger emotion, distribution channels, and metrics to track virality coefficient.";
    },
  );

  promptData.add(
    "aio-005",
    {
      id = "aio-005";
      categoryId = "all-in-one-vault";
      section = "Content & Copy";
      title = "Sales Page Copy";
      promptText = "Write a high-converting sales page for [product]. Include: headline, subheadline, pain agitation, solution, benefits list, social proof section, FAQ, and CTA. Tone: [tone].";
    },
  );

  promptData.add(
    "aio-006",
    {
      id = "aio-006";
      categoryId = "all-in-one-vault";
      section = "Content & Copy";
      title = "5-Part Email Sequence";
      promptText = "Write a 5-email welcome sequence for [product/service]. Email 1: welcome + quick win. Email 2: story + value. Email 3: case study. Email 4: objection handling. Email 5: offer CTA.";
    },
  );

  promptData.add(
    "aio-007",
    {
      id = "aio-007";
      categoryId = "all-in-one-vault";
      section = "Productivity & Planning";
      title = "90-Day Goal Sprint Plan";
      promptText = "Create a 90-day goal achievement plan for [goal]. Break it into 3 monthly milestones, weekly action items, daily habits, and a tracking system. Include accountability checkpoints.";
    },
  );

  promptData.add(
    "aio-008",
    {
      id = "aio-008";
      categoryId = "all-in-one-vault";
      section = "Productivity & Planning";
      title = "Decision-Making Framework";
      promptText = "I need to make a decision about [decision]. Apply the 10/10/10 framework, second-order thinking, and pre-mortem analysis. Give me a structured recommendation.";
    },
  );

  promptData.add(
    "aio-009",
    {
      id = "aio-009";
      categoryId = "all-in-one-vault";
      section = "Personal Development";
      title = "Limiting Belief Reframe";
      promptText = "I hold this limiting belief: [belief]. Help me identify where it came from, why it is inaccurate, and reframe it into 3 empowering beliefs with supporting evidence.";
    },
  );

  promptData.add(
    "aio-010",
    {
      id = "aio-010";
      categoryId = "all-in-one-vault";
      section = "Personal Development";
      title = "Annual Life Audit";
      promptText = "Guide me through an annual life audit across 8 areas: career, finance, health, relationships, learning, creativity, spirituality, and fun. Rate each area and set one stretch goal per area.";
    },
  );

  // Category and Prompt methods
  public query ({ caller }) func getCategories() : async [Category] {
    categoryData.values().toArray();
  };

  public query ({ caller }) func getCategoryById(id : Text) : async Category {
    switch (categoryData.get(id)) {
      case (?category) { category };
      case (null) { Runtime.trap("Category not found") };
    };
  };

  public query ({ caller }) func getPromptsByCategory(categoryId : Text) : async [Prompt] {
    promptData.values().toArray().filter(func(prompt) { prompt.categoryId == categoryId });
  };

  public query ({ caller }) func searchPrompts(searchQuery : Text) : async [Prompt] {
    let lowercaseQuery = searchQuery.toLower();
    promptData.values().toArray().filter(
      func(prompt) {
        prompt.title.toLower().contains(#text lowercaseQuery) or
        prompt.promptText.toLower().contains(#text lowercaseQuery);
      }
    );
  };

  public query ({ caller }) func getPromptById(id : Text) : async Prompt {
    switch (promptData.get(id)) {
      case (?prompt) { prompt };
      case (null) { Runtime.trap("Prompt not found") };
    };
  };

  // Purchase Order methods
  public shared ({ caller }) func submitOrder(
    customerName : Text,
    customerEmail : Text,
    packageType : Text,
    selectedCategories : [Text],
  ) : async Text {
    let newOrderId = customerEmail # "_" # packageType # "_" # Time.now().toText();
    let newOrder : PurchaseOrder = {
      id = newOrderId;
      customerName;
      customerEmail;
      packageType;
      selectedCategories;
      timestamp = Time.now();
      status = "pending";
    };
    orderData.add(newOrderId, newOrder);
    newOrderId;
  };

  public shared ({ caller }) func submitOrderWithPayment(
    customerName : Text,
    customerEmail : Text,
    packageType : Text,
    selectedCategories : [Text],
    razorpayPaymentId : Text,
    razorpayOrderId : Text,
  ) : async Text {
    let newOrderId = customerEmail # "_" # packageType # "_" # Time.now().toText() # "_" # razorpayPaymentId;
    let newOrder : PurchaseOrder = {
      id = newOrderId;
      customerName;
      customerEmail;
      packageType;
      selectedCategories;
      timestamp = Time.now();
      status = "paid";
    };
    orderData.add(newOrderId, newOrder);
    newOrderId;
  };

  public query ({ caller }) func getOrderById(id : Text) : async PurchaseOrder {
    switch (orderData.get(id)) {
      case (?order) { order };
      case (null) { Runtime.trap("Order not found") };
    };
  };

  public query ({ caller }) func getAllOrders() : async [PurchaseOrder] {
    orderData.values().toArray();
  };
};
