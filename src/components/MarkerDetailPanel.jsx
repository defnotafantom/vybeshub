import React from "react";
import MarkerPopupContent from "./MarkerPopupContent";

const MarkerDetailPanel = ({ marker, onClose }) => {
  if (!marker) return null;

  return (
    <div className="md-modal-backdrop" onClick={onClose}>
      <div className="md-modal" onClick={e => e.stopPropagation()}>
        <div className="md-modal-header">
          <h3>{marker.label}</h3>
          <button className="md-close-btn" onClick={onClose}>Chiudi</button>
        </div>
        <div className="md-modal-body">
          <MarkerPopupContent marker={marker} />
          {marker.extraInfo && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg shadow-inner">
              <h4 className="font-semibold mb-2">Info aggiuntive</h4>
              <p className="text-sm text-gray-700">{marker.extraInfo}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkerDetailPanel;





