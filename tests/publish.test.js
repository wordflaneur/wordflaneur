const assert = require('assert');
const { buildStoryPayload } = require('../js/publish.js');

const payload = buildStoryPayload({
  title: 'The Lantern Keep',
  description: 'A city of lanterns',
  coverUrl: 'https://example.com/cover.jpg',
  tags: 'Fantasy, Romance',
  aiDisclosure: 'ai-assisted',
  translationDisclosure: 'human-human',
  contentWarnings: ['violence', 'trauma'],
  status: 'draft',
  authorId: 'user-123'
});

assert.strictEqual(payload.title, 'The Lantern Keep');
assert.strictEqual(payload.description, 'A city of lanterns');
assert.strictEqual(payload.cover_url, 'https://example.com/cover.jpg');
assert.deepStrictEqual(payload.tags, ['Fantasy', 'Romance']);
assert.strictEqual(payload.ai_disclosure, 'ai-assisted');
assert.strictEqual(payload.translation_disclosure, 'human-human');
assert.deepStrictEqual(payload.content_warnings, ['violence', 'trauma']);
assert.strictEqual(payload.status, 'draft');
assert.strictEqual(payload.author_id, 'user-123');

console.log('publish payload test passed');
