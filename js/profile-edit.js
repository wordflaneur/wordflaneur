// ============================================================
// PROFILE EDIT FUNCTIONS
// ============================================================

// ============================================================
// TAB SWITCHING
// ============================================================
function switchEditTab(event, tabId) {
    event.preventDefault();

    // Update tab buttons
    document.querySelectorAll('.profile-edit-tabs .tab').forEach(t => {
        t.classList.remove('active');
    });
    document.querySelector(`.profile-edit-tabs .tab[data-tab="${tabId}"]`).classList.add('active');

    // Update tab panes
    document.querySelectorAll('.tab-pane').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`tab-${tabId}`).classList.add('active');
}

// ============================================================
// TAG MANAGEMENT
// ============================================================
function addTag(event, containerId) {
    if (event.key === 'Enter') {
        const input = event.target;
        const value = input.value.trim();
        if (value) {
            const container = document.getElementById(containerId);
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.innerHTML = `${value} <span class="remove" onclick="removeTag(this)">×</span>`;
            container.insertBefore(tag, input);
            input.value = '';
        }
        event.preventDefault();
    }
}

function removeTag(element) {
    const tag = element.parentElement;
    tag.remove();
}

// ============================================================
// SAVE PROFILE
// ============================================================
function saveProfile() {
    const message = document.getElementById('success-message');
    message.classList.add('show');

    // Scroll to top to show success message
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Hide after 5 seconds
    setTimeout(() => {
        message.classList.remove('show');
    }, 5000);

    // Collect form data (for demo)
    const formData = collectProfileData();
    console.log('📝 Profile saved:', formData);

    // In production, send to backend:
    // const result = await window.saveUserProfile(formData);
    // if (result.success) { show success } else { show error }
}

// ============================================================
// COLLECT PROFILE DATA
// ============================================================
function collectProfileData() {
    const data = {};

    // General tab
    data.displayName = document.querySelector('#tab-general input[placeholder="Your public name"]')?.value || '';
    data.username = document.querySelector('#tab-general input[placeholder="Unique username"]')?.value || '';
    data.bio = document.querySelector('#tab-general textarea')?.value || '';
    data.location = document.querySelector('#tab-general input[placeholder="City, Country"]')?.value || '';
    data.website = document.querySelector('#tab-general input[placeholder="https://yourwebsite.com"]')?.value || '';

    // Author tab
    const authorBio = document.querySelector('#tab-author textarea')?.value || '';
    const primaryGenre = document.querySelector('#tab-author select:first-of-type')?.value || '';
    const secondaryGenre = document.querySelector('#tab-author select:last-of-type')?.value || '';

    // Scout tab
    const scoutBio = document.querySelector('#tab-scout textarea')?.value || '';

    // Social links
    const twitter = document.querySelector('#tab-social input[placeholder="https://twitter.com/yourhandle"]')?.value || '';
    const instagram = document.querySelector('#tab-social input[placeholder="https://instagram.com/yourhandle"]')?.value || '';
    const goodreads = document.querySelector('#tab-social input[placeholder="https://goodreads.com/yourprofile"]')?.value || '';
    const youtube = document.querySelector('#tab-social input[placeholder="https://youtube.com/@yourchannel"]')?.value || '';
    const tiktok = document.querySelector('#tab-social input[placeholder="https://tiktok.com/@yourhandle"]')?.value || '';
    const discord = document.querySelector('#tab-social input[placeholder="https://discord.gg/yourinvite"]')?.value || '';
    const otherLink = document.querySelector('#tab-social input[placeholder="https://yourlink.com"]')?.value || '';

    // Collect tags
    const authorTags = [];
    document.querySelectorAll('#author-tags .tag').forEach(tag => {
        authorTags.push(tag.textContent.replace('×', '').trim());
    });

    const scoutTags = [];
    document.querySelectorAll('#scout-tags .tag').forEach(tag => {
        scoutTags.push(tag.textContent.replace('×', '').trim());
    });

    return {
        general: {
            displayName: data.displayName,
            username: data.username,
            bio: data.bio,
            location: data.location,
            website: data.website
        },
        author: {
            bio: authorBio,
            primaryGenre: primaryGenre,
            secondaryGenre: secondaryGenre,
            tags: authorTags
        },
        scout: {
            bio: scoutBio,
            specialties: scoutTags
        },
        social: {
            twitter: twitter,
            instagram: instagram,
            goodreads: goodreads,
            youtube: youtube,
            tiktok: tiktok,
            discord: discord,
            otherLink: otherLink
        }
    };
}

