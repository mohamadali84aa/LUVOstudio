document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Hamburger menu toggle with smooth height animation
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Close menu
            menuBtn.setAttribute('aria-expanded', 'false');
            // Animate max-height to 0 and fade out
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            requestAnimationFrame(() => {
                mobileMenu.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
                mobileMenu.style.maxHeight = '0';
                mobileMenu.style.opacity = '0';
            });
            // After animation, hide menu
            setTimeout(() => {
                mobileMenu.hidden = true;
                mobileMenu.style.transition = '';
            }, 350);
            header.classList.remove('open');
        } else {
            // Open menu
            mobileMenu.hidden = false;
            menuBtn.setAttribute('aria-expanded', 'true');
            header.classList.add('open');
            // Animate max-height from 0 to scrollHeight and fade in
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.opacity = '0';
            requestAnimationFrame(() => {
                mobileMenu.style.transition = 'max-height 0.35s ease, opacity 0.35s ease';
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
                mobileMenu.style.opacity = '1';
            });
        }
    });

    // Close menu when a mobile menu link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (menuBtn.getAttribute('aria-expanded') === 'true') {
                // Instantly hide the menu to prevent it from blocking the scroll
                mobileMenu.style.transition = 'none'; // Disable transition temporarily
                mobileMenu.style.maxHeight = '0';
                mobileMenu.style.opacity = '0';
                mobileMenu.hidden = true;
                menuBtn.setAttribute('aria-expanded', 'false');
                header.classList.remove('open');
            }
        });
    });

    // Close mobile menu on ESC key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') {
            menuBtn.click();
            menuBtn.focus();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Initialize particles.js on #particles-js
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
