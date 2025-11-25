import React from "react";

const MarkerPopupContent = ({ marker }) => {
  if (!marker) return null;
  const isArtist = marker.type === "artist";

  return (
    <div className="max-w-xs p-3 bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        {isArtist && <img src={marker.avatar || "https://i.pravatar.cc/100"} alt={marker.label} className="hover-avatar object-cover" />}
        <div>
          <h3 className="hover-title">{marker.label}</h3>
          <p className="hover-sub">{marker.city}</p>
        </div>
      </div>
      <p className="text-sm mb-2">{marker.description}</p>
      {marker.badges && marker.badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {marker.badges.map((badge, idx) => <span key={idx} className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">{badge}</span>)}
        </div>
      )}
      <div className="flex gap-2 mt-2">
        {isArtist ? (
          <>
            <button className="btn small">Collabora</button>
            <button className="btn small bg-gray-200 text-gray-800 hover:bg-gray-300">Messaggio</button>
          </>
        ) : (
          <>
            <button className="btn small bg-blue-200 text-blue-800 hover:bg-blue-300">Candidati</button>
            <button className="btn small bg-gray-200 text-gray-800 hover:bg-gray-300">Info</button>
          </>
        )}
      </div>
    </div>
  );
};

export default MarkerPopupContent;




