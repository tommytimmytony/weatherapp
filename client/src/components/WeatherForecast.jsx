import { useEffect, useRef } from "react";

export default function WeatherForecast({ todayForecast }) {
  const currentHour = new Date().getHours();
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
  }, [todayForecast]); // Add todayForecast as dependency if the forecast data updates

  return (
    <ul>
      {todayForecast &&
        Object.entries(todayForecast)
          .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
          .map(([key, forecast]) => {
            const forecastHour = new Date(key).getHours(); // Extract the hour from each forecast key

            return (
              <li
                key={key}
                ref={(el) => (forecastRefs.current[forecastHour] = el)} // Set a ref for each forecast
                className={`flex justify-between ${
                  forecastHour === currentHour
                    ? "text-white font-bold shadow-xl"
                    : ""
                }`}
              >
                <span>{key.split(" ")[1]}</span> {/* Display the hour */}
                <span>{forecast.description}</span>
                <span>{forecast.temp}°C</span>
              </li>
            );
          })}
    </ul>
  );
}
