// Toggle hamburger menu open/close
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  const isOpen = menuBtn.classList.toggle('open');
  if (isOpen) {
    mobileMenu.classList.add('open');
    menuBtn.setAttribute('aria-expanded', 'true');
  } else {
    mobileMenu.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// Close mobile menu if clicking outside
document.addEventListener('click', (e) => {
  if (!mobileMenu.contains(e.target) && !menuBtn.contains(e.target)) {
    mobileMenu.classList.remove('open');
    menuBtn.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
});

// Initialize particles.js
particlesJS('particles-js', {
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 700
      }
    },
    "color": { "value": "#ffffff" },
    "shape": {
      "type": "circle"
    },
    "opacity": {
      "value": 0.85,
      "random": true,
      "anim": { "enable": false }
    },
    "size": {
      "value": 2,
      "random": true,
      "anim": { "enable": false }
    },
    "line_linked": {
      "enable": true,
      "distance": 140,
      "color": "#ffffff",
      "opacity": 0.18,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 1.6,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "bounce",
      "bounce": true,
      "attract": {
        "enable": true,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "canvas",
    "events": {
      "onhover": { "enable": true, "mode": "grab" },
      "onclick": { "enable": true, "mode": "push" },
      "resize": true
    },
    "modes": {
      "grab": { "distance": 160, "line_linked": { "opacity": 0.45 } },
      "push": { "particles_nb": 4 }
    }
  },
  "retina_detect": true
});
