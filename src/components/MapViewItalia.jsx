import React, { useState, useRef, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";

const italyGeoUrl =
  "https://raw.githubusercontent.com/openpolis/geojson-italy/master/geojson/limits_IT_regions.geojson";

const MapViewItalia = ({ markers = [], sidebarWidth = 250, marginX = 20, marginY = 20 }) => {
  const containerRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [targetZoom, setTargetZoom] = useState(1);
  const [center, setCenter] = useState([12.5, 42]);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef(null);
  const [size, setSize] = useState({ width: 400, height: 400 });
  const [filters, setFilters] = useState({});

  const minZoom = 0.5;
  const maxZoom = 20;

  // Aggiorna dimensioni responsive
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth - sidebarWidth - 3 * marginX - 300; // spazio per box
      const height = window.innerHeight - 2 * marginY;
      const dimension = Math.min(width, height); // mantiene proporzioni quadrate
      setSize({ width: dimension, height: dimension });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [sidebarWidth, marginX, marginY]);

  // Zoom fluido
  useEffect(() => {
    const animateZoom = () => {
      setZoom((z) => {
        const diff = targetZoom - z;
        if (Math.abs(diff) < 0.01) return targetZoom;
        return z + diff * 0.2;
      });
      if (Math.abs(targetZoom - zoom) > 0.01) requestAnimationFrame(animateZoom);
    };
    requestAnimationFrame(animateZoom);
  }, [targetZoom]);

  // Drag
  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStart.current = [e.clientX, e.clientY];
  };
  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart.current) return;
    const [startX, startY] = dragStart.current;
    const dx = (e.clientX - startX) * 0.015 / zoom;
    const dy = (e.clientY - startY) * 0.015 / zoom;
    setCenter(([lon, lat]) => {
      let newLon = lon - dx;
      let newLat = lat + dy;
      newLon = Math.max(6, Math.min(19, newLon));
      newLat = Math.max(36, Math.min(47, newLat));
      return [newLon, newLat];
    });
    dragStart.current = [e.clientX, e.clientY];
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    dragStart.current = null;
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = 1.1;
    if (e.deltaY < 0) setTargetZoom((z) => Math.min(z * zoomFactor, maxZoom));
    else setTargetZoom((z) => Math.max(z / zoomFactor, minZoom));
  };

  // Stile box (sia mappa che filtri)
  const boxStyle = {
    borderRadius: "1.5rem",
    background: "rgba(229, 231, 235, 0.4)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    fontFamily: "Arial, sans-serif",
    fontWeight: "bold",
    color: "#111827",
    overflow: "hidden",
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        background: "#f0f2f5",
        display: "flex",
        justifyContent: "flex-end", // allinea tutto a destra
        gap: `${marginX}px`,
        padding: `${marginY}px`,
        boxSizing: "border-box",
        alignItems: "flex-start",
      }}
    >
      {/* Mappa */}
      <div
        ref={containerRef}
        style={{
          ...boxStyle,
          width: size.width,
          height: size.height,
          cursor: isDragging ? "grabbing" : "grab",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center, scale: 3500 * zoom }}
          width={size.width}
          height={size.height}
        >
          <Geographies geography={italyGeoUrl} style={{ pointerEvents: "none" }}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#cce5ff", stroke: "#333", cursor: "grab" },
                    hover: { fill: "#cce5ff", stroke: "#333", cursor: "grab" },
                    pressed: { fill: "#cce5ff", stroke: "#333", cursor: "grab" },
                  }}
                />
              ))
            }
          </Geographies>

          {markers.map((marker, idx) => (
            <Marker key={idx} coordinates={marker.coordinates}>
              <circle r={5} fill="#ff5252" stroke="#fff" strokeWidth={1} />
              <text
                textAnchor="middle"
                y={-10}
                style={{ fontFamily: "Arial", fill: "#333", fontSize: 12 }}
              >
                {marker.label}
              </text>
            </Marker>
          ))}
        </ComposableMap>
      </div>

      {/* Box filtri */}
      <div
        style={{
          ...boxStyle,
          width: 300,
          minHeight: size.height,
        }}
      >
        {/* Pulsanti zoom */}
        <div style={{ display: "flex", gap: "8px" }}>
          {["+", "–"].map((label, i) => (
            <button
              key={i}
              onClick={() =>
                setTargetZoom((z) =>
                  label === "+" ? Math.min(z * 1.5, maxZoom) : Math.max(z / 1.5, minZoom)
                )
              }
              style={{
                flex: 1,
                padding: "12px 0",
                borderRadius: "1.5rem",
                border: "none",
                background: "rgba(229, 231, 235, 0.6)",
                color: "#111827",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Barra ricerca e filtri */}
        {[
          { type: "input", placeholder: "Cerca...", key: "search" },
          { type: "select", placeholder: "Seleziona città", options: ["Roma", "Milano"], key: "city" },
          { type: "select", placeholder: "Seleziona art_tag", options: ["Tag1"], key: "art_tag" },
          { type: "input", placeholder: "Parola chiave", key: "keyword" },
          { type: "select", placeholder: "Data pubblicazione", options: ["Più recenti", "Più vecchi"], key: "date" },
        ].map((field) =>
          field.type === "input" ? (
            <input
              key={field.key}
              type="text"
              placeholder={field.placeholder}
              value={filters[field.key] || ""}
              onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
              style={{
                padding: "10px",
                borderRadius: "1.5rem",
                border: "none",
                background: "rgba(229, 231, 235, 0.4)",
                color: "#111827",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}
            />
          ) : (
            <select
              key={field.key}
              value={filters[field.key] || ""}
              onChange={(e) => setFilters({ ...filters, [field.key]: e.target.value })}
              style={{
                padding: "10px",
                borderRadius: "1.5rem",
                border: "none",
                background: "rgba(229, 231, 235, 0.4)",
                color: "#111827",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                transition: "all 0.3s",
              }}
            >
              <option value="">{field.placeholder}</option>
              {field.options &&
                field.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
            </select>
          )
        )}
      </div>
    </div>
  );
};

export default MapViewItalia;









