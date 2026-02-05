document.addEventListener('DOMContentLoaded', () => {
    // Navigation Toggle for Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        
        // Animate links (optional, if you want staggered fade in)
    });

    // Close nav when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Smooth Scrolling (Polyfill if native not supported, though HTML {scroll-behavior: smooth} covers most)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // Offset for fixed header
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Animate sections on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Add fade-in class to sections for animation styling
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
        section.style.opacity = "0";
        section.style.transition = "opacity 0.8s ease-out, transform 0.8s ease-out";
        section.style.transform = "translateY(20px)";
    });

    // Helper to handle the actual class addition based on the observer above
    // Since I added inline styles above for initial state, I'll modify the loop slightly
    // to just handle the class logic cleanly if I were writing CSS for .fade-in.
    // Let's attach the specific logic here:
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        fadeInObserver.observe(section);
    });
});
