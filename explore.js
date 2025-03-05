document.addEventListener('DOMContentLoaded', function() {
    // Get country from URL parameter or local storage
    const urlParams = new URLSearchParams(window.location.search);
    let country = urlParams.get('country') || localStorage.getItem('country') || 'france'; // Default to France if no country specified
    
    if (country) {
        // Save country to local storage
        localStorage.setItem('country', country);

        // Update page title and description
        const countryNameElement = document.getElementById('country-name');
        const countryDescriptionElement = document.getElementById('country-description');
        
        if (countryNameElement) {
            countryNameElement.innerHTML = `Exploring <span>${country.charAt(0).toUpperCase() + country.slice(1)}</span>`;
        }
        
        if (countryDescriptionElement) {
            // Get country description from predefined list or generate a generic one
            const countryDescriptions = {
                'france': 'France, a country of rich history and cultural heritage, is renowned for its exquisite cuisine, world-class art, and iconic landmarks like the Eiffel Tower. From the romantic streets of Paris to the sun-drenched beaches of the French Riviera, France offers diverse experiences for every traveler.',
                'italy': 'Italy, the cradle of Renaissance art and Roman history, captivates visitors with its stunning architecture, world-famous cuisine, and passionate culture. From the ancient ruins of Rome to the canals of Venice and the rolling hills of Tuscany, Italy is a treasure trove of unforgettable experiences.',
                'japan': 'Japan seamlessly blends ancient traditions with cutting-edge technology. Experience the serenity of Buddhist temples, the excitement of modern Tokyo, and the beauty of cherry blossoms in spring. Japanese cuisine, art, and architecture create an unforgettable journey through this fascinating island nation.',
                'morocco': 'Morocco is a gateway to Africa, where vibrant colors, exotic scents, and rich traditions create an intoxicating atmosphere. From the bustling souks of Marrakech to the serene Sahara Desert and the rugged Atlas Mountains, Morocco offers a sensory adventure unlike any other destination.',
                'new zealand': 'New Zealand\'s dramatic landscapes encompass everything from pristine beaches and lush rainforests to active volcanoes and stunning glaciers. Home to the indigenous Māori culture and famous for its outdoor adventures, this island nation offers breathtaking natural beauty and warm hospitality.',
                'australia': 'Australia, the land down under, boasts diverse landscapes from the iconic Sydney Opera House to the vast Outback and the magnificent Great Barrier Reef. With its unique wildlife, laid-back cities, and stunning coastlines, Australia offers adventures for every type of traveler.',
                'brazil': 'Brazil pulses with energy, from the rhythm of samba and the excitement of Carnival to the roar of the Amazon and the thunder of Iguazu Falls. With its vibrant cities, pristine beaches, and incredible biodiversity, Brazil offers a colorful tapestry of experiences for adventurous travelers.'
            };
            
            const description = countryDescriptions[country.toLowerCase()] || 
                `Discover the beautiful country of ${country.charAt(0).toUpperCase() + country.slice(1)}, a destination full of unique experiences, rich culture, and unforgettable landscapes. Plan your journey to explore its hidden gems and create lasting memories.`;
            
            countryDescriptionElement.textContent = description;

            // Save description to local storage
            localStorage.setItem('countryDescription', description);
        }
        
        // Fetch attractions from Unsplash API
        fetchAttractions(country);
        
        // Initialize map
        initMap(country);
    }
    
    // Attraction search functionality
    const attractionSearch = document.getElementById('attraction-search');
    
    if (attractionSearch) {
        attractionSearch.addEventListener('input', function() {
            filterAttractions();
        });
    }
    
    // Category filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter attractions
            filterAttractions();
        });
    });
    
    // Slider functionality
    const sliderWrapper = document.getElementById('slider-wrapper');
    const prevButton = document.getElementById('prev-slide');
    const nextButton = document.getElementById('next-slide');
    
    if (sliderWrapper && prevButton && nextButton) {
        let slidePosition = 0;
        let slideWidth = 330; // Width of slide + margin
        let slidesToShow = Math.floor(sliderWrapper.parentElement.offsetWidth / slideWidth);
        let maxSlidePosition = 0;
        
        // Update slidesToShow on window resize
        window.addEventListener('resize', function() {
            slidesToShow = Math.floor(sliderWrapper.parentElement.offsetWidth / slideWidth);
            updateSliderControls();
        });
        
        prevButton.addEventListener('click', function() {
            if (slidePosition > 0) {
                slidePosition--;
                updateSliderPosition();
            }
        });
        
        nextButton.addEventListener('click', function() {
            if (slidePosition < maxSlidePosition) {
                slidePosition++;
                updateSliderPosition();
            }
        });
        
        function updateSliderPosition() {
            sliderWrapper.style.transform = `translateX(-${slidePosition * slideWidth}px)`;
            updateSliderControls();
        }
        
        function updateSliderControls() {
            prevButton.disabled = slidePosition === 0;
            nextButton.disabled = slidePosition >= maxSlidePosition;
            
            prevButton.style.opacity = prevButton.disabled ? '0.5' : '1';
            nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
        }
    }
    
    // Share buttons functionality
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            if (this.classList.contains('facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            } else if (this.classList.contains('twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            } else if (this.classList.contains('pinterest')) {
                const img = encodeURIComponent(document.querySelector('.attraction-image img')?.src || '');
                shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&media=${img}&description=${title}`;
            } else if (this.classList.contains('whatsapp')) {
                shareUrl = `https://api.whatsapp.com/send?text=${title} ${url}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
    
    // Functions
    async function fetchAttractions(country) {
        const attractionsGrid = document.getElementById('attractions-grid');
        const sliderWrapper = document.getElementById('slider-wrapper');
        
        if (!attractionsGrid || !sliderWrapper) return;
        
        try {
            // Show loading state
            attractionsGrid.innerHTML = `
                <div class="loading-attractions">
                    <div class="loading-spinner"></div>
                    <p>Loading attractions...</p>
                </div>
            `;
            
            // Fetch images from Unsplash API
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${country}+landmarks+travel+attractions&per_page=12&client_id=SDSSqp5l6g2sUVKcLODwrHHJrs3shrLMiTrFkwl-j9M`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Clear loading state
                attractionsGrid.innerHTML = '';
                
                // Categories for random assignment
                const categories = ['landmarks', 'nature', 'culture'];
                
                // Attraction descriptions
                const attractionDescriptions = [
                    'A must-visit destination with stunning views and rich history.',
                    'One of the most iconic landmarks in the region, attracting visitors from around the world.',
                    'Experience the local culture and traditions at this popular attraction.',
                    'A breathtaking natural wonder that showcases the country\'s diverse landscape.',
                    'Immerse yourself in the local heritage and architecture at this historic site.',
                    'A perfect spot for photography enthusiasts and nature lovers.',
                    'Discover the unique charm and beauty of this famous location.',
                    'An unforgettable experience that captures the essence of the country.',
                    'Explore the rich cultural significance and artistic value of this attraction.',
                    'A peaceful retreat surrounded by natural beauty and scenic views.',
                    'A fascinating blend of history and modern culture in one location.',
                    'Witness the architectural marvel and engineering excellence at this site.'
                ];
                
                // Create attraction cards
                data.results.forEach((image, index) => {
                    // Randomly assign a category
                    const category = categories[Math.floor(Math.random() * categories.length)];
                    
                    // Get a description
                    const description = attractionDescriptions[index % attractionDescriptions.length];
                    
                    // Create attraction card
                    const card = document.createElement('div');
                    card.className = `attraction-card ${category}`;
                    card.setAttribute('data-category', category);
                    
                    // Get location name from image data or create a generic one
                    const locationName = (image.location && image.location.title) ? 
                        image.location.title : 
                        (image.alt_description || `${country.charAt(0).toUpperCase() + country.slice(1)} Attraction`);
                    
                    card.innerHTML = `
                        <div class="attraction-image">
                            <img src="${image.urls.regular}" alt="${image.alt_description || 'Travel attraction'}" loading="lazy">
                            <span class="attraction-category">${category.charAt(0).toUpperCase() + category.slice(1)}</span>
                        </div>
                        <div class="attraction-info">
                            <h3>${locationName}</h3>
                            <p>${description}</p>
                            <div class="attraction-meta">
                                <span><i class="fas fa-map-marker-alt"></i> ${(image.location && image.location.name) ? image.location.name : country}</span>
                                <span><i class="fas fa-heart"></i> ${Math.floor(Math.random() * 500) + 100}</span>
                            </div>
                        </div>
                    `;
                    
                    attractionsGrid.appendChild(card);
                    
                    // Add to slider if it's one of the first 6 images
                    if (index < 6) {
                        const sliderItem = document.createElement('div');
                        sliderItem.className = 'slider-item';
                        
                        sliderItem.innerHTML = `
                            <div class="slider-image">
                                <img src="${image.urls.regular}" alt="${image.alt_description || 'Travel attraction'}" loading="lazy">
                            </div>
                            <div class="slider-info">
                                <h3>${locationName}</h3>
                                <p>${description.substring(0, 60)}...</p>
                            </div>
                        `;
                        
                        sliderWrapper.appendChild(sliderItem);
                    }
                });
                
                // Update slider controls
                if (sliderWrapper.children.length > 0) {
                    const slideWidth = 330; // Width of slide + margin
                    const slidesToShow = Math.floor(sliderWrapper.parentElement.offsetWidth / slideWidth);
                    const maxSlidePosition = Math.max(0, sliderWrapper.children.length - slidesToShow);
                    
                    // Store maxSlidePosition in a global variable
                    window.maxSlidePosition = maxSlidePosition;
                    
                    // Update slider controls
                    const prevButton = document.getElementById('prev-slide');
                    const nextButton = document.getElementById('next-slide');
                    
                    if (prevButton && nextButton) {
                        prevButton.disabled = true;
                        nextButton.disabled = maxSlidePosition === 0;
                        
                        prevButton.style.opacity = '0.5';
                        nextButton.style.opacity = nextButton.disabled ? '0.5' : '1';
                    }
                }
            } else {
                // No results found
                attractionsGrid.innerHTML = `
                    <div class="no-results">
                        <p>No attractions found for ${country}. Please try another search.</p>
                    </div>
                `;
                
                sliderWrapper.innerHTML = `
                    <div class="no-results">
                        <p>No featured attractions available.</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error fetching attractions:', error);
            
            // Show error message
            attractionsGrid.innerHTML = `
                <div class="error-message">
                    <p>Failed to load attractions. Please try again later.</p>
                </div>
            `;
            
            sliderWrapper.innerHTML = `
                <div class="error-message">
                    <p>Failed to load featured attractions.</p>
                </div>
            `;
        }
    }
    
    function filterAttractions() {
        const searchTerm = document.getElementById('attraction-search').value.toLowerCase();
        const activeCategory = document.querySelector('.filter-btn.active').getAttribute('data-filter');
        const attractionCards = document.querySelectorAll('.attraction-card');
        
        attractionCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            
            const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            
            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function initMap(country) {
        // This function initializes a Google Map
        const mapElement = document.getElementById('map');
        
        if (mapElement) {
            // Create a placeholder map with country name
            mapElement.innerHTML = `
                <div class="map-placeholder">
                    <p>Map of ${country.charAt(0).toUpperCase() + country.slice(1)} would be displayed here.</p>
                    <p>Using Google Maps API with key provided.</p>
                </div>
            `;
            
            // Style the placeholder
            const mapPlaceholder = mapElement.querySelector('.map-placeholder');
            if (mapPlaceholder) {
                mapPlaceholder.style.height = '100%';
                mapPlaceholder.style.display = 'flex';
                mapPlaceholder.style.flexDirection = 'column';
                mapPlaceholder.style.alignItems = 'center';
                mapPlaceholder.style.justifyContent = 'center';
                mapPlaceholder.style.backgroundColor = '#f0f0f0';
                mapPlaceholder.style.borderRadius = '8px';
                mapPlaceholder.style.padding = '20px';
                mapPlaceholder.style.textAlign = 'center';
            }
            
            // If you want to implement actual Google Maps functionality:
            try {
                // Check if Google Maps API is loaded
                if (window.google && window.google.maps) {
                    // Get country coordinates (simplified example)
                    const countryCoordinates = getCountryCoordinates(country);
                    
                    // Create map
                    const map = new google.maps.Map(mapElement, {
                        center: countryCoordinates,
                        zoom: 5,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        mapTypeControl: true,
                        scrollwheel: false,
                        draggable: true,
                        styles: [
                            {
                                featureType: "poi",
                                elementType: "labels",
                                stylers: [{ visibility: "off" }]
                            }
                        ]
                    });
                    
                    // Add marker for country
                    new google.maps.Marker({
                        position: countryCoordinates,
                        map: map,
                        title: country.charAt(0).toUpperCase() + country.slice(1),
                        animation: google.maps.Animation.DROP
                    });
                }
            } catch (error) {
                console.error('Error initializing Google Maps:', error);
            }
        }
    }
    
    // Helper function to get country coordinates
    function getCountryCoordinates(country) {
        // Default coordinates (Paris, France)
        let coordinates = { lat: 48.8566, lng: 2.3522 };
        
        // Country coordinates lookup
        const countryCoordinates = {
            'france': { lat: 46.603354, lng: 1.888334 },
            'italy': { lat: 41.8719, lng: 12.5674 },
            'japan': { lat: 36.2048, lng: 138.2529 },
            'morocco': { lat: 31.7917, lng: -7.0926 },
            'new zealand': { lat: -40.9006, lng: 174.8860 },
            'australia': { lat: -25.2744, lng: 133.7751 },
            'brazil': { lat: -14.2350, lng: -51.9253 }
        };
        
        // Return coordinates for the specified country or default to France
        return countryCoordinates[country.toLowerCase()] || coordinates;
    }
});