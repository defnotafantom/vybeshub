// src/components/Map/MarkerDetailPanel.jsx
import React, { useEffect, useRef } from "react";
import MarkerPopupContent from "@/components/Map/MarkerPopupContent";

const MarkerDetailPanel = ({ marker, onClose }) => {
  const panelRef = useRef(null);

  useEffect(() => {
    if (!marker) return;
    const prevActive = document.activeElement;
    const toFocus = panelRef.current?.querySelector("button, a, input, [tabindex]") || panelRef.current;
    toFocus?.focus?.();
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevActive?.focus?.();
    };
  }, [marker, onClose]);

  if (!marker) return null;

  return (
    <div className="w-80 flex-shrink-0 bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-4 border border-blue-200/40 max-h-[80vh] overflow-y-auto" ref={panelRef}>
      <div className="flex justify-between items-start mb-4">
        <h2 className="font-bold text-xl">{marker.label}</h2>
        <button onClick={onClose} className="px-2 py-1 text-gray-700 rounded hover:bg-gray-200">Chiudi</button>
      </div>

      <MarkerPopupContent marker={marker} />

      {marker.extraInfo && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-inner">
          <h4 className="font-semibold mb-2">Info aggiuntive</h4>
          <p className="text-sm text-gray-700">{marker.extraInfo}</p>
        </div>
      )}
    </div>
  );
};

export default MarkerDetailPanel;
