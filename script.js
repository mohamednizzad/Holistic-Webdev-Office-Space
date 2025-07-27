// NexusFlow - Modern Digital Workplace
class NexusFlowApp {
    constructor() {
        this.currentSlide = 0;
        this.slideInterval = null;
        this.fabMenuOpen = false;
        this.notifications = [];
        
        this.init();
    }

    init() {
        this.initializeEventListeners();
        this.initializeCarousel();
        this.startClock();
        this.initializeAnimations();
        this.loadNotifications();
        this.initializeTypingAnimation();
    }

    // Event Listeners
    initializeEventListeners() {
        // FAB Button
        const fabButton = document.getElementById('fabButton');
        const fabMenu = document.getElementById('fabMenu');
        
        fabButton?.addEventListener('click', () => {
            this.toggleFabMenu();
        });

        // FAB Menu Options
        document.querySelectorAll('.fab-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.handleFabAction(e.currentTarget);
            });
        });

        // Quick Action Buttons
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleQuickAction(e.currentTarget);
            });
        });

        // App Launcher Buttons
        document.querySelectorAll('.app-launcher-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleAppLaunch(e.currentTarget);
            });
        });

        // Quick Links
        document.querySelectorAll('a[href="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleQuickLink(e.currentTarget);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Search functionality
        const searchInput = document.querySelector('input[placeholder="Search everything..."]');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Intersection Observer for animations
        this.initializeIntersectionObserver();
    }

    // FAB Menu Management
    toggleFabMenu() {
        const fabButton = document.getElementById('fabButton');
        const fabMenu = document.getElementById('fabMenu');
        
        this.fabMenuOpen = !this.fabMenuOpen;
        
        if (this.fabMenuOpen) {
            fabMenu.classList.remove('opacity-0', 'invisible', 'translate-y-4');
            fabButton.querySelector('svg').style.transform = 'rotate(45deg)';
        } else {
            fabMenu.classList.add('opacity-0', 'invisible', 'translate-y-4');
            fabButton.querySelector('svg').style.transform = 'rotate(0deg)';
        }
    }

    handleFabAction(element) {
        const actionText = element.querySelector('span').textContent;
        this.toggleFabMenu();
        
        setTimeout(() => {
            this.showToast(`Opening ${actionText}...`, 'info');
            
            // Simulate different actions
            switch(actionText) {
                case 'Quick Chat':
                    this.openChatInterface();
                    break;
                case 'Help Center':
                    this.openHelpCenter();
                    break;
                case 'Feedback':
                    this.openFeedbackForm();
                    break;
            }
        }, 200);
    }

    // Carousel Management
    initializeCarousel() {
        this.startCarouselAutoplay();
        
        const carousel = document.getElementById('newsCarousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => this.pauseCarousel());
            carousel.addEventListener('mouseleave', () => this.startCarouselAutoplay());
        }
    }

    startCarouselAutoplay() {
        this.slideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    pauseCarousel() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
    }

    nextSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (slides.length === 0) return;
        
        // Hide current slide
        slides[this.currentSlide].classList.remove('opacity-100');
        slides[this.currentSlide].classList.add('opacity-0');
        dots[this.currentSlide].classList.remove('opacity-100');
        dots[this.currentSlide].classList.add('opacity-50');
        
        // Move to next slide
        this.currentSlide = (this.currentSlide + 1) % slides.length;
        
        // Show new slide
        slides[this.currentSlide].classList.remove('opacity-0');
        slides[this.currentSlide].classList.add('opacity-100');
        dots[this.currentSlide].classList.remove('opacity-50');
        dots[this.currentSlide].classList.add('opacity-100');
    }

    previousSlide() {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (slides.length === 0) return;
        
        // Hide current slide
        slides[this.currentSlide].classList.remove('opacity-100');
        slides[this.currentSlide].classList.add('opacity-0');
        dots[this.currentSlide].classList.remove('opacity-100');
        dots[this.currentSlide].classList.add('opacity-50');
        
        // Move to previous slide
        this.currentSlide = this.currentSlide === 0 ? slides.length - 1 : this.currentSlide - 1;
        
        // Show new slide
        slides[this.currentSlide].classList.remove('opacity-0');
        slides[this.currentSlide].classList.add('opacity-100');
        dots[this.currentSlide].classList.remove('opacity-50');
        dots[this.currentSlide].classList.add('opacity-100');
    }

    goToSlide(slideIndex) {
        const slides = document.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dot');
        
        if (slides.length === 0 || slideIndex >= slides.length) return;
        
        // Hide current slide
        slides[this.currentSlide].classList.remove('opacity-100');
        slides[this.currentSlide].classList.add('opacity-0');
        dots[this.currentSlide].classList.remove('opacity-100');
        dots[this.currentSlide].classList.add('opacity-50');
        
        // Set new slide
        this.currentSlide = slideIndex;
        
        // Show new slide
        slides[this.currentSlide].classList.remove('opacity-0');
        slides[this.currentSlide].classList.add('opacity-100');
        dots[this.currentSlide].classList.remove('opacity-50');
        dots[this.currentSlide].classList.add('opacity-100');
        
        // Reset autoplay
        this.pauseCarousel();
        this.startCarouselAutoplay();
    }

    // Action Handlers
    handleQuickAction(element) {
        const actionText = element.querySelector('span').textContent;
        
        // Add click animation
        element.style.transform = 'scale(0.95)';
        setTimeout(() => {
            element.style.transform = '';
        }, 150);
        
        this.showToast(`Opening ${actionText}...`, 'success');
        
        // Simulate loading state
        const icon = element.querySelector('div');
        icon.classList.add('animate-pulse');
        setTimeout(() => {
            icon.classList.remove('animate-pulse');
        }, 1000);
    }

    handleAppLaunch(element) {
        const appName = element.querySelector('span').textContent;
        
        // Add launch animation
        const icon = element.querySelector('div');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        setTimeout(() => {
            icon.style.transform = '';
        }, 300);
        
        this.showToast(`Launching ${appName}...`, 'info');
    }

    handleQuickLink(element) {
        const linkText = element.querySelector('span').textContent;
        
        // Add ripple effect
        this.createRippleEffect(element);
        
        this.showToast(`Opening ${linkText}...`, 'info');
    }

    // Utility Functions
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            warning: 'bg-yellow-500',
            info: 'bg-blue-500'
        };
        
        toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
        toast.innerHTML = `
            <div class="flex items-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.remove('translate-x-full'), 100);
        
        // Hide toast
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${rect.width / 2 - size / 2}px;
            top: ${rect.height / 2 - size / 2}px;
            background: rgba(59, 130, 246, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Clock and Time Management
    startClock() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
    }

    updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const timeElement = document.getElementById('current-time');
        if (timeElement) {
            timeElement.textContent = timeString;
        }
    }

    // Animations
    initializeAnimations() {
        // Stagger animations for cards
        const cards = document.querySelectorAll('.card-hover');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }

    initializeIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate-slide-up').forEach(el => {
            observer.observe(el);
        });
    }

    initializeTypingAnimation() {
        const typingElement = document.querySelector('.typing-animation');
        if (typingElement) {
            const text = 'Alex';
            let index = 0;
            
            const typeText = () => {
                if (index < text.length) {
                    typingElement.textContent = text.substring(0, index + 1);
                    index++;
                    setTimeout(typeText, 150);
                } else {
                    // Remove typing cursor after completion
                    setTimeout(() => {
                        typingElement.classList.remove('typing-animation');
                    }, 1000);
                }
            };
            
            // Start typing after a delay
            setTimeout(typeText, 1000);
        }
    }

    // Search Functionality
    handleSearch(query) {
        if (query.length < 2) return;
        
        // Simulate search results
        console.log(`Searching for: ${query}`);
        
        // In a real app, this would make an API call
        setTimeout(() => {
            this.showToast(`Found ${Math.floor(Math.random() * 20) + 1} results for "${query}"`, 'info');
        }, 500);
    }

    // Keyboard Shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[placeholder="Search everything..."]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Escape to close FAB menu
        if (e.key === 'Escape' && this.fabMenuOpen) {
            this.toggleFabMenu();
        }
        
        // Arrow keys for carousel navigation
        if (e.key === 'ArrowLeft') {
            this.previousSlide();
        } else if (e.key === 'ArrowRight') {
            this.nextSlide();
        }
    }

    // Notification System
    loadNotifications() {
        this.notifications = [
            {
                id: 1,
                title: 'Meeting Reminder',
                message: 'All-Hands Meeting starts in 30 minutes',
                type: 'meeting',
                time: '5 minutes ago',
                read: false
            },
            {
                id: 2,
                title: 'New Message',
                message: 'Sarah Martinez sent you a message',
                type: 'message',
                time: '10 minutes ago',
                read: false
            },
            {
                id: 3,
                title: 'Task Completed',
                message: 'Project Alpha milestone completed',
                type: 'task',
                time: '1 hour ago',
                read: true
            }
        ];
        
        this.updateNotificationBadge();
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
    }

    // Interface Actions
    openChatInterface() {
        // Simulate opening chat
        this.showToast('Chat interface opened', 'success');
    }

    openHelpCenter() {
        // Simulate opening help
        this.showToast('Help center opened', 'info');
    }

    openFeedbackForm() {
        // Simulate opening feedback
        this.showToast('Feedback form opened', 'info');
    }

    // Performance Monitoring
    trackUserInteraction(action, element) {
        // In a real app, this would send analytics data
        console.log(`User interaction: ${action}`, element);
    }

    // Accessibility Features
    initializeAccessibility() {
        // Add skip links
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded-lg z-50';
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content landmark
        const main = document.querySelector('main');
        if (main) {
            main.id = 'main-content';
        }
    }

    // Theme Management
    toggleTheme() {
        const isDark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark', !isDark);
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
        }
    }
}

// Global functions for carousel controls (called from HTML)
function nextSlide() {
    app.nextSlide();
}

function previousSlide() {
    app.previousSlide();
}

function goToSlide(index) {
    app.goToSlide(index);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .quick-action-btn, .app-launcher-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 1rem;
        background: transparent;
        border: none;
        border-radius: 1rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .quick-action-btn:hover, .app-launcher-btn:hover {
        background: rgba(59, 130, 246, 0.05);
        transform: translateY(-2px);
    }
    
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
    
    .focus\\:not-sr-only:focus {
        position: static;
        width: auto;
        height: auto;
        padding: 0.5rem 1rem;
        margin: 0;
        overflow: visible;
        clip: auto;
        white-space: normal;
    }
`;
document.head.appendChild(style);

// Initialize the application
const app = new NexusFlowApp();

// Initialize accessibility features
app.initializeAccessibility();
app.initializeTheme();