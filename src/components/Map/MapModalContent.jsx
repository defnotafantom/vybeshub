// @/components/Map/MapModalContent.jsx
import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const MapModalContent = () => (
  <div style={{ width: "100%", height: "400px" }}>
    <MapContainer center={[45.4642, 9.19]} zoom={13} style={{ width: "100%", height: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[45.4642, 9.19]}>
        <Popup>Qui sei tu!</Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default MapModalContent;
