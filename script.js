// ===================================
// ALL-IN-ONE POCKET - MAIN SCRIPT
// ===================================

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(reg => console.log('Service Worker Registered!', reg.scope))
            .catch(err => console.log('Service Worker Registration Failed:', err));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 All-in-one Pocket initialized!');
    
    // Initialize Lucide Icons
    lucide.createIcons();

    // Initialize Theme Toggle
    initThemeToggle();

    // Initialize Search & Filter
    initSearchAndFilter();
});

// ===================================
// THEME TOGGLE LOGIC
// ===================================
function initThemeToggle() {
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const html = document.documentElement;
    
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Apply saved theme
    if (savedTheme === 'light') {
        html.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        html.removeAttribute('data-theme');
        if (themeIcon) themeIcon.setAttribute('data-lucide', 'moon');
    }

    // Re-render icon since we changed the attribute
    lucide.createIcons();

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');

            if (currentTheme === 'light') {
                // Switch to Dark
                html.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) {
                    themeIcon.setAttribute('data-lucide', 'moon');
                    // Small animation/rotation effect could be added via CSS classes
                }
            } else {
                // Switch to Light
                html.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeIcon) {
                    themeIcon.setAttribute('data-lucide', 'sun');
                }
            }

            // Re-initialize icons to update the moon/sun
            lucide.createIcons();
        });
    }
}

// ===================================
// SEARCH & FILTER LOGIC
// ===================================
function initSearchAndFilter() {
    const searchInput = document.getElementById('searchInput');
    const filterTags = document.querySelectorAll('.filter-tag');
    const toolCards = document.querySelectorAll('.tool-card');
    const sections = document.querySelectorAll('.tool-section');
    const noResults = document.getElementById('noResults');

    if (!searchInput) return; // Only runs on main hub

    let currentFilter = 'all';
    let currentSearch = '';

    // Filter Button Click Handler
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            currentFilter = tag.dataset.filter;
            applyFilters();
        });
    });

    // Search Input Handler
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.toLowerCase().trim();
        applyFilters();
    });

    function applyFilters() {
        let visibleCount = 0;

        sections.forEach(section => {
            const sectionCategory = section.dataset.category;
            const cards = section.querySelectorAll('.tool-card');
            let sectionHasVisibleCards = false;

            cards.forEach(card => {
                const cardTitle = card.querySelector('.tool-title').textContent.toLowerCase();
                const cardDesc = card.querySelector('.tool-description').textContent.toLowerCase();
                const cardCategory = card.dataset.category;

                const matchesSearch = cardTitle.includes(currentSearch) || cardDesc.includes(currentSearch);
                const matchesFilter = currentFilter === 'all' || currentFilter === cardCategory;

                if (matchesSearch && matchesFilter) {
                    card.parentElement.style.display = 'grid'; // Reset grid if needed, though parent is grid
                    card.style.display = 'flex'; // Tool cards are flex
                    sectionHasVisibleCards = true;
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Hide empty sections
            if (sectionHasVisibleCards) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });

        // Show "No Results" if everything is hidden
        if (visibleCount === 0) {
            noResults.classList.remove('hidden');
        } else {
            noResults.classList.add('hidden');
        }
    }
}
