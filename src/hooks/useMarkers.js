// src/lib/useMarkers.js
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

export default function useMarkers(type="artist", pageSize=200) {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchPage = async () => {
      const { data, error } = await supabase
        .from(type+"s")
        .select("*")
        .range(page*pageSize, (page+1)*pageSize-1);

      if (error) console.error(error);
      if (data && data.length > 0) setMarkers(prev => [...prev, ...data.map(m => ({ ...m, type }))]);
      else setHasMore(false);
      setLoading(false);
    };
    fetchPage();
  }, [page, type, pageSize]);

  return { markers, loading, hasMore, nextPage: () => setPage(p => p+1) };
}



