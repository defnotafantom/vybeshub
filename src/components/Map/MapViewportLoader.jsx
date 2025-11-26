// @/components/Map/MapViewportLoader.jsx
import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MapViewportLoader({ map, onMarkersFetched, debounceMs = 350 }) {
  const timer = useRef(null);
  const abortCtrl = useRef(null);

  const fetchMarkersInBounds = useCallback(async () => {
    if (!map) return;
    const bounds = map.getBounds();
    if (!bounds) return;
    const south = bounds.getSouth();
    const north = bounds.getNorth();
    const west = bounds.getWest();
    const east = bounds.getEast();

    if (abortCtrl.current) try { abortCtrl.current.abort(); } catch {}
    abortCtrl.current = new AbortController();
    const signal = abortCtrl.current.signal;

    try {
      const { data, error } = await supabase
        .from("markers")
        .select("*")
        .gte("latitude", south)
        .lte("latitude", north)
        .gte("longitude", west)
        .lte("longitude", east)
        .abortSignal(signal);

      if (error && error.message) {
        console.error("Supabase fetch error:", error);
        return;
      }

      const markers = (data || []).map(m => ({
        id: m.id ?? `${m.latitude}-${m.longitude}-${m.label ?? ""}`,
        label: m.label ?? m.title ?? "",
        description: m.description ?? "",
        lat: Number(m.latitude),
        lng: Number(m.longitude),
        city: m.city ?? "",
        avatar: m.avatar ?? undefined,
        raw: m
      }));

      onMarkersFetched && onMarkersFetched(markers);
    } catch (err) {
      if (err.name !== "AbortError") console.error("Failed to fetch markers:", err);
    }
  }, [map, onMarkersFetched]);

  useEffect(() => {
    if (!map) return;
    const wrapped = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => fetchMarkersInBounds(), debounceMs);
    };
    wrapped();
    map.on("moveend", wrapped);
    map.on("zoomend", wrapped);

    return () => {
      map.off("moveend", wrapped);
      map.off("zoomend", wrapped);
      if (timer.current) clearTimeout(timer.current);
      if (abortCtrl.current) try { abortCtrl.current.abort(); } catch {}
    };
  }, [map, fetchMarkersInBounds, debounceMs]);

  return null;
}
