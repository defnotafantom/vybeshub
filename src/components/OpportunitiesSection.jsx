// src/components/OpportunitiesSection.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const OpportunitiesSection = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    };
    fetchProfile();
  }, [user]);

  const isStager = profile?.role === "stager";
  const isArtist = profile?.role === "artist";

  useEffect(() => {
    const fetchOpportunities = async () => {
      if (!profile) return;
      let query = supabase.from("opportunities").select("*").order("created_at", { ascending: false });
      if (isStager) query = query.eq("creator_id", user.id);
      if (isArtist) query = query.eq("status", "open");
      const { data } = await query;
      if (data) setOpportunities(data);
    };
    fetchOpportunities();
  }, [profile]);

  const handleCreateOpportunity = async () => {
    if (!newTitle.trim()) return;
    const { data } = await supabase.from("opportunities").insert([{
      title: newTitle,
      description: newDescription,
      location: newLocation,
      creator_id: user.id,
      status: "open",
      candidates: []
    }]);
    if (data?.[0]) setOpportunities(prev => [data[0], ...prev]);
    setNewTitle(""); setNewDescription(""); setNewLocation("");
  };

  const handleDeleteOpportunity = async (id) => {
    await supabase.from("opportunities").delete().eq("id", id);
    setOpportunities(prev => prev.filter(o => o.id !== id));
  };

  const handleApply = async (opportunity) => {
    if (!isArtist) return;
    const newCandidates = [...(opportunity.candidates || []), user.id];
    await supabase.from("opportunities").update({ candidates: newCandidates }).eq("id", opportunity.id);
    setOpportunities(prev => prev.map(o => o.id === opportunity.id ? { ...o, candidates: newCandidates } : o));
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4">
      {isStager && (
        <div className="bg-white p-4 rounded-xl shadow-md mb-4">
          <h2 className="font-bold text-lg mb-2">Crea nuova opportunità</h2>
          <input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Titolo" className="w-full mb-2 p-2 border rounded"/>
          <input value={newDescription} onChange={e => setNewDescription(e.target.value)} placeholder="Descrizione" className="w-full mb-2 p-2 border rounded"/>
          <input value={newLocation} onChange={e => setNewLocation(e.target.value)} placeholder="Luogo" className="w-full mb-2 p-2 border rounded"/>
          <button onClick={handleCreateOpportunity} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Crea</button>
        </div>
      )}

      {opportunities.length === 0 ? (
        <p className="text-gray-500">Nessuna opportunità da mostrare</p>
      ) : (
        opportunities.map(o => (
          <div key={o.id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-start">
            <div>
              <h3 className="font-bold">{o.title}</h3>
              <p>{o.description}</p>
              <p className="text-sm text-gray-500">{o.location}</p>
              {isArtist && o.candidates?.includes(user.id) && <p className="text-green-600 font-bold">Candidatura inviata</p>}
            </div>
            <div className="flex flex-col gap-2">
              {isStager && <button onClick={() => handleDeleteOpportunity(o.id)} className="text-red-500 hover:text-red-700">Elimina</button>}
              {isArtist && !o.candidates?.includes(user.id) && (
                <button onClick={() => handleApply(o)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Candidati</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OpportunitiesSection;

