document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init('29WPjOVORhbZw8vAq'); //replacing with user-id

    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validate form
            let isValid = true;
            
            if (name === '') {
                showError('name', 'Please enter your name');
                isValid = false;
            } else {
                removeError('name');
            }
            
            if (email === '') {
                showError('email', 'Please enter your email');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError('email');
            }
            
            if (subject === '') {
                showError('subject', 'Please enter a subject');
                isValid = false;
            } else {
                removeError('subject');
            }
            
            if (message === '') {
                showError('message', 'Please enter your message');
                isValid = false;
            } else {
                removeError('message');
            }
            
            if (isValid) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Send email using EmailJS
                emailjs.send('service_zr6qco6', 'template_xjm6m6d', {
                    from_name: name,
                    from_email: email,
                    subject: subject,
                    message: message,
                    to_email: 'codebraver26@codebrave.org' // Replace with the recipient email
                }).then(function(response) {
                    // Show success message
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.innerHTML = '<i class="fas fa-check-circle"></i> Thank you for your message! We will get back to you soon.';
                    
                    contactForm.appendChild(successMessage);
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Remove success message after 5 seconds
                    setTimeout(function() {
                        successMessage.style.opacity = '0';
                        setTimeout(function() {
                            successMessage.remove();
                        }, 300);
                    }, 5000);
                    
                    // Save to local storage for demo purposes
                    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
                    messages.push({ name, email, subject, message, date: new Date().toISOString() });
                    localStorage.setItem('contactMessages', JSON.stringify(messages));
                    
                }, function(error) {
                    // Show error message
                    const errorMessage = document.createElement('div');
                    errorMessage.className = 'error-message';
                    errorMessage.innerHTML = '<i class="fas fa-exclamation-circle"></i> Failed to send message. Please try again later.';
                    
                    contactForm.appendChild(errorMessage);
                    
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Remove error message after 5 seconds
                    setTimeout(function() {
                        errorMessage.style.opacity = '0';
                        setTimeout(function() {
                            errorMessage.remove();
                        }, 300);
                    }, 5000);
                });
            }
        });
        
        // Form field animations
        const formFields = contactForm.querySelectorAll('input, textarea');
        
        formFields.forEach(field => {
            field.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            field.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
            
            // Check if field already has value on page load
            if (field.value !== '') {
                field.parentElement.classList.add('focused');
            }
        });
    }
    
    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Close other open FAQs
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current FAQ
            item.classList.toggle('active');
        });
    });
    
    // Helper functions
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.error-message') || document.createElement('div');
        
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        
        if (!field.parentElement.querySelector('.error-message')) {
            field.parentElement.appendChild(errorElement);
        }
        
        field.classList.add('error');
    }
    
    function removeError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = field.parentElement.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        field.classList.remove('error');
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});