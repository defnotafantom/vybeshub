import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapViewItalia = () => {
  return (
    <MapContainer
      center={[41.8719, 12.5674]} // Centro Italia
      zoom={5}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
    >
      {/* ATTENZIONE: mai mettere div o fragment qui, solo componenti di leaflet */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapViewItalia;



