import { supabase } from "./client";

export function getAirQualityLabel(pm2_5, so2, no2, o3) {
  // Define thresholds for each pollutant
  const thresholds = {
    pm2_5: { good: 20, average: 35 }, // in µg/m³
    so2: { good: 75, average: 185 }, // in µg/m³
    no2: { good: 55, average: 100 }, // in ppb
    o3: { good: 60, average: 70 }, // in ppb
  };

  // Check each pollutant against thresholds and determine quality level
  const getQuality = (value, pollutant) => {
    if (value <= thresholds[pollutant].good) return "Good";
    if (value <= thresholds[pollutant].average) return "Average";
    return "Bad";
  };

  // Get individual quality labels for each pollutant
  const pm2_5Quality = getQuality(pm2_5, "pm2_5");
  const so2Quality = getQuality(so2, "so2");
  const no2Quality = getQuality(no2, "no2");
  const o3Quality = getQuality(o3, "o3");

  // Aggregate overall quality: if any pollutant is "Bad," return "Bad"
  if ([pm2_5Quality, so2Quality, no2Quality, o3Quality].includes("Bad")) {
    return "Bad";
  }
  if ([pm2_5Quality, so2Quality, no2Quality, o3Quality].includes("Average")) {
    return "Average";
  }
  return "Good";
}

export function convertTo24HourTime(time12hr) {
  // Match hours, minutes, and period (AM/PM) from the 12-hour format
  const [time, period] = time12hr.split(" ");
  let [hours, minutes] = time.split(":");
  // Convert hours to a number for processing
  hours = parseInt(hours, 10);
  // Adjust hours based on period
  if (period === "PM" && hours !== 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }
  // Format the hours and minutes to ensure two digits (e.g., 14:30)
  const hoursStr = hours.toString().padStart(2, "0");
  const minutesStr = minutes.padStart(2, "0");
  return `${hoursStr}:${minutesStr}`;
}

export function customGetDate(typeDate, dateString = "") {
  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let d;
  if (dateString == "") {
    d = new Date();
  } else {
    d = new Date(dateString);
  }

  const day = weekday[d.getDay()];
  const fullDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(d.getDate()).padStart(2, "0")}`;
  const monthName = d.toLocaleString("default", { month: "long" });
  const date = d.getDate();

  switch (typeDate) {
    case "day":
      return day;

    case "full date":
      return fullDate;

    case "month name":
      return monthName;

    case "date":
      return date;
  }
}

export function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

export function getAirQualityColor(label) {
  switch (label) {
    case "Bad":
      return "red";

    case "Average":
      return "yellow";

    case "Good":
      return "green";
  }
}

export function formatData(data) {
  const sunsetTime = convertTo24HourTime(
    data.forecast.forecastday[0].astro.sunset
  );
  const sunriseTime = convertTo24HourTime(
    data.forecast.forecastday[0].astro.sunrise
  );
  const pm2_5 = parseFloat(data.current.air_quality.pm2_5).toFixed(1);
  const so2 = parseFloat(data.current.air_quality.so2).toFixed(1);
  const no2 = parseFloat(data.current.air_quality.no2).toFixed(1);
  const o3 = parseFloat(data.current.air_quality.o3).toFixed(1);

  return {
    temp: parseInt(data.current.temp_f),
    weather_description: capitalizeFirstLetter(data.current.condition.text),
    location: data.location.name + ", " + data.location.region,
    lon: data.location.lon,
    lat: data.location.lat,
    date: data.location.localtime.split(" ")[0],
    air_quality_pm2_5: pm2_5.toString(),
    air_quality_so2: so2.toString(),
    air_quality_no2: no2.toString(),
    air_quality_o3: o3.toString(),
    sunset: sunsetTime,
    sunrise: sunriseTime,
    humidity: data.current.humidity,
    pressure: parseInt(data.current.pressure_mb),
    visibility: parseInt(data.current.vis_miles),
    feel_like: parseInt(data.current.feelslike_f),
  };
}

export async function insertData(table, data) {
  const { error } = await supabase.from(table).insert([data]);
  if (error) {
    console.error("Insert Data failed:", error.message);
  }
}

export async function handleFetchData() {
  const city = "San Antonio";
  try {
    const [apiWeatherResponse] = await Promise.all([
      fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHERAPI_KEY
        }&q=${city}&days=3&aqi=yes&alerts=no`
      ).then((res) => res.json()),
    ]);

    return apiWeatherResponse;
  } catch (error) {
    console.error("Fetch data failed:", error);
  }
}

