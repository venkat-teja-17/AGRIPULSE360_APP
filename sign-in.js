document.addEventListener('DOMContentLoaded', () => {
    // Initialize GSAP animations
    initializeAnimations();

    // Form elements
    const form = document.getElementById('signup-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const agreeCheckbox = document.getElementById('agreeCheckbox');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const errorMessage = document.querySelector('.error-message');
    const successMessage = document.querySelector('.success-message');
    const loadingOverlay = document.querySelector('.loading-overlay');

    // Password requirement elements
    const requirements = {
        length: document.getElementById('length'),
        uppercase: document.getElementById('uppercase'),
        lowercase: document.getElementById('lowercase'),
        number: document.getElementById('number'),
        special: document.getElementById('special')
    };

    // Toggle password visibility
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            btn.classList.toggle('fa-eye');
            btn.classList.toggle('fa-eye-slash');
        });
    });

    // Real-time password validation
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // Form submission
    form.addEventListener('submit', handleSubmit);

    // Validation functions
    function validatePassword() {
        const password = passwordInput.value;
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        // Update requirement indicators
        Object.keys(requirements).forEach(req => {
            const element = document.getElementById(req);
            if (requirements[req]) {
                element.classList.add('valid');
                element.querySelector('i').style.color = 'hsl(135, 58%, 39%)';
            } else {
                element.classList.remove('valid');
                element.querySelector('i').style.color = '#ccc';
            }
        });

        return Object.values(requirements).every(Boolean);
    }

    function validatePasswordMatch() {
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const errorText = confirmPasswordInput.nextElementSibling;

        if (confirmPassword && password !== confirmPassword) {
            errorText.textContent = 'Passwords do not match';
            errorText.style.display = 'block';
            return false;
        } else {
            errorText.style.display = 'none';
            return true;
        }
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const errorText = emailInput.nextElementSibling;
        
        if (!re.test(email)) {
            errorText.textContent = 'Please enter a valid email address';
            errorText.style.display = 'block';
            return false;
        } else {
            errorText.style.display = 'none';
            return true;
        }
    }

    function validatePhone(phone) {
        const re = /^\+?[\d\s-]{10,}$/;
        const errorText = phoneInput.nextElementSibling;

        if (!re.test(phone)) {
            errorText.textContent = 'Please enter a valid phone number';
            errorText.style.display = 'block';
            return false;
        } else {
            errorText.style.display = 'none';
            return true;
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // Reset messages
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';

        // Validate all fields
        const isPasswordValid = validatePassword();
        const isPasswordMatch = validatePasswordMatch();
        const isEmailValid = validateEmail(emailInput.value);
        const isPhoneValid = validatePhone(phoneInput.value);
        const isAgreed = agreeCheckbox.checked;

        if (!isPasswordValid || !isPasswordMatch || !isEmailValid || !isPhoneValid) {
            showError('Please fix the errors in the form');
            return;
        }

        if (!isAgreed) {
            showError('Please agree to the terms and conditions');
            return;
        }

        try {
            // Show loading animation
            loadingOverlay.style.display = 'flex';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Show success message
            showSuccess('Account created successfully! Redirecting...');

            // Redirect after 2 seconds
            setTimeout(() => {
                window.location.href = '../login page/login.html';
            }, 2000);

        } catch (error) {
            showError('An error occurred. Please try again.');
        } finally {
            loadingOverlay.style.display = 'none';
        }
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        gsap.from(errorMessage, {
            y: -20,
            opacity: 0,
            duration: 0.3
        });
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        gsap.from(successMessage, {
            y: -20,
            opacity: 0,
            duration: 0.3
        });
    }

    function initializeAnimations() {
        // Animate form elements on load
        gsap.from('.form-container', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        });

        gsap.from('.form-group', {
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.3
        });

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
    }
});