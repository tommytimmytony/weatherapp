import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDateRange } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { FaWind } from "react-icons/fa";
import { FiSunrise } from "react-icons/fi";
import { FiSunset } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaTemperatureHigh } from "react-icons/fa";
import { BsEyeFill } from "react-icons/bs";
import { useState, useEffect, useRef } from "react";
import { supabase } from "../client.js";
import {
  getAirQualityLabel,
  customGetDate,
  getAirQualityColor,
  formatData,
  insertData,
  handleFetchData,
  insertForecastData,
  getForecastData,
  getNextForecastData,
} from "./functions.js";
import WeatherForecast from "../components/WeatherForecast.jsx";
import NextDayForecast from "../components/NextDayForecast.jsx";
export default function Dashboard() {
  const [curWeather, setCurWeather] = useState();
  const [apiWeather, setApiWeather] = useState();
  const [airQualityLabel, setAirQualityLabel] = useState("");
  const [airQualityColor, setAirQualityColor] = useState("green");
  const [day, setDay] = useState(customGetDate("day"));
  const [fullDate, setFullDate] = useState(customGetDate("full date"));
  const [monthName, setMonthName] = useState(customGetDate("month name"));
  const [date, setDate] = useState(customGetDate("date"));
  const [todayForecast, setTodayForecast] = useState();
  const [nextForecast, setNextForecast] = useState();

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

  useEffect(() => {
    const getTodayData = async () => {
      try {
        const { data: weather, error } = await supabase
          .from("weather")
          .select("*")
          .eq("date", fullDate)
          .single();

        if (error) {
          console.log("Weather not found in database:", error);
          setApiWeather(await handleFetchData());
        } else {
          console.log("Setting weather...");
          setAirQualityLabel(
            getAirQualityLabel(
              weather.air_quality_pm2_5,
              weather.air_quality_so2,
              weather.air_quality_no2,
              weather.air_quality_o3
            )
          );
          setCurWeather(weather);
          setTodayForecast(await getForecastData(fullDate));
          setNextForecast(await getNextForecastData(fullDate));
        }
      } catch (err) {
        console.error("Error fetching today's data:", err);
      }
    };

    getTodayData();
  }, []);

  useEffect(() => {
    if (apiWeather) {
      insertForecastData(apiWeather);
      setCurWeather(formatData(apiWeather));
      setAirQualityLabel(
        getAirQualityLabel(
          parseFloat(apiWeather.current.air_quality.pm2_5).toFixed(1),
          parseFloat(apiWeather.current.air_quality.pm2_5).toFixed(1),
          parseFloat(apiWeather.current.air_quality.pm2_5).toFixed(1),
          parseFloat(apiWeather.current.air_quality.pm2_5).toFixed(1)
        )
      );
      setTodayForecast(getForecastData(fullDate));
    }
  }, [apiWeather]);

  useEffect(() => {
    insertData("weather", curWeather);
  }, [curWeather]);

  useEffect(() => {
    setAirQualityColor(getAirQualityColor(airQualityLabel));
  }, [airQualityLabel]);

  useEffect(() => {
    scrollToActive();
  }, [currentHour]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full p-4 space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Left Section: Current Weather , Today weather, and 2-Day Forecast */}
      <div className="flex flex-col w-full lg:w-1/4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-200">Now</h2>
          <div className="text-lg text-gray-300">
            <p className="flex items-center text-5xl font-bold">
              {curWeather ? `${curWeather.temp}°C` : ""} &nbsp;
              <IoSunnyOutline size={50} />
            </p>
            <p> {curWeather ? `${curWeather.weather_description}` : ""}</p>
            <hr className="w-48 my-2" />
            <p className="flex items-center">
              <MdOutlineDateRange /> &nbsp; {`${day} ${date}, ${monthName}`}
            </p>
            <p className="flex items-center">
              <CiLocationOn /> &nbsp;{" "}
              {curWeather ? `${curWeather.location}` : ""}
            </p>
          </div>
        </div>

        {/* Scrollable "Today" weather forecast section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-64 overflow-y-scroll scrollbar-custom">
          <h2 className="text-2xl font-bold mb-2 text-gray-200">
            Today’s Forecast
          </h2>
          <ul className="space-y-2 text-gray-300">
            <WeatherForecast todayForecast={todayForecast} />
          </ul>
        </div>
        {/* Future 2 day weather forecast section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-200">
            2-Day Forecast
          </h2>
          <ul className="space-y-2 text-gray-300">
            <NextDayForecast nextForecast={nextForecast} />
            {/* Add more days as needed */}
          </ul>
        </div>
      </div>

      {/* Middle Section: Today's Highlights */}
      <div className="flex flex-col w-full lg:w-3/4 bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
        <h2 className="text-3xl font-bold text-gray-200">Todays Highlights</h2>
        <div className="flex flex-col space-y-4">
          {/* Two Large Sections */}
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
              <div className="flex items-center my-2 p-4">
                <h3 className="flex items-center text-xl font-semibold text-gray-300">
                  <FaWind size={20} /> &nbsp; Air Quality Index
                </h3>
                <button
                  className={`ml-10 bg-${airQualityColor}-500 text-white px-4 py-2 rounded-lg hover:bg-${airQualityColor}-600`}
                >
                  {`${airQualityLabel}`}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 p-4">
                <div className="">
                  <p>PM2_5</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {curWeather ? `${curWeather.air_quality_pm2_5}` : ""}
                  </p>
                </div>
                <div className="">
                  <p>SO2</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {curWeather ? `${curWeather.air_quality_so2}` : ""}
                  </p>
                </div>
                <div className="">
                  <p>NO2</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {curWeather ? `${curWeather.air_quality_no2}` : ""}
                  </p>
                </div>
                <div className="">
                  <p>O3</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {" "}
                    {curWeather ? `${curWeather.air_quality_o3}` : ""}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
              <div className="flex items-center my-2 p-4">
                <h3 className="flex items-center text-xl font-semibold text-gray-300">
                  Sunset & Sunrise
                </h3>
              </div>
              <div className="flex items-center justify-between mt-2 p-4">
                <div className="flex items-center">
                  <div className="mr-2 pr-4">
                    <FiSunrise size={35} />
                  </div>
                  <div>
                    <p> Sunrise</p>
                    <p className="text-4xl font-bold text-gray-100">
                      {" "}
                      {curWeather ? `${curWeather.sunrise}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 pr-4">
                    <FiSunset size={35} />
                  </div>
                  <div>
                    <p>Sunset</p>
                    <p className="text-4xl font-bold text-gray-100">
                      {" "}
                      {curWeather ? `${curWeather.sunset}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Four Smaller Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-300">Humidity</h3>
              <div className="flex items-center my-2">
                <WiHumidity size={50} />
                <p className="text-4xl font-bold text-gray-100 ml-5">
                  {" "}
                  {curWeather ? `${curWeather.humidity}%` : ""}
                </p>
              </div>
            </div>

            <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-300">
                Pressure (hPa)
              </h3>
              <div className="flex items-center my-2">
                <RiTailwindCssFill size={50} />
                <p className="text-4xl font-bold text-gray-100 ml-5">
                  {" "}
                  {curWeather ? `${curWeather.pressure}` : ""}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-300">
                Visibility
              </h3>
              <div className="flex items-center my-2">
                <BsEyeFill size={50} />
                <p className="text-4xl font-bold text-gray-100 ml-4">
                  {" "}
                  {curWeather ? `${curWeather.visibility} mi` : ""}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-300">
                Feels Like
              </h3>
              <div className="flex items-center my-2">
                <FaTemperatureHigh size={45} />
                <p className="text-4xl font-bold text-gray-100 ml-4">
                  {" "}
                  {curWeather ? `${curWeather.feel_like}°C` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
