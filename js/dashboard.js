// ============================================
// 📊 DASHBOARD.JS — User Dashboard Logic
// ============================================

const supabase = window.supabaseClient || window.supabase;

// ============================================
// GET USER DASHBOARD DATA
// ============================================

async function getUserDashboardData(userId) {
    try {
        // Get user profile
        const profileResult = await getUserProfile(userId);
        if (!profileResult.success) throw new Error(profileResult.error);
        const profile = profileResult.profile;

        // Get user's stories (if author)
        let stories = [];
        if (profile.role === 'author' || profile.role === 'admin') {
            const storiesResult = await getStories({ authorId: userId });
            if (storiesResult.success) {
                stories = storiesResult.data;
            }
        }

        // Get user's spotlights (if scout/reader)
        let spotlights = [];
        if (profile.role === 'scout' || profile.role === 'reader') {
            const { data, error } = await supabase
            .from('spotlights')
            .select('*, stories (*)')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

            if (!error) {
                spotlights = data;
            }
        }

        // Get user's shelves (if scout)
        let shelves = [];
        if (profile.role === 'scout') {
            const { data, error } = await supabase
            .from('shelves')
            .select('*, shelf_items (story_id)')
            .eq('creator_id', userId)
            .order('created_at', { ascending: false });

            if (!error) {
                shelves = data;
            }
        }

        // Get user's reading history (bookmarks)
        let bookmarks = [];
        const { data: bookmarkData, error: bookmarkError } = await supabase
        .from('bookmarks')
        .select('*, stories (*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

        if (!bookmarkError) {
            bookmarks = bookmarkData;
        }

        // Get user's comments
        let comments = [];
        const { data: commentData, error: commentError } = await supabase
        .from('comments')
        .select('*, chapters (title, story_id)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

        if (!commentError) {
            comments = commentData;
        }

        // Calculate totals
        const totalStories = stories.length;
        const totalChapters = stories.reduce((sum, s) => sum + (s.chapter_count || 0), 0);
        const totalSpotlights = spotlights.length;
        const totalBookmarks = bookmarks.length;
        const totalComments = comments.length;

        // Calculate total RIS across all stories (if author)
        let totalRIS = 0;
        stories.forEach(story => {
            totalRIS += calculateRIS(story);
        });

        return {
            success: true,
            data: {
                profile,
                stories,
                spotlights,
                shelves,
                bookmarks,
                comments,
                stats: {
                    totalStories,
                    totalChapters,
                    totalSpotlights,
                    totalBookmarks,
                    totalComments,
                    totalRIS
                }
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// AUTHOR DASHBOARD
// ============================================

async function getAuthorDashboard(userId) {
    try {
        const result = await getUserDashboardData(userId);
        if (!result.success) throw new Error(result.error);

        const data = result.data;
        const profile = data.profile;

        // Get drop-off feedback for author's stories
        let dropOffFeedback = [];
        const storyIds = data.stories.map(s => s.id);
        if (storyIds.length > 0) {
            const { data: feedbackData, error } = await supabase
            .from('dropoff_feedback')
            .select('*')
            .in('story_id', storyIds);

            if (!error) {
                dropOffFeedback = feedbackData;
            }
        }

        // Aggregate drop-off reasons
        const dropOffReasons = {};
        dropOffFeedback.forEach(item => {
            const reason = item.reason || 'Unknown';
            dropOffReasons[reason] = (dropOffReasons[reason] || 0) + 1;
        });

        // Get top stories by RIS
        const topStories = sortByRIS(data.stories).slice(0, 5);

        // Get recent activity (comments on author's stories)
        let recentComments = [];
        const { data: recentData, error: recentError } = await supabase
        .from('comments')
        .select('*, chapters (title, story_id), profiles (display_name)')
        .in('chapter_id', (await supabase
        .from('chapters')
        .select('id')
        .in('story_id', storyIds))
        .data?.map(c => c.id) || [])
        .order('created_at', { ascending: false })
        .limit(10);

        if (!recentError) {
            recentComments = recentData;
        }

        return {
            success: true,
            data: {
                profile,
                stories: data.stories,
                topStories,
                dropOffReasons,
                recentComments,
                stats: data.stats,
                totalRIS: data.stats.totalRIS
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// SCOUT DASHBOARD
// ============================================

async function getScoutDashboard(userId) {
    try {
        const result = await getUserDashboardData(userId);
        if (!result.success) throw new Error(result.error);

        const data = result.data;
        const profile = data.profile;

        // Get Scout rank based on RCS
        const rcs = profile.rcs || 0;
        let scoutRank = 'Seedling';
        if (rcs >= 1000) scoutRank = 'Master';
        else if (rcs >= 500) scoutRank = 'Archivist';
        else if (rcs >= 200) scoutRank = 'Timber';
        else if (rcs >= 50) scoutRank = 'Sapling';

        // Get spotlight stats
        const totalSpotlights = data.spotlights.length;
        const spotlightsThisWeek = data.spotlights.filter(
            s => new Date(s.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        ).length;

        // Get shelf stats
        const totalShelves = data.shelves.length;
        const totalShelfFollowers = data.shelves.reduce((sum, s) => sum + (s.follower_count || 0), 0);

        // Get impact metrics (how many readers reached via spotlights)
        let readersReached = 0;
        const spotlightedStoryIds = data.spotlights.map(s => s.story_id);
        if (spotlightedStoryIds.length > 0) {
            const { count, error } = await supabase
            .from('stories')
            .select('view_count', { count: 'exact', head: true })
            .in('id', spotlightedStoryIds);

            if (!error) {
                // This is a rough estimate — we'd need better analytics for true impact
                readersReached = data.spotlights.length * 10; // Placeholder
            }
        }

        return {
            success: true,
            data: {
                profile,
                scoutRank,
                stats: {
                    rcs,
                    totalSpotlights,
                    spotlightsThisWeek,
                    totalShelves,
                    totalShelfFollowers,
                    readersReached
                },
                recentSpotlights: data.spotlights.slice(0, 5),
                recentShelves: data.shelves.slice(0, 5)
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// READER DASHBOARD
// ============================================

async function getReaderDashboard(userId) {
    try {
        const result = await getUserDashboardData(userId);
        if (!result.success) throw new Error(result.error);

        const data = result.data;
        const profile = data.profile;

        // Get reading stats
        const totalBookmarks = data.bookmarks.length;
        const totalComments = data.comments.length;

        // Get favorite genres from bookmarked stories
        let favoriteGenres = [];
        const bookmarkedStoryIds = data.bookmarks.map(b => b.story_id);
        if (bookmarkedStoryIds.length > 0) {
            const { data: storyData, error } = await supabase
            .from('stories')
            .select('tags')
            .in('id', bookmarkedStoryIds);

            if (!error) {
                const allTags = storyData.flatMap(s => s.tags || []);
                const tagCounts = {};
                allTags.forEach(tag => {
                    tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                });
                favoriteGenres = Object.entries(tagCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([tag]) => tag);
            }
        }

        // Get recently read stories (from bookmarks)
        const recentReads = data.bookmarks.slice(0, 5);

        return {
            success: true,
            data: {
                profile,
                stats: {
                    totalBookmarks,
                    totalComments,
                    favoriteGenres
                },
                recentReads,
                comments: data.comments.slice(0, 5)
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// GET USER'S INFLUENCE WALLET (Scouts)
// ============================================

async function getInfluenceWallet(userId) {
    try {
        const profileResult = await getUserProfile(userId);
        if (!profileResult.success) throw new Error(profileResult.error);
        const profile = profileResult.profile;

        return {
            success: true,
            data: {
                points: profile.influence_points || 0,
                earned: profile.influence_earned || 0,
                shared: profile.influence_shared || 0,
                purchased: profile.influence_purchased || 0,
                breakdown: {
                    'Earned from Activity': profile.influence_earned || 0,
                    'Received from Others': profile.influence_shared || 0,
                    'Purchased': profile.influence_purchased || 0
                }
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// GET USER'S EARNINGS (Authors)
// ============================================

async function getEarnings(userId) {
    try {
        // Get gifts received
        const { data: gifts, error: giftError } = await supabase
        .from('gifts')
        .select('*')
        .eq('receiver_id', userId);

        if (giftError) throw giftError;

        // Get donations received
        const { data: donations, error: donationError } = await supabase
        .from('donations')
        .select('*')
        .eq('author_id', userId)
        .eq('status', 'active');

        if (donationError) throw donationError;

        // Calculate totals
        const totalGiftAmount = gifts.reduce((sum, g) => sum + (g.amount || 0), 0);
        const totalDonationAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
        const platformFee = (totalGiftAmount + totalDonationAmount) * 0.10; // 10% platform fee
        const netEarnings = (totalGiftAmount + totalDonationAmount) - platformFee;

        return {
            success: true,
            data: {
                totalGifts: gifts.length,
                totalDonations: donations.length,
                totalGiftAmount,
                totalDonationAmount,
                platformFee,
                netEarnings,
                recentGifts: gifts.slice(0, 5),
                recentDonations: donations.slice(0, 5)
            }
        };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

window.getUserDashboardData = getUserDashboardData;
window.getAuthorDashboard = getAuthorDashboard;
window.getScoutDashboard = getScoutDashboard;
window.getReaderDashboard = getReaderDashboard;
window.getInfluenceWallet = getInfluenceWallet;
window.getEarnings = getEarnings;
