/* ═══════════════════════════════════════════════════════════
   Daniel Ruiz — Personal Portfolio
   Interactions & Animations
   ═══════════════════════════════════════════════════════════ */

// ── Navbar scroll effect ──────────────────────────────────────
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.scrollY;
  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = currentScroll;
}, { passive: true });

// ── Mobile menu toggle ────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

function closeMenu() {
  navToggle.classList.remove('active');
  navLinks.classList.remove('open');
  document.body.style.overflow = '';
}

// ── Intersection Observer for fade-in animations ──────────────
const observerOptions = {
  root: null,
  rootMargin: '0px 0px -80px 0px',
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((el) => {
  observer.observe(el);
});

// ── Mouse-follow gradient on body ─────────────────────────────
document.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  document.body.style.setProperty('--mouse-x', `${x}%`);
  document.body.style.setProperty('--mouse-y', `${y}%`);
});

// ── Mouse-follow glow on project cards ────────────────────────
document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--card-mouse-x', `${x}%`);
    card.style.setProperty('--card-mouse-y', `${y}%`);
  });
});

// ── Smooth scroll for anchor links ────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── Animated stat counter ─────────────────────────────────────
function animateCounter(el, target, suffix = '') {
  const isNumber = !isNaN(parseInt(target));
  if (!isNumber) return;

  const num = parseInt(target);
  const duration = 1500;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * num);
    el.textContent = current + suffix;
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        const match = text.match(/^(\d+)(.*)$/);
        if (match) {
          animateCounter(el, text, '');
        }
        statsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.stat-number').forEach((el) => {
  statsObserver.observe(el);
});

// ── Particle canvas ───────────────────────────────────────────
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let animationId;
  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 120;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.3 + 0.1,
    };
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DISTANCE) {
          const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.08;
          ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${p.opacity})`;
      ctx.fill();

      // Update position
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    }

    animationId = requestAnimationFrame(draw);
  }

  // Reduce particle count & pause on mobile for performance
  function checkPerformance() {
    if (window.innerWidth < 768) {
      if (animationId) cancelAnimationFrame(animationId);
      ctx.clearRect(0, 0, width, height);
      return;
    }
    if (!animationId) draw();
  }

  window.addEventListener('resize', () => {
    resize();
    checkPerformance();
  });

  init();
  draw();
  checkPerformance();
})();

// ── Typed text effect for hero subtitle (subtle) ──────────────
(function typedCursor() {
  const badge = document.querySelector('.hero-badge');
  if (!badge) return;

  // Add a subtle blinking cursor after the badge text
  const cursor = document.createElement('span');
  cursor.textContent = '|';
  cursor.style.cssText = `
    display: inline-block;
    margin-left: 2px;
    animation: blink 1s step-end infinite;
    color: var(--accent-indigo);
    font-weight: 300;
  `;

  // Add blink keyframe
  const style = document.createElement('style');
  style.textContent = `@keyframes blink { 50% { opacity: 0; } }`;
  document.head.appendChild(style);

  badge.appendChild(cursor);
})();

// ── Active nav link highlighting on scroll ────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach((a) => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--text-primary)';
    }
  });
}, { passive: true });

// ── Set current year in footer ────────────────────────────────
const yearEl = document.getElementById('current-year');
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}
