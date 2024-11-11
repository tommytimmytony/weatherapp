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
import Control from "ol/control/Control";

// Style
import "ol/ol.css";

export default function Radar() {
  useEffect(() => {
    const locate = () => {
      return (
        <div className="ol-control ol-unselectable locate">
          Not Empty
          <button title="Locate me">◎</button>
        </div>
      );
    };
    //Base layer for map of the World
    const osmLayer = new TileLayer({
      preload: Infinity,
      source: new OSM(),
    });
    //Location layer for user location
    const navLayer = new VectorLayer({
      source: new VectorSource(),
    });

    const map = new Map({
      target: "map",
      layers: [osmLayer, navLayer],
      view: new View({
        center: [0, 0],
        zoom: 0,
      }),
    });
    //Locate Button
    //const myControl = new Control({ element: locate() });
    //Cleanup Function
    return () => map.setTarget(null);
  }, []);

  return (
    <div>
      <div
        style={{ height: "500px", width: "100%" }}
        id="map"
        className="map-container"
      ></div>
    </div>
  );
}
