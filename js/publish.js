function buildStoryPayload(formValues) {
  const tags = (formValues.tags || '')
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean);

  return {
    title: formValues.title?.trim() || '',
    description: formValues.description?.trim() || '',
    author_id: formValues.authorId || null,
    cover_url: formValues.coverUrl?.trim() || null,
    tags,
    ai_disclosure: formValues.aiDisclosure || 'human',
    translation_disclosure: formValues.translationDisclosure || 'none',
    content_warnings: formValues.contentWarnings || [],
    status: formValues.status || 'draft',
    chapter_count: 0,
    view_count: 0,
    spotlight_count: 0,
    comment_count: 0,
    shelf_appearance_count: 0,
    gift_count: 0,
    bookmark_count: 0,
    ris_score: 0,
    last_updated: new Date().toISOString()
  };
}

if (typeof window !== 'undefined') {
  window.buildStoryPayload = buildStoryPayload;
}

if (typeof module !== 'undefined') {
  module.exports = { buildStoryPayload };
}
