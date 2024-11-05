import { FaCloud } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import { MdOutlineDateRange } from "react-icons/md";
import { IoSunnyOutline } from "react-icons/io5";
import { FaWind } from "react-icons/fa";
import { FiSunrise } from "react-icons/fi";
import { FiSunset } from "react-icons/fi";
import { WiHumidity } from "react-icons/wi";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaTemperatureHigh } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { BsEyeFill } from "react-icons/bs";
import { useState, useEffect } from "react";
import { supabase } from "../client.js";

export default function Dashboard() {
  const [curWeather, setCurWeather] = useState();

  const getTodayData = async () => {
    try {
      // Single query to find today weather
      const todayDate = new Date().toLocaleDateString();
      const { data: weather, error } = await supabase
        .from("weather")
        .select("*")
        .eq("date", todayDate)
        .single();
      if (error) {
        console.log(error);
      } else {
        console.log(weather);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const handleFetchData = () => {
      // fetch(
      //   `https://api.openweathermap.org/data/2.5/weather?q=San%20Antonio&appid=${
      //     import.meta.env.VITE_OPENWEATHER_KEY
      //   }&units=imperial`
      // )
      //   .then((res) => res.json())
      //   .then((data) => console.log(data))
      //   .catch((err) => console.log(err));
    };
    handleFetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-b from-gray-800 to-gray-900 text-white mb">
      {/* Top Bar with Logo, Search Bar, and Button */}
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-lg">
        {/* Logo */}
        <div className="flex items-center text-2xl font-bold text-gray-100">
          <FaCloud size={50} /> &nbsp; Weather App
        </div>

        {/* Search Bar */}
        <div className="flex-grow mx-4 max-w-xs relative">
          <IoIosSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />{" "}
          {/* Icon positioned inside the container */}
          <input
            type="text"
            placeholder="Search for a city..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 outline-none"
          />
        </div>

        {/* Current Location Button */}
        <button className="flex items-center px-4 py-2 bg-gray-700 rounded-lg shadow-md hover:bg-gray-600">
          <CiLocationOn size={25} /> &nbsp; Current Location
        </button>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row h-full w-full p-4 space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Left Section: Current Weather and 5-Day Forecast */}
        <div className="flex flex-col w-full lg:w-1/4 space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-gray-200">Now</h2>
            <div className="text-lg text-gray-300">
              <p className="flex items-center text-5xl font-bold">
                25°C &nbsp;
                <IoSunnyOutline size={50} />
              </p>
              <p>Clear Sky</p>
              <hr className="w-48 my-2" />
              <p className="flex items-center">
                <MdOutlineDateRange /> &nbsp; Thursday 2, March
              </p>
              <p className="flex items-center">
                <CiLocationOn /> &nbsp; San Antonio
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-2 text-gray-200">
              5-Day Forecast
            </h2>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>3 March</span>
                <span>Monday</span>
                <span>28°C / 20°C</span>
              </li>
              <li className="flex justify-between">
                <span>4 March</span>
                <span>Tuesday</span>
                <span>30°C / 21°C</span>
              </li>
              {/* Add more days as needed */}
            </ul>
          </div>
        </div>

        {/* Middle Section: Today's Highlights */}
        <div className="flex flex-col w-full lg:w-3/4 bg-gray-800 p-4 rounded-lg shadow-lg space-y-4">
          <h2 className="text-3xl font-bold text-gray-200">
            Todays Highlights
          </h2>
          <div className="flex flex-col space-y-4">
            {/* Two Large Sections */}
            <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
                <div className="flex items-center my-2 p-4">
                  <h3 className="flex items-center text-xl font-semibold text-gray-300">
                    <FaWind size={20} /> &nbsp; Air Quality Index
                  </h3>
                  <button className="ml-10 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
                    Good
                  </button>
                </div>

                <div className="flex items-center justify-between mt-2 p-4">
                  <div className="">
                    <p>PM2_5</p>
                    <p className="text-4xl font-bold text-gray-100">270</p>
                  </div>
                  <div className="">
                    <p>SO2</p>
                    <p className="text-4xl font-bold text-gray-100">4.53</p>
                  </div>
                  <div className="">
                    <p>NO2</p>
                    <p className="text-4xl font-bold text-gray-100">41.5</p>
                  </div>
                  <div className="">
                    <p>O3</p>
                    <p className="text-4xl font-bold text-gray-100">23.6</p>
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
                      <p className="text-4xl font-bold text-gray-100">23.6</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-2 pr-4">
                      <FiSunset size={35} />
                    </div>
                    <div>
                      <p>Sunset</p>
                      <p className="text-4xl font-bold text-gray-100">23.6</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Four Smaller Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-300">
                  Humidity
                </h3>
                <div className="flex items-center my-2">
                  <WiHumidity size={50} />
                  <p className="text-4xl font-bold text-gray-100 ml-5">43%</p>
                </div>
              </div>

              <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-300">
                  Pressure (hPa)
                </h3>
                <div className="flex items-center my-2">
                  <RiTailwindCssFill size={50} />
                  <p className="text-4xl font-bold text-gray-100 ml-5">1016</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-300">
                  Visibility
                </h3>
                <div className="flex items-center my-2">
                  <BsEyeFill size={50} />
                  <p className="text-4xl font-bold text-gray-100 ml-4">10km</p>
                </div>
              </div>
              <div className="w-full bg-gray-700 p-4 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-300">
                  Feels Like
                </h3>
                <div className="flex items-center my-2">
                  <FaTemperatureHigh size={45} />
                  <p className="text-4xl font-bold text-gray-100 ml-4">18°C</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
