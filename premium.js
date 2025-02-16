document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all premium cards
    const premiumCards = document.querySelectorAll('.premium-card');
    
    premiumCards.forEach(card => {
        card.addEventListener('click', function() {
            // Get the feature title
            const featureTitle = this.querySelector('h3').textContent;
            const featureDescription = this.querySelector('p').textContent;
            
            // You can add modal or tooltip functionality here
            showFeatureDetails(featureTitle, featureDescription);
        });
    });
    
    // Add smooth scroll animation for better UX
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
});

// Function to show feature details (can be customized based on your needs)
function showFeatureDetails(title, description) {
    // You can implement a modal, tooltip, or any other UI element to show more details
    console.log(`Feature: ${title}`);
    console.log(`Description: ${description}`);
    
    // Example: You could add code here to show a modal with more details about the feature
    // or redirect to a detailed feature page
}
