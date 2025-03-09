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
            const description = `Discover the beautiful country of ${country.charAt(0).toUpperCase() + country.slice(1)}, a destination full of unique experiences, rich culture, and unforgettable landscapes. Plan your journey to explore its hidden gems and create lasting memories.`;
            countryDescriptionElement.textContent = description;
            localStorage.setItem('countryDescription', description);
        }
        
        // Fetch attractions from Unsplash API
        fetchAttractions(country);
        
        // Initialize map
        initMap(country);
    }
    
    // Functions
    async function fetchAttractions(country) {
        const attractionsGrid = document.getElementById('attractions-grid');
        
        if (!attractionsGrid) return;
        
        try {
            // Show loading state
            attractionsGrid.innerHTML = `
                <div class="loading-attractions">
                    <div class="loading-spinner"></div>
                    <p>Loading attractions...</p>
                </div>
            `;
            
            // Fetch images from Unsplash API
            const response = await fetch(`https://api.unsplash.com/search/photos?query=${country}+landmarks&per_page=12&client_id=SDSSqp5l6g2sUVKcLODwrHHJrs3shrLMiTrFkwl-j9M`);
            const data = await response.json();
            
            if (data.results && data.results.length > 0) {
                // Clear loading state
                attractionsGrid.innerHTML = '';
                
                // Create attraction cards
                data.results.forEach(image => {
                    const card = document.createElement('div');
                    card.className = 'attraction-card';
                    
                    const locationName = (image.location && image.location.title) ? 
                        image.location.title : 
                        (image.alt_description || `${country.charAt(0).toUpperCase() + country.slice(1)} Attraction`);
                    
                    card.innerHTML = `
                        <div class="attraction-image">
                            <img src="${image.urls.regular}" alt="${image.alt_description || 'Travel attraction'}" loading="lazy">
                        </div>
                        <div class="attraction-info">
                            <h3>${locationName}</h3>
                        </div>
                    `;
                    
                    attractionsGrid.appendChild(card);
                });
            } else {
                // No results found
                attractionsGrid.innerHTML = `
                    <div class="no-results">
                        <p>No attractions found for ${country}. Please try another search.</p>
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
        }
    }
    
    async function initMap(country) {
        const mapElement = document.getElementById('map');
        
        if (mapElement) {
            // Clear existing map if any
            if (mapElement._leaflet_id) {
                mapElement._leaflet_id = null;
                mapElement.innerHTML = '';
            }

            // Get country coordinates using MapTiler Geocoding API
            const countryCoordinates = await getCountryCoordinates(country);
            
            // Create map
            const map = L.map(mapElement).setView([countryCoordinates.lat, countryCoordinates.lng], 5);
            
            // Add MapTiler tiles
            L.tileLayer(`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=BtG8Dth703oBNnclxFn0`, {
                attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
            }).addTo(map);
            
            // Add marker for country
            L.marker([countryCoordinates.lat, countryCoordinates.lng]).addTo(map)
                .bindPopup(`${country.charAt(0).toUpperCase() + country.slice(1)}`)
                .openPopup();
        }
    }
    
    // Helper function to get country coordinates using MapTiler Geocoding API
    async function getCountryCoordinates(country) {
        const response = await fetch(`https://api.maptiler.com/geocoding/${country}.json?key=BtG8Dth703oBNnclxFn0`);
        const data = await response.json();
        
        if (data && data.features && data.features.length > 0) {
            const coordinates = data.features[0].center;
            return { lat: coordinates[1], lng: coordinates[0] };
        } else {
            // Default coordinates (Paris, France)
            return { lat: 48.8566, lng: 2.3522 };
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
                    localStorage.setItem('country', newCountry);

                    // Update map and attractions
                    initMap(newCountry);
                    fetchAttractions(newCountry);
                }
            }
        });
    }
});