// src/components/Map/utils/icons.js
import L from "leaflet";

export const makeIcon = (url, size=[34,34], anchor=[17,34]) =>
  new L.Icon({ iconUrl: url, iconSize: size, iconAnchor: anchor, popupAnchor: [0,-28] });

export const artistIcon = makeIcon('/icons/artist.png');
export const oppIcon = makeIcon('/icons/opportunity.png');
