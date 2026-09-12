document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links (native CSS usually handles this, but JS ensures it works cross-browser and with offset)
    const navLinks = document.querySelectorAll('.nav-links a, .nav-logo');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Console branding
    console.log('%c C2E Crew ', 'background: #000; color: #fff; font-size: 20px; padding: 10px;');
});
