document.addEventListener('DOMContentLoaded', () => {
    // Initialize elements
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const schemeCards = document.querySelectorAll('.scheme-card');
    let currentFilter = 'all';
    let currentSearch = '';

    // Initialize animations
    initializeAnimations();

    // Search functionality with debounce
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            currentSearch = e.target.value.toLowerCase();
            filterSchemes();
        }, 300);
    });

    // Category filter
    categoryFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        filterSchemes();
    });

    // Filter schemes based on search and category
    function filterSchemes() {
        schemeCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('.description').textContent.toLowerCase();
            const category = card.dataset.category;
            
            const matchesSearch = title.includes(currentSearch) || description.includes(currentSearch);
            const matchesCategory = currentFilter === 'all' || category === currentFilter;

            if (matchesSearch && matchesCategory) {
                showCard(card);
            } else {
                hideCard(card);
            }
        });

        // Check if no results found
        const visibleCards = document.querySelectorAll('.scheme-card[style*="display: block"]');
        const noResultsMsg = document.querySelector('.no-results');
        
        if (visibleCards.length === 0) {
            if (!noResultsMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-results';
                msg.innerHTML = `
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h3>No schemes found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                    </div>
                `;
                document.querySelector('.schemes-grid').appendChild(msg);
                
                // Animate no results message
                gsap.from(msg, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }

    // Show card with animation
    function showCard(card) {
        if (card.style.display === 'none' || !card.style.display) {
            card.style.display = 'block';
            gsap.from(card, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: 'power2.out'
            });
        }
    }

    // Hide card with animation
    function hideCard(card) {
        gsap.to(card, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                card.style.display = 'none';
            }
        });
    }

    // Initialize animations
    function initializeAnimations() {
        // Stagger animation for scheme cards
        gsap.from('.scheme-card', {
            opacity: 0,
            y: 30,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });

        // Animate header
        gsap.from('.header', {
            opacity: 0,
            y: -30,
            duration: 0.8,
            ease: 'power2.out'
        });

        // Animate search section
        gsap.from('.search-section', {
            opacity: 0,
            y: -20,
            duration: 0.8,
            delay: 0.2,
            ease: 'power2.out'
        });

        // Add hover animations for cards
        schemeCards.forEach(card => {
            // Create hover effect for learn more button
            const learnMore = card.querySelector('.learn-more');
            const arrow = learnMore.querySelector('i');
            
            learnMore.addEventListener('mouseenter', () => {
                gsap.to(arrow, {
                    x: 5,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            learnMore.addEventListener('mouseleave', () => {
                gsap.to(arrow, {
                    x: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            // Animate benefits on hover
            const benefits = card.querySelectorAll('.benefits li');
            benefits.forEach((benefit, index) => {
                benefit.style.opacity = 0;
                benefit.style.transform = 'translateX(-10px)';
                
                gsap.to(benefit, {
                    opacity: 1,
                    x: 0,
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: 'power2.out'
                });
            });
        });
    }

    // Add smooth scroll for back to top
    const scrollToTop = document.createElement('button');
    scrollToTop.className = 'scroll-top';
    scrollToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTop);

    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollToTop.style.display = 'flex';
            gsap.to(scrollToTop, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        } else {
            gsap.to(scrollToTop, {
                opacity: 0,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    scrollToTop.style.display = 'none';
                }
            });
        }
    });

    // Add CSS for scroll to top button
    const style = document.createElement('style');
    style.textContent = `
        .scroll-top {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 40px;
            height: 40px;
            background: #2ecc71;
            border: none;
            border-radius: 50%;
            color: white;
            display: none;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            opacity: 0;
            transition: background-color 0.3s ease;
            z-index: 1000;
        }

        .scroll-top:hover {
            background: #27ae60;
        }

        .no-results {
            grid-column: 1 / -1;
            text-align: center;
            padding: 3rem;
        }

        .no-results-content {
            color: #666;
        }

        .no-results i {
            font-size: 2rem;
            color: #2ecc71;
            margin-bottom: 1rem;
        }

        .no-results h3 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }

        .no-results p {
            color: #666;
        }
    `;
    document.head.appendChild(style);
});
