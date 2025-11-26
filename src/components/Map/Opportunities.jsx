import React, { useEffect, useState } from "react";
import OpportunitiesSection from "@/components/OpportunitiesSection";

export default function Opportunities({ user }) {
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    // Caricamento dati (Supabase o statico)
    setMarkers([
      { id: 1, label: "Opportunità Milano", city: "Milano", description: "Lavoro creativo", avatar: "/icons/milano.png", badges: ["Job"] },
      { id: 2, label: "Collab Roma", city: "Roma", description: "Collaborazione artistica", avatar: "/icons/roma.png", badges: ["Collab"] },
    ]);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Opportunità</h1>
      <OpportunitiesSection markers={markers} onSelect={() => {}} user={user} />
    </div>
  );
}