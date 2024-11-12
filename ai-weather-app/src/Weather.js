import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import WeatherIcon from "./components/WeatherIcon"; // Ensure the path is correct
import ForecastDay from "./components/ForecastDay"; // Ensure the path is correct

const Weather = ({ defaultCity }) => {
  const [weatherData, setWeatherData] = useState({ ready: false });
  const [city, setCity] = useState(defaultCity);
  const [searchInput, setSearchInput] = useState(defaultCity); // Separate state for input
  const [error, setError] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  const showTemperature = (response) => {
    console.log('API response:', response);
    const weather = response.data.weather;
    const aiInsight = response.data.aiInsight;
    const forecast = response.data.forecast.slice(0, 5);

    setWeatherData({
      ready: true,
      coordinates: weather.coord,
      temperature: weather.main.temp,
      feelsLike: weather.main.feels_like,
      tempMin: weather.main.temp_min,
      tempMax: weather.main.temp_max,
      humidity: weather.main.humidity,
      city: weather.name,
      description: weather.weather[0].description,
      wind: weather.wind.speed,
      icon: weather.weather[0].icon,
      date: new Date(weather.dt * 1000),
      aiInsight: aiInsight,
    });

    setWeeklyForecast(forecast);
  };

  const search = useCallback(() => {
    if (city) {
      const url = `/.netlify/functions/getWeather?location=${city}`;
      axios.get(url)
        .then(showTemperature)
        .catch((error) => {
          setError('Failed to fetch weather data');
          console.error('API call error:', error);
        });
    }
  }, [city]);

  useEffect(() => {
    search();
  }, [search]);

  const handleSearch = (event) => {
    event.preventDefault();
    setCity(searchInput); // Set the actual search city only on submit
  };

  const updateSearchInput = (event) => {
    setSearchInput(event.target.value); // Update the local input state
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (weatherData.ready) {
    return (
      <div className="weather-app">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchInput}
            onChange={updateSearchInput} // Update searchInput only, not city
            placeholder="Enter location"
          />
          <button type="submit">Search</button>
        </form>
        <div className="weather-card">
          <h2>{weatherData.city}</h2>
          <div className="weather-info">
            <div>
            <WeatherIcon description={weatherData.description} /> {/* Main weather icon */}
              <p>{weatherData.temperature}°F</p>
              <p>{weatherData.description}</p>
            </div>
          </div>
          <div className="ai-insight">
            <h3>AI Weather Insight</h3>
            <p>{weatherData.aiInsight}</p>
          </div>
          <div className="weekly-forecast">
            <h3>Weekly Forecast</h3>
            {Array.isArray(weeklyForecast) && weeklyForecast.length > 0 ? (
              weeklyForecast.map((day, index) => (
                <ForecastDay key={index} data={day} />
              ))
            ) : (
              <p>No forecast data available.</p>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return "Loading...";
  }
};

export default Weather;
