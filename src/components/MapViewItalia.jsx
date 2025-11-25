// src/components/MapViewItalia.jsx
import React, { useEffect, useState } from "react";
import MapDashboard from "./MapDashboard";

export default function MapViewItalia(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-screen w-full flex items-center justify-center">Caricamento mappa…</div>;
  return <div className="h-[calc(100vh-2rem)] w-full"><MapDashboard {...props} /></div>;
}
































