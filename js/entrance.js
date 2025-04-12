class EntranceAnimations {
    constructor() {
        this.body = document.body;
        this.pageContent = document.querySelector('.page-content');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.introPages = document.querySelector('.intro-pages');
        this.platformCards = document.querySelectorAll('.platform-card');
        this.nextBtn = document.querySelector('.next-btn');
        this.skipBtn = document.querySelector('.skip-btn');
        this.currentIntroPage = 1;
        
        // Ensure all elements are loaded before initializing
        if (this.loadingScreen && this.introPages && this.pageContent) {
            this.init();
        } else {
            console.error('Required elements not found');
        }
    }
    
    init() {
        console.log('Initializing entrance animations...');
        
        // Start loading sequence
        this.startLoading();
        
        this.initEventListeners();
        this.initResizeHandler();
    }
    
    startLoading() {
        console.log('Starting loading sequence...');
        
        // Show loading screen
        this.loadingScreen.style.display = 'flex';
        
        // Simulate asset loading (replace with actual asset loading in production)
        let progress = 0;
        const loadingBar = document.querySelector('.loading-progress');
        
        const incrementProgress = () => {
            if (progress < 100) {
                progress += 1;
                if (loadingBar) {
                    loadingBar.style.width = `${progress}%`;
                }
                setTimeout(incrementProgress, 20);
            } else {
                // Loading complete
                console.log('Loading complete, showing intro pages...');
                setTimeout(() => {
                    this.showIntroPages();
                }, 500);
            }
        };
        
        incrementProgress();
    }
    
    initEventListeners() {
        // Next button click
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.goToNextIntroPage();
            });
        }
        
        // Skip button click
        if (this.skipBtn) {
            this.skipBtn.addEventListener('click', () => {
                console.log('Skip button clicked');
                this.showMainContent();
            });
        }
        
        // Platform card click
        this.platformCards.forEach(card => {
            card.addEventListener('click', () => {
                console.log('Platform selected:', card.dataset.platform);
                this.selectPlatform(card.dataset.platform);
            });
        });
    }
    
    initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', () => {
            document.body.classList.add('resize-animation-stopper');
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 400);
        });
    }
    
    showIntroPages() {
        console.log('Showing intro pages...');
        
        // Hide loading screen with fade out
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.body.classList.remove('loading');
            
            // Show intro pages with fade in
            this.introPages.classList.remove('hidden');
            this.introPages.style.opacity = '1';
        }, 500);
    }
    
    goToNextIntroPage() {
        const currentPage = document.querySelector(`.intro-page[data-page="${this.currentIntroPage}"]`);
        const nextPage = document.querySelector(`.intro-page[data-page="${this.currentIntroPage + 1}"]`);
        
        if (nextPage) {
            currentPage.classList.remove('active');
            nextPage.classList.add('active');
            this.currentIntroPage++;
        } else {
            this.showMainContent();
        }
    }
    
    selectPlatform(platform) {
        // Add selected class to the chosen platform card
        this.platformCards.forEach(card => {
            if (card.dataset.platform === platform) {
                card.classList.add('selected');
            }
        });
        
        // Store selected platform
        localStorage.setItem('selectedPlatform', platform);
        
        // Show main content after a brief delay
        setTimeout(() => {
            this.showMainContent();
        }, 500);
    }
    
    showMainContent() {
        console.log('Showing main content...');
        
        // Hide intro pages with fade out
        this.introPages.style.opacity = '0';
        setTimeout(() => {
            this.introPages.classList.add('hidden');
            
            // Show main content with fade in
            this.pageContent.classList.remove('hidden');
            this.pageContent.style.opacity = '1';
            
            // Initialize scroll animations
            this.initScrollAnimations();
        }, 500);
    }
    
    initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all sections except hero
        const sections = document.querySelectorAll('section:not(#hero)');
        sections.forEach(section => {
            section.classList.add('reveal');
            observer.observe(section);
        });
        
        // Observe feature cards
        const cards = document.querySelectorAll('.feature-card');
        cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.2}s`;
            card.classList.add('reveal');
            observer.observe(card);
        });
    }
}

// Initialize entrance animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing animations...');
    new EntranceAnimations();
    
    // Add CSS class to handle animation disabling during window resize
    const style = document.createElement('style');
    style.textContent = `
        .resize-animation-stopper * {
            animation: none !important;
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
}); 