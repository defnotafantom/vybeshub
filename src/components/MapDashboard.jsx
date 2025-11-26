// src/components/MapDashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Search, Plus, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { supabase } from "@/lib/supabaseClient"; // opzionale DB

// -------------------
// ICONS
// -------------------
const artistIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
  iconSize: [34, 34],
  iconAnchor: [17, 34],
});

const oppIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
});

// -------------------
// MOCK DATA (sostituire con DB)
// -------------------
const mockMarkers = [
  { id: 1, label: "Opportunità Milano", type: "opportunity", city: "Milano", lat: 45.46, lng: 9.19, description: "Lavoro creativo", avatar:"https://cdn-icons-png.flaticon.com/512/147/147144.png" },
  { id: 2, label: "Collab Roma", type: "artist", city: "Roma", lat: 41.90, lng: 12.49, description: "Collaborazione artistica", avatar:"https://cdn-icons-png.flaticon.com/512/147/147142.png" },
];

// -------------------
// BOUNDS ITALIA
// -------------------
const ITALY_BOUNDS = [
  [36.619987, 6.749955], // sud-ovest
  [47.115393, 18.480247], // nord-est
];

export default function MapDashboard() {
  const [markers, setMarkers] = useState(mockMarkers);
  const [activeMarker, setActiveMarker] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // -------------------
  // Filtri e ricerca
  // -------------------
  const filteredMarkers = useMemo(() => {
    return markers.filter((m) => {
      const matchesSearch =
        !searchQuery ||
        m.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        filterType === "all" ? true : m.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [markers, searchQuery, filterType]);

  // -------------------
  // Funzione per aggiungere nuovo marker
  // -------------------
  const addNewMarker = (data) => {
    const newMarker = {
      id: Date.now(),
      label: data.title,
      type: data.type,
      city: data.city,
      lat: parseFloat(data.lat),
      lng: parseFloat(data.lng),
      description: data.description,
      avatar: "https://cdn-icons-png.flaticon.com/512/147/147144.png",
    };
    setMarkers([...markers, newMarker]);
    setShowNewPost(false);
  };

  return (
    <div className="relative w-full h-screen p-4 flex flex-col gap-4 bg-gray-50">

      {/* --- TOP BAR --- */}
      <div className="flex items-center gap-3 bg-white/70 backdrop-blur-xl p-4 rounded-3xl shadow-xl border border-gray-200 z-20">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Cerca artista, città, opportunità..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white rounded-xl pl-10 pr-4 py-2 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Filtri */}
        <button
          className={clsx(
            "px-4 py-2 rounded-xl shadow font-semibold",
            filterType === "artist" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
          )}
          onClick={() =>
            setFilterType(filterType === "artist" ? "all" : "artist")
          }
        >
          Artisti
        </button>
        <button
          className={clsx(
            "px-4 py-2 rounded-xl shadow font-semibold",
            filterType === "opportunity" ? "bg-blue-700 text-white" : "bg-gray-200 text-gray-700"
          )}
          onClick={() =>
            setFilterType(filterType === "opportunity" ? "all" : "opportunity")
          }
        >
          Opportunità
        </button>

        {/* Nuovo annuncio */}
        <button
          onClick={() => setShowNewPost(true)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus size={18} /> Nuovo Annuncio
        </button>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="relative flex-1 flex items-stretch justify-center gap-4">

        {/* Colonna Nuovo Annuncio */}
        <AnimatePresence>
          {showNewPost && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute left-0 top-0 h-full w-[350px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-4 z-20"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">Nuovo Annuncio</h2>
                <X size={20} className="cursor-pointer" onClick={() => setShowNewPost(false)} />
              </div>
              <NewPostForm onSubmit={addNewMarker} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAPPA CENTRALE */}
        <div className="flex-1 max-w-[900px] rounded-3xl overflow-hidden shadow-xl border border-gray-200 z-10">
          <MapContainer
            bounds={ITALY_BOUNDS}
            maxBounds={ITALY_BOUNDS}
            maxBoundsViscosity={1.0}
            zoom={5.5}
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {filteredMarkers.map((m) => (
              <Marker
                key={m.id}
                position={[m.lat, m.lng]}
                icon={m.type === "artist" ? artistIcon : oppIcon}
                eventHandlers={{
                  click: () => setActiveMarker(m),
                }}
              >
                <Popup>
                  <div className="flex items-center gap-2">
                    <img src={m.avatar} className="w-8 h-8 rounded-full" />
                    <div>
                      <h3 className="font-semibold">{m.label}</h3>
                      <p className="text-sm">{m.description}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Colonna Dettaglio Marker */}
        <AnimatePresence>
          {activeMarker && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute right-0 top-0 h-full w-[350px] bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200 p-4 z-20 flex flex-col gap-3"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-xl">{activeMarker.label}</h2>
                <X size={20} className="cursor-pointer" onClick={() => setActiveMarker(null)} />
              </div>
              <img src={activeMarker.avatar} className="w-16 h-16 rounded-full mb-2" />
              <p className="text-gray-700">{activeMarker.description}</p>
              <p className="text-sm text-gray-500">{activeMarker.city}</p>
              <div className="mt-auto flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
                  Candidati
                </button>
                <button className="flex-1 px-3 py-2 bg-gray-200 rounded-xl shadow hover:bg-gray-300 transition">
                  Contatta
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// -------------------
// FORM NUOVO ANNUNCIO
// -------------------
const NewPostForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("opportunity");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !city || !lat || !lng) return;
    onSubmit({ title, description, type, city, lat, lng });
    setTitle(""); setDescription(""); setCity(""); setLat(""); setLng(""); setType("opportunity");
  };

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <input type="text" placeholder="Titolo" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 border rounded-lg"/>
      <textarea placeholder="Descrizione" value={description} onChange={e=>setDescription(e.target.value)} className="p-2 border rounded-lg"/>
      <input type="text" placeholder="Città" value={city} onChange={e=>setCity(e.target.value)} className="p-2 border rounded-lg"/>
      <div className="flex gap-2">
        <input type="text" placeholder="Latitudine" value={lat} onChange={e=>setLat(e.target.value)} className="p-2 border rounded-lg flex-1"/>
        <input type="text" placeholder="Longitudine" value={lng} onChange={e=>setLng(e.target.value)} className="p-2 border rounded-lg flex-1"/>
      </div>
      <select value={type} onChange={e=>setType(e.target.value)} className="p-2 border rounded-lg">
        <option value="opportunity">Opportunità</option>
        <option value="artist">Collaborazione</option>
      </select>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition">
        Crea Annuncio
      </button>
    </form>
  );
};





























