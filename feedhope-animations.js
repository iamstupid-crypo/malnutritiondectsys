// FeedHope: Fueling Futures - Interactive Animations & Functionality

document.addEventListener('DOMContentLoaded', () => {
    // ===== NAVIGATION & MOBILE MENU =====
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuClose = document.getElementById('menuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    // Toggle mobile menu
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    // Close mobile menu
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event listeners for mobile menu
    if (hamburger) hamburger.addEventListener('click', toggleMobileMenu);
    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
    if (mobileMenu) mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) closeMobileMenu();
    });

    // Close menu when clicking nav links
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ===== SMOOTH SCROLLING FOR NAVIGATION =====
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#' || href === '#login') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                closeMobileMenu();
            }
        });
    });

    // ===== SCROLL-TRIGGERED ANIMATIONS =====
    const childIllustration = document.getElementById('childIllustration');
    const heroTagline = document.getElementById('heroTagline');
    let hasTransformed = false;

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add specific animations for different elements
                if (entry.target.classList.contains('empowerment-visual')) {
                    animateStrengthIllustration();
                }
                
                if (entry.target.classList.contains('about-visual')) {
                    animateGlobeChildren();
                }
            }
        });
    }, observerOptions);

    // Apply observer to animated elements
    const animatedElements = document.querySelectorAll('.empowerment-text, .empowerment-visual, .about-text, .about-visual, .step, .story-card, .resource-card, .stats');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease';
        animateOnScroll.observe(el);
    });

    // ===== HERO GIRL TRANSFORMATION =====
    const heroSection = document.querySelector('.hero');
    const heroGirlIllustration = document.getElementById('heroGirlIllustration');
    const heroMessage = document.getElementById('heroMessage');
    const heroDescription = document.getElementById('heroDescription');
    let ticking = false;

    function updateHeroGirlTransformation() {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const windowHeight = window.innerHeight;
                const transformPoint = windowHeight * 0.4; // Transform at 40% of viewport height

                if (heroSection && scrollY > transformPoint && !hasTransformed) {
                    // Transform to happy state
                    heroSection.classList.add('transformed');
                    hasTransformed = true;
                    
                    // Add celebration effect with delay
                    setTimeout(() => {
                        createCelebrationEffect();
                    }, 600);
                    
                } else if (heroSection && scrollY <= transformPoint && hasTransformed) {
                    // Transform back to sad state
                    heroSection.classList.remove('transformed');
                    hasTransformed = false;
                }
                
                ticking = false;
            });
            
            ticking = true;
        }
    }

    // Celebration effect when child transforms
    function createCelebrationEffect() {
        const celebrationElements = ['✨', '🌟', '💫', '⭐', '🎉', '🎊'];
        const heroSection = document.querySelector('.hero');
        
        if (!heroSection) return;
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const celebration = document.createElement('div');
                celebration.textContent = celebrationElements[Math.floor(Math.random() * celebrationElements.length)];
                celebration.style.cssText = `
                    position: absolute;
                    font-size: ${Math.random() * 20 + 15}px;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    pointer-events: none;
                    z-index: 1000;
                    animation: celebrationFloat 3s ease-out forwards;
                `;
                
                heroSection.appendChild(celebration);
                
                // Remove element after animation
                setTimeout(() => {
                    if (celebration.parentNode) {
                        celebration.parentNode.removeChild(celebration);
                    }
                }, 3000);
            }, i * 100);
        }
    }

    // Add celebration animation CSS
    if (!document.querySelector('#celebration-styles')) {
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            @keyframes celebrationFloat {
                0% {
                    opacity: 0;
                    transform: translateY(100px) scale(0);
                }
                20% {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                80% {
                    opacity: 1;
                    transform: translateY(-100px) scale(1);
                }
                100% {
                    opacity: 0;
                    transform: translateY(-200px) scale(0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Scroll event listener
    window.addEventListener('scroll', updateHeroGirlTransformation);

    // ===== STRENGTH ILLUSTRATION ANIMATION =====
    function animateStrengthIllustration() {
        const biceps = document.querySelectorAll('.bicep');
        const powerLines = document.querySelector('.power-lines');
        const confidenceAura = document.querySelector('.confidence-aura');
        const foodItems = document.querySelectorAll('.food-item');
        
        // Animate biceps flexing
        biceps.forEach((bicep, index) => {
            setTimeout(() => {
                bicep.style.animation = 'flex 1s ease infinite alternate';
            }, index * 200);
        });
        
        // Animate power effects
        if (powerLines) {
            powerLines.style.opacity = '1';
            powerLines.style.animation = 'rotate 4s linear infinite';
        }
        
        if (confidenceAura) {
            confidenceAura.style.opacity = '1';
            confidenceAura.style.animation = 'pulse 3s ease infinite';
        }
        
        // Animate food items
        foodItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.animation = 'bobFloat 3s ease infinite';
                item.style.animationDelay = `${index * 0.5}s`;
            }, index * 300);
        });
    }

    // ===== GLOBE CHILDREN ANIMATION =====
    function animateGlobeChildren() {
        const globe = document.querySelector('.globe');
        const children = document.querySelectorAll('.child');
        const heartPulse = document.querySelector('.heart-pulse');
        
        if (globe) {
            globe.style.animation = 'slowRotate 20s linear infinite';
        }
        
        children.forEach((child, index) => {
            setTimeout(() => {
                child.style.animation = 'orbitPulse 4s ease infinite';
                child.style.animationDelay = `${index}s`;
            }, index * 500);
        });
        
        if (heartPulse) {
            heartPulse.style.animation = 'heartPulse 2s ease infinite';
        }
    }

    // ===== STATISTICS COUNTER ANIMATION =====
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = counter.textContent.replace(/[^\d]/g, '');
                    const targetNumber = parseInt(target);
                    const isPercentage = counter.textContent.includes('%');
                    const hasPlus = counter.textContent.includes('+');
                    
                    if (targetNumber) {
                        animateCounter(counter, targetNumber, isPercentage, hasPlus);
                        counterObserver.unobserve(counter);
                    }
                }
            });
        }, { threshold: 0.5 });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    function animateCounter(element, target, isPercentage = false, hasPlus = false) {
        let current = 0;
        const increment = target / 50; // 50 steps for smooth animation
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (isPercentage) displayValue += '%';
            if (hasPlus && current >= target) displayValue += '+';
            if (target === 24 && current >= target) displayValue = '24/7'; // Special case for 24/7
            
            element.textContent = displayValue;
        }, 40);
    }

    // Initialize counter animation
    animateCounters();

    // ===== ENHANCED DETECTION SYSTEM =====
    const detectionForm = document.getElementById('detectionform');
    const resultContainer = document.getElementById('result');
    const submitButton = document.querySelector('.detect-button');
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const fileUploadLabel = document.querySelector('.file-upload-label');

    // Image preview functionality with enhanced feedback
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit
                    showToast('Image size must be less than 10MB', 'error');
                    return;
                }
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.innerHTML = `
                        <div style="position: relative; display: inline-block;">
                            <img src="${e.target.result}" alt="Preview" class="preview-image" 
                                 style="transition: all 0.3s ease; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,0,0,0.15);">
                            <div style="position: absolute; top: -5px; right: -5px; background: #27ae60; color: white; 
                                       border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; 
                                       justify-content: center; font-size: 14px; font-weight: bold;">✓</div>
                        </div>
                        <p style="margin-top: 10px; color: #27ae60; font-weight: 600; font-size: 0.9rem;">
                            ✅ ${file.name} uploaded successfully
                        </p>
                    `;
                    
                    if (fileUploadLabel) {
                        fileUploadLabel.classList.add('has-file');
                        const uploadText = document.querySelector('.upload-text');
                        if (uploadText) uploadText.textContent = '📷 Change Image';
                    }
                    
                    validateForm();
                    showToast('Image uploaded successfully!', 'success');
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Enhanced form validation with real-time feedback
    function validateForm() {
        const age = document.getElementById('age');
        const weight = document.getElementById('weight');
        const image = document.getElementById('imageInput');
        
        let isValid = true;
        
        if (age) {
            isValid = validateField(age, 'age-feedback', (val) => {
                const numVal = parseFloat(val);
                if (!val) return { valid: false, message: '⚠️ Age is required' };
                if (isNaN(numVal) || numVal < 0) return { valid: false, message: '⚠️ Age must be positive' };
                if (numVal > 6) return { valid: false, message: '⚠️ Age must be 6 years or less' };
                return { valid: true, message: '✅ Valid age entered' };
            }) && isValid;
        }
        
        if (weight) {
            isValid = validateField(weight, 'weight-feedback', (val) => {
                const numVal = parseFloat(val);
                if (!val) return { valid: false, message: '⚠️ Weight is required' };
                if (isNaN(numVal) || numVal <= 0) return { valid: false, message: '⚠️ Weight must be positive' };
                if (numVal > 50) return { valid: false, message: '⚠️ Weight seems too high for a child' };
                return { valid: true, message: '✅ Valid weight entered' };
            }) && isValid;
        }
        
        if (image) {
            isValid = validateField(image, 'image-feedback', (files) => {
                if (!files || files.length === 0) return { valid: false, message: '⚠️ Please upload an image' };
                const file = files[0];
                if (!file.type.startsWith('image/')) return { valid: false, message: '⚠️ Please upload a valid image file' };
                if (file.size > 10 * 1024 * 1024) return { valid: false, message: '⚠️ Image size must be less than 10MB' };
                return { valid: true, message: '✅ Valid image selected' };
            }) && isValid;
        }
        
        return isValid;
    }
    
    function validateField(element, feedbackId, validator) {
        const feedback = document.getElementById(feedbackId);
        if (!feedback) return true;
        
        const value = element.type === 'file' ? element.files : element.value;
        const result = validator(value);
        
        feedback.textContent = result.message;
        feedback.className = `input-feedback ${result.valid ? 'success' : 'error'}`;
        
        // Add visual feedback to input
        if (result.valid) {
            element.style.borderColor = '#27ae60';
            element.style.boxShadow = '0 0 0 4px rgba(39, 174, 96, 0.1)';
        } else if (value && (element.type !== 'file' || value.length > 0)) {
            element.style.borderColor = '#e74c3c';
            element.style.boxShadow = '0 0 0 4px rgba(231, 76, 60, 0.1)';
        }
        
        return result.valid;
    }

    // Add real-time validation listeners
    const ageInput = document.getElementById('age');
    const weightInput = document.getElementById('weight');
    
    if (ageInput) {
        ageInput.addEventListener('input', () => {
            setTimeout(validateForm, 100); // Small delay for better UX
        });
    }
    
    if (weightInput) {
        weightInput.addEventListener('input', () => {
            setTimeout(validateForm, 100);
        });
    }

    // Enhanced form submission with better UX
    if (detectionForm) {
        detectionForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const age = document.getElementById('age').value.trim();
            const weight = document.getElementById('weight').value.trim();
            const image = document.getElementById('imageInput').files[0];

            // Validate all fields
            if (!validateForm() || !age || !weight || !image) {
                showResult("⚠️ Please correct the errors above and try again.", 'error');
                showToast('Please fill all fields correctly', 'error');
                return;
            }

            // Show loading state with enhanced animation
            setLoadingState(true);
            showResult(`
                <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                    <div class="analysis-spinner"></div>
                    <div>
                        <div style="font-size: 1.2em; font-weight: 600; color: #3498db;">🧠 Analyzing Image...</div>
                        <div style="font-size: 0.9em; color: #7f8c8d; margin-top: 5px;">Please wait while our AI processes the data</div>
                    </div>
                </div>
            `, 'loading');

            const formData = new FormData();
            formData.append('image', image);
            formData.append('age', age);
            formData.append('weight', weight);

            try {
                const response = await fetch('http://127.0.0.1:5000/predict', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (response.ok) {
                    const resultHTML = createEnhancedResultDisplay(data);
                    showResult(resultHTML, data.label === 'Healthy' ? 'success' : 'warning');
                    
                    // Scroll to results
                    setTimeout(() => {
                        resultContainer.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                    }, 300);
                    
                    showToast(`Analysis complete: ${data.label}`, data.label === 'Healthy' ? 'success' : 'warning');
                } else {
                    showResult(`
                        <div style="text-align: center; padding: 20px;">
                            <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
                            <div style="font-size: 1.2em; font-weight: 600; color: #e74c3c; margin-bottom: 10px;">Analysis Failed</div>
                            <div style="color: #7f8c8d;">${data.error || "Something went wrong. Please try again."}</div>
                        </div>
                    `, 'error');
                    showToast('Analysis failed. Please try again.', 'error');
                }
            } catch (error) {
                showResult(`
                    <div style="text-align: center; padding: 20px;">
                        <div style="font-size: 2em; margin-bottom: 10px;">🔌</div>
                        <div style="font-size: 1.2em; font-weight: 600; color: #e74c3c; margin-bottom: 10px;">Connection Error</div>
                        <div style="color: #7f8c8d;">Unable to connect to the server. Please ensure the backend is running.</div>
                        <div style="font-size: 0.9em; color: #95a5a6; margin-top: 10px;">Error: ${error.message}</div>
                    </div>
                `, 'error');
                showToast('Connection failed. Check if backend is running.', 'error');
            } finally {
                setLoadingState(false);
            }
        });
    }

    // Enhanced result display
    function createEnhancedResultDisplay(data) {
        const statusColor = data.label === 'Healthy' ? '#27ae60' : '#e74c3c';
        const statusIcon = data.label === 'Healthy' ? '✅' : '⚠️';
        const statusBg = data.label === 'Healthy' ? 'rgba(39, 174, 96, 0.1)' : 'rgba(231, 76, 60, 0.1)';
        
        return `
            <div style="animation: resultSlideIn 0.6s ease-out;">
                <!-- Main Status Card -->
                <div style="text-align: center; padding: 25px; border-radius: 16px; background: ${statusBg}; 
                           border: 2px solid ${statusColor}; margin-bottom: 20px; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -50%; left: -50%; width: 200%; height: 200%; 
                               background: radial-gradient(circle, ${statusColor}20 0%, transparent 50%); 
                               animation: backgroundPulse 3s ease infinite;"></div>
                    <div style="position: relative; z-index: 2;">
                        <div style="font-size: 3em; margin-bottom: 10px; animation: iconBounce 0.6s ease;">${statusIcon}</div>
                        <div style="font-size: 1.8em; font-weight: 700; color: ${statusColor}; margin-bottom: 5px;">${data.label}</div>
                        <div style="font-size: 1em; color: #7f8c8d;">Confidence: ${data.confidence}%</div>
                        <div style="width: 100%; height: 6px; background: #e0e0e0; border-radius: 3px; margin-top: 10px; overflow: hidden;">
                            <div style="height: 100%; background: ${statusColor}; border-radius: 3px; 
                                       width: ${data.confidence}%; animation: confidenceBar 1s ease-out;"></div>
                        </div>
                    </div>
                </div>
                
                <!-- Analysis Details -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="padding: 15px; background: rgba(52, 152, 219, 0.05); border-radius: 12px; 
                               border-left: 4px solid #3498db; transition: transform 0.2s ease;" 
                         onmouseover="this.style.transform='translateY(-2px)'" 
                         onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <span style="font-size: 1.2em;">🧠</span>
                            <strong style="color: #2c3e50;">AI Analysis</strong>
                        </div>
                        <div style="color: #34495e; font-size: 1.1em;">${data.image_label}</div>
                    </div>
                    
                    <div style="padding: 15px; background: rgba(155, 89, 182, 0.05); border-radius: 12px; 
                               border-left: 4px solid #9b59b6; transition: transform 0.2s ease;" 
                         onmouseover="this.style.transform='translateY(-2px)'" 
                         onmouseout="this.style.transform='translateY(0)'">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 5px;">
                            <span style="font-size: 1.2em;">📏</span>
                            <strong style="color: #2c3e50;">Weight Check</strong>
                        </div>
                        <div style="color: #34495e; font-size: 1.1em;">${data.rule_label}</div>
                    </div>
                </div>
                
                <!-- Recommendation Card -->
                <div style="padding: 20px; background: linear-gradient(135deg, rgba(46, 204, 113, 0.05), rgba(39, 174, 96, 0.02)); 
                           border-radius: 12px; border-left: 4px solid #2ecc71; margin-bottom: 15px;">
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                        <span style="font-size: 1.5em;">🥗</span>
                        <strong style="color: #27ae60; font-size: 1.2em;">Nutritional Recommendation</strong>
                    </div>
                    <div style="color: #2c3e50; line-height: 1.6; font-size: 1.05em;">${data.recommendation}</div>
                </div>
                
                ${data.message ? `
                    <div style="padding: 18px; background: linear-gradient(135deg, rgba(243, 156, 18, 0.05), rgba(241, 196, 15, 0.02)); 
                               border-radius: 12px; border-left: 4px solid #f39c12;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <span style="font-size: 1.3em;">ℹ️</span>
                            <strong style="color: #f39c12; font-size: 1.1em;">Important Note</strong>
                        </div>
                        <div style="color: #2c3e50; line-height: 1.6;">${data.message}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    // Loading state management
    function setLoadingState(loading) {
        if (!submitButton) return;
        
        if (loading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    // Enhanced result display with animations
    function showResult(message, type) {
        if (!resultContainer) return;
        
        resultContainer.innerHTML = message;
        resultContainer.className = `result-container ${type}`;
        
        // Add show class for animation
        setTimeout(() => {
            resultContainer.classList.add('show');
        }, 100);
    }

    // Toast notification system
    function showToast(message, type = 'info') {
        // Create toast container if it doesn't exist
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        toast.style.cssText = `
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-weight: 500;
            max-width: 300px;
            word-wrap: break-word;
            animation: toastSlideIn 0.3s ease-out;
            cursor: pointer;
            transition: opacity 0.2s ease;
        `;

        toast.textContent = message;
        toast.onclick = () => toast.remove();

        toastContainer.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastSlideOut 0.3s ease-in forwards';
                setTimeout(() => toast.remove(), 300);
            }
        }, 4000);
    }

    // Add additional CSS animations
    if (!document.querySelector('#additional-animations')) {
        const style = document.createElement('style');
        style.id = 'additional-animations';
        style.textContent = `
            @keyframes resultSlideIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            @keyframes iconBounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            @keyframes confidenceBar {
                from { width: 0%; }
                to { width: ${100}%; }
            }
            
            @keyframes backgroundPulse {
                0%, 100% { opacity: 0.3; }
                50% { opacity: 0.6; }
            }
            
            @keyframes toastSlideIn {
                from { opacity: 0; transform: translateX(100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            
            @keyframes toastSlideOut {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(100%); }
            }
            
            .analysis-spinner {
                width: 30px;
                height: 30px;
                border: 3px solid rgba(52, 152, 219, 0.3);
                border-radius: 50%;
                border-top-color: #3498db;
                animation: spin 1s ease-in-out infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== HEADER SCROLL EFFECT =====
    let lastScrollTop = 0;
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // ===== CONTACT FORM ENHANCEMENT =====
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = contactForm.querySelector('#contactName').value;
            const email = contactForm.querySelector('#contactEmail').value;
            const message = contactForm.querySelector('#contactMessage').value;
            
            if (name && email && message) {
                showToast('Thank you! We will get back to you soon.', 'success');
                contactForm.reset();
            } else {
                showToast('Please fill all fields.', 'error');
            }
        });
    }

    // ===== INITIALIZE ALL ANIMATIONS =====
    // Initialize scroll-triggered animations
    updateHeroGirlTransformation();
    
    // Add smooth transitions to all interactive elements
    const interactiveElements = document.querySelectorAll('button, .btn-cta, .btn-secondary-outline, .nav-link, .resource-card, .story-card');
    interactiveElements.forEach(el => {
        el.style.transition = 'all 0.3s ease';
    });

    console.log('🌟 FeedHope animations initialized successfully!');
});
