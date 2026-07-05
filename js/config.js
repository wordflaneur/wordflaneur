// ============================================
// 📝 CONFIG.JS — ALL TEXT AND OPTIONS
// ============================================
// Edit this file to change ANY text, dropdown options,
// mission statements, or descriptions.
// ============================================

const CONFIG = {
  // ============================================
  // 🏠 HOMEPAGE TEXT
  // ============================================
  homepage: {
    hero: {
      title: "It's OK to Be Slower.",
      subtitle: "A sanctuary for slow-burn stories. Where fantasy breathes. Where romance unfolds. Where every chapter is savored.",
      buttonText: "Explore Stories",
      buttonLink: "/library.html"
    },
    mission: {
      title: "Why MythosForge?",
      description: "We're building a platform where every story gets a fair chance. Where readers are curators. Where writers can breathe.",
      points: [
        "Weekly updates are enough—no daily pressure.",
        "Quality matters more than speed.",
        "Readers become Scouts and promote stories they love.",
        "Every story gets a second chance."
      ]
    },
    supporterBanner: {
      text: "💚 Support MythosForge",
      oneTimeText: "Buy us a coffee ☕",
      recurringText: "Join the Supporter's Circle"
    }
  },

  // ============================================
  // 📄 ABOUT PAGE
  // ============================================
  about: {
    title: "About MythosForge",
    sections: [
      {
        heading: "Our Philosophy",
        content: "We believe stories should be experienced, not consumed. We believe quality matters more than speed. We believe community is stronger than competition."
      },
      {
        heading: "Why We Exist",
        content: "Other platforms reward speed and volume. We reward commitment, community, and sustainability."
      },
      {
        heading: "What We Offer",
        content: [
          "A place to write at your own pace.",
          "Readers who curate, not algorithms.",
          "Earn $200–$500/month from your hobby.",
          "A community that values quality over speed."
        ]
      }
    ]
  },

  // ============================================
  // 🏷️ TAG SYSTEM OPTIONS
  // ============================================
  tags: {
    categories: {
      genre: {
        label: "Genre",
        options: [
          "High Fantasy",
          "Dark Fantasy",
          "Urban Fantasy",
          "Sci-Fantasy",
          "LitRPG",
          "Romantic Fantasy",
          "Cozy Fantasy"
        ]
      },
      vibe: {
        label: "Vibe / Trope",
        options: [
          "Political",
          "Slow Burn",
          "Morally Grey",
          "Found Family",
          "No Chosen One",
          "Grimdark",
          "Wholesome",
          "Philosophical"
        ]
      },
      mood: {
        label: "Mood / Atmosphere",
        options: [
          "Hopeful",
          "Bleak",
          "Mysterious",
          "Epic",
          "Intimate",
          "Tense"
        ]
      },
      pacing: {
        label: "Pacing",
        options: [
          "Fast-paced",
          "Medium-paced",
          "Slow-paced"
        ]
      },
      character: {
        label: "Character Focus",
        options: [
          "Male Lead",
          "Female Lead",
          "Ensemble",
          "Anti-Hero",
          "Villain Protagonist"
        ]
      },
      relationship: {
        label: "Relationship",
        options: [
          "Romance",
          "Friendship",
          "Family",
          "Rivalry"
        ]
      },
      content: {
        label: "Content Warnings",
        options: [
          "Violence",
          "Gore",
          "Sexual Content",
          "Strong Language",
          "Trauma"
        ]
      }
    },
    visibleCategories: {
      genre: true,
      vibe: true,
      mood: true,
      pacing: true,
      character: true,
      relationship: true,
      content: true
    }
  },

  // ============================================
  // 📊 RANKING VIEWS (Dropdown Options)
  // ============================================
  rankings: {
    views: [
      { id: "most-scouted", label: "Most Scouted", description: "Weighted by Scout RCS" },
      { id: "rising", label: "Rising", description: "Most Spotlights in 7 days" },
      { id: "hidden-gems", label: "Hidden Gems", description: "RIS < 50" },
      { id: "curator-picks", label: "Curator Picks", description: "Most Shelf appearances" },
      { id: "lost-found", label: "Lost & Found", description: "Old but high quality" },
      { id: "promoted", label: "Promoted", description: "Paid or earned visibility" }
    ]
  },

  // ============================================
  // 💰 SUBSCRIPTION PLANS
  // ============================================
  plans: [
    {
      id: "free",
      name: "Tier",
      price: "$0",
      description: "Just starting out",
      features: [
        "Publish up to 3 stories",
        "5 images per story",
        "Basic analytics"
      ]
    },
    {
      id: "serious",
      name: "Serious",
      price: "$4.99",
      description: "Committed to your craft",
      features: [
        "Publish up to 10 stories",
        "15 images per story",
        "Basic analytics",
        "Early access to features"
      ]
    },
    {
      id: "pro",
      name: "Pro",
      price: "$9.99",
      description: "Building a career",
      features: [
        "Unlimited stories",
        "25 images per story",
        "Advanced analytics",
        "24-hour early access",
        "Ad-free reading",
        "Ebook downloads"
      ]
    },
    {
      id: "superpro",
      name: "SuperPro",
      price: "$19.99",
      description: "Platform supporter",
      features: [
        "Unlimited stories",
        "50 images per story",
        "Full analytics suite",
        "72-hour early access",
        "Ad-free reading",
        "Ebook downloads",
        "Direct feedback channel",
        "Name in platform credits"
      ]
    }
  ],

  // ============================================
  // 🎁 SUPPORTER'S CIRCLE (Donations)
  // ============================================
  supporterTiers: [
    { id: "supporter", name: "Supporter", price: "$2", badge: "💚" },
    { id: "pro-supporter", name: "Pro Supporter", price: "$5", badge: "⭐" },
    { id: "super-supporter", name: "Super Supporter", price: "$10", badge: "👑" },
    { id: "platinum", name: "Platinum Supporter", price: "$25", badge: "🏆" },
    { id: "diamond", name: "Diamond Supporter", price: "$50", badge: "💎" }
  ],

  // ============================================
  // 📋 SCOUT APPLICATION FORM
  // ============================================
  scoutApplication: {
    title: "Become a Scout",
    description: "Scouts are dedicated readers who discover and promote great stories. They Spotlight stories, create Shelves, and help shape the platform.",
    commitmentQuestion: "How much time do you plan to spend reading and recommending?",
    commitmentOptions: [
      "1-2 hours per week (Casual)",
      "3-5 hours per week (Moderate)",
      "5-10 hours per week (Dedicated)",
      "10+ hours per week (Highly Dedicated)"
    ],
    genreQuestion: "What genres do you enjoy reading?",
    genreOptions: [
      "High Fantasy",
      "Dark Fantasy",
      "Romantic Fantasy",
      "Cozy Fantasy",
      "Political Fantasy",
      "LitRPG",
      "Slice-of-Life",
      "Other"
    ],
    contributionQuestion: "How do you plan to contribute?",
    contributionOptions: [
      "Spotlighting stories I love",
      "Creating Curator Shelves",
      "Leaving thoughtful comments",
      "Providing feedback to authors",
      "All of the above"
    ]
  },

  // ============================================
  // 💬 DROP-OFF FEEDBACK OPTIONS
  // ============================================
  dropOffOptions: [
    "The story is too slow",
    "The plot is unclear",
    "The characters aren't engaging",
    "The writing style isn't for me",
    "I got busy (will return later)",
    "Other"
  ],

  // ============================================
  // 🚀 EARLY ADOPTER MESSAGING
  // ============================================
  earlyAdopter: {
    founderMessage: "🌟 You're a Founder! (First 10 users)",
    pioneerMessage: "🏅 You're a Pioneer! (First 50 users)",
    earlyAdopterMessage: "🎖️ You're an Early Adopter! (First 200 users)",
    benefits: [
      "Permanent badge",
      "+5% RIS boost (Founders only)",
      "Lower platform fees",
      "Early access to new features"
    ]
  },

  // ============================================
  // 🛠️ ALGORITHM WEIGHTS (Easy to tweak)
  // ============================================
  algorithmWeights: {
    view: 1,
    chapterClick: 2,
    spotlight: 10,
    comment: 5,
    shelfAddition: 8,
    gift: 15,
    bookmark: 3
  },

  // ============================================
  // 👑 SUPERPRO APPLICATION
  // ============================================
  superProApplication: {
    title: "Apply for SuperPro",
    description: "SuperPro is for our most dedicated supporters. It's not just about money—it's about commitment.",
    requirements: [
      "3+ months active on the platform",
      "10+ published chapters (authors) or 50+ chapters read (readers)",
      "Commitment to helping the platform grow"
    ],
    benefits: [
      "Exclusive 'Founder's Circle' badge",
      "Direct feedback channel",
      "Name in platform credits",
      "2x Spotlight weight"
    ]
  },

  // ============================================
  // 📚 PLATFORM NETWORK (Future)
  // ============================================
  platformNetwork: {
    title: "The Forge Network",
    description: "MythosForge is the first of many Forges. Each platform has its own identity, its own vibe, and its own community.",
    platforms: [
      { name: "MythosForge", genre: "Fantasy", color: "#6b4f3c", tagline: "It's OK to Be Slower." },
      { name: "HeartsForge", genre: "Romance", color: "#c0392b", tagline: "Love Without the Rush." },
      { name: "NovaForge", genre: "Sci-Fi", color: "#2980b9", tagline: "Infinity at Your Own Pace." },
      { name: "MysteryForge", genre: "Mystery", color: "#8e44ad", tagline: "Slow-Burn Suspense." }
    ]
  }
};

// ============================================
// 📤 EXPORT
// ============================================
// If using modules:
// export default CONFIG;

// For browser:
window.CONFIG = CONFIG;
