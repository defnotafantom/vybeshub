// src/components/Map/RightPanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import MarkerPopupContent from "@/components/Map/MarkerPopupContent";

export default function RightPanel({ activeMarker }) {
  return (
    <AnimatePresence>
      {activeMarker && (
        <motion.div
          key="rightPanel"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed right-10 top-[140px] bottom-[50px] w-96 max-h-[90vh] overflow-y-auto bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-blue-200/40 z-50"
        >
          <MarkerPopupContent marker={activeMarker} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
