// ============================================
// 🚀 SERVER.JS — WordFlaneur Backend
// ============================================

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve your HTML, CSS, and JS files

// ============================================
// SUPABASE CLIENT
// ============================================
const supabaseUrl = process.env.SUPABASE_URL || 'https://ugrmqwgjcisufcpjqhzy.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'sb_publishable__9skp_lVOca6QzX0vU5Xpg_5m6156tp';
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'WordFlaneur is running!' });
});

// ============================================
// GET STORIES
// ============================================
app.get('/api/stories', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('stories')
            .select('*, profiles!author_id (username, display_name)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// GET A SINGLE STORY
// ============================================
app.get('/api/stories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('stories')
            .select('*, profiles!author_id (username, display_name)')
            .eq('id', id)
            .single();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// CREATE A STORY
// ============================================
app.post('/api/stories', async (req, res) => {
    try {
        const { title, description, author_id, cover_url, tags, ai_disclosure } = req.body;
        const { data, error } = await supabase
            .from('stories')
            .insert([{ title, description, author_id, cover_url, tags, ai_disclosure }])
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// GET CHAPTERS FOR A STORY
// ============================================
app.get('/api/stories/:id/chapters', async (req, res) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('chapters')
            .select('*')
            .eq('story_id', id)
            .order('order_number', { ascending: true });

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// CREATE A CHAPTER
// ============================================
app.post('/api/chapters', async (req, res) => {
    try {
        const { story_id, title, content, order_number } = req.body;
        const { data, error } = await supabase
            .from('chapters')
            .insert([{ story_id, title, content, order_number }])
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// SPOTLIGHT A STORY
// ============================================
app.post('/api/spotlight', async (req, res) => {
    try {
        const { user_id, story_id } = req.body;
        const { data, error } = await supabase
            .from('spotlights')
            .insert([{ user_id, story_id }])
            .select();

        if (error) throw error;
        res.json({ success: true, data: data[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 WordFlaneur server running on port ${PORT}`);
});
