// src/components/MapViewportLoader.jsx
import { useEffect } from "react";
import L from "leaflet";
import { supabase } from "@/lib/supabaseClient";

export default function MapViewportLoader({ map, type="artist", onMarkersFetched }) {
  useEffect(() => {
    if (!map) return;
    const fetchMarkersInBounds = async () => {
      const bounds = map.getBounds();
      const { data } = await supabase.from(type+"s")
        .select("*")
        .gte("lat", bounds.getSouth())
        .lte("lat", bounds.getNorth())
        .gte("lng", bounds.getWest())
        .lte("lng", bounds.getEast());
      onMarkersFetched(data.map(m => ({ ...m, type })));
    };
    fetchMarkersInBounds();
    map.on("moveend", fetchMarkersInBounds);
    return () => map.off("moveend", fetchMarkersInBounds);
  }, [map]);
  return null;
}
