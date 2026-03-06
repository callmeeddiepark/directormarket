/* =========================================
   DIRECTOR MARKET — Interactivity
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // --- Particles Background ---
    createParticles();

    // --- Nav scroll behavior ---
    const nav = document.getElementById('nav');
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
    });

    // --- Mobile hamburger ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll animations (custom AOS) ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));

    // --- Smooth scroll for nav links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // --- Parallax on hero ---
    const heroImg = document.querySelector('.hero-img');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight && heroImg) {
            heroImg.style.transform = `scale(${1 + scrolled * 0.0003})`;
        }
    });

    // --- Service cards stagger animation ---
    const cards = document.querySelectorAll('.service-card');
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 150);
                cardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
        cardObserver.observe(card);
    });

    // --- Client logos hover glow ---
    document.querySelectorAll('.client-logo').forEach(logo => {
        logo.addEventListener('mouseenter', function () {
            this.style.boxShadow = '0 0 30px rgba(230,60,47,0.06)';
        });
        logo.addEventListener('mouseleave', function () {
            this.style.boxShadow = 'none';
        });
    });
});

/* --- Star Particles --- */
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 300;
    // 70% decrease of [2, 4, 6, 8, 12] -> roughly [0.6, 1.2, 1.8, 2.4, 3.6]
    const SIZES = [0.6, 1.2, 1.8, 2.4, 3.6];

    let mouse = { x: -1000, y: -1000 };
    let trail = [];
    const TRAIL_LENGTH = 20;

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const size = SIZES[Math.floor(Math.random() * SIZES.length)];
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: size,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.3, // Brighter base alpha
                pulse: Math.random() * Math.PI * 2
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            // Mouse Interaction (피하기)
            let dx = mouse.x - p.x;
            let dy = mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let maxDistance = 200;

            if (distance < maxDistance && distance > 0) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;
                let force = (maxDistance - distance) / maxDistance;
                p.x -= forceDirectionX * force * 5;
                p.y -= forceDirectionY * force * 5;
            }

            // Normal movement
            p.x += p.vx;
            p.y += p.vy;
            p.pulse += 0.05; // Faster pulsing for twinkling effect

            // Boundaries
            if (p.x < -p.radius * 2) p.x = canvas.width + p.radius * 2;
            if (p.x > canvas.width + p.radius * 2) p.x = -p.radius * 2;
            if (p.y < -p.radius * 2) p.y = canvas.height + p.radius * 2;
            if (p.y > canvas.height + p.radius * 2) p.y = -p.radius * 2;

            const currentAlpha = p.alpha + Math.sin(p.pulse) * 0.4;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, currentAlpha)})`;
            // Glowing star effect
            ctx.shadowBlur = p.radius * 4;
            ctx.shadowColor = `rgba(255, 255, 255, ${Math.max(0.2, currentAlpha)})`;
            ctx.fill();
            // Reset shadow to prevent weird overlapping artifacts
            ctx.shadowBlur = 0;
        });

        // Shooting Star Mouse Trail
        if (mouse.x !== -1000) {
            trail.push({ x: mouse.x, y: mouse.y });
            if (trail.length > TRAIL_LENGTH) {
                trail.shift();
            }
        } else if (trail.length > 0) {
            trail.shift();
        }

        if (trail.length > 1) {
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            for (let i = 0; i < trail.length - 1; i++) {
                const p1 = trail[i];
                const p2 = trail[i + 1];
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                const ratio = i / trail.length; // 0 to 1
                ctx.strokeStyle = `rgba(255, 255, 255, ${ratio * 0.8})`;
                ctx.lineWidth = ratio * 4;
                ctx.stroke();
            }

            // Draw head (glow)
            const head = trail[trail.length - 1];
            ctx.beginPath();
            ctx.arc(head.x, head.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.shadowBlur = 12;
            ctx.shadowColor = 'rgba(255, 255, 255, 1)';
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        requestAnimationFrame(draw);
    }

    init();
    draw();
    window.addEventListener('resize', resize);
}
