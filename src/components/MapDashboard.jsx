import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import MarkerPopupContent from "./MarkerPopupContent";
import MarkerDetailPanel from "./MarkerDetailPanel";
import { supabase } from "@/lib/supabaseClient";
import clsx from "clsx";
import "../styles/map-dashboard.css";

const MapDashboard = ({ profile }) => {
  const [markers, setMarkers] = useState({ artists: [], opportunities: [] });
  const [loading, setLoading] = useState(true);
  const [filterCity, setFilterCity] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [filterDiscipline, setFilterDiscipline] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showDetailPanel, setShowDetailPanel] = useState(false);

  const mapRef = useRef(null);
  const clusterRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      try {
        const { data: artists } = await supabase.from("artists").select("*");
        const { data: opportunities } = await supabase.from("opportunities").select("*");
        if (mounted) setMarkers({ artists: artists || [], opportunities: opportunities || [] });
      } catch (e) { console.error(e); }
      finally { if (mounted) setLoading(false); }
    };
    fetchData();
    return () => { mounted = false; };
  }, []);

  const filteredMarkers = [...markers.artists, ...markers.opportunities].filter(m =>
    (!filterCity || m.city === filterCity) &&
    (!filterTag || m.tags?.includes(filterTag)) &&
    (!filterDiscipline || m.discipline?.includes(filterDiscipline)) &&
    (!searchTerm || m.label.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", { zoomControl: true }).setView([41.9028, 12.4964], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap contributors" }).addTo(mapRef.current);
      clusterRef.current = L.markerClusterGroup();
      mapRef.current.addLayer(clusterRef.current);
    }
    clusterRef.current.clearLayers();
    filteredMarkers.forEach(m => {
      const color = m.type === "artist" ? "#1E90FF" : "#32CD32";
      const icon = new L.Icon({ iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`, iconSize: [21, 34], iconAnchor: [10, 34] });
      const marker = L.marker(m.coordinates, { icon });
      marker.on("click", () => { setSelectedMarker(m); setShowDetailPanel(true); });
      clusterRef.current.addLayer(marker);
    });
  }, [filteredMarkers]);

  const centerOnUser = () => {
    if (!navigator.geolocation) return alert("Geolocalizzazione non supportata");
    navigator.geolocation.getCurrentPosition(pos => mapRef.current.setView([pos.coords.latitude, pos.coords.longitude], 12));
  };

  return (
    <div className="map-dashboard-container">
      <div className="map-filters">
        <input type="text" placeholder="Cerca..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        <select value={filterCity} onChange={e => setFilterCity(e.target.value)}>
          <option value="">Tutte le città</option>
          <option value="Roma">Roma</option>
          <option value="Milano">Milano</option>
          <option value="Firenze">Firenze</option>
        </select>
        {profile?.role === "artist" && (
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)}>
            <option value="">Tutti i tag</option>
            <option value="Musica">Musica</option>
            <option value="Arte">Arte</option>
            <option value="Design">Design</option>
          </select>
        )}
        <select value={filterDiscipline} onChange={e => setFilterDiscipline(e.target.value)}>
          <option value="">Tutte le discipline</option>
          <option value="DJ">DJ</option>
          <option value="Visual">Visual</option>
          <option value="Musica">Musica</option>
        </select>
        <button className="btn small" onClick={centerOnUser}>My Location</button>
      </div>

      <div id="map" className="map-main" />

      {selectedMarker && !showDetailPanel && mapRef.current && (
        <div className="hover-preview visible" style={{
          left: `${mapRef.current.latLngToContainerPoint(selectedMarker.coordinates).x}px`,
          top: `${mapRef.current.latLngToContainerPoint(selectedMarker.coordinates).y - 120}px`
        }}>
          <div className="hover-card"><MarkerPopupContent marker={selectedMarker} /></div>
        </div>
      )}

      {selectedMarker && showDetailPanel && (
        <MarkerDetailPanel marker={selectedMarker} role={profile?.role || "artist"} onClose={() => setShowDetailPanel(false)} />
      )}

      {loading && <div className="map-loading">Caricamento markers…</div>}
    </div>
  );
};

export default MapDashboard;


















