// src/components/Map/MarkerPreview.jsx
import React from "react";

export default function MarkerPreview({ marker, onDetailClick }) {
  return (
    <div className="flex flex-col gap-1 bg-white/80 backdrop-blur-lg p-2 rounded-xl shadow-md text-xs">
      <div className="flex items-center gap-2">
        <img src={marker.avatar || '/icons/default-avatar.png'} alt={marker.label} className="w-8 h-8 rounded-full" />
        <div>
          <div className="font-semibold">{marker.label}</div>
          <div className="text-gray-500">{marker.city}</div>
        </div>
      </div>
      <div className="text-gray-700">{marker.description}</div>
      <button
        className="mt-1 px-2 py-1 bg-blue-600 text-white rounded text-xs"
        onClick={onDetailClick}
      >
        ➤ Dettaglio
      </button>
    </div>
  );
}
