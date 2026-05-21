import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, MapPin } from 'lucide-react';
import WeatherCard from './WeatherCard';
import { fetchWeatherData } from '../services/weatherApi';

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState('dark');
  const [unit, setUnit] = useState('celsius');
  const [recentSearches, setRecentSearches] = useState([]);

  // Initialize theme and recent searches
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      setTheme('light');
    }
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Update data-theme on document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  // Fetch geolocation on initial load
  useEffect(() => {
    handleGeolocation();
  }, []);

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      handleSearch('Tokyo'); // Fallback if browser doesn't support geolocation
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const data = await fetchWeatherData({ lat: latitude, lon: longitude });
          setWeatherData(data);
          setError(null);
        } catch (err) {
          setError(err.message);
          handleSearch('Tokyo'); // Fallback on error
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        // User denied geolocation or error occurred, use fallback
        console.warn("Geolocation denied or failed:", err.message);
        handleSearch('Tokyo');
      }
    );
  };

  const handleSearch = async (searchCity) => {
    const targetCity = searchCity || city;
    if (!targetCity || typeof targetCity !== 'string' || !targetCity.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(targetCity);
      setWeatherData(data);
      setCity('');
      
      // Update recent searches
      setRecentSearches(prev => {
        const newSearches = [data.name, ...prev.filter(s => s !== data.name)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(newSearches));
        return newSearches;
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      {/* Animated Background Orbs */}
      <div className="background-orbs">
        <div className="orb-1"></div>
        <div className="orb-2"></div>
      </div>

      {/* Top Controls */}
      <div className="top-controls">
        <button className="unit-toggle" onClick={toggleUnit} aria-label="Toggle unit">
          {unit === 'celsius' ? '°C' : '°F'}
        </button>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="dashboard-container animate-fade-in">
        <h1 className="app-title">Weather Forecast</h1>
        
        {/* Sleek Top Search Bar */}
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button className="location-button" onClick={handleGeolocation} title="Use Current Location">
            <MapPin size={20} />
          </button>
          <button className="search-button" onClick={() => handleSearch()} title="Search City">
            <Search size={20} />
          </button>
        </div>
        
        {recentSearches.length > 0 && (
          <div className="recent-searches animate-fade-in">
            {recentSearches.map((s, i) => (
              <button key={i} className="recent-search-tag" onClick={() => handleSearch(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        
        {loading && <div className="loading-spinner"></div>}
        
        {error && <div className="error-message">{error}</div>}
        
        {!loading && !error && weatherData && (
          <WeatherCard weatherData={weatherData} unit={unit} />
        )}

      </div>
    </>
  );
};

export default WeatherApp;
