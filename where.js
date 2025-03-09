document.addEventListener('DOMContentLoaded', function() {
    // Get country from URL parameter or local storage
    const urlParams = new URLSearchParams(window.location.search);
    let country = urlParams.get('country') || localStorage.getItem('selectedCountry');
    
    if (country) {
        // Save country to local storage
        localStorage.setItem('selectedCountry', country);

        // Update page title
        const countryNameElement = document.getElementById('country-name');
        
        if (countryNameElement) {
            countryNameElement.innerHTML = `Where to Stay in <span>${country.charAt(0).toUpperCase() + country.slice(1)}</span>`;
        }
        
        // Fetch weather data
        fetchWeather(country);
        
        // Fetch accommodations and restaurants
        fetchAccommodations(country);
        fetchRestaurants(country);
    } else {
        // Retrieve data from local storage if available
        const savedCountry = localStorage.getItem('selectedCountry');
        const savedWeather = localStorage.getItem('weatherData');
        const savedAccommodations = localStorage.getItem('accommodationsData');
        const savedRestaurants = localStorage.getItem('restaurantsData');

        if (savedCountry) {
            country = savedCountry;
            if (countryNameElement) {
                countryNameElement.innerHTML = `Where to Stay in <span>${country.charAt(0).toUpperCase() + country.slice(1)}</span>`;
            }
        }

        if (savedWeather) {
            document.getElementById('weather-widget').innerHTML = savedWeather;
        }

        if (savedAccommodations) {
            document.getElementById('accommodations-grid').innerHTML = savedAccommodations;
        }

        if (savedRestaurants) {
            document.getElementById('restaurants-grid').innerHTML = savedRestaurants;
        }
    }
    
    // Initialize date pickers
    const datepickers = document.querySelectorAll('.datepicker');
    
    if (window.flatpickr) {
        datepickers.forEach(datepicker => {
            flatpickr(datepicker, {
                minDate: 'today',
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'F j, Y',
                disableMobile: true
            });
        });
    }
    
    // Booking search form
    const bookingSearchForm = document.getElementById('booking-search-form');
    
    if (bookingSearchForm) {
        bookingSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;
            const accommodationType = document.getElementById('accommodation-type').value;
            
            // Filter accommodations based on form values
            filterAccommodations(checkIn, checkOut, guests, accommodationType);
        });
    }
    
    // Sort and filter controls
    const sortBySelect = document.getElementById('sort-by');
    const priceRangeSelect = document.getElementById('price-range');
    const restaurantSortSelect = document.getElementById('restaurant-sort');
    const cuisineTypeSelect = document.getElementById('cuisine-type');
    
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            sortAccommodations(this.value);
        });
    }
    
    if (priceRangeSelect) {
        priceRangeSelect.addEventListener('change', function() {
            filterAccommodationsByPrice(this.value);
        });
    }
    
    if (restaurantSortSelect) {
        restaurantSortSelect.addEventListener('change', function() {
            sortRestaurants(this.value);
        });
    }
    
    if (cuisineTypeSelect) {
        cuisineTypeSelect.addEventListener('change', function() {
            filterRestaurantsByCuisine(this.value);
        });
    }
    
    // Booking modal
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (bookingModal && closeModalBtn) {
        // Close modal when clicking the close button
        closeModalBtn.addEventListener('click', function() {
            bookingModal.classList.remove('active');
        });
        
        // Close modal when clicking outside the content
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
            }
        });
        
        // Booking form submission
        const bookingForm = document.getElementById('booking-form');
        
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show success message
                const modalContent = bookingModal.querySelector('.modal-content');
                modalContent.innerHTML = `
                    <div class="booking-success">
                        <i class="fas fa-check-circle"></i>
                        <h2>Booking Confirmed!</h2>
                        <p>Thank you for your booking. We've sent a confirmation email with all the details.</p>
                        <button class="btn" id="close-success">Close</button>
                    </div>
                `;
                
                // Close modal when clicking the close button
                document.getElementById('close-success').addEventListener('click', function() {
                    bookingModal.classList.remove('active');
                });
            });
        }
    }

    // Event listener for country search
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                const newCountry = searchInput.value.trim().toLowerCase();
                if (newCountry) {
                    // Update URL parameter
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('country', newCountry);
                    window.history.pushState({}, '', newUrl);

                    // Save new country to local storage
                    localStorage.setItem('selectedCountry', newCountry);

                    // Update page title
                    if (countryNameElement) {
                        countryNameElement.innerHTML = `Where to Stay in <span>${newCountry.charAt(0).toUpperCase() + newCountry.slice(1)}</span>`;
                    }

                    // Update weather, accommodations, and restaurants
                    fetchWeather(newCountry);
                    fetchAccommodations(newCountry);
                    fetchRestaurants(newCountry);
                }
            }
        });
    }
});

