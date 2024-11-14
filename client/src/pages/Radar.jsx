//Components
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

// Style
import "ol/ol.css";

export default function Radar() {
  const [source, setSource] = useState(new VectorSource({}));

  useEffect(() => {
    //Base layer for map of the World
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });
    //Location layer for user location
    const navLayer = new VectorLayer({
      source: source,
    });
    const map = new Map({
      target: "map",
      layers: [osmLayer, navLayer],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    //GPS Tracker
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
    console.log("Log: " + watchId);
    //Add Custom locate me button to map
    const customControl = new CustomControl({
      positionStyles: { top: "10px", right: "10px" }, // button position
      label: "◎", // custom label for the control button
      onClick: () => {
        map.getView().fit(source.getExtent(), {
          maxZoom: 18,
          duration: 500,
        });
      },
    });
    map.addControl(customControl);
    // Clean up functions
    return () => {
      map.setTarget(null);
      navigator.geolocation.clearWatch(watchId);
    };
  }, [source]);

  return (
    <div
      style={{ height: "90vh", width: "100%" }}
      id="map"
      className="map-container"
    ></div>
  );
}
