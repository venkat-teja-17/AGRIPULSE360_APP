document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category-filter');
    const videoCards = document.querySelectorAll('.video-card');

    // Add loading animation
    const loading = document.createElement('div');
    loading.className = 'loading';
    document.body.appendChild(loading);

    // Remove loading after content is loaded
    window.addEventListener('load', function() {
        loading.remove();
        animateVideoCards();
    });

    // Search functionality
    function filterVideos() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;

        videoCards.forEach(card => {
            const title = card.getAttribute('data-title').toLowerCase();
            const category = card.getAttribute('data-category');
            const description = card.querySelector('.video-description').textContent.toLowerCase();
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = selectedCategory === 'all' || category === selectedCategory;

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.5s ease forwards';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Animate video cards on load
    function animateVideoCards() {
        videoCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Event listeners
    searchInput.addEventListener('input', filterVideos);
    categoryFilter.addEventListener('change', filterVideos);

    // Lazy loading for iframes
    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const handleIntersection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const iframe = entry.target;
                const src = iframe.getAttribute('src');
                if (src) {
                    iframe.setAttribute('loading', 'lazy');
                }
                observer.unobserve(iframe);
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    document.querySelectorAll('.video-wrapper iframe').forEach(iframe => {
        observer.observe(iframe);
    });

    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle video errors
    document.querySelectorAll('iframe').forEach(iframe => {
        iframe.addEventListener('error', function() {
            this.style.display = 'none';
            const errorMessage = document.createElement('div');
            errorMessage.className = 'video-error';
            errorMessage.textContent = 'Video unavailable';
            this.parentElement.appendChild(errorMessage);
        });
    });
});
