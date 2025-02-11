import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { WeatherData } from './types';
import { Cloud, Droplets, Thermometer, Wind, Sunrise, Sunset, Gauge, Plane as Plant, MapPin } from 'lucide-react';

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (latitude: number, longitude: number) => {
      try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
        );
        setWeather(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch weather data');
        setLoading(false);
      }
    };

    const getLocationDetails = async (latitude: number, longitude: number) => {
      try {
        const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
        );
        
        if (response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0];
          const addressComponents = result.address_components;
          
          const getAddressComponent = (type: string) => {
            const component = addressComponents.find((comp: any) => 
              comp.types.includes(type)
            );
            return component ? component.long_name : '';
          };

          const detailedLocation = {
            street: getAddressComponent('route'),
            area: getAddressComponent('sublocality'),
            city: getAddressComponent('locality') || getAddressComponent('administrative_area_level_1'),
            country: getAddressComponent('country')
          };

          setWeather(prev => prev ? {
            ...prev,
            detailedLocation
          } : null);
        }
      } catch (err) {
        console.error('Failed to get location details:', err);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeather(latitude, longitude);
        getLocationDetails(latitude, longitude);
      },
      (err) => {
        setError('Failed to get location. Please enable location services.');
        setLoading(false);
      }
    );
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <p className="text-red-500">{error || 'Failed to load weather data'}</p>
        </div>
      </div>
    );
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-green-600 text-white p-6">
            <div className="flex items-center gap-2">
              <Plant className="h-8 w-8" />
              <h1 className="text-3xl font-bold">Agricultural Weather Dashboard</h1>
            </div>
            <div className="mt-4 flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xl font-semibold">
                  {weather.detailedLocation?.city || weather.name}
                </p>
                {weather.detailedLocation && (
                  <p className="text-sm text-green-100">
                    {[
                      weather.detailedLocation.street,
                      weather.detailedLocation.area,
                      weather.detailedLocation.city,
                      weather.detailedLocation.country
                    ].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Main Weather Info */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Temperature and Main Weather */}
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Thermometer className="text-green-600" />
                    <span className="text-4xl font-bold">{Math.round(weather.main.temp)}°C</span>
                  </div>
                  <p className="text-gray-600 mt-2">Feels like {Math.round(weather.main.feels_like)}°C</p>
                </div>
                <img 
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                  alt={weather.weather[0].description}
                  className="w-20 h-20"
                />
              </div>
              <p className="text-lg capitalize mt-2">{weather.weather[0].description}</p>
            </div>

            {/* Agricultural Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Droplets className="text-blue-600" />
                  <span className="text-lg">Humidity</span>
                </div>
                <p className="text-2xl font-semibold mt-2">{weather.main.humidity}%</p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Wind className="text-yellow-600" />
                  <span className="text-lg">Wind</span>
                </div>
                <p className="text-2xl font-semibold mt-2">{Math.round(weather.wind.speed * 3.6)} km/h</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Gauge className="text-purple-600" />
                  <span className="text-lg">Pressure</span>
                </div>
                <p className="text-2xl font-semibold mt-2">{weather.main.pressure} hPa</p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <Cloud className="text-orange-600" />
                  <span className="text-lg">Precipitation</span>
                </div>
                <p className="text-2xl font-semibold mt-2">
                  {weather.rain?.["1h"] ? `${weather.rain["1h"]} mm` : "0 mm"}
                </p>
              </div>
            </div>
          </div>

          {/* Sun Times */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex justify-around">
              <div className="flex items-center gap-2">
                <Sunrise className="text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Sunrise</p>
                  <p className="text-lg font-semibold">{formatTime(weather.sys.sunrise)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Sunset className="text-orange-600" />
                <div>
                  <p className="text-sm text-gray-600">Sunset</p>
                  <p className="text-lg font-semibold">{formatTime(weather.sys.sunset)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Agricultural Advisory */}
          <div className="bg-green-50 p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold mb-3">Agricultural Advisory</h2>
            <ul className="space-y-2">
              {weather.main.humidity > 80 && (
                <li className="text-red-600">⚠️ High humidity alert: Monitor for potential fungal diseases</li>
              )}
              {weather.wind.speed > 20 && (
                <li className="text-red-600">⚠️ Strong winds: Consider protecting sensitive crops</li>
              )}
              {weather.main.temp > 30 && (
                <li className="text-red-600">⚠️ High temperature: Ensure adequate irrigation</li>
              )}
              <li className="text-green-700">
                {weather.rain?.["1h"] 
                  ? "☔ Recent rainfall: Hold off on irrigation" 
                  : "🌱 Monitor soil moisture levels"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;