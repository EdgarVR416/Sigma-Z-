class CustomCursor {
    constructor() {
        this.cursor = document.querySelector('.custom-cursor');
        this.follower = document.querySelector('.custom-cursor-follower');
        this.links = document.querySelectorAll('a, button');
        this.pos = { x: 0, y: 0 };
        this.mouse = { x: 0, y: 0 };
        this.speed = 0.1;
        
        this.init();
    }
    
    init() {
        // Initial position off screen
        this.pos.x = -100;
        this.pos.y = -100;
        
        this.initCursorMovement();
        this.initHoverStates();
        this.initClickAnimation();
        this.initTextHoverEffect();
    }
    
    initCursorMovement() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Set cursor position immediately
            this.cursor.style.transform = `translate3d(${this.mouse.x}px, ${this.mouse.y}px, 0)`;
        });
        
        // Smooth follower movement
        const updateFollower = () => {
            const dx = this.mouse.x - this.pos.x;
            const dy = this.mouse.y - this.pos.y;
            
            this.pos.x += dx * this.speed;
            this.pos.y += dy * this.speed;
            
            this.follower.style.transform = `translate3d(${this.pos.x - 20}px, ${this.pos.y - 20}px, 0)`;
            
            requestAnimationFrame(updateFollower);
        };
        
        updateFollower();
    }
    
    initHoverStates() {
        this.links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                this.cursor.classList.add('active');
                this.follower.classList.add('active');
            });
            
            link.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('active');
                this.follower.classList.remove('active');
            });
        });
    }
    
    initClickAnimation() {
        document.addEventListener('mousedown', () => {
            this.cursor.classList.add('click');
            this.follower.classList.add('click');
        });
        
        document.addEventListener('mouseup', () => {
            this.cursor.classList.remove('click');
            this.follower.classList.remove('click');
        });
    }
    
    initTextHoverEffect() {
        const texts = document.querySelectorAll('.gradient-text, .section-title, .feature-card h3');
        
        texts.forEach(text => {
            text.addEventListener('mouseenter', () => {
                this.cursor.classList.add('text-hover');
                this.follower.classList.add('text-hover');
            });
            
            text.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('text-hover');
                this.follower.classList.remove('text-hover');
            });
        });
    }
}

// Initialize custom cursor when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on non-touch devices
    if (!('ontouchstart' in window)) {
        new CustomCursor();
    }
}); 