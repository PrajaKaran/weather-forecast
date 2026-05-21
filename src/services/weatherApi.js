import axios from 'axios';

// Weather code mapping
const getWeatherDescription = (code) => {
  const codes = {
    0: { desc: 'Clear Sky', icon: '01d' },
    1: { desc: 'Mainly Clear', icon: '02d' },
    2: { desc: 'Partly Cloudy', icon: '03d' },
    3: { desc: 'Overcast', icon: '04d' },
    45: { desc: 'Fog', icon: '50d' },
    48: { desc: 'Rime Fog', icon: '50d' },
    51: { desc: 'Light Drizzle', icon: '09d' },
    53: { desc: 'Moderate Drizzle', icon: '09d' },
    55: { desc: 'Dense Drizzle', icon: '09d' },
    56: { desc: 'Light Freezing Drizzle', icon: '09d' },
    57: { desc: 'Dense Freezing Drizzle', icon: '09d' },
    61: { desc: 'Slight Rain', icon: '10d' },
    63: { desc: 'Moderate Rain', icon: '10d' },
    65: { desc: 'Heavy Rain', icon: '10d' },
    66: { desc: 'Light Freezing Rain', icon: '13d' },
    67: { desc: 'Heavy Freezing Rain', icon: '13d' },
    71: { desc: 'Slight Snow', icon: '13d' },
    73: { desc: 'Moderate Snow', icon: '13d' },
    75: { desc: 'Heavy Snow', icon: '13d' },
    77: { desc: 'Snow Grains', icon: '13d' },
    80: { desc: 'Slight Rain Showers', icon: '09d' },
    81: { desc: 'Moderate Rain Showers', icon: '09d' },
    82: { desc: 'Violent Rain Showers', icon: '09d' },
    85: { desc: 'Slight Snow Showers', icon: '13d' },
    86: { desc: 'Heavy Snow Showers', icon: '13d' },
    95: { desc: 'Thunderstorm', icon: '11d' },
    96: { desc: 'Thunderstorm & Hail', icon: '11d' },
    99: { desc: 'Thunderstorm & Heavy Hail', icon: '11d' }
  };
  return codes[code] || { desc: 'Unknown', icon: '03d' };
};

export const fetchWeatherData = async (query) => {
  try {
    let location = {};

    // Check if query is coordinates or a city string
    if (typeof query === 'object' && query.lat && query.lon) {
      // Use coordinates directly, fetch city name via reverse geocoding if possible, or just use coords
      const geoResponse = await axios.get('https://api.bigdatacloud.net/data/reverse-geocode-client', {
        params: { latitude: query.lat, longitude: query.lon, localityLanguage: 'en' }
      });
      location = {
        latitude: query.lat,
        longitude: query.lon,
        name: geoResponse.data.city || geoResponse.data.locality || 'Current Location',
        country_code: geoResponse.data.countryCode || ''
      };
    } else {
      // It's a city string, use normal geocoding
      const geoResponse = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
        params: { name: query, count: 1, language: 'en', format: 'json' }
      });

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        throw new Error("City not found. Please try another search.");
      }
      location = geoResponse.data.results[0];
    }

    // Fetch weather using coordinates
    const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,uv_index',
        hourly: 'temperature_2m,weather_code',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
        timezone: 'auto'
      }
    });

    const data = weatherResponse.data;
    const currentInfo = getWeatherDescription(data.current.weather_code);

    // Format Hourly data (next 24 hours)
    const currentHourIndex = new Date().getHours();
    const hourlyData = data.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time, index) => ({
      time: new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: Math.round(data.hourly.temperature_2m[currentHourIndex + index]),
      icon: getWeatherDescription(data.hourly.weather_code[currentHourIndex + index]).icon
    }));

    // Format Daily data (7 days)
    const dailyData = data.daily.time.map((date, index) => ({
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      maxTemp: Math.round(data.daily.temperature_2m_max[index]),
      minTemp: Math.round(data.daily.temperature_2m_min[index]),
      icon: getWeatherDescription(data.daily.weather_code[index]).icon
    }));

    return {
      name: location.name,
      country: location.country_code,
      current: {
        temp: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: (data.current.wind_speed_10m / 3.6).toFixed(1),
        pressure: data.current.pressure_msl,
        uvIndex: data.current.uv_index,
        desc: currentInfo.desc,
        icon: currentInfo.icon
      },
      hourly: hourlyData,
      daily: dailyData
    };
  } catch (error) {
    if (error.message.includes("City not found")) throw error;
    throw new Error("Failed to fetch advanced weather data.");
  }
};
