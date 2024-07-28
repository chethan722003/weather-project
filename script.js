document.getElementById('city').addEventListener('input', function() {
    const city = this.value.trim();
    const suggestionsList = document.getElementById('suggestions');

    if (city.length > 2) {
        fetch(`http://api.geonames.org/searchJSON?name_startsWith=${city}&maxRows=5&username=mahesha`)
            .then(response => response.json())
            .then(data => {
                suggestionsList.innerHTML = '';
                if (data.geonames && data.geonames.length > 0) {
                    data.geonames.forEach(geoname => {
                        const li = document.createElement('li');
                        li.classList.add('list-group-item');
                        li.textContent = `${geoname.name}, ${geoname.countryName}`;
                        li.addEventListener('click', function() {
                            document.getElementById('city').value = geoname.name;
                            suggestionsList.innerHTML = '';
                        });
                        suggestionsList.appendChild(li);
                    });
                }
            })
            .catch(error => console.error('Error fetching city suggestions:', error));
    } else {
        suggestionsList.innerHTML = '';
    }
});

document.getElementById('weatherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const cityInput = document.getElementById('city');
    const city = cityInput.value.trim();
    const apiKey = '2c212ce513bcb9f2c93bcd8367a7edf8'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    // Clear any previous results
    const weatherResult = document.getElementById('weatherResult');
    weatherResult.innerHTML = '';

    // Validate input
    if (city === '') {
        alert('Please enter a city name.');
        return;
    }

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                weatherResult.innerHTML = `
                    <h2>${data.name}, ${data.sys.country}</h2>
                    <i class="wi wi-owm-${data.weather[0].id} weather-icon"></i>
                    <p class="weather-details">Temperature: ${data.main.temp}°C</p>
                    <p class="weather-details">Weather: ${data.weather[0].description}</p>
                    <p class="weather-details">Humidity: ${data.main.humidity}%</p>
                    <p class="weather-details">Wind Speed: ${data.wind.speed} m/s</p>
                `;
            } else {
                weatherResult.innerHTML = `<p>City not found. Please try again.</p>`;
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            weatherResult.innerHTML = `<p>Error fetching weather data. Please try again.</p>`;
        });
});

document.getElementById('darkModeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
});
