// src/components/Map/MapDashboard.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import MarkerDetailPanel from "@/components/Map/MarkerDetailPanel";
import LeftPanel from "@/components/Map/LeftPanel";
import RightPanel from "@/components/Map/RightPanel";
import TopBar from "@/components/Map/TopBar";
import MarkerPreview from "@/components/Map/MarkerPreview";

import { artistIcon, oppIcon } from "@/components/Map/utils/icons";

const safeUUID = () => (crypto?.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.floor(Math.random() * 1e6)}`);
const ITALY_BOUNDS = [[36.619987, 6.749955], [47.115393, 18.480247]];

export default function MapDashboard({ user }) {
  const [markers, setMarkers] = useState([]);
  const [activeMarker, setActiveMarker] = useState(null);
  const [map, setMap] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showNewPost, setShowNewPost] = useState(false);

  useEffect(() => {
    setMarkers([
      { id: safeUUID(), label: 'Opportunità Milano', type: 'opportunity', city: 'Milano', lat: 45.46, lng: 9.19, description: 'Lavoro creativo', avatar: '/icons/milano.png', badges: ['Job'] },
      { id: safeUUID(), label: 'Collab Roma', type: 'artist', city: 'Roma', lat: 41.90, lng: 12.49, description: 'Collaborazione artistica', avatar: '/icons/roma.png', badges: ['Collab'] },
    ]);
  }, []);

  const filteredMarkers = markers.filter(m => {
    const matchesSearch = m.label.toLowerCase().includes(searchQuery.toLowerCase()) || m.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" ? true : m.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSelectFromList = (markerId) => {
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return;
    setActiveMarker(marker);
    if (map?.setView) map.setView([marker.lat, marker.lng], Math.max(map.getZoom(), 10));
  };

  return (
    <div className="flex flex-col items-center w-full py-6 bg-gray-50 gap-6 relative">

      {/* TopBar */}
      <TopBar
        showNewPost={showNewPost}
        setShowNewPost={setShowNewPost}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />

      {/* Mappa centrata responsive */}
      <div className="relative w-1/2 max-w-[670px] aspect-square rounded-2xl shadow-lg overflow-hidden">
        <MapContainer
          bounds={ITALY_BOUNDS}
          zoom={5.5}
          maxBounds={ITALY_BOUNDS}
          maxBoundsViscosity={1.0}
          style={{ width: "100%", height: "100%" }}
          whenCreated={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {filteredMarkers.map(m => (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={m.type === 'artist' ? artistIcon : oppIcon}
            >
              <Popup className="flex flex-col gap-2">
                <MarkerPreview marker={m} onDetailClick={() => setActiveMarker(m)} />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Left panel nuovo annuncio */}
      <LeftPanel showNewPost={showNewPost} setShowNewPost={setShowNewPost} />

      {/* Right panel dettaglio marker */}
      <RightPanel activeMarker={activeMarker} />

    </div>
  );
}
