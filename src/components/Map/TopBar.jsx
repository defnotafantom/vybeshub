// src/components/Map/TopBar.jsx
import React from "react";

export default function TopBar({ showNewPost, setShowNewPost, searchQuery, setSearchQuery, filterType, setFilterType }) {
  return (
    <div className="flex items-center gap-4 bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-blue-200/40 w-full max-w-2xl">
      <button
        className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl text-lg font-bold shadow-lg"
        onClick={() => setShowNewPost(prev => !prev)}
        aria-label="Nuovo Annuncio"
      >
        +
      </button>
      <input
        type="text"
        placeholder="Cerca città o titolo..."
        className="flex-1 p-2 border rounded-xl"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
      />
      <select
        value={filterType}
        onChange={e => setFilterType(e.target.value)}
        className="p-2 border rounded-xl"
      >
        <option value="all">Tutti</option>
        <option value="artist">Artisti</option>
        <option value="opportunity">Opportunità</option>
      </select>
    </div>
  );
}
