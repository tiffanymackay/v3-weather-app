import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Weather = ({ defaultCity }) => {
  const [weatherData, setWeatherData] = useState({ ready: false });
  const [city, setCity] = useState(defaultCity);
  const [error, setError] = useState(null);
  const [weeklyForecast, setWeeklyForecast] = useState([]);

  const showTemperature = (response) => {
    const weather = response.data.weather;
    const aiInsight = response.data.aiInsight;
    const forecast = response.data.forecast;

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
    const url = `/.netlify/functions/getWeather?location=${city}`;
    axios.get(url)
      .then(showTemperature)
      .catch((error) => {
        setError('Failed to fetch weather data');
        console.error(error);
      });
  }, [city]);

  const handleSearch = (event) => {
    event.preventDefault();
    search();
  };

  const updateCity = (event) => {
    setCity(event.target.value);
  };

  const getWeatherIcon = (iconCode) => {
    const baseClass = "wu wu-white wu-64";
    switch (iconCode) {
      case 'chanceflurries':
        return <i className={`${baseClass} wu-chanceflurries`}></i>;
      case 'chancerain':
        return <i className={`${baseClass} wu-chancerain`}></i>;
      case 'chancesleet':
        return <i className={`${baseClass} wu-chancesleet`}></i>;
      case 'chancesnow':
        return <i className={`${baseClass} wu-chancesnow`}></i>;
      case 'chancetstorms':
        return <i className={`${baseClass} wu-chancetstorms`}></i>;
      case 'clear':
        return <i className={`${baseClass} wu-clear`}></i>;
      case 'cloudy':
        return <i className={`${baseClass} wu-cloudy`}></i>;
      case 'flurries':
        return <i className={`${baseClass} wu-flurries`}></i>;
      case 'fog':
        return <i className={`${baseClass} wu-fog`}></i>;
      case 'hazy':
        return <i className={`${baseClass} wu-hazy`}></i>;
      case 'mostlycloudy':
        return <i className={`${baseClass} wu-mostlycloudy`}></i>;
      case 'mostlysunny':
        return <i className={`${baseClass} wu-mostlysunny`}></i>;
      case 'partlycloudy':
        return <i className={`${baseClass} wu-partlycloudy`}></i>;
      case 'partlysunny':
        return <i className={`${baseClass} wu-partlysunny`}></i>;
      case 'rain':
        return <i className={`${baseClass} wu-rain`}></i>;
      case 'sleet':
        return <i className={`${baseClass} wu-sleet`}></i>;
      case 'snow':
        return <i className={`${baseClass} wu-snow`}></i>;
      case 'sunny':
        return <i className={`${baseClass} wu-sunny`}></i>;
      case 'tstorms':
        return <i className={`${baseClass} wu-tstorms`}></i>;
      case 'unknown':
      default:
        return <i className={`${baseClass} wu-unknown`}></i>; // Default icon
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (weatherData.ready) {
    return (
      <div className="weather-app">
        <form onSubmit={handleSearch}>
          <input type="text" value={city} onChange={updateCity} placeholder="Enter location" />
          <button type="submit">Search</button>
        </form>
        <div className="weather-card">
          <h2>{weatherData.city}</h2>
          <div className="weather-info">
            <div>
              <p>{weatherData.temperature}°F</p>
              <p>{weatherData.description}</p>
              {getWeatherIcon(weatherData.icon)}
            </div>
          </div>
          <div className="ai-insight">
            <h3>AI Weather Insight</h3>
            <p>{weatherData.aiInsight}</p>
          </div>
          <div className="weekly-forecast">
            <h3>Weekly Forecast</h3>
            {weeklyForecast.map((day, index) => (
              <div key={index} className="forecast-day">
                <p>{day.day}</p>
                <p>High: {day.high}°F</p>
                <p>Low: {day.low}°F</p>
                {getWeatherIcon(day.icon)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return "Loading...";
  }
};

export default Weather;
