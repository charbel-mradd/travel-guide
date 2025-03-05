// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', function() {
    // Hide loader when page is loaded
    window.addEventListener('load', function() {
        const loader = document.querySelector('.loader');
        loader.classList.add('hidden');
    });

    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Dark mode toggle
    const themeToggle = document.querySelector('.theme-toggle');
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark-mode');
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-mode');
            
            // Save theme preference
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        });
    }

    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Header scroll effect
    const header = document.querySelector('header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Parallax effect for hero section
    const parallaxBg = document.querySelector('.parallax-bg');
    
    if (parallaxBg) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            parallaxBg.style.transform = `scale(1.1) translateY(${scrollPosition * 0.5}px)`;
        });
    }

  
    
     // Search form submission
const searchForm = document.getElementById('search-form');
        
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const countryInput = document.getElementById('country-search');
                const country = countryInput.value.trim();
                
                if (country) {
                    // Save country to local storage
                    localStorage.setItem('selectedCountry', country);
                    window.location.href = `explore.html?country=${encodeURIComponent(country)}`;
                }
            });
        }
    
        // Newsletter form submission
        const newsletterForm = document.getElementById('newsletter-form');
        
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (email) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'newsletter-success';
                    successMessage.textContent = 'Thank you for subscribing to our newsletter!';
                    
                    newsletterForm.innerHTML = '';
                    newsletterForm.appendChild(successMessage);
                    
                    // Save to local storage
                    const subscribers = JSON.parse(localStorage.getItem('subscribers') || '[]');
                    subscribers.push(email);
                    localStorage.setItem('subscribers', JSON.stringify(subscribers));
                }
            });
        }
    
        const destinationCards = document.querySelectorAll('.destination-card');
        
        destinationCards.forEach(card => {
            card.addEventListener('click', function() {
                const country = this.getAttribute('data-country');
                if (country) {
                    // Save country to local storage
                    localStorage.setItem('selectedCountry', country);
                    window.location.href = `explore.html?country=${encodeURIComponent(country)}`;
                }
            });
        });
    });