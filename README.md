# Wanderlust Project

## Project Overview
Wanderlust is a web application designed to help users explore and discover travel destinations, accommodations, and dining options around the world. The project includes several key features such as destination search, accommodation and restaurant listings, weather information, and interactive maps.

## File Structure
The project is organized into the following files:

- `index.html`: The main landing page of the application.
- `explore.html`: The page for exploring different travel destinations.
- `where.html`: The page for finding accommodations and dining options.
- `contact.html`: The page for contacting the Wanderlust team.
- `styles.css`: The main stylesheet for the application.
- `scripts.js`: The main JavaScript file for common functionalities.
- `explore.js`: JavaScript file specific to the explore page.
- `where.js`: JavaScript file specific to the where to stay page.
- `contact.js`: JavaScript file specific to the contact page.

## External Libraries and APIs
The project utilizes several external libraries and APIs:

### CSS Libraries
- [Google Fonts](https://fonts.googleapis.com): For custom fonts (Poppins).
- [Font Awesome](https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css): For icons.
- [Flatpickr](https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css): For date picker functionality.

### JavaScript Libraries
- [Flatpickr](https://cdn.jsdelivr.net/npm/flatpickr): For date picker functionality.
- [EmailJS](https://www.emailjs.com/): For sending emails from the contact page.

### APIs
- [Unsplash API](https://unsplash.com/developers): For fetching images of attractions.
- [Weather API](https://weatherapi.com): For fetching weather information.
- [Google Maps API](https://maps.googleapis.com/maps/api/js): For interactive maps.

## Key Features
### Home Page (`index.html`)
- Loader animation on page load.
- Mobile menu toggle.
- Dark mode toggle.
- Back to top button.
- Parallax effect for the hero section.
- Search form for entering a country name.
- Featured destinations and travel inspiration sections.
- Newsletter subscription form.

### Explore Page (`explore.html` and `explore.js`)
- Fetch and display country information based on URL parameters or local storage.
- Search functionality for attractions.
- Category filter buttons.
- Slider for featured attractions.
- Interactive map showing the selected country.
- Share buttons for social media.

### Where to Stay Page (`where.html` and `where.js`)
- Fetch and display accommodations and restaurants based on the selected country.
- Search form for booking accommodations.
- Sort and filter controls for accommodations and restaurants.
- Booking modal for making reservations.

### Contact Page (`contact.html` and `contact.js`)
- Contact form with validation and submission using EmailJS.
- FAQ section with accordion functionality.

## Installation and Setup
1. Clone the repository to your local machine.
2. Open the project directory and run a local server to view the application in your browser.
3. Ensure you have an internet connection to load external libraries and APIs.

## Usage
- Navigate to the home page to start exploring destinations.
- Use the search form to find specific countries.
- Explore different destinations, accommodations, and dining options.
- Contact the Wanderlust team through the contact page for any inquiries.

## Acknowledgements
- [Unsplash](https://unsplash.com) for providing images.
- [Google Maps](https://maps.google.com) for the interactive map functionality.
- [Font Awesome](https://fontawesome.com) for icons.
- [Flatpickr](https://flatpickr.js.org) for date picker functionality.
- [Weather API](https://weatherapi.com) for weather information.
- [EmailJS](https://www.emailjs.com/) for email functionality on the contact page.
