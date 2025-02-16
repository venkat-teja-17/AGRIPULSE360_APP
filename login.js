import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZjh5uhKM2pSrGlRGnA_u9J71VGukTBwc",
  authDomain: "agripulse-e079e.firebaseapp.com",
  projectId: "agripulse-e079e",
  storageBucket: "agripulse-e079e.firebasestorage.app",
  messagingSenderId: "621805575302",
  appId: "1:621805575302:web:28f6277fa5b095c469c507",
  measurementId: "G-4Q3BJFB55H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

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

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
  // Create floating background elements
  createFloatingElements();

  // Hide loading overlay
  const loadingOverlay = document.querySelector('.loading-overlay');
  setTimeout(() => {
    loadingOverlay.style.opacity = '0';
    setTimeout(() => {
      loadingOverlay.style.display = 'none';
    }, 500);
  }, 1500);

  // Animate form elements
  gsap.from('.form-container', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out',
    delay: 0.5
  });

  // Toggle password visibility
  const togglePassword = document.querySelector('.toggle-password');
  const passwordInput = document.querySelector('#password');

  if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassword.classList.toggle('fa-eye');
      togglePassword.classList.toggle('fa-eye-slash');
    });
  }

  // Form validation and submission
  const loginForm = document.querySelector('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;

      // Add loading state to button
      const loginButton = document.querySelector('.login-button');
      const originalContent = loginButton.innerHTML;
      loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
      loginButton.disabled = true;

      // Simulate API call
      setTimeout(() => {
        // Reset button state
        loginButton.innerHTML = originalContent;
        loginButton.disabled = false;

        // Basic validation
        if (!email || !password) {
          showError('Please fill in all fields');
          return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email) && !isValidPhoneNumber(email)) {
          showError('Please enter a valid email or phone number');
          return;
        }

        // If validation passes, redirect to dashboard
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            // Signed up 
            const user = userCredential.user;
            window.location.href = "../agripluse/index.html";
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
          });
      }, 1500);
    });
  }

  // Input focus effects
  const inputs = document.querySelectorAll('.input-field input');
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
      if (!input.value) {
        input.parentElement.classList.remove('focused');
      }
    });
  });
});

// Helper function to validate phone number
function isValidPhoneNumber(phone) {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
}

// Helper function to show error messages
function showError(message) {
  // Create error element if it doesn't exist
  let errorElement = document.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    document.querySelector('.input-group').insertAdjacentElement('beforebegin', errorElement);
  }

  // Show error message with animation
  errorElement.textContent = message;
  errorElement.style.animation = 'none';
  errorElement.offsetHeight; // Trigger reflow
  errorElement.style.animation = 'shake 0.5s ease-in-out';

  // Hide error after 3 seconds
  setTimeout(() => {
    errorElement.style.opacity = '0';
    setTimeout(() => {
      errorElement.remove();
    }, 300);
  }, 3000);
}

// Add these styles to your CSS
const style = document.createElement('style');
style.textContent = `
  .error-message {
    color: #ff4444;
    background: rgba(255, 68, 68, 0.1);
    padding: 0.8rem;
    border-radius: 10px;
    margin-bottom: 1rem;
    text-align: center;
    animation: shake 0.5s ease-in-out;
    transition: opacity 0.3s ease;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);