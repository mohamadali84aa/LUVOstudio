document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const menuBtn = document.querySelector('.menu-btn');
  const navLinks = document.querySelector('.nav-links');

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
    menuBtn.setAttribute('aria-expanded', !expanded);

    header.classList.toggle('open');
    menuBtn.classList.toggle('open');
    navLinks.classList.toggle('show');
  });

  // Close menu when clicking a nav link (on mobile)
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      header.classList.remove('open');
      menuBtn.classList.remove('open');
      navLinks.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && header.classList.contains('open')) {
      header.classList.remove('open');
      menuBtn.classList.remove('open');
      navLinks.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Initialize particles.js
  if (window.particlesJS) {
    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 900 } },
        color: { value: '#fff' },
        shape: { type: 'circle' },
        opacity: { value: 0.6, random: true },
        size: { value: 2, random: true },
        line_linked: {
          enable: true,
          distance: 120,
          color: '#fff',
          opacity: 0.2,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.5,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false,
          attract: { enable: true, rotateX: 600, rotateY: 1200 },
        },
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'push' },
          resize: true,
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.4 } },
          push: { particles_nb: 4 },
        },
      },
      retina_detect: true,
    });
  }
});
