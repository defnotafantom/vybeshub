import React, { useState } from "react";

const AnimatedCard = ({ children, imageUrl, alt, className = "" }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <article className={`flex flex-col rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform animate-fade-in-scale ${className}`}>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`w-full object-cover rounded-t-2xl transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      <div className="p-4 flex-1 flex flex-col justify-between">
        {children}
      </div>
    </article>
  );
};

export default AnimatedCard;

