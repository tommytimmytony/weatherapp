import React, { useState, useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { circular } from "ol/geom/Polygon";
import CustomControl from "./CustomControl";
import { fromLonLat } from "ol/proj";
import XYZ from "ol/source/XYZ.js";

// Style
import "ol/ol.css";

export default function Radar() {
  const [source, setSource] = useState(new VectorSource({}));
  const apiKey = "fac24a4dd1c66774b748298045beaa41";
  const [showTempLayer, setTempLayer] = useState(false); // State to toggle temp layer
  const [showPrecipitationLayer, setPrecipitationLayer] = useState(false); // State to toggle precipitation layer
  const [showWindLayer, setWindLayer] = useState(false); // State to toggle wind layer

  useEffect(() => {
    // Base layer for map of the World
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });

    // Location layer for user location
    const navLayer = new VectorLayer({
      source: source,
    });

    // OpenWeather temperature layer
    const tempLayer = new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      }),
      visible: showTempLayer, // Bind visibility to state
    });

    // OpenWeather precipitation layer
    const precipitationLayer = new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      }),
      visible: showPrecipitationLayer, // Bind visibility to state
    });

    // OpenWeather wind layer
    const windLayer = new TileLayer({
      source: new XYZ({
        url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${apiKey}`,
      }),
      visible: showWindLayer, // Bind visibility to state
    });

    // Initialize map
    const map = new Map({
      target: "map",
      layers: [osmLayer, tempLayer, navLayer, precipitationLayer, windLayer], // Add the OpenWeather layer here
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
    });

    // GPS Tracker
    const watchId = navigator.geolocation.watchPosition(
      function (pos) {
        const coords = [pos.coords.longitude, pos.coords.latitude];
        const accuracy = circular(coords, pos.coords.accuracy);
        source.clear(true);
        source.addFeatures([
          new Feature(
            accuracy.transform("EPSG:4326", map.getView().getProjection())
          ),
          new Feature(new Point(fromLonLat(coords))),
        ]);
      },
      function (error) {
        alert(`ERROR: ${error.message}`);
      },
      {
        enableHighAccuracy: true,
      }
    );

    // Add Custom locate me button to map
    const locateControl = new CustomControl({
      positionStyles: { top: "10px", right: "10px" }, // button position
      label: "◎", // custom label for the control button
      onClick: () => {
        map.getView().fit(source.getExtent(), {
          maxZoom: 18,
          duration: 500,
        });
      },
    });
    map.addControl(locateControl);

    // Add Custom temp button to map
    const tempControl = new CustomControl({
      positionStyles: { top: "40px", right: "10px" }, // button position
      label: "☀", // custom label for the control button
      onClick: () => {
        setTempLayer(!showTempLayer)}, // Toggle layer visibility
    });
    map.addControl(tempControl);

    // Add Custom precipitation button to map
    const precipitaionControl = new CustomControl({
      positionStyles: { top: "70px", right: "10px" }, // button position
      label: "🌂", // custom label for the control button
      onClick: () => {
        setPrecipitationLayer(!showPrecipitationLayer)}, // Toggle layer visibility
    });
    map.addControl(precipitaionControl);

    // Add Custom wind button to map
    const windControl = new CustomControl({
      positionStyles: { top: "100px", right: "10px" }, // button position
      label: "☁️", // custom label for the control button
      onClick: () => {
        setWindLayer(!showWindLayer)}, // Toggle layer visibility
    });
    map.addControl(windControl);
    
    // Clean up functions
    return () => {
      map.setTarget(null);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [source, showTempLayer, showPrecipitationLayer, showWindLayer ]);

  return (
    <div
      style={{ height: "90vh", width: "100%" }}
      id="map"
      className="map-container"
    ></div>
  );
}
