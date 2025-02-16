document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
});

function initializeAnimations() {
    // Create floating background elements
    const floatingElements = document.querySelector('.floating-elements');
    for (let i = 0; i < 50; i++) {
        const element = document.createElement('div');
        element.style.cssText = `
            position: absolute;
            width: ${Math.random() * 10 + 5}px;
            height: ${Math.random() * 10 + 5}px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        floatingElements.appendChild(element);

        // Animate each element
        gsap.to(element, {
            y: -100,
            x: Math.random() * 100 - 50,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut',
            delay: Math.random() * 2
        });
    }

    // Animate card elements
    gsap.from('.icon-container', {
        scale: 0,
        duration: 0.6,
        delay: 0.3,
        ease: 'back.out(1.7)'
    });

    gsap.from('h2, p', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.5
    });

    gsap.from('.button-container button', {
        y: 20,
        opacity: 0,
        duration: 0.4,
        stagger: 0.1,
        delay: 0.7
    });
}

function redirectToHome() {
    // Add fade out animation
    gsap.to('.logout-card', {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
            window.location.href = '../agripluse/animation.html';
        }
    });
}

function redirectToLogin() {
    // Add fade out animation
    gsap.to('.logout-card', {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
            window.location.href = '../login page/login.html';
        }
    });
}
