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

export function getNextDay(todayDate, addDay) {
  const today = new Date(todayDate);
  const nextDay = new Date(today);
  nextDay.setDate(today.getDate() + addDay);

  const year = nextDay.getFullYear();
  const month = String(nextDay.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(nextDay.getDate()).padStart(2, "0");
  const hours = String(nextDay.getHours()).padStart(2, "0");
  const minutes = String(nextDay.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export function capitalizeEachWord(val) {
  return String(val)
    .toLowerCase() // Make the entire string lowercase first
    .split(" ") // Split the string into an array of words
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(" "); // Join the array back into a single string
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

export async function handleFetchData(citySelected) {
  try {
    const [apiWeatherResponse] = await Promise.all([
      fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${
          import.meta.env.VITE_WEATHERAPI_KEY
        }&q=${citySelected}&days=3&aqi=yes&alerts=no`
      ).then((res) => res.json()),
    ]);

    return apiWeatherResponse;
  } catch (error) {
    console.error("Fetch data failed:", error);
  }
}

export function extractForecastData(data) {
  const object = {};
  data.forecast.forecastday.forEach((day) => {
    object[day.date] = {
      ...day,
    };
  });
  return object;
}

export function extractTodayData(data, fullDate) {
  const currentHour = new Date(fullDate).getHours();
  const result = Object.entries(data.hour).find(([key, forecast]) => {
    const forecastHour = new Date(forecast.time).getHours();
    return forecastHour === currentHour;
  });

  return result ? result[1] : undefined;
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
