import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { Music } from "lucide-react"; // icona musicale

// Componente TagFilters principale (con animazioni)
const TagFilters = ({ artTags = [], selectedTags = [], toggleTag, clearAll }) => {
  if (!artTags || artTags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 mb-2">
      <AnimatePresence>
        {artTags.map(tag => {
          const isSelected = selectedTags.includes(tag.name);

          return (
            <motion.button
              key={tag.id}
              layout
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: isSelected ? 1.1 : 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              onClick={() => toggleTag(tag.name)}
              className={clsx(
                "px-3 py-1 rounded-2xl shadow-md text-sm font-semibold transition-all duration-200 flex items-center gap-1 h-8",
                isSelected
                  ? "bg-blue-600 text-white scale-105 shadow-lg"
                  : "bg-blue-200 text-blue-800 hover:bg-blue-300"
              )}
            >
              <motion.span layout className="flex items-center gap-1">
                {tag.name}
                {tag.name === "Musica" && (
                  <Music size={14} className={isSelected ? "text-white" : "text-blue-800"} />
                )}
              </motion.span>
            </motion.button>
          );
        })}
      </AnimatePresence>

      {selectedTags.length > 0 && (
        <motion.button
          layout
          onClick={clearAll}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="ml-2 px-3 py-1 rounded-2xl shadow-md text-sm font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 h-8"
        >
          Pulisci
        </motion.button>
      )}
    </div>
  );
};

// Componente PostTags (senza animazioni)
export const PostTags = ({ tags = [], onTagClick }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onTagClick(tag)}
          className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-200 text-blue-800 hover:bg-blue-300 flex items-center gap-1 h-6 transition-colors"
        >
          {tag}
          {tag === "Musica" && <Music size={12} className="text-blue-800" />}
        </button>
      ))}
    </div>
  );
};

export default TagFilters;










