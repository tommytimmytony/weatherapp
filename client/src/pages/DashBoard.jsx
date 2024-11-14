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
import {
  getAirQualityLabel,
  customGetDate,
  convertTo24HourTime,
  getNextDay,
  getAirQualityColor,
  handleFetchData,
  extractForecastData,
  extractTodayData,
  capitalizeEachWord,
} from "../functions.js";
import WeatherForecast from "../components/WeatherForecast.jsx";
import NextDayForecast from "../components/NextDayForecast.jsx";
import { useParams } from "react-router-dom";
import { useWeather } from "../context/WeatherContext.js";

export default function Dashboard() {
  const [weather, setWeather] = useState();
  const [curWeather, setCurWeather] = useState();
  const [forecast, setForecast] = useState();
  const [airQualityLabel, setAirQualityLabel] = useState("");
  const [airQualityColor, setAirQualityColor] = useState();
  const [sunrise, setSunrise] = useState(0);
  const [sunset, setSunset] = useState(0);
  const [fullDate, setFullDate] = useState(customGetDate("full date"));
  const [fullDate1, setFullDate1] = useState(
    customGetDate("full date", getNextDay(fullDate, 1))
  );
  const [fullDate2, setFullDate2] = useState(
    customGetDate("full date", getNextDay(fullDate, 2))
  );
  const [day, setDay] = useState(customGetDate("day"));
  const [monthName, setMonthName] = useState(customGetDate("month name"));
  const [date, setDate] = useState(customGetDate("date"));
  const { city, setCity } = useWeather();
 
  const resetAllVar = () => {
    setCity("");
    setDay("");
    setMonthName("");
    setDate("");
    setFullDate("");
    setFullDate1("");
    setFullDate2("");
    setWeather();
    setForecast();
    setCurWeather();
  };
  useEffect(() => {
    const getTodayData = async () => {
      try {
        resetAllVar();
        if (city != "null") {
          setCity(capitalizeEachWord(city));
          console.log("Fetching weather API...");
          const data = await handleFetchData(city);
          const newDate = data.location.localtime;
          setDay(customGetDate("day", newDate));
          setMonthName(customGetDate("month name", newDate));
          setDate(customGetDate("date", newDate));
          setFullDate(newDate);
          setFullDate1(getNextDay(newDate, 1));
          setFullDate2(getNextDay(newDate, 2));
          setWeather(data);
          setForecast(extractForecastData(data));
          console.log(data)
        }
      } catch (error) {
        console.error("Error fetching today's data:", error);
      }
    };

    getTodayData();
  }, [city]);

  useEffect(() => {
    if (weather) {
      setAirQualityLabel(
        getAirQualityLabel(
          parseFloat(weather.current.air_quality.pm2_5).toFixed(1),
          parseFloat(weather.current.air_quality.pm2_5).toFixed(1),
          parseFloat(weather.current.air_quality.pm2_5).toFixed(1),
          parseFloat(weather.current.air_quality.pm2_5).toFixed(1)
        )
      );
    }
  }, [weather]);

  useEffect(() => {
    setAirQualityColor(getAirQualityColor(airQualityLabel));
  }, [airQualityLabel]);

  useEffect(() => {
    if (forecast) {
      setCurWeather(
        extractTodayData(forecast[fullDate.slice(0, 10)], fullDate)
      );
      setSunrise(
        convertTo24HourTime(forecast[fullDate.slice(0, 10)].astro.sunrise)
      );
      setSunset(
        convertTo24HourTime(forecast[fullDate.slice(0, 10)].astro.sunset)
      );
    }
  }, [forecast]);

  return (
    <div className="flex flex-col lg:flex-row h-full w-full p-4 space-y-4 lg:space-y-0 lg:space-x-4">
      {/* Left Section: Current Weather , Today weather, and 2-Day Forecast */}
      <div className="flex flex-col w-full lg:w-1/4 space-y-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-200">Now</h2>
          <div className="text-lg text-gray-300">
            <p className="flex items-center text-5xl font-bold">
              {curWeather ? `${parseInt(curWeather.temp_f)}°C` : ""} &nbsp;
              <IoSunnyOutline size={50} />
            </p>
            <p> {curWeather ? `${curWeather.condition.text}` : ""}</p>
            <hr className="w-48 my-2" />
            <p className="flex items-center">
              <MdOutlineDateRange /> &nbsp; {`${day} ${date}, ${monthName}`}
            </p>
            <p className="flex items-center">
              <CiLocationOn /> &nbsp; {weather ? `${weather.location.name}` : ""}
            </p>
          </div>
        </div>

        {/* Scrollable "Today" weather forecast section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg h-64 overflow-y-scroll scrollbar-custom">
          <h2 className="text-2xl font-bold mb-2 text-gray-200">
            Today’s Forecast
          </h2>
          <ul className="space-y-2 text-gray-300">
            <WeatherForecast
              todayForecast={
                forecast ? forecast[fullDate.slice(0, 10)].hour : null
              }
              hour={fullDate.slice(11, 13)}
            />
          </ul>
        </div>
        {/* Future 2 day weather forecast section */}
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-2 text-gray-200">
            2-Day Forecast
          </h2>
          <ul className="space-y-2 text-gray-300">
            <NextDayForecast
              nextForecast={forecast}
              fullDate1={fullDate1}
              fullDate2={fullDate2}
            />
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
                  className={`ml-10 text-white px-4 py-2 rounded-lg hover:bg-opacity-90 ${
                    airQualityColor == "green"
                      ? "bg-green-500 hover:bg-green-600"
                      : airQualityColor == "yellow"
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : airQualityColor == "red"
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-gray-500 hover:bg-gray-600"
                  }`}
                >
                  {airQualityLabel}
                </button>
              </div>

              <div className="flex items-center justify-between mt-2 p-4">
                <div className="">
                  <p>PM2_5</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {curWeather
                      ? `${curWeather.air_quality.pm2_5.toFixed(1)}`
                      : ""}
                  </p>
                </div>
                <div className="">
                  <p>SO2</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {curWeather
                      ? `${curWeather.air_quality.so2.toFixed(1)}`
                      : ""}
                  </p>
                </div>
                <div className="">
                  <p>NO2</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {curWeather
                      ? `${curWeather.air_quality.no2.toFixed(1)}`
                      : ""}
                  </p>
                </div>
                <div className="">
                  <p>O3</p>
                  <p className="text-4xl font-bold text-gray-100">
                    {" "}
                    {curWeather
                      ? `${curWeather.air_quality.o3.toFixed(1)}`
                      : ""}
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
                      {sunrise}
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
                      {sunset}
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
                  {curWeather ? `${curWeather.pressure_mb}` : ""}
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
                  {curWeather ? `${curWeather.vis_miles} mi` : ""}
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
                  {curWeather ? `${parseInt(curWeather.feelslike_f)}°C` : ""}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
