import React from "react";

const MapWrapper = ({ children }) => {
  return (
    <div className="w-full h-[80vh] md:h-[600px] rounded-xl overflow-hidden shadow-lg">
      {children}
    </div>
  );
};

export default MapWrapper;
