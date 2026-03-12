const express = require("express");
const router = express.Router();
const axios = require("axios");
const auth = require("../middleware/auth");

const CITY_COORDS = {
  Mumbai: { lat: 19.076, lon: 72.8777 },
  Delhi: { lat: 28.6139, lon: 77.209 },
  Bangalore: { lat: 12.9716, lon: 77.5946 },
  Hyderabad: { lat: 17.385, lon: 78.4867 },
  Chennai: { lat: 13.0827, lon: 80.2707 },
};

router.get("/check", auth, async (req, res) => {
  try {
    const { city } = req.query;
    const coords = CITY_COORDS[city] || CITY_COORDS["Bangalore"];
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey || apiKey === "your_openweather_api_key_here") {
      return res.json({
        city, temperature: 28, description: "Moderate Rain",
        humidity: 85, rainfall_1h: 12.5, triggers: [], disruption: false,
        message: "Mock data — add API key in .env for live data",
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}`
    );
    const w = response.data;
    const temp = (w.main.temp - 273.15).toFixed(1);
    const rain = w?.rain?.["1h"] || 0;
    const triggers = [];
    if (rain > 25) triggers.push({ type: "Heavy Rain", value: `Rainfall: ${rain}mm/hr`, triggered: true });
    if (parseFloat(temp) > 44) triggers.push({ type: "Extreme Heat", value: `Temp: ${temp}°C`, triggered: true });

    res.json({ city, temperature: parseFloat(temp), description: w.weather[0].description, humidity: w.main.humidity, rainfall_1h: rain, triggers, disruption: triggers.length > 0 });
  } catch (err) {
    res.status(500).json({ message: "Weather API error", error: err.message });
  }
});

router.get("/simulate", auth, (req, res) => {
  const scenarios = {
    rain: { city: "Bangalore", temperature: 22, description: "Heavy Rain", humidity: 95, rainfall_1h: 32.5,
      triggers: [{ type: "Heavy Rain", value: "Rainfall: 32.5mm/hr", triggered: true }], disruption: true },
    heat: { city: "Delhi", temperature: 46.2, description: "Extreme Heat", humidity: 15, rainfall_1h: 0,
      triggers: [{ type: "Extreme Heat", value: "Temperature: 46.2°C", triggered: true }], disruption: true },
    normal: { city: "Bangalore", temperature: 28, description: "Partly Cloudy", humidity: 60, rainfall_1h: 0, triggers: [], disruption: false },
  };
  res.json(scenarios[req.query.scenario] || scenarios["normal"]);
});

module.exports = router;