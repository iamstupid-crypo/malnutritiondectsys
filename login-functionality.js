// FeedHope Login - Interactive Functionality

document.addEventListener('DOMContentLoaded', () => {
    // ===== DOM ELEMENTS =====
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const showSignupBtn = document.getElementById('showSignup');
    const showLoginBtn = document.getElementById('showLogin');
    
    const loginFormElement = document.getElementById('loginFormElement');
    const signupFormElement = document.getElementById('signupFormElement');
    
    const successModal = document.getElementById('successModal');
    const continueBtn = document.getElementById('continueBtn');
    const closeModal = document.getElementById('closeModal');
    
    // Password toggle elements
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    // Form validation state
    let validationState = {
        login: {
            username: false,
            password: false
        },
        signup: {
            firstName: false,
            lastName: false,
            email: false,
            username: false,
            password: false,
            confirmPassword: false,
            terms: false
        }
    };

    // ===== FORM SWITCHING =====
    function switchToSignup() {
        loginForm.classList.remove('active');
        loginForm.classList.add('exit-left');
        
        setTimeout(() => {
            signupForm.classList.add('active');
        }, 300);
        
        showToast('Ready to join FeedHope? Let\'s create your account!', 'info');
    }
    
    function switchToLogin() {
        signupForm.classList.remove('active');
        signupForm.classList.add('exit-left');
        
        setTimeout(() => {
            loginForm.classList.remove('exit-left');
            loginForm.classList.add('active');
        }, 300);
        
        showToast('Welcome back! Please sign in to continue.', 'info');
    }

    // Event listeners for form switching
    if (showSignupBtn) showSignupBtn.addEventListener('click', switchToSignup);
    if (showLoginBtn) showLoginBtn.addEventListener('click', switchToLogin);

    // ===== PASSWORD VISIBILITY TOGGLE =====
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const passwordInput = toggle.parentElement.querySelector('.password-input');
            const toggleIcon = toggle.querySelector('.toggle-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.textContent = '🙈';
                toggle.setAttribute('aria-label', 'Hide password');
            } else {
                passwordInput.type = 'password';
                toggleIcon.textContent = '👁️';
                toggle.setAttribute('aria-label', 'Show password');
            }
        });
    });

    // ===== FORM VALIDATION =====
    function validateField(field, validationType) {
        const value = field.value.trim();
        const feedbackElement = document.getElementById(`${field.id}-feedback`);
        let isValid = false;
        let message = '';

        switch (validationType) {
            case 'required':
                isValid = value.length > 0;
                message = isValid ? '✅ Looks good!' : '⚠️ This field is required';
                break;
                
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = isValid ? '✅ Valid email address' : '⚠️ Please enter a valid email address';
                break;
                
            case 'username':
                const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
                isValid = usernameRegex.test(value);
                if (value.length === 0) {
                    message = '⚠️ Username is required';
                } else if (value.length < 3) {
                    message = '⚠️ Username must be at least 3 characters';
                } else if (value.length > 20) {
                    message = '⚠️ Username must be less than 20 characters';
                } else if (!usernameRegex.test(value)) {
                    message = '⚠️ Username can only contain letters, numbers, and underscores';
                } else {
                    message = '✅ Username is available';
                }
                break;
                
            case 'password':
                const strength = getPasswordStrength(value);
                isValid = strength.score >= 2; // Require medium or strong password
                message = strength.message;
                
                // Update password strength indicator for signup
                if (field.id === 'signupPassword') {
                    const strengthIndicator = document.getElementById('passwordStrength');
                    if (strengthIndicator) {
                        strengthIndicator.textContent = strength.text;
                        strengthIndicator.className = `password-strength ${strength.level}`;
                    }
                }
                break;
                
            case 'confirmPassword':
                const originalPassword = document.getElementById('signupPassword').value;
                isValid = value === originalPassword && value.length > 0;
                message = isValid ? '✅ Passwords match' : '⚠️ Passwords do not match';
                break;
                
            case 'name':
                const nameRegex = /^[a-zA-Z\s]{2,30}$/;
                isValid = nameRegex.test(value);
                if (value.length === 0) {
                    message = '⚠️ Name is required';
                } else if (value.length < 2) {
                    message = '⚠️ Name must be at least 2 characters';
                } else if (!nameRegex.test(value)) {
                    message = '⚠️ Name can only contain letters and spaces';
                } else {
                    message = '✅ Valid name';
                }
                break;
        }

        // Apply visual feedback
        if (feedbackElement) {
            feedbackElement.textContent = message;
            feedbackElement.className = `input-feedback ${isValid ? 'success' : 'error'}`;
        }

        // Update field styling
        field.style.borderColor = isValid ? '#27ae60' : '#e74c3c';
        field.style.boxShadow = isValid 
            ? '0 0 0 4px rgba(39, 174, 96, 0.1)' 
            : '0 0 0 4px rgba(231, 76, 60, 0.1)';

        return isValid;
    }

    function getPasswordStrength(password) {
        let score = 0;
        let feedback = [];

        if (password.length === 0) {
            return {
                score: 0,
                level: 'weak',
                text: '',
                message: '⚠️ Password is required'
            };
        }

        // Length check
        if (password.length >= 8) score++;
        else feedback.push('at least 8 characters');

        // Uppercase check
        if (/[A-Z]/.test(password)) score++;
        else feedback.push('uppercase letter');

        // Lowercase check
        if (/[a-z]/.test(password)) score++;
        else feedback.push('lowercase letter');

        // Number check
        if (/\d/.test(password)) score++;
        else feedback.push('number');

        // Special character check
        if (/[^A-Za-z0-9]/.test(password)) score++;
        else feedback.push('special character');

        let level, text, message;

        if (score < 2) {
            level = 'weak';
            text = '🔴 Weak password';
            message = `⚠️ Password needs: ${feedback.join(', ')}`;
        } else if (score < 4) {
            level = 'medium';
            text = '🟡 Medium strength';
            message = '✅ Good password, but could be stronger';
        } else {
            level = 'strong';
            text = '🟢 Strong password';
            message = '✅ Excellent! Very secure password';
        }

        return { score, level, text, message };
    }

    // ===== REAL-TIME VALIDATION SETUP =====
    const validationConfig = {
        // Login form
        'loginUsername': 'required',
        'loginPassword': 'required',
        
        // Signup form
        'signupFirstName': 'name',
        'signupLastName': 'name',
        'signupEmail': 'email',
        'signupUsername': 'username',
        'signupPassword': 'password',
        'confirmPassword': 'confirmPassword'
    };

    Object.keys(validationConfig).forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', () => {
                setTimeout(() => {
                    const isValid = validateField(field, validationConfig[fieldId]);
                    updateValidationState(fieldId, isValid);
                }, 100);
            });

            field.addEventListener('blur', () => {
                const isValid = validateField(field, validationConfig[fieldId]);
                updateValidationState(fieldId, isValid);
            });
        }
    });

    function updateValidationState(fieldId, isValid) {
        const formType = fieldId.startsWith('login') ? 'login' : 'signup';
        const fieldName = fieldId.replace('login', '').replace('signup', '').replace('Name', '').toLowerCase();
        
        if (validationState[formType]) {
            validationState[formType][fieldName] = isValid;
        }
    }

    // ===== FORM SUBMISSION =====
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleLogin(e);
        });
    }

    if (signupFormElement) {
        signupFormElement.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handleSignup(e);
        });
    }

    async function handleLogin(e) {
        const submitBtn = e.target.querySelector('.submit-btn');
        const username = document.getElementById('loginUsername').value.trim();
        const password = document.getElementById('loginPassword').value.trim();
        const rememberMe = document.getElementById('rememberMe').checked;

        // Validate required fields
        const usernameValid = validateField(document.getElementById('loginUsername'), 'required');
        const passwordValid = validateField(document.getElementById('loginPassword'), 'required');

        if (!usernameValid || !passwordValid) {
            showToast('Please fill in all required fields correctly.', 'error');
            return;
        }

        // Show loading state
        setLoadingState(submitBtn, true);

        try {
            // Simulate API call (replace with actual authentication)
            await simulateAuthRequest();

            // For demo purposes, any non-empty credentials will "succeed"
            if (username && password) {
                // Store user session (in real app, handle JWT tokens)
                if (rememberMe) {
                    localStorage.setItem('feedhope_user', JSON.stringify({
                        username: username,
                        loginTime: new Date().toISOString()
                    }));
                } else {
                    sessionStorage.setItem('feedhope_user', JSON.stringify({
                        username: username,
                        loginTime: new Date().toISOString()
                    }));
                }

                showToast('Login successful! Welcome back to FeedHope.', 'success');
                
                setTimeout(() => {
                    showSuccessModal(
                        'Welcome Back!',
                        `Hello ${username}! You have successfully signed in. Ready to continue your mission of helping children get proper nutrition?`
                    );
                }, 1000);
            }
        } catch (error) {
            showToast('Login failed. Please check your credentials and try again.', 'error');
            console.error('Login error:', error);
        } finally {
            setLoadingState(submitBtn, false);
        }
    }

    async function handleSignup(e) {
        const submitBtn = e.target.querySelector('.submit-btn');
        const formData = new FormData(e.target);
        const termsAccepted = document.getElementById('agreeTerms').checked;

        // Validate all fields
        let allValid = true;
        Object.keys(validationConfig).forEach(fieldId => {
            if (fieldId.startsWith('signup')) {
                const field = document.getElementById(fieldId);
                if (field) {
                    const isValid = validateField(field, validationConfig[fieldId]);
                    if (!isValid) allValid = false;
                }
            }
        });

        // Check terms acceptance
        if (!termsAccepted) {
            showToast('Please accept the Terms of Service and Privacy Policy.', 'error');
            document.getElementById('agreeTerms').focus();
            return;
        }

        if (!allValid) {
            showToast('Please correct all errors before submitting.', 'error');
            return;
        }

        // Show loading state
        setLoadingState(submitBtn, true);

        try {
            // Simulate API call
            await simulateAuthRequest();

            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                username: formData.get('username'),
                newsletter: document.getElementById('subscribeNewsletter').checked
            };

            // Store user data (in real app, this would be handled by backend)
            localStorage.setItem('feedhope_user', JSON.stringify({
                ...userData,
                signupTime: new Date().toISOString()
            }));

            showToast('Account created successfully! Welcome to FeedHope.', 'success');
            
            setTimeout(() => {
                showSuccessModal(
                    'Welcome to FeedHope!',
                    `Congratulations ${userData.firstName}! Your account has been created successfully. You're now part of our mission to give every child proper nutrition!`
                );
            }, 1000);

        } catch (error) {
            showToast('Signup failed. Please try again later.', 'error');
            console.error('Signup error:', error);
        } finally {
            setLoadingState(submitBtn, false);
        }
    }

    // ===== UTILITY FUNCTIONS =====
    function setLoadingState(button, loading) {
        if (loading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    async function simulateAuthRequest() {
        // Simulate network delay
        return new Promise((resolve) => {
            setTimeout(resolve, 1500 + Math.random() * 1000);
        });
    }

    function showSuccessModal(title, message) {
        const successTitle = document.getElementById('successTitle');
        const successMessage = document.getElementById('successMessage');

        if (successTitle) successTitle.textContent = title;
        if (successMessage) successMessage.textContent = message;

        successModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function hideSuccessModal() {
        successModal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // Modal event listeners
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            hideSuccessModal();
            // Redirect to main application (replace with your app's main page)
            window.location.href = 'index_new.html';
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', hideSuccessModal);
    }

    // Close modal when clicking overlay
    if (successModal) {
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                hideSuccessModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && successModal.classList.contains('show')) {
            hideSuccessModal();
        }
    });

    // ===== SOCIAL LOGIN HANDLERS =====
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const provider = btn.classList.contains('google-btn') ? 'Google' : 'Facebook';
            showToast(`${provider} login is not yet implemented. Coming soon!`, 'warning');
        });
    });

    // ===== TOAST NOTIFICATION SYSTEM =====
    function showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toast-container');
        
        const toast = document.createElement('div');
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span style="font-size: 1.2rem;">
                    ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </span>
                <span>${message}</span>
            </div>
        `;

        toast.onclick = () => toast.remove();
        toastContainer.appendChild(toast);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    // Add toast slide out animation
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes toastSlideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== FORGOT PASSWORD HANDLER =====
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Password reset functionality coming soon! Please contact support for assistance.', 'info');
        });
    }

    // ===== KEYBOARD ACCESSIBILITY =====
    document.addEventListener('keydown', (e) => {
        // Tab navigation enhancement
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
        
        // Enter key form switching
        if (e.key === 'Enter' && e.target.classList.contains('switch-form-btn')) {
            e.target.click();
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });

    // ===== AUTO-FILL DETECTION =====
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('animationstart', (e) => {
            if (e.animationName === 'onAutoFillStart') {
                input.classList.add('auto-filled');
            }
        });
    });

    // ===== INITIALIZATION =====
    console.log('🔐 FeedHope login system initialized successfully!');
    
    // Check if user is already logged in
    const existingUser = localStorage.getItem('feedhope_user') || sessionStorage.getItem('feedhope_user');
    if (existingUser) {
        const userData = JSON.parse(existingUser);
        showToast(`Welcome back, ${userData.username || userData.firstName}!`, 'success');
    }

    // Add subtle entrance animation to form container
    setTimeout(() => {
        const loginWrapper = document.querySelector('.login-wrapper');
        if (loginWrapper) {
            loginWrapper.style.opacity = '1';
            loginWrapper.style.transform = 'scale(1)';
        }
    }, 100);
});

// ===== CSS INJECTION FOR ADDITIONAL ANIMATIONS =====
if (!document.querySelector('#login-additional-styles')) {
    const style = document.createElement('style');
    style.id = 'login-additional-styles';
    style.textContent = `
        .login-wrapper {
            opacity: 0;
            transform: scale(0.95);
            transition: all 0.6s ease;
        }
        
        .keyboard-navigation *:focus {
            outline: 3px solid #2ECC40 !important;
            outline-offset: 2px !important;
        }
        
        .auto-filled {
            background: rgba(46, 204, 64, 0.05) !important;
        }
        
        /* Auto-fill detection */
        input:-webkit-autofill {
            animation-name: onAutoFillStart;
            animation-duration: 0.001s;
        }
        
        @keyframes onAutoFillStart {
            from { opacity: 0.99; }
            to { opacity: 1; }
        }
        
        /* Form loading states */
        .form-container.loading {
            pointer-events: none;
            opacity: 0.7;
        }
        
        /* Enhanced focus states */
        .form-input:focus-visible {
            transform: translateY(-2px);
        }
        
        /* Button press animation */
        .submit-btn:active:not(.loading) {
            transform: translateY(1px) !important;
        }
    `;
    document.head.appendChild(style);
}
