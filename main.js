// Main JavaScript for CryptoP2P Exchange

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navAuth = document.querySelector('.nav-auth');

// Mobile Navigation Toggle
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        navAuth.classList.toggle('active');
    });
}

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function showLoginModal() {
    showModal('loginModal');
}

function showSignupModal() {
    showModal('signupModal');
}

function switchModal(currentModalId, targetModalId) {
    closeModal(currentModalId);
    setTimeout(() => {
        showModal(targetModalId);
    }, 100);
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Scroll to Section Function
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Header Background on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 14, 26, 0.98)';
    } else {
        header.style.background = 'rgba(10, 14, 26, 0.95)';
    }
});

// Animate Elements on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .security-item, .crypto-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Crypto Price Animation (Mock Data)
function animateCryptoPrices() {
    const priceElements = document.querySelectorAll('.price');
    
    priceElements.forEach(priceEl => {
        const currentPrice = parseFloat(priceEl.textContent.replace('$', '').replace(',', ''));
        const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
        const newPrice = currentPrice * (1 + variation);
        
        // Format price based on value
        let formattedPrice;
        if (newPrice >= 1000) {
            formattedPrice = '$' + newPrice.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        } else {
            formattedPrice = '$' + newPrice.toFixed(2);
        }
        
        // Add color animation based on change
        if (variation > 0) {
            priceEl.style.color = 'var(--success-color)';
        } else {
            priceEl.style.color = 'var(--error-color)';
        }
        
        // Reset color after animation
        setTimeout(() => {
            priceEl.style.color = 'var(--success-color)';
        }, 1000);
        
        priceEl.textContent = formattedPrice;
    });
}

// Start price animation
setInterval(animateCryptoPrices, 5000);

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = 'var(--error-color)';
            isValid = false;
        } else {
            input.style.borderColor = 'var(--border-color)';
        }
        
        // Email validation
        if (input.type === 'email' && input.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value)) {
                input.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
        }
        
        // Password validation
        if (input.type === 'password' && input.value) {
            if (input.value.length < 8) {
                input.style.borderColor = 'var(--error-color)';
                isValid = false;
            }
        }
    });
    
    return isValid;
}

// Handle Form Submissions
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (validateForm(form)) {
                // Show success message
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Processing...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = 'Success!';
                    submitBtn.style.background = 'var(--success-color)';
                    
                    setTimeout(() => {
                        // Reset form and close modal
                        form.reset();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        
                        // Close modal
                        const modal = form.closest('.modal');
                        if (modal) {
                            modal.style.display = 'none';
                            document.body.style.overflow = 'auto';
                        }
                        
                        // Redirect to trading page (simulation)
                        if (originalText.includes('Login') || originalText.includes('Create Account')) {
                            setTimeout(() => {
                                window.location.href = 'pages/trading.html';
                            }, 500);
                        }
                    }, 1500);
                }, 2000);
            }
        });
    });
});

// Real-time Input Validation
document.addEventListener('DOMContentLoaded', () => {
    const inputs = document.querySelectorAll('input');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.value.trim()) {
                input.style.borderColor = 'var(--success-color)';
            } else {
                input.style.borderColor = 'var(--border-color)';
            }
        });
        
        input.addEventListener('blur', () => {
            if (input.required && !input.value.trim()) {
                input.style.borderColor = 'var(--error-color)';
            }
        });
    });
});

// Loading Animation
function showLoading() {
    const loader = document.createElement('div');
    loader.className = 'loading-overlay';
    loader.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-coins fa-spin"></i>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.remove();
    }
}

// Add loading styles
const loadingStyles = `
    .loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(10, 14, 26, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    
    .loading-spinner {
        text-align: center;
        color: var(--primary-color);
    }
    
    .loading-spinner i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }
    
    .loading-spinner p {
        font-size: 1.1rem;
        font-weight: 500;
    }
`;

// Inject loading styles
const styleSheet = document.createElement('style');
styleSheet.textContent = loadingStyles;
document.head.appendChild(styleSheet);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[style*="block"]');
        if (openModal) {
            openModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});

// Performance Optimization
document.addEventListener('DOMContentLoaded', () => {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Console Welcome Message
console.log(`
🚀 Welcome to CryptoP2P Exchange!
💰 Secure peer-to-peer cryptocurrency trading platform
🔒 Your security is our priority
📱 Fully responsive and mobile-friendly
⚡ Built with modern web technologies

For support, visit: https://github.com/your-repo
`);

// Export functions for use in other files
window.CryptoP2P = {
    showModal,
    closeModal,
    showLoginModal,
    showSignupModal,
    switchModal,
    scrollToSection,
    showLoading,
    hideLoading
};

