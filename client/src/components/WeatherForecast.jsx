import { useState, useEffect, useRef } from "react";

export default function WeatherForecast({ todayForecast, hour }) {
  const [currentHour, setCurrentHour] = useState(hour);

  const forecastRefs = useRef({});
  // Function to scroll to the active forecast (current hour)
  const scrollToActive = () => {
    const activeForecast = forecastRefs.current[currentHour];
    if (activeForecast) {
      activeForecast.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Scroll to the active forecast when the component mounts or updates
  useEffect(() => {
    scrollToActive();
  }, [todayForecast, currentHour]); // Add todayForecast as dependency if the forecast data updates

  useEffect(() => {
    setCurrentHour(hour);
  }, [hour]);
  return (
    <ul>
      {todayForecast &&
        Object.entries(todayForecast)
          .sort(([keyA], [keyB]) => keyA.time - keyB.time)
          .map(([key, forecast]) => {
            const forecastHour = new Date(forecast.time).getHours(); // Extract the hour from each forecast key

            return (
              <li
                key={key}
                ref={(el) => (forecastRefs.current[forecastHour] = el)} // Set a ref for each forecast
                className={`flex justify-between ${
                  forecastHour == currentHour ? "text-white font-bold" : ""
                }`}
              >
                <span>{forecast.time.split(" ")[1]}</span>{" "}
                {/* Display the hour */}
                <span>{forecast.condition.text}</span>
                <span>{parseInt(forecast.temp_f)}°C</span>
              </li>
            );
          })}
    </ul>
  );
}
