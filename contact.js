document.addEventListener('DOMContentLoaded', function() {
    // Contact form validation and submission
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            
            // Validate form
            let isValid = true;
            
            const name = formData.get('name').trim();
            const email = formData.get('email').trim();
            const subject = formData.get('subject').trim();
            const message = formData.get('message').trim();
            
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
                
                try {
                    // Send email using Getform
                    const response = await fetch('https://getform.io/f/aejjmvgb', {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        // Show success message
                        alert("Message sent successfully! Thank you for reaching out.");
                        contactForm.reset();
                    } else {
                        alert("Failed to send the message. Please try again later.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert("An error occurred. Please try again.");
                } finally {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
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