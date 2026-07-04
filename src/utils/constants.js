export const BOOKING_GUEST_DETAILS_STORAGE_KEY = "tripease_guest_details";

export const BRAND_NAME = "TripEase";
export const DEFAULT_LOCALE = "en-IN";
export const CURRENCY_SYMBOL = "\u20b9";
export const DEFAULT_HOTEL_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945";

export const AI_CONSTANTS = {
  DEFAULT_HOTEL_MESSAGE:
    "Find a luxurious stay in Goa between 9000 to 12000 for 2 nights",
  EXAMPLE_PROMPTS: [
    {
      label: "Goa luxury",
      description: "2 nights, premium budget",
      prompt: "Find a luxurious stay in Goa between 9000 to 12000 for 2 nights",
    },
    {
      label: "Mumbai value",
      description: "Basic rooms, 2 guests",
      prompt: "Show affordable basic rooms in Mumbai for 2 guests and 3 nights",
    },
    {
      label: "Jaipur family",
      description: "Suite, pool, 4+ rating",
      prompt: "Find a family suite in Jaipur for 4 guests with pool and 4+ rating",
    },
  ],
  RESULTS_STATE: {
    initial: {
      title: "Tell us the trip you have in mind",
      description:
        "Share a city, mood, budget, guests, nights, or room style. Your best-fit stays will appear here with filters already prepared.",
    },
    empty: {
      title: "No perfect stay found yet",
      description: `Try a broader ${BRAND_NAME} search with a city, budget, guests, or room preference.`,
    },
    loading: {
      title: `Searching ${BRAND_NAME} hotels`,
      description: "Checking rooms, prices, totals, and filters for this request.",
    },
  },
  NOTIFICATION_COPY: {
    searchRequiredTitle: "Search required",
    searchRequiredMessage: "Enter a hotel request to continue.",
    searchFailedTitle: "Search failed",
    searchFailedMessage: "Could not fetch AI hotel results right now.",
  },
  SEARCH_COPY: {
    badge: `${BRAND_NAME} AI`,
    modeBadge: "travel concierge",
    title: "Describe the stay. We'll find the place.",
    subtitle:
      "Tell TripEase the vibe, destination, budget, guests, and nights. AI shapes it into beautiful hotel matches with live prices and room-level filters.",
    formTitle: "Plan your stay",
    examplesLabel: "Quick ideas",
    promptLabel: "What kind of stay do you want?",
    promptHelper: "Add city, dates or nights, budget, guests, rating, and room style.",
    promptCapabilityBadge: "room + price aware",
    loadingStatus: "Searching",
    assistantLoading: "Matching hotels, rooms, and budgets",
    textareaPlaceholder: `Example: beach resort in Goa for 2 nights under ${CURRENCY_SYMBOL}12,000`,
    submitLabel: "Find stays",
    useSuggestionLabel: "Use suggestion",
    recommendedTitle: "Handpicked for you",
    recommendedSubtitle: "Top stays from your AI search",
    filtersTitle: "Trip details",
    filtersEmpty: "Your trip filters will appear after search.",
    filtersLoading: "Reading your travel preferences.",
    resultsTitle: "Available stays",
    resultsLoadingSubtitle: "Searching beautiful matches now",
    searchingBadge: "Searching",
    liveSearchBadge: "live search",
    aiWorkingBadge: "AI working",
    noResultCardsSubtitle: "No hotel cards for this request",
    resultsInitialSubtitle: "Results appear here",
    matchesSuffix: "matches",
  },
  FEATURE_BADGES: [
    "verified prices",
    "room-level matches",
    "editable filters",
  ],
  UNSUPPORTED_QUERY_SOURCE: "unsupported_query",
};

export const formatCurrency = (value = 0) =>
  `${CURRENCY_SYMBOL}${Number(value || 0).toLocaleString(DEFAULT_LOCALE)}`;
