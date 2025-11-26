import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const ITALY_BOUNDS = [[36.619987, 6.749955],[47.115393, 18.480247]];
const makeIcon = (url, size=[34,34], anchor=[17,34]) => new L.Icon({ iconUrl: url, iconSize: size, iconAnchor: anchor, popupAnchor: [0,-28] });
const artistIcon = makeIcon('/icons/artist.png');
const oppIcon = makeIcon('/icons/opportunity.png');

export default function MapWrapper({ markers, setActiveMarker, mapRef }) {
  return (
    <MapContainer
      bounds={ITALY_BOUNDS}
      zoom={5.5}
      maxBounds={ITALY_BOUNDS}
      maxBoundsViscosity={1.0}
      style={{ width: "100%", height: "100%" }}
      whenCreated={map => mapRef.current = map}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map(m => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={m.type === 'artist' ? artistIcon : oppIcon}
          eventHandlers={{ click: () => setActiveMarker(m) }}
        />
      ))}
    </MapContainer>
  );
}
