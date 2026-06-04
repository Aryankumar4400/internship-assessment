const axios = require("axios");

async function weatherSummary() {

    const city = "London";

    const latitude = 51.5072;
    const longitude = -0.1276;

    const weatherCodes = {
        0: "Clear Sky",
        1: "Mainly Clear",
        2: "Partly Cloudy",
        3: "Overcast",
        45: "Fog",
        61: "Light Rain",
        80: "Rain Showers",
        95: "Thunderstorm"
    };

    try {

        const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );

        const weather = response.data.current_weather;

        console.log(`City: ${city}`);
        console.log(`Temperature: ${weather.temperature}°C`);
        console.log(
            `Condition: ${
                weatherCodes[weather.weathercode] || "Unknown"
            }`
        );

    } catch (error) {
        console.log("Error:", error.message);
    }
}

weatherSummary();

/*
Expected Output Example:

City: London
Temperature: 18.2°C
Condition: Overcast

(Note:
Temperature and condition may vary
depending on real-time weather data.)
*/