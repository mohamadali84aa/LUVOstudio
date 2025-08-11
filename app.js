/* ======= PARTICLES.JS CONFIG ======= */
particlesJS("particles-js", {
    particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: "#ffffff" },
        shape: { type: "circle" },
        opacity: { value: 0.7, random: false },
        size: { value: 3, random: true },
        line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.3,
            width: 1
        },
        move: { enable: true, speed: 2 }
    },
    interactivity: {
        detect_on: "canvas",
        events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: true, mode: "push" },
            resize: true
        },
        modes: {
            grab: { distance: 200, line_linked: { opacity: 0.6 } },
            push: { particles_nb: 4 }
        }
    },
    retina_detect: true
});

/* ======= CUSTOM CAMERA SHAPE INTERACTION ======= */
// This is a placeholder for a complex camera formation animation.
// A real implementation would involve mapping particle coordinates into a camera outline
// and smoothly tweening their positions using a physics engine or custom math.

document.addEventListener("click", function(e) {
    // Placeholder for smooth camera formation animation
    console.log("Camera shape animation trigger at:", e.clientX, e.clientY);
});

/* ======= HAMBURGER MENU ======= */
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    hamburger.classList.toggle("active");
});