export function insertForecastData(data) {
  const forecastDays = data.forecast.forecastday;
  forecastDays.forEach((forecast) => {
    forecast.hour.forEach((hr) => {
      insertData("weather_forecast", {
        date: hr.time,
        description: hr.condition.text,
        temp: hr.temp_f,
      });
    });
  });
}

export async function getForecastData(fullDate) {
  try {
    const { data: forecast, error } = await supabase
      .from("weather_forecast")
      .select("*")
      .like("date", `${fullDate}%`);

    if (error) {
      console.log("Forecast not found in database:", error);
    } else {
      console.log("Setting forecast...");
      const object = {};
      forecast.forEach((hr) => {
        object[hr.date] = {
          temp: hr.temp,
          description: hr.description,
        };
      });
      return object;
    }
  } catch (err) {
    console.error("Error fetching today's data:", err);
  }
}

function getNextDay(today, dayNum) {
  const date = new Date(today);
  date.setDate(date.getDate() + dayNum);
  // Format the date back to "YYYY-MM-DD"
  const nextDay = date.toISOString().split("T")[0];
  return nextDay;
}

export async function getNextForecastData(fullDate) {
  try {
    const { data: forecast0, error0 } = await supabase
      .from("weather_forecast")
      .select("*")
      .like("date", `${getNextDay(fullDate, 1)}%`);

    const { data: forecast1, error1 } = await supabase
      .from("weather_forecast")
      .select("*")
      .like("date", `${getNextDay(fullDate, 2)}%`);

    if (error0 || error1) {
      console.log("Next Forecast not found in database:", error0, error1);
    } else {
      console.log("Setting next forecast...");
      // Sorting function
      const sortByTemp = (forecast) => {
        return forecast.sort((a, b) => a.temp - b.temp);
      };

      const object0 = {};
      forecast0.forEach((hr) => {
        object0[hr.date] = {
          temp: hr.temp,
          description: hr.description,
        };
      });

      const object1 = {};
      forecast1.forEach((hr) => {
        object1[hr.date] = {
          temp: hr.temp,
          description: hr.description,
        };
      });

      // Get the first and last values for each object
      const sorted0 = sortByTemp(Object.values(object0));
      const sorted1 = sortByTemp(Object.values(object1));

      // Get first and last
      const first0 = sorted0[0];
      const last0 = sorted0[sorted0.length - 1];
      const first1 = sorted1[0];
      const last1 = sorted1[sorted1.length - 1];

      const finalObject = {
        day1: {
          day: customGetDate("day", getNextDay(fullDate, 2)),
          date: customGetDate("date", getNextDay(fullDate, 2)),
          month: customGetDate("month name", getNextDay(fullDate, 2)),
          low_temp: first0.temp,
          high_temp: last0.temp,
        },
        day2: {
          day: customGetDate("day", getNextDay(fullDate, 3)),
          date: customGetDate("date", getNextDay(fullDate, 3)),
          month: customGetDate("month name", getNextDay(fullDate, 3)),
          low_temp: first1.temp,
          high_temp: last1.temp,
        },
      };
      return finalObject;
    }
  } catch (err) {
    console.error("Error fetching next forecast data:", err);
  }
}

export async function reverseGeoLocation(latitude, longitude) {
  try {
    const [geoResponse] = await Promise.all([
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${
          import.meta.env.VITE_GEO_KEY
        }`
      ).then((res) => res.json()),
    ]);

    return geoResponse.results[0].components.city;
  } catch (error) {
    console.error("Fetch data failed:", error);
    return "Unable to access location";
  }
}