// ============================================================
// LOAD PROFILE DATA (for editing existing profiles)
// ============================================================
function loadProfileData(data) {
    // General
    if (data.general) {
        const inputs = document.querySelectorAll('#tab-general input');
        if (inputs[0]) inputs[0].value = data.general.displayName || '';
        if (inputs[1]) inputs[1].value = data.general.username || '';
        document.querySelector('#tab-general textarea').value = data.general.bio || '';
        if (inputs[2]) inputs[2].value = data.general.location || '';
        if (inputs[3]) inputs[3].value = data.general.website || '';
    }

    // Author
    if (data.author) {
        document.querySelector('#tab-author textarea').value = data.author.bio || '';
        const selects = document.querySelectorAll('#tab-author select');
        if (selects[0]) selects[0].value = data.author.primaryGenre || '';
        if (selects[1]) selects[1].value = data.author.secondaryGenre || '';

        // Add tags
        const container = document.getElementById('author-tags');
        if (data.author.tags) {
            data.author.tags.forEach(tagText => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = `${tagText} <span class="remove" onclick="removeTag(this)">×</span>`;
                const input = container.querySelector('input');
                container.insertBefore(tag, input);
            });
        }
    }

    // Scout
    if (data.scout) {
        document.querySelector('#tab-scout textarea').value = data.scout.bio || '';

        // Add specialties
        const container = document.getElementById('scout-tags');
        if (data.scout.specialties) {
            data.scout.specialties.forEach(tagText => {
                const tag = document.createElement('span');
                tag.className = 'tag';
                tag.innerHTML = `${tagText} <span class="remove" onclick="removeTag(this)">×</span>`;
                const input = container.querySelector('input');
                container.insertBefore(tag, input);
            });
        }
    }

    // Social
    if (data.social) {
        const socialInputs = document.querySelectorAll('#tab-social input');
        const socialMap = {
            'https://twitter.com/yourhandle': data.social.twitter,
            'https://instagram.com/yourhandle': data.social.instagram,
            'https://goodreads.com/yourprofile': data.social.goodreads,
            'https://youtube.com/@yourchannel': data.social.youtube,
            'https://tiktok.com/@yourhandle': data.social.tiktok,
            'https://discord.gg/yourinvite': data.social.discord,
            'https://yourlink.com': data.social.otherLink
        };

        socialInputs.forEach(input => {
            const placeholder = input.getAttribute('placeholder');
            if (socialMap[placeholder]) {
                input.value = socialMap[placeholder] || '';
            }
        });
    }
}

// ============================================================
// AUTH
// ============================================================
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        document.getElementById('user-greeting').textContent = '👋 Guest';
        alert('Logged out successfully!');
        // window.location.href = 'login.html';
    }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✏️ Profile Edit page loaded!');

    // Load existing profile data (if logged in)
    // const userData = await window.getCurrentUser();
    // if (userData.success) {
    //     const profileData = await window.getUserProfile(userData.user.id);
    //     if (profileData.success) {
    //         loadProfileData(profileData.profile);
    //     }
    // }

    // Update user greeting
    const greeting = document.getElementById('user-greeting');
    if (greeting) {
        // const user = await window.getCurrentUser();
        // if (user.success) {
        //     greeting.textContent = `👋 ${user.user.display_name || user.user.email}`;
        // }
        greeting.textContent = '👋 Elara Voss'; // Demo
    }
});

console.log('🔧 Profile edit functions loaded!');
