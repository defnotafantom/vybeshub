import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MapViewportLoader({ map, onMarkersFetched }) {
  useEffect(() => {
    if (!map) return;

    const fetchMarkersInBounds = async () => {
      const bounds = map.getBounds();

      // Fetch dai marker generici
      const { data } = await supabase
        .from("markers")
        .select("*")
        .gte("latitude", bounds.getSouth())
        .lte("latitude", bounds.getNorth())
        .gte("longitude", bounds.getWest())
        .lte("longitude", bounds.getEast());

      if (!data) return;

      // Trasforma per la mappa
      const markers = data.map(m => ({
        ...m,
        coordinates: [Number(m.latitude), Number(m.longitude)]
      }));

      onMarkersFetched(markers);
    };

    fetchMarkersInBounds();
    map.on("moveend", fetchMarkersInBounds);
    return () => map.off("moveend", fetchMarkersInBounds);
  }, [map]);
  return null;
}
