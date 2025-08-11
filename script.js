// script.js

document.addEventListener('DOMContentLoaded', () => {
  // ==== Hamburger menu toggle ====
  const menuBtn = document.querySelector('.menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');

  menuBtn.addEventListener('click', () => {
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true' || false;
    menuBtn.setAttribute('aria-expanded', !expanded);
    mobileMenu.classList.toggle('show');
  });

  // Close mobile menu when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // ==== Smooth scrolling for anchor links ====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ==== Particles.js init only on first section ====
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

  // Optional: Close mobile menu on ESC key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
      mobileMenu.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.focus();
    }
  });
});