// Functions
async function fetchWeather(city) {
    const weatherWidget = document.getElementById('weather-widget');
    
    if (!weatherWidget) return;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f43a94db3bb97a18d8b3cce9c542e8dc`);
        const data = await response.json();
        
        if (data.cod === 200) {
            // Format weather data
            const temperature = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const cityName = data.name;
            
            // Update weather widget
            const weatherHTML = `
                <div class="weather-info">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
                    <div class="weather-details">
                        <h3>${cityName}</h3>
                        <div class="weather-temp">${temperature}°C</div>
                        <div class="weather-desc">${description}</div>
                    </div>
                </div>
            `;
            weatherWidget.innerHTML = weatherHTML;

            // Save weather data to local storage
            localStorage.setItem('weatherData', weatherHTML);
        } else {
            // Show error message
            weatherWidget.innerHTML = `
                <div class="weather-error">
                    <p>Weather information not available for ${city}.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Show error message
        weatherWidget.innerHTML = `
            <div class="weather-error">
                <p>Failed to load weather information. Please try again later.</p>
            </div>
        `;
    }
}

async function fetchAccommodations(country) {
    const accommodationsGrid = document.getElementById('accommodations-grid');
    
    if (!accommodationsGrid) return;
    
    try {
        // Show loading state
        accommodationsGrid.innerHTML = `
            <div class="loading-accommodations">
                <div class="loading-spinner"></div>
                <p>Loading accommodations...</p>
            </div>
        `;
        
        // Fetch images from Unsplash API for accommodations
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${country}+hotel+accommodation&per_page=9&client_id=SDSSqp5l6g2sUVKcLODwrHHJrs3shrLMiTrFkwl-j9M`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Clear loading state
            accommodationsGrid.innerHTML = '';
            
            // Accommodation types
            const types = ['Hotel', 'Resort', 'Apartment', 'Hostel'];
            
            // Price categories
            const priceCategories = ['budget', 'moderate', 'luxury'];
            
            // Accommodation names
            const accommodationNames = [
                'Grand Hotel',
                'Royal Palace',
                'Seaside Resort',
                'City View Apartments',
                'Mountain Retreat',
                'Riverside Lodge',
                'Central Hostel',
                'Luxury Suites',
                'Heritage Inn',
                'Ocean Breeze Resort',
                'Urban Stay',
                'Sunset Villas'
            ];
            
            // Create accommodation cards
            data.results.forEach((image, index) => {
                // Randomly assign type, price category, and rating
                const type = types[Math.floor(Math.random() * types.length)];
                const priceCategory = priceCategories[Math.floor(Math.random() * priceCategories.length)];
                const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
                
                // Generate price based on category
                let price;
                if (priceCategory === 'budget') {
                    price = Math.floor(Math.random() * 50) + 30; // $30-$80
                } else if (priceCategory === 'moderate') {
                    price = Math.floor(Math.random() * 100) + 80; // $80-$180
                } else {
                    price = Math.floor(Math.random() * 200) + 180; // $180-$380
                }
                
                // Get accommodation name
                const name = `${accommodationNames[index % accommodationNames.length]} ${type}`;
                
                // Create accommodation card
                const card = document.createElement('div');
                card.className = 'accommodation-card';
                card.setAttribute('data-type', type.toLowerCase());
                card.setAttribute('data-price-category', priceCategory);
                card.setAttribute('data-price', price);
                card.setAttribute('data-rating', rating);
                
                card.innerHTML = `
                    <div class="accommodation-image">
                        <img src="${image.urls.regular}" alt="${name}" loading="lazy">
                        <span class="price-category">${priceCategory.charAt(0).toUpperCase() + priceCategory.slice(1)}</span>
                    </div>
                    <div class="accommodation-info">
                        <h3>
                            ${name}
                            <span class="rating">
                                ${rating} <i class="fas fa-star"></i>
                            </span>
                        </h3>
                        <p>${type} in ${country.charAt(0).toUpperCase() + country.slice(1)} with excellent amenities and convenient location.</p>
                        <div class="accommodation-meta">
                            <span class="price">$${price} / night</span>
                            <button class="btn book-btn">Book Now</button>
                        </div>
                    </div>
                `;
                
                accommodationsGrid.appendChild(card);
                
                // Add event listener to book button
                const bookBtn = card.querySelector('.book-btn');
                bookBtn.addEventListener('click', function() {
                    openBookingModal(name, price, type);
                });
            });

            // Save accommodations data to local storage
            localStorage.setItem('accommodationsData', accommodationsGrid.innerHTML);
        } else {
            // No results found
            accommodationsGrid.innerHTML = `
                <div class="no-results">
                    <p>No accommodations found for ${country}. Please try another search.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        
        // Show error message
        accommodationsGrid.innerHTML = `
            <div class="error-message">
                <p>Failed to load accommodations. Please try again later.</p>
            </div>
        `;
    }
}

