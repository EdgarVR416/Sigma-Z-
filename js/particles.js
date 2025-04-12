class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
        };
        this.radius = Math.random() * 2;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(139, 92, 246, ${this.opacity})`;
        this.ctx.fill();
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x < 0 || this.x > this.canvas.width) this.velocity.x *= -1;
        if (this.y < 0 || this.y > this.canvas.height) this.velocity.y *= -1;

        this.draw();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numberOfParticles = 100;
        this.mouse = {
            x: null,
            y: null,
            radius: 100
        };

        this.init();
        this.animate();
        this.handleResize();
        this.handleMouseMove();
    }

    init() {
        this.setCanvasSize();
        this.createParticles();
    }

    setCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this.canvas, this.ctx));
        }
    }

    handleResize() {
        window.addEventListener('resize', () => {
            this.setCanvasSize();
            this.createParticles();
        });
    }

    handleMouseMove() {
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
    }

    connectParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update();

            // Mouse interaction
            if (this.mouse.x && this.mouse.y) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    
                    particle.x += Math.cos(angle) * force;
                    particle.y += Math.sin(angle) * force;
                }
            }
        });

        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 