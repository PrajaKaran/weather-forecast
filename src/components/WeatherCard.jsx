import React from 'react';
import { Droplets, Wind, Sun, Clock, CalendarDays, Activity } from 'lucide-react';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const { name, country, current, hourly, daily } = weatherData;
  const iconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@4x.png`;
  const smallIconUrl = (icon) => `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="bento-grid animate-fade-in">
      
      {/* 1. MAIN WEATHER TILE */}
      <div className="bento-card main-weather-tile">
        <div className="main-info">
          <h2 className="main-location">{name}, {country}</h2>
          <h1 className="main-temp">{current.temp}°</h1>
          <p className="main-desc">{current.desc}</p>
        </div>
        <img src={iconUrl(current.icon)} alt={current.desc} className="main-icon" />
      </div>

      {/* 2. DAILY FORECAST TILE */}
      <div className="bento-card daily-forecast-tile">
        <h3 className="section-title"><CalendarDays size={16} /> 7-Day Forecast</h3>
        <div className="daily-list">
          {daily.map((day, i) => (
            <div key={i} className="daily-item">
              <span className="daily-day">{i === 0 ? 'Today' : day.date}</span>
              <img src={smallIconUrl(day.icon)} alt="icon" className="daily-icon" />
              <div className="daily-temps">
                <span className="temp-min">{day.minTemp}°</span>
                <div className="temp-bar-container">
                  <div 
                    className="temp-bar" 
                    style={{ 
                      width: `${((day.maxTemp - day.minTemp) / 20) * 100}%`,
                      marginLeft: `${((day.minTemp + 10) / 40) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="temp-max">{day.maxTemp}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. HOURLY FORECAST TILE */}
      <div className="bento-card hourly-forecast-tile">
        <h3 className="section-title"><Clock size={16} /> Hourly Forecast</h3>
        <div className="hourly-container">
          {hourly.map((hour, i) => (
            <div key={i} className="hourly-item">
              <span className="hourly-time">{i === 0 ? 'Now' : hour.time.split(' ')[0]}</span>
              <img src={smallIconUrl(hour.icon)} alt="icon" className="hourly-icon" />
              <span className="hourly-temp">{hour.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. HUMIDITY METRIC */}
      <div className="bento-card metric-tile">
        <h3 className="section-title"><Droplets size={16} /> Humidity</h3>
        <div className="metric-value">{current.humidity}%</div>
        <div className="metric-sub">
          {current.humidity > 60 ? 'Sticky and muggy right now.' : 'Comfortable levels.'}
        </div>
      </div>

      {/* 5. WIND METRIC */}
      <div className="bento-card metric-tile">
        <h3 className="section-title"><Wind size={16} /> Wind</h3>
        <div className="metric-value">{current.windSpeed}</div>
        <div className="metric-sub">Meters per second</div>
      </div>

      {/* 6. UV INDEX METRIC */}
      <div className="bento-card metric-tile">
        <h3 className="section-title"><Sun size={16} /> UV Index</h3>
        <div className="metric-value">{Math.round(current.uvIndex)}</div>
        <div className="metric-sub">
          {current.uvIndex > 5 ? 'High risk. Wear SPF.' : 'Low risk level.'}
        </div>
      </div>

      {/* 7. PRESSURE METRIC */}
      <div className="bento-card metric-tile">
        <h3 className="section-title"><Activity size={16} /> Pressure</h3>
        <div className="metric-value">{current.pressure}</div>
        <div className="metric-sub">hPa</div>
      </div>

    </div>
  );
};

export default WeatherCard;