async function fetchRestaurants(country) {
    const restaurantsGrid = document.getElementById('restaurants-grid');
    
    if (!restaurantsGrid) return;
    
    try {
        // Show loading state
        restaurantsGrid.innerHTML = `
            <div class="loading-restaurants">
                <div class="loading-spinner"></div>
                <p>Loading restaurants...</p>
            </div>
        `;
        
        // Fetch images from Unsplash API for restaurants
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${country}+restaurant+food&per_page=9&client_id=SDSSqp5l6g2sUVKcLODwrHHJrs3shrLMiTrFkwl-j9M`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Clear loading state
            restaurantsGrid.innerHTML = '';
            
            // Cuisine types
            const cuisineTypes = ['Local', 'International', 'Vegetarian', 'Seafood', 'Italian', 'Asian', 'Mediterranean'];
            
            // Price categories
            const priceCategories = ['budget', 'moderate', 'luxury'];
            
            // Restaurant names
            const restaurantNames = [
                'The Golden Spoon',
                'Ocean View',
                'Taste of',
                'La Bella',
                'The Hungry',
                'Spice Garden',
                'Blue Lagoon',
                'Green Plate',
                'Royal Feast',
                'Sunset Dining',
                'Urban Bites',
                'Flavor House'
            ];
            
            // Create restaurant cards
            data.results.forEach((image, index) => {
                // Randomly assign cuisine type, price category, and rating
                const cuisineType = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
                const priceCategory = priceCategories[Math.floor(Math.random() * priceCategories.length)];
                const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
                
                // Generate price indicator based on category
                let priceIndicator;
                if (priceCategory === 'budget') {
                    priceIndicator = '$';
                } else if (priceCategory === 'moderate') {
                    priceIndicator = '$$';
                } else {
                    priceIndicator = '$$$';
                }
                
                // Get restaurant name
                const name = `${restaurantNames[index % restaurantNames.length]} ${cuisineType}`;
                
                // Create restaurant card
                const card = document.createElement('div');
                card.className = 'restaurant-card';
                card.setAttribute('data-cuisine', cuisineType.toLowerCase());
                card.setAttribute('data-price-category', priceCategory);
                card.setAttribute('data-rating', rating);
                
                card.innerHTML = `
                    <div class="restaurant-image">
                        <img src="${image.urls.regular}" alt="${name}" loading="lazy">
                        <span class="price-category">${priceIndicator}</span>
                    </div>
                    <div class="restaurant-info">
                        <h3>
                            ${name}
                            <span class="rating">
                                ${rating} <i class="fas fa-star"></i>
                            </span>
                        </h3>
                        <p>${cuisineType} cuisine in ${country.charAt(0).toUpperCase() + country.slice(1)} with a delightful ambiance and delicious food.</p>
                        <div class="restaurant-meta">
                            <span class="price">${priceIndicator}</span>
                            <button class="btn book-btn">Book Now</button>
                        </div>
                    </div>
                `;
                
                restaurantsGrid.appendChild(card);
                
                // Add event listener to book button
                const bookBtn = card.querySelector('.book-btn');
                bookBtn.addEventListener('click', function() {
                    openBookingModal(name, priceIndicator, cuisineType);
                });
            });

            // Save restaurants data to local storage
            localStorage.setItem('restaurantsData', restaurantsGrid.innerHTML);
        } else {
            // No results found
            restaurantsGrid.innerHTML = `
                <div class="no-results">
                    <p>No restaurants found for ${country}. Please try another search.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        
        // Show error message
        restaurantsGrid.innerHTML = `
            <div class="error-message">
                <p>Failed to load restaurants. Please try again later.</p>
            </div>
        `;
    }
}

