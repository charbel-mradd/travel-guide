# Travel Guide

## Overview

Travel Guide is a web application that helps users explore various travel destinations, find accommodations, and contact the support team. The application uses several external APIs and libraries to provide a rich user experience.

## Features

- Explore travel destinations with images from Unsplash
- Find accommodations and restaurants
- Contact form to send messages to the support team
- Dynamic background images using Unsplash API
- Show weather information using OpenWeather API
- FAQ section

## External Files and Libraries

- **Unsplash API**: Used to fetch images for travel destinations, accommodations, and restaurants.
- **Getform API**: Used to handle form submissions and send emails.
- **OpenWeather API**: Used to fetch and display weather information.
- **Font Awesome**: Used for icons throughout the application.
- **Flatpickr**: Used for date pickers in the booking form.

## APIs Used

### Unsplash API

- **Endpoint**: `https://api.unsplash.com`
- **Usage**: 
  - Fetch images for travel destinations in `explore.js`
  - Fetch images for accommodations and restaurants in `where.js`
  - Fetch random background images in `scripts.js`

### Getform API

- **Endpoint**: `https://getform.io/f/aejjmvgb`
- **Usage**: 
  - Handle form submissions in `contact.js`

### OpenWeather API

- **Endpoint**: `https://api.openweathermap.org`
- **Usage**: 
  - Fetch and display weather information in `where.js`

## File Structure

- `index.html`: The main landing page of the application.
- `explore.html`: The page to explore travel destinations.
- `where.html`: The page to find accommodations and restaurants.
- `contact.html`: The contact page with a form to send messages.
- `styles.css`: The main stylesheet for the application.
- `scripts.js`: The main JavaScript file for dynamic functionalities.
- `explore.js`: JavaScript file for the explore page functionalities.
- `where.js`: JavaScript file for the where to stay page functionalities.
- `contact.js`: JavaScript file for the contact page functionalities.

## Detailed Usage

### `index.html`

- Includes the main structure of the landing page.
- Links to `styles.css` for styling and `scripts.js` for dynamic functionalities.

### `explore.html`

- Includes the structure for exploring travel destinations.
- Links to `styles.css` for styling and `explore.js` for fetching and displaying travel destination images using the Unsplash API.

### `where.html`

- Includes the structure for finding accommodations and restaurants.
- Links to `styles.css` for styling and `where.js` for fetching and displaying accommodations and restaurant images using the Unsplash API.
- Fetches and displays weather information using the OpenWeather API.

### `contact.html`

- Includes the structure for the contact form.
- Links to `styles.css` for styling and `contact.js` for handling form submissions using the Getform API.

### `styles.css`

- Contains the main styles for the application.
- Includes styles for the hero section, parallax background, and other components.

### `scripts.js`

- Contains JavaScript code for dynamic functionalities.
- Fetches random background images from the Unsplash API and sets them as the background image.

### `explore.js`

- Fetches images for travel destinations from the Unsplash API.
- Displays the fetched images on the explore page.

### `where.js`

- Fetches images for accommodations and restaurants from the Unsplash API.
- Displays the fetched images on the where to stay page.
- Fetches and displays weather information using the OpenWeather API.

### `contact.js`

- Handles form submissions using the Getform API.
- Validates form inputs and displays success or error messages based on the response.

