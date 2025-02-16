// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Get form elements
    const form = document.querySelector('form');
    const oldPassword = document.getElementById('oldPassword');
    const newPassword = document.getElementById('newPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    const errorMessage = document.querySelector('.error-message');

    // Password validation function
    function validatePassword(password) {
        const requirements = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*]/.test(password)
        };

        return {
            isValid: Object.values(requirements).every(req => req),
            requirements
        };
    }

    // Show error message with animation
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.style.animation = 'slideDown 0.3s ease-out';
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Add input event listeners for password fields
    newPassword.addEventListener('input', () => {
        const { isValid, requirements } = validatePassword(newPassword.value);
        
        // Update password field style based on validation
        if (newPassword.value.length > 0) {
            newPassword.style.borderColor = isValid ? '#4CAF50' : '#ff4444';
        } else {
            newPassword.style.borderColor = '#b7e4c7';
        }

        hideError();
    });

    confirmPassword.addEventListener('input', () => {
        const passwordsMatch = newPassword.value === confirmPassword.value;
        
        // Update confirm password field style
        if (confirmPassword.value.length > 0) {
            confirmPassword.style.borderColor = passwordsMatch ? '#4CAF50' : '#ff4444';
        } else {
            confirmPassword.style.borderColor = '#b7e4c7';
        }

        hideError();
    });

    // Form submission handler
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideError();

        // Validate old password (not empty)
        if (!oldPassword.value) {
            showError('Please enter your old password');
            oldPassword.focus();
            return;
        }

        // Validate new password
        const { isValid, requirements } = validatePassword(newPassword.value);
        if (!isValid) {
            showError('Password must contain at least 8 characters, including uppercase, lowercase, number, and special character');
            newPassword.focus();
            return;
        }

        // Validate password match
        if (newPassword.value !== confirmPassword.value) {
            showError('Passwords do not match');
            confirmPassword.focus();
            return;
        }

        try {
            // Add loading state to button
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="loading-spinner"></span> Resetting...';

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success state
            submitButton.style.backgroundColor = '#4CAF50';
            submitButton.innerHTML = '&#10003; Password Reset Successfully';

            // Redirect to login page after delay
            setTimeout(() => {
                window.location.href = '../login page/login.html';
            }, 1500);

        } catch (error) {
            showError('An error occurred. Please try again.');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .loading-spinner {
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid #ffffff;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    input:focus {
        outline: none;
        border-color: #40916c !important;
        box-shadow: 0 0 0 2px rgba(64, 145, 108, 0.2);
    }

    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
`;
document.head.appendChild(style);