// Filter accommodations based on search form values
function filterAccommodations(checkIn, checkOut, guests, accommodationType) {
    const accommodationCards = document.querySelectorAll('.accommodation-card');
    
    accommodationCards.forEach(card => {
        const type = card.getAttribute('data-type');
        
        // Check if accommodation type matches
        const matchesType = accommodationType === 'all' || type === accommodationType;
        
        // Show or hide card based on filters
        if (matchesType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort accommodations by price or rating
function sortAccommodations(sortBy) {
    const accommodationsGrid = document.getElementById('accommodations-grid');
    const accommodationCards = Array.from(document.querySelectorAll('.accommodation-card'));
    
    if (!accommodationsGrid || accommodationCards.length === 0) return;
    
    // Sort cards based on selected option
    accommodationCards.sort((a, b) => {
        if (sortBy === 'price-low-high') {
            return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
        } else if (sortBy === 'price-high-low') {
            return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
        } else if (sortBy === 'rating-high-low') {
            return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
        } else if (sortBy === 'rating-low-high') {
            return parseFloat(a.getAttribute('data-rating')) - parseFloat(b.getAttribute('data-rating'));
        }
    });
    
    // Clear existing cards
    accommodationsGrid.innerHTML = '';
    
    // Append sorted cards
    accommodationCards.forEach(card => {
        accommodationsGrid.appendChild(card);
    });
}

// Sort accommodations by price or rating
function sortAccommodations(sortBy) {
    const accommodationsGrid = document.getElementById('accommodations-grid');
    const accommodationCards = Array.from(document.querySelectorAll('.accommodation-card'));
    
    if (!accommodationsGrid || accommodationCards.length === 0) return;
    
    // Sort cards based on selected option
   document.addEventListener('DOMContentLoaded', function() {
    // Get country from URL parameter or local storage
    const urlParams = new URLSearchParams(window.location.search);
    let country = urlParams.get('country') || localStorage.getItem('selectedCountry');
    
    if (country) {
        // Save country to local storage
        localStorage.setItem('selectedCountry', country);

        // Update page title
        const countryNameElement = document.getElementById('country-name');
        
        if (countryNameElement) {
            countryNameElement.innerHTML = `Where to Stay in <span>${country.charAt(0).toUpperCase() + country.slice(1)}</span>`;
        }
        
        // Fetch weather data
        fetchWeather(country);
        
        // Fetch accommodations and restaurants
        fetchAccommodations(country);
        fetchRestaurants(country);
    } else {
        // Retrieve data from local storage if available
        const savedCountry = localStorage.getItem('selectedCountry');
        const savedWeather = localStorage.getItem('weatherData');
        const savedAccommodations = localStorage.getItem('accommodationsData');
        const savedRestaurants = localStorage.getItem('restaurantsData');

        if (savedCountry) {
            country = savedCountry;
            if (countryNameElement) {
                countryNameElement.innerHTML = `Where to Stay in <span>${country.charAt(0).toUpperCase() + country.slice(1)}</span>`;
            }
        }

        if (savedWeather) {
            document.getElementById('weather-widget').innerHTML = savedWeather;
        }

        if (savedAccommodations) {
            document.getElementById('accommodations-grid').innerHTML = savedAccommodations;
        }

        if (savedRestaurants) {
            document.getElementById('restaurants-grid').innerHTML = savedRestaurants;
        }
    }
    
    // Initialize date pickers
    const datepickers = document.querySelectorAll('.datepicker');
    
    if (window.flatpickr) {
        datepickers.forEach(datepicker => {
            flatpickr(datepicker, {
                minDate: 'today',
                dateFormat: 'Y-m-d',
                altInput: true,
                altFormat: 'F j, Y',
                disableMobile: true
            });
        });
    }
    
    // Booking search form
    const bookingSearchForm = document.getElementById('booking-search-form');
    
    if (bookingSearchForm) {
        bookingSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const checkIn = document.getElementById('check-in').value;
            const checkOut = document.getElementById('check-out').value;
            const guests = document.getElementById('guests').value;
            const accommodationType = document.getElementById('accommodation-type').value;
            
            // Filter accommodations based on form values
            filterAccommodations(checkIn, checkOut, guests, accommodationType);
        });
    }
    
    // Sort and filter controls
    const sortBySelect = document.getElementById('sort-by');
    const priceRangeSelect = document.getElementById('price-range');
    const restaurantSortSelect = document.getElementById('restaurant-sort');
    const cuisineTypeSelect = document.getElementById('cuisine-type');
    
    if (sortBySelect) {
        sortBySelectEventListener('change', function() {
            sortAccommodations(this.value);
        });
    }
    
    if (priceRangeSelect) {
        priceRangeSelect.addEventListener('change', function() {
            filterAccommodationsByPrice(this.value);
        });
    }
    
    if (restaurantSortSelect) {
        restaurantSortSelect.addEventListener('change', function() {
            sortRestaurants(this.value);
        });
    }
    
    if (cuisineTypeSelect) {
        cuisineTypeSelect.addEventListener('change', function() {
            filterRestaurantsByCuisine(this.value);
        });
    }
    
    // Booking modal
    const bookingModal = document.getElementById('booking-modal');
    const closeModalBtn = document.getElementById('close-modal');
    
    if (bookingModal && closeModalBtn) {
        // Close modal when clicking the close button
        closeModalBtn.addEventListener('click', function() {
            bookingModal.classList.remove('active');
        });
        
        // Close modal when clicking outside the content
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                bookingModal.classList.remove('active');
            }
        });
        
        // Booking form submission
        const bookingForm = document.getElementById('booking-form');
        
        if (bookingForm) {
            bookingForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Show success message
                const modalContent = bookingModal.querySelector('.modal-content');
                modalContent.innerHTML = `
                    <div class="booking-success">
                        <i class="fas fa-check-circle"></i>
                        <h2>Booking Confirmed!</h2>
                        <p>Thank you for your booking. We've sent a confirmation email with all the details.</p>
                        <button class="btn" id="close-success">Close</button>
                    </div>
                `;
                
                // Close modal when clicking the close button
                document.getElementById('close-success').addEventListener('click', function() {
                    bookingModal.classList.remove('active');
                });
            });
        }
    }

    // Event listener for country search
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                const newCountry = searchInput.value.trim().toLowerCase();
                if (newCountry) {
                    // Update URL parameter
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('country', newCountry);
                    window.history.pushState({}, '', newUrl);

                    // Save new country to local storage
                    localStorage.setItem('selectedCountry', newCountry);

                    // Update page title
                    if (countryNameElement) {
                        countryNameElement.innerHTML = `Where to Stay in <span>${newCountry.charAt(0).toUpperCase() + newCountry.slice(1)}</span>`;
                    }

                    // Update weather, accommodations, and restaurants
                    fetchWeather(newCountry);
                    fetchAccommodations(newCountry);
                    fetchRestaurants(newCountry);
                }
            }
        });
    }
});

