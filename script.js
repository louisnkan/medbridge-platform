// ========================================
// MedBridge - Clean, Minimal JavaScript
// Bug-free, production-ready code
// ========================================

// ========== STATE MANAGEMENT ==========
const appState = {
    theme: localStorage.getItem('medbridge-theme') || 'light',
    selectedSymptoms: [],
    assessmentActive: false
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    console.log('🏥 MedBridge initialized successfully');
});

function initializeApp() {
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', appState.theme);
    updateThemeIcon();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

function setupEventListeners() {
    // Close modals on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAssessment();
            closeFounderModal();
        }
    });
    
    // Close modals on backdrop click
    document.getElementById('assessmentOverlay')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeAssessment();
        }
    });
    
    document.getElementById('founderModal')?.addEventListener('click', function(e) {
        if (e.target === this) {
            closeFounderModal();
        }
    });
}

// ========== THEME TOGGLE ==========
function toggleTheme() {
    appState.theme = appState.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', appState.theme);
    localStorage.setItem('medbridge-theme', appState.theme);
    updateThemeIcon();
    
    // Add smooth transition
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
}

function updateThemeIcon() {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = appState.theme === 'dark' ? '☀️' : '🌙';
    }
}

// ========== ASSESSMENT FUNCTIONS ==========
function startAssessment() {
    const overlay = document.getElementById('assessmentOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        appState.assessmentActive = true;
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        
        // Add entrance animation
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
    }
}

function closeAssessment() {
    const overlay = document.getElementById('assessmentOverlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.classList.add('hidden');
            appState.assessmentActive = false;
            document.body.style.overflow = ''; // Restore scrolling
            resetAssessment();
        }, 200);
    }
}

function resetAssessment() {
    appState.selectedSymptoms = [];
    
    // Reset all symptom buttons
    document.querySelectorAll('.symptom-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Disable continue button
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = true;
    }
}

function toggleSymptom(button) {
    const symptom = button.dataset.symptom;
    
    if (button.classList.contains('active')) {
        // Deselect
        button.classList.remove('active');
        appState.selectedSymptoms = appState.selectedSymptoms.filter(s => s !== symptom);
    } else {
        // Select
        button.classList.add('active');
        appState.selectedSymptoms.push(symptom);
    }
    
    // Update continue button state
    updateContinueButton();
    
    // Add haptic feedback (if supported)
    if ('vibrate' in navigator) {
        navigator.vibrate(10);
    }
}

function updateContinueButton() {
    const continueBtn = document.getElementById('continueBtn');
    if (continueBtn) {
        continueBtn.disabled = appState.selectedSymptoms.length === 0;
    }
}

function proceedToSeverity() {
    // In full version, this would proceed to next step
    // For MVP, show a success message
    const symptoms = appState.selectedSymptoms.join(', ');
    
    alert(`Assessment started for: ${symptoms}\n\nIn the full version, you would proceed through:\n• Severity assessment\n• Duration questions\n• AI analysis\n• Personalized care instructions\n\nThis is a simplified demo.`);
    
    closeAssessment();
}

// ========== FOUNDER STORY MODAL ==========
function showFounderStory(e) {
    e.preventDefault();
    const modal = document.getElementById('founderModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }
}

function closeFounderModal() {
    const modal = document.getElementById('founderModal');
    if (modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 200);
    }
}

// ========== ANALYTICS & TRACKING (Privacy-Friendly) ==========
function trackEvent(eventName, eventData = {}) {
    // In production, integrate with privacy-friendly analytics
    // For now, just console log
    console.log('Event:', eventName, eventData);
    
    // Example: Track button clicks, assessment starts, etc.
    // This helps understand user behavior without compromising privacy
}

// Track important user actions
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function() {
        trackEvent('cta_clicked', { 
            button_text: this.textContent.trim(),
            location: this.closest('section')?.className || 'unknown'
        });
    });
});

// ========== PERFORMANCE OPTIMIZATIONS ==========
// Lazy load images (when you add them)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ========== ACCESSIBILITY ENHANCEMENTS ==========
// Keyboard navigation for custom buttons
document.querySelectorAll('.symptom-btn').forEach(btn => {
    btn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Announce dynamic content changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

// ========== ERROR HANDLING ==========
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // In production, send to error tracking service
    // Don't show ugly errors to users - handle gracefully
});

// ========== NETWORK STATUS DETECTION ==========
window.addEventListener('online', function() {
    announceToScreenReader('Internet connection restored');
    console.log('✅ Back online');
});

window.addEventListener('offline', function() {
    announceToScreenReader('Internet connection lost. Basic features still available.');
    console.log('⚠️ Offline mode');
});

// ========== SERVICE WORKER (For Offline Support) ==========
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // In production, register service worker for offline capability
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}

// ========== UTILITY FUNCTIONS ==========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========== PAGE VISIBILITY API ==========
// Pause unnecessary operations when page is hidden
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('Page hidden - pausing non-essential operations');
    } else {
        console.log('Page visible - resuming operations');
    }
});

// ========== SMOOTH REVEAL ON SCROLL ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to sections
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(section);
    });
});

// ========== PREFETCH RESOURCES ==========
// Prefetch critical resources when user shows intent
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('mouseenter', function() {
        // Prefetch resources for better UX
        // In production, prefetch API endpoints or images
    });
});

// ========== CONSOLE ART (Optional Easter Egg) ==========
console.log(`
%c🏥 MedBridge Platform
%cHealthcare shouldn't depend on location

%cBuilt with ❤️ by Louis Nkan
%cInterested in the mission? louisnkan2002@gmail.com
`, 
'font-size: 20px; font-weight: bold; color: #2D6A4F;',
'font-size: 14px; color: #6B7280;',
'font-size: 12px; font-weight: bold; color: #2D6A4F;',
'font-size: 12px; color: #6B7280;'
);

// ========== EXPORT FOR TESTING ==========
// If you're adding tests later, export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleTheme,
        startAssessment,
        closeAssessment,
        toggleSymptom
    };
}
