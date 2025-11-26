// src/components/Map/MarkerPopupContent.jsx
import React from "react";

const defaultAvatar = "/icons/default-avatar.png";

export default function MarkerPopupContent({ marker }) {
  if (!marker) return null;
  const isArtist = marker.type === 'artist';

  return (
    <div className="flex flex-col gap-2 bg-white/80 backdrop-blur-lg p-3 rounded-2xl shadow-md text-sm">
      <div className="flex items-center gap-2">
        <img src={marker.avatar || defaultAvatar} alt={marker.label} className="w-10 h-10 rounded-full" />
        <div>
          <h3 className="font-semibold">{marker.label}</h3>
          <p className="text-gray-500 text-xs">{marker.city}</p>
        </div>
      </div>
      <p>{marker.description}</p>
      {marker.badges?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {marker.badges.map(b => (
            <span key={b} className="px-2 py-1 bg-green-200 text-green-800 rounded-full text-xs">{b}</span>
          ))}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <button className="flex-1 px-2 py-1 bg-blue-600 text-white rounded-xl text-xs">{isArtist ? "Collabora" : "Candidati"}</button>
        <button className="flex-1 px-2 py-1 bg-gray-200 rounded-xl text-xs">Contatta</button>
      </div>
    </div>
  );
}
