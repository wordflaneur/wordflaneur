// ============================================
// 📊 ALGORITHM.JS — RIS Calculation
// ============================================

// Calculate RIS for a single story
function calculateRIS(story) {
  const weights = CONFIG.algorithmWeights;

  return (
    (story.view_count || 0) * weights.view +
    (story.chapter_count || 0) * weights.chapterClick +
    (story.spotlight_count || 0) * weights.spotlight +
    (story.comment_count || 0) * weights.comment +
    (story.shelf_appearance_count || 0) * weights.shelfAddition +
    (story.gift_count || 0) * weights.gift +
    (story.bookmark_count || 0) * weights.bookmark
  );
}

// Sort stories by RIS (descending)
function sortByRIS(stories) {
  return stories.sort((a, b) => calculateRIS(b) - calculateRIS(a));
}

// Get top stories by RIS
function getTopStories(stories, limit = 10) {
  const sorted = sortByRIS(stories);
  return sorted.slice(0, limit);
}

// Filter stories for Hidden Gems (RIS < 50)
function getHiddenGems(stories) {
  return stories.filter(story => calculateRIS(story) < 50);
}

// Filter stories for Lost & Found (not updated in 30+ days, RIS > 100)
function getLostAndFound(stories) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  return stories.filter(story => {
    const lastUpdated = new Date(story.last_updated);
    const ris = calculateRIS(story);
    return lastUpdated < thirtyDaysAgo && ris > 100;
  });
}

// Get Rising Stories (most Spotlights in 7 days)
function getRisingStories(stories) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Sort by spotlight_count (descending)
  return stories
    .filter(story => new Date(story.created_at) > sevenDaysAgo)
    .sort((a, b) => (b.spotlight_count || 0) - (a.spotlight_count || 0));
}

// Get Scout-Weighted Spotlights
function calculateWeightedSpotlights(story, scouts) {
  // If scouts are passed, weight by their RCS
  if (scouts && scouts.length > 0) {
    const totalWeight = scouts.reduce((sum, scout) => {
      return sum + (1 + (scout.rcs || 0) / 1000);
    }, 0);
    return story.spotlight_count * (1 + totalWeight / 100);
  }
  return story.spotlight_count;
}

// Sort stories by weighted spotlights
function sortByWeightedSpotlights(stories, scouts) {
  return stories.sort((a, b) => {
    const aWeighted = calculateWeightedSpotlights(a, scouts);
    const bWeighted = calculateWeightedSpotlights(b, scouts);
    return bWeighted - aWeighted;
  });
}

// Calculate Loyalty Bonus
function calculateLoyaltyBonus(user) {
  const daysActive = user.days_active || 0;
  const weeksConsecutive = user.consecutive_weeks || 0;
  const currentMonth = getCurrentMonth(); // 1-24

  const baseBonus = (daysActive * 0.5) + (weeksConsecutive * 2);

  // Phase-based cap
  let maxBonus;
  if (currentMonth <= 6) maxBonus = 50;
  else if (currentMonth <= 12) maxBonus = 50 - ((currentMonth - 6) * 5);
  else if (currentMonth <= 24) maxBonus = 20 - ((currentMonth - 12) * 1.25);
  else maxBonus = 0;

  return Math.min(Math.round(baseBonus), maxBonus);
}

// Helper: get current month since launch
function getCurrentMonth() {
  const launchDate = new Date('2026-07-01');
  const now = new Date();
  const months = (now.getFullYear() - launchDate.getFullYear()) * 12 +
                 (now.getMonth() - launchDate.getMonth()) + 1;
  return Math.min(Math.max(months, 1), 24);
}

// Apply loyalty bonus to RIS
function applyLoyaltyBonusToRIS(story, user) {
  const bonus = calculateLoyaltyBonus(user);
  const ris = calculateRIS(story);
  return ris + (bonus * 0.5);
}

// Export functions
window.calculateRIS = calculateRIS;
window.sortByRIS = sortByRIS;
window.getTopStories = getTopStories;
window.getHiddenGems = getHiddenGems;
window.getLostAndFound = getLostAndFound;
window.getRisingStories = getRisingStories;
window.calculateWeightedSpotlights = calculateWeightedSpotlights;
window.sortByWeightedSpotlights = sortByWeightedSpotlights;
window.calculateLoyaltyBonus = calculateLoyaltyBonus;
window.applyLoyaltyBonusToRIS = applyLoyaltyBonusToRIS;