// Functions
async function fetchWeather(city) {
    const weatherWidget = document.getElementById('weather-widget');
    
    if (!weatherWidget) return;
    
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=f43a94db3bb97a18d8b3cce9c542e8dc`);
        const data = await response.json();
        
        if (data.cod === 200) {
            // Format weather data
            const temperature = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const icon = data.weather[0].icon;
            const cityName = data.name;
            
            // Update weather widget
            const weatherHTML = `
                <div class="weather-info">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}" class="weather-icon">
                    <div class="weather-details">
                        <h3>${cityName}</h3>
                        <div class="weather-temp">${temperature}°C</div>
                        <div class="weather-desc">${description}</div>
                    </div>
                </div>
            `;
            weatherWidget.innerHTML = weatherHTML;

            // Save weather data to local storage
            localStorage.setItem('weatherData', weatherHTML);
        } else {
            // Show error message
            weatherWidget.innerHTML = `
                <div class="weather-error">
                    <p>Weather information not available for ${city}.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        
        // Show error message
        weatherWidget.innerHTML = `
            <div class="weather-error">
                <p>Failed to load weather information. Please try again later.</p>
            </div>
        `;
    }
}

async function fetchAccommodations(country) {
    const accommodationsGrid = document.getElementById('accommodations-grid');
    
    if (!accommodationsGrid) return;
    
    try {
        // Show loading state
        accommodationsGrid.innerHTML = `
            <div class="loading-accommodations">
                <div class="loading-spinner"></div>
                <p>Loading accommodations...</p>
            </div>
        `;
        
        // Fetch images from Unsplash API for accommodations
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${country}+hotel+accommodation&per_page=9&client_id=SDSSqp5l6g2sUVKcLODwrHHJrs3shrLMiTrFkwl-j9M`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Clear loading state
            accommodationsGrid.innerHTML = '';
            
            // Accommodation types
            const types = ['Hotel', 'Resort', 'Apartment', 'Hostel'];
            
            // Price categories
            const priceCategories = ['budget', 'moderate', 'luxury'];
            
            // Accommodation names
            const accommodationNames = [
                'Grand Hotel',
                'Royal Palace',
                'Seaside Resort',
                'City View Apartments',
                'Mountain Retreat',
                'Riverside Lodge',
                'Central Hostel',
                'Luxury Suites',
                'Heritage Inn',
                'Ocean Breeze Resort',
                'Urban Stay',
                'Sunset Villas'
            ];
            
            // Create accommodation cards
            data.results.forEach((image, index) => {
                // Randomly assign type, price category, and rating
                const type = types[Math.floor(Math.random() * types.length)];
                const priceCategory = priceCategories[Math.floor(Math.random() * priceCategories.length)];
                const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
                
                // Generate price based on category
                let price;
                if (priceCategory === 'budget') {
                    price = Math.floor(Math.random() * 50) + 30; // $30-$80
                } else if (priceCategory === 'moderate') {
                    price = Math.floor(Math.random() * 100) + 80; // $80-$180
                } else {
                    price = Math.floor(Math.random() * 200) + 180; // $180-$380
                }
                
                // Get accommodation name
                const name = `${accommodationNames[index % accommodationNames.length]} ${type}`;
                
                // Create accommodation card
                const card = document.createElement('div');
                card.className = 'accommodation-card';
                card.setAttribute('data-type', type.toLowerCase());
                card.setAttribute('data-price-category', priceCategory);
                card.setAttribute('data-price', price);
                card.setAttribute('data-rating', rating);
                
                card.innerHTML = `
                    <div class="accommodation-image">
                        <img src="${image.urls.regular}" alt="${name}" loading="lazy">
                        <span class="price-category">${priceCategory.charAt(0).toUpperCase() + priceCategory.slice(1)}</span>
                    </div>
                    <div class="accommodation-info">
                        <h3>
                            ${name}
                            <span class="rating">
                                ${rating} <i class="fas fa-star"></i>
                            </span>
                        </h3>
                        <p>${type} in ${country.charAt(0).toUpperCase() + country.slice(1)} with excellent amenities and convenient location.</p>
                        <div class="accommodation-meta">
                            <span class="price">$${price} / night</span>
                            <button class="btn book-btn">Book Now</button>
                        </div>
                    </div>
                `;
                
                accommodationsGrid.appendChild(card);
                
                // Add event listener to book button
                const bookBtn = card.querySelector('.book-btn');
                bookBtn.addEventListener('click', function() {
                    openBookingModal(name, price, type);
                });
            });

            // Save accommodations data to local storage
            localStorage.setItem('accommodationsData', accommodationsGrid.innerHTML);
        } else {
            // No results found
            accommodationsGrid.innerHTML = `
                <div class="no-results">
                    <p>No accommodations found for ${country}. Please try another search.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        
        // Show error message
        accommodationsGrid.innerHTML = `
            <div class="error-message">
                <p>Failed to load accommodations. Please try again later.</p>
            </div>
        `;
    }
}

