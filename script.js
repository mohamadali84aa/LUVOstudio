document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = mobileMenu.querySelectorAll('a');

    // Toggles the mobile menu with smooth height and opacity animation
    menuBtn.addEventListener('click', () => {
        const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';

        if (isExpanded) {
            // Close menu with animation
            menuBtn.setAttribute('aria-expanded', 'false');
            mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
            requestAnimationFrame(() => {
                mobileMenu.style.transition = 'max-height 0.35s ease-in-out, opacity 0.35s ease-in-out, padding 0.35s ease-in-out';
                mobileMenu.style.maxHeight = '0';
                mobileMenu.style.opacity = '0';
                mobileMenu.style.padding = '0 1rem';
            });
            setTimeout(() => {
                mobileMenu.hidden = true;
                mobileMenu.style.transition = '';
            }, 350);
            header.classList.remove('open');
        } else {
            // Open menu with animation
            mobileMenu.hidden = false;
            menuBtn.setAttribute('aria-expanded', 'true');
            header.classList.add('open');
            mobileMenu.style.maxHeight = '0';
            mobileMenu.style.opacity = '0';
            requestAnimationFrame(() => {
                mobileMenu.style.transition = 'max-height 0.35s ease-in-out, opacity 0.35s ease-in-out, padding 0.35s ease-in-out';
                mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
                mobileMenu.style.opacity = '1';
                mobileMenu.style.padding = '1rem';
            });
        }
    });

    // Handle smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            // Prevent the default jump action
            e.preventDefault();

            // Store the target of the link
            const target = document.querySelector(anchor.getAttribute('href'));

            // Check if the menu is open (on mobile)
            if (menuBtn.getAttribute('aria-expanded') === 'true') {
                // Manually trigger the menu close animation
                menuBtn.click();

                // Wait for the animation to finish before scrolling
                setTimeout(() => {
                    if (target) {
                        target.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 350); // This delay should match your transition duration
            } else {
                // If the menu is not open (desktop), just smooth scroll immediately
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
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

    // Initialize particles.js on #particles-js
    if (typeof particlesJS !== 'undefined') {
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
