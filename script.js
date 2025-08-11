// Hamburger Menu Toggle
const hamburger = document.getElementById('hamburger');
const navbar = document.getElementById('navbar');

hamburger.addEventListener('click', () => {
    navbar.classList.toggle('active');
});

// Particles.js Init
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('Particles.js loaded!');
});
