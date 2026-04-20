export const fetchEnvironmentalData = async () => {
  // Free public weather API for generic stadium coordinates (London)
  const API_URL = "https://api.open-meteo.com/v1/forecast?latitude=19.0760&longitude=72.8777&current_weather=true";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("API Network Error");
    const data = await response.json();
    
    // WMO Weather interpretation codes
    const code = data.current_weather.weathercode;
    const temp = data.current_weather.temperature;
    
    let condition = 'clear';
    if (code >= 51 && code <= 67) condition = 'rain';
    if (code >= 71 && code <= 77) condition = 'snow';
    if (code >= 95) condition = 'storm';

    return {
      status: 'live',
      temperature: temp,
      condition,
      windspeed: data.current_weather.windspeed
    };
  } catch (err) {
    // Elegant fallback to mock data
    console.warn("API Layer Failed, falling back to Simulation Environment", err);
    return {
      status: 'simulated',
      temperature: 22,
      condition: 'clear',
      windspeed: 10
    };
  }
};
