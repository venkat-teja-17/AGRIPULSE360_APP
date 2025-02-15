document.addEventListener("DOMContentLoaded", function () {
  let logo = document.getElementById("logo");
  let content = document.querySelector(".content");

  // Initialize GSAP
  gsap.registerPlugin();

  // Typing effect text
  const taglines = [
    "Smart Agriculture Solutions",
    "Real-time Crop Monitoring",
    "Data-Driven Farming",
    "Sustainable Future"
  ];

  // Create floating elements
  function createFloatingElements() {
    const floatingElements = document.querySelector('.floating-elements');
    const icons = ['leaf', 'seedling', 'tree', 'cloud', 'sun'];
    const numElements = 15;

    for (let i = 0; i < numElements; i++) {
      const icon = icons[Math.floor(Math.random() * icons.length)];
      const element = document.createElement('i');
      element.className = `fas fa-${icon}`;
      element.style.left = `${Math.random() * 100}%`;
      element.style.animationDelay = `${Math.random() * 15}s`;
      element.style.fontSize = `${Math.random() * 20 + 10}px`;
      floatingElements.appendChild(element);
    }
  }

  // Typing effect animation
  function typeWriter(element, text, i = 0) {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      setTimeout(() => typeWriter(element, text, i + 1), 100);
    }
  }

  // Cycle through taglines
  function cycleTaglines() {
    const tagline = document.querySelector('.tagline');
    let currentIndex = 0;

    setInterval(() => {
      tagline.textContent = '';
      typeWriter(tagline, taglines[currentIndex]);
      currentIndex = (currentIndex + 1) % taglines.length;
    }, 4000);
  }

  // Initial animations
  function initialAnimations() {
    // Hide loading overlay
    const loadingOverlay = document.querySelector('.loading-overlay');
    setTimeout(() => {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 500);
    }, 1500);

    // Animate main elements
    gsap.from('.logo-container', {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: 'power3.out'
    });

    gsap.from('.main-title', {
      duration: 1,
      y: 30,
      opacity: 0,
      delay: 0.5,
      ease: 'power3.out'
    });

    // Start tagline animation
    setTimeout(() => {
      const tagline = document.querySelector('.tagline');
      typeWriter(tagline, taglines[0]);
      cycleTaglines();
    }, 1500);
  }

  // Animate logo moving up
  setTimeout(() => {
    logo.style.transition = "bottom 1.5s ease-in-out, opacity 1s";
    logo.style.bottom = "50%";
    logo.style.opacity = "1";
  }, 500);

  // Show text and buttons after logo animation
  setTimeout(() => {
    content.style.opacity = "1";
  }, 2000);

  createFloatingElements();
  initialAnimations();

  // Add hover animations for feature cards
  const cards = document.querySelectorAll('.feature-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card.querySelector('i'), {
        duration: 0.3,
        y: -10,
        scale: 1.2,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card.querySelector('i'), {
        duration: 0.3,
        y: 0,
        scale: 1,
        ease: 'power2.out'
      });
    });
  });

  // Button hover effects
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        duration: 0.3,
        scale: 1.05,
        ease: 'power2.out'
      });
    });

    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        duration: 0.3,
        scale: 1,
        ease: 'power2.out'
      });
    });
  });
});