async function fetchRestaurants(country) {
    const restaurantsGrid = document.getElementById('restaurants-grid');
    
    if (!restaurantsGrid) return;
    
    try {
        // Show loading state
        restaurantsGrid.innerHTML = `
            <div class="loading-restaurants">
                <div class="loading-spinner"></div>
                <p>Loading restaurants...</p>
            </div>
        `;
        
        // Fetch images from Unsplash API for restaurants
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${country}+restaurant+food&per_page=9&client_id=SDSSqp5l6g2sUVKcLODwrHHJrs3shrLMiTrFkwl-j9M`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            // Clear loading state
            restaurantsGrid.innerHTML = '';
            
            // Cuisine types
            const cuisineTypes = ['Local', 'International', 'Vegetarian', 'Seafood', 'Italian', 'Asian', 'Mediterranean'];
            
            // Price categories
            const priceCategories = ['budget', 'moderate', 'luxury'];
            
            // Restaurant names
            const restaurantNames = [
                'The Golden Spoon',
                'Ocean View',
                'Taste of',
                'La Bella',
                'The Hungry',
                'Spice Garden',
                'Blue Lagoon',
                'Green Plate',
                'Royal Feast',
                'Sunset Dining',
                'Urban Bites',
                'Flavor House'
            ];
            
            // Create restaurant cards
            data.results.forEach((image, index) => {
                // Randomly assign cuisine type, price category, and rating
                const cuisineType = cuisineTypes[Math.floor(Math.random() * cuisineTypes.length)];
                const priceCategory = priceCategories[Math.floor(Math.random() * priceCategories.length)];
                const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0 and 5.0
                
                // Generate price indicator based on category
                let priceIndicator;
                if (priceCategory === 'budget') {
                    priceIndicator = '$';
                } else if (priceCategory === 'moderate') {
                    priceIndicator = '$$';
                } else {
                    priceIndicator = '$$$';
                }
                
                // Get restaurant name
                const name = `${restaurantNames[index % restaurantNames.length]} ${cuisineType}`;
                
                // Create restaurant card
                const card = document.createElement('div');
                card.className = 'restaurant-card';
                card.setAttribute('data-cuisine', cuisineType.toLowerCase());
                card.setAttribute('data-price-category', priceCategory);
                card.setAttribute('data-rating', rating);
                
                card.innerHTML = `
                    <div class="restaurant-image">
                        <img src="${image.urls.regular}" alt="${name}" loading="lazy">
                        <span class="price-category">${priceIndicator}</span>
                    </div>
                    <div class="restaurant-info">
                        <h3>
                            ${name}
                            <span class="rating">
                                ${rating} <i class="fas fa-star"></i>
                            </span>
                        </h3>
                        <p>${cuisineType} cuisine in ${country.charAt(0).toUpperCase() + country.slice(1)} with a delightful ambiance and delicious food.</p>
                        <div class="restaurant-meta">
                            <span class="price">${priceIndicator}</span>
                            <button class="btn book-btn">Book Now</button>
                        </div>
                    </div>
                `;
                
                restaurantsGrid.appendChild(card);
                
                // Add event listener to book button
                const bookBtn = card.querySelector('.book-btn');
                bookBtn.addEventListener('click', function() {
                    openBookingModal(name, priceIndicator, cuisineType);
                });
            });

            // Save restaurants data to local storage
            localStorage.setItem('restaurantsData', restaurantsGrid.innerHTML);
        } else {
            // No results found
            restaurantsGrid.innerHTML = `
                <div class="no-results">
                    <p>No restaurants found for ${country}. Please try another search.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        
        // Show error message
        restaurantsGrid.innerHTML = `
            <div class="error-message">
                <p>Failed to load restaurants. Please try again later.</p>
            </div>
        `;
    }
}

