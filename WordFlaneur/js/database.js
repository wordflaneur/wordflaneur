// ============================================
// 📊 DATABASE.JS — Database Operations
// ============================================

// ============================================
// STORY OPERATIONS
// ============================================

// Get all stories with optional filters
async function getStories(filters = {}) {
  try {
    let query = supabase
      .from('stories')
      .select(`
        *,
        profiles:author_id (username, display_name),
        tags:story_tags (tag_id, is_primary, tags (*))
      `);

    // Apply filters
    if (filters.tag) {
      query = query.contains('tags', [filters.tag]);
    }
    if (filters.authorId) {
      query = query.eq('author_id', filters.authorId);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query;

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get a single story by ID
async function getStoryById(storyId) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles:author_id (username, display_name),
        tags:story_tags (tag_id, is_primary, tags (*)),
        chapters (*)
      `)
      .eq('id', storyId)
      .single();

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create a new story
async function createStory(storyData) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .insert([storyData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update a story
async function updateStory(storyId, updates) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .update(updates)
      .eq('id', storyId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete a story
async function deleteStory(storyId) {
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// CHAPTER OPERATIONS
// ============================================

// Get chapters for a story
async function getChapters(storyId) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('story_id', storyId)
      .order('order_number', { ascending: true });

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Get a single chapter
async function getChapterById(chapterId) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('id', chapterId)
      .single();

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create a new chapter
async function createChapter(chapterData) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .insert([chapterData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update a chapter
async function updateChapter(chapterId, updates) {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .update(updates)
      .eq('id', chapterId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Delete a chapter
async function deleteChapter(chapterId) {
  try {
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', chapterId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// COMMENT OPERATIONS
// ============================================

// Get comments for a chapter
async function getComments(chapterId) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, profiles:user_id (username, display_name, avatar_url)')
      .eq('chapter_id', chapterId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create a comment
async function createComment(commentData) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert([commentData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SPOTLIGHT OPERATIONS
// ============================================

// Spotlight a story
async function spotlightStory(userId, storyId) {
  try {
    const { data, error } = await supabase
      .from('spotlights')
      .insert([{ user_id: userId, story_id: storyId }])
      .select();

    if (error) throw error;

    // Update story spotlight count
    await supabase.rpc('increment_spotlight_count', { story_id: storyId });

    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Check if user has spotlit a story today
async function hasSpotlitToday(userId, storyId) {
  try {
    const { data, error } = await supabase
      .from('spotlights')
      .select('id')
      .eq('user_id', userId)
      .eq('story_id', storyId)
      .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString());

    if (error) throw error;
    return { success: true, hasSpotlit: data.length > 0 };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SHELF OPERATIONS
// ============================================

// Get shelves for a user
async function getShelves(userId) {
  try {
    const { data, error } = await supabase
      .from('shelves')
      .select('*, shelf_items (story_id, stories (*))')
      .eq('creator_id', userId);

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create a shelf
async function createShelf(shelfData) {
  try {
    const { data, error } = await supabase
      .from('shelves')
      .insert([shelfData])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Add a story to a shelf
async function addToShelf(shelfId, storyId, userId) {
  try {
    const { data, error } = await supabase
      .from('shelf_items')
      .insert([{ shelf_id: shelfId, story_id: storyId, added_by: userId }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// BOOKMARK OPERATIONS
// ============================================

// Bookmark a story
async function bookmarkStory(userId, storyId, chapterId = null) {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, story_id: storyId, chapter_id: chapterId }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Remove a bookmark
async function removeBookmark(userId, storyId) {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('story_id', storyId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// PRIVATE NOTES OPERATIONS
// ============================================

// Get notes for a user on a story
async function getNotes(userId, storyId) {
  try {
    const { data, error } = await supabase
      .from('private_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('story_id', storyId);

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Create a private note
async function createNote(userId, storyId, chapterId, paragraphId, content) {
  try {
    const { data, error } = await supabase
      .from('private_notes')
      .insert([{
        user_id: userId,
        story_id: storyId,
        chapter_id: chapterId,
        paragraph_id: paragraphId,
        content: content
      }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Update a private note
async function updateNote(noteId, content) {
  try {
    const { data, error } = await supabase
      .from('private_notes')
      .update({ content: content, updated_at: new Date().toISOString() })
      .eq('id', noteId)
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// TAG OPERATIONS
// ============================================

// Get all approved tags
async function getTags() {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('is_approved', true)
      .order('name');

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Submit a custom tag for approval
async function submitTag(tagName, category, storyId, userId, context) {
  try {
    const { data, error } = await supabase
      .from('pending_tags')
      .insert([{
        tag_name: tagName,
        category: category,
        story_id: storyId,
        submitted_by: userId,
        context: context
      }])
      .select();

    if (error) throw error;
    return { success: true, data: data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// SEARCH OPERATIONS
// ============================================

// Search stories by keyword
async function searchStories(query) {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select(`
        *,
        profiles:author_id (username, display_name)
      `)
      .textSearch('title', query, { config: 'english' });

    if (error) throw error;
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Filter stories by tags
async function filterStoriesByTags(tagIds) {
  try {
    const { data, error } = await supabase
      .from('story_tags')
      .select('story_id')
      .in('tag_id', tagIds)
      .groupBy('story_id')
      .having('COUNT(*) >= ?', tagIds.length);

    if (error) throw error;

    const storyIds = data.map(item => item.story_id);
    const stories = await getStories({ ids: storyIds });

    return stories;
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Export functions
window.getStories = getStories;
window.getStoryById = getStoryById;
window.createStory = createStory;
window.updateStory = updateStory;
window.deleteStory = deleteStory;
window.getChapters = getChapters;
window.getChapterById = getChapterById;
window.createChapter = createChapter;
window.updateChapter = updateChapter;
window.deleteChapter = deleteChapter;
window.getComments = getComments;
window.createComment = createComment;
window.spotlightStory = spotlightStory;
window.hasSpotlitToday = hasSpotlitToday;
window.getShelves = getShelves;
window.createShelf = createShelf;
window.addToShelf = addToShelf;
window.bookmarkStory = bookmarkStory;
window.removeBookmark = removeBookmark;
window.getNotes = getNotes;
window.createNote = createNote;
window.updateNote = updateNote;
window.getTags = getTags;
window.submitTag = submitTag;
window.searchStories = searchStories;
window.filterStoriesByTags = filterStoriesByTags;
