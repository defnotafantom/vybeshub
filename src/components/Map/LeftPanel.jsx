// src/components/Map/LeftPanel.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeftPanel({ showNewPost, setShowNewPost }) {
  return (
    <AnimatePresence>
      {showNewPost && (
        <motion.div
          key="leftPanel"
          initial={{ x: -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-10 top-[140px] bottom-[50px] w-96 max-h-[90vh] overflow-y-auto bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-blue-200/40 z-50"
        >
          <h2 className="font-bold text-xl mb-2">Nuovo Annuncio</h2>
          {/* Qui potrai inserire il form */}
          <button
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-xl"
            onClick={() => setShowNewPost(false)}
          >
            Chiudi
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