// Filter accommodations based on search form values
function filterAccommodations(checkIn, checkOut, guests, accommodationType) {
    const accommodationCards = document.querySelectorAll('.accommodation-card');
    
    accommodationCards.forEach(card => {
        const type = card.getAttribute('data-type');
        
        // Check if accommodation type matches
        const matchesType = accommodationType === 'all' || type === accommodationType;
        
        // Show or hide card based on filters
        if (matchesType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}
function sortAccommodations(sortBy) {
    const accommodationsGrid = document.getElementById('accommodations-grid');
    const accommodationCards = Array.from(document.querySelectorAll('.accommodation-card'));
    
    if (!accommodationsGrid || accommodationCards.length === 0) return;
    
    // Sort cards based on selected option
    accommodationCards.sort((a, b) => {
        if (sortBy === 'price-low-high') {
            return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
        } else if (sortBy === 'price-high-low') {
            return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
        } else if (sortBy === 'rating-high-low') {
            return parseFloat(b.getAttribute('data-rating')) - parseFloat(a.getAttribute('data-rating'));
        } else if (sortBy === 'rating-low-high') {
            return parseFloat(a.getAttribute('data-rating')) - parseFloat(b.getAttribute('data-rating'));
        }
    });
    
    // Clear existing cards
    accommodationsGrid.innerHTML = '';
    
    // Append sorted cards
    accommodationCards.forEach(card => {
        accommodationsGrid.appendChild(card);
    });
}

// Filter accommodations based on search form values
function filterAccommodations(checkIn, checkOut, guests, accommodationType) {
    const accommodationCards = document.querySelectorAll('.accommodation-card');
    
    accommodationCards.forEach(card => {
        const type = card.getAttribute('data-type');
        
        // Check if accommodation type matches
        const matchesType = accommodationType === 'all' || type === accommodationType;
        
        // Show or hide card based on filters
        if (matchesType) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Event listener for country search
const searchForm = document.getElementById('search-form');
if (searchForm) {
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            const newCountry = searchInput.value.trim().toLowerCase();
            if (newCountry) {
                // Update URL parameter
                const newUrl = new URL(window.location.href);
                newUrl.searchParams.set('country', newCountry);
                window.history.pushState({}, '', newUrl);

                // Save new country to local storage
                localStorage.setItem('selectedCountry', newCountry);

                // Update page title
                const countryNameElement = document.getElementById('country-name');
                if (countryNameElement) {
                    countryNameElement.innerHTML = `Where to Stay in <span>${newCountry.charAt(0).toUpperCase() + newCountry.slice(1)}</span>`;
                }

                // Update weather, accommodations, and restaurants
                fetchWeather(newCountry);
                fetchAccommodations(newCountry);
                fetchRestaurants(newCountry);
            }
        }
    });
}};