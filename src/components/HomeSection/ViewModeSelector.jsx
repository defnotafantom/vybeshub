// src/components/HomeSection/ViewModeSelector.jsx
import React from "react";
import clsx from "clsx";
import { LayoutGrid, LayoutList, Layout, MessageSquare } from "lucide-react";

const ViewModeSelector = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-center gap-2 mt-2">
      <button
        onClick={() => setViewMode("cover")}
        className={clsx(
          "p-2 rounded-2xl transition-colors",
          viewMode === "cover" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        )}
      >
        <LayoutGrid size={18} />
      </button>
      <button
        onClick={() => setViewMode("social")}
        className={clsx(
          "p-2 rounded-2xl transition-colors",
          viewMode === "social" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        )}
      >
        <LayoutList size={18} />
      </button>
      <button
        onClick={() => setViewMode("masonry")}
        className={clsx(
          "p-2 rounded-2xl transition-colors",
          viewMode === "masonry" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        )}
      >
        <Layout size={18} />
      </button>
      <button
        onClick={() => setViewMode("threads")}
        className={clsx(
          "p-2 rounded-2xl transition-colors",
          viewMode === "threads" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
        )}
      >
        <MessageSquare size={18} />
      </button>
    </div>
  );
};

export default ViewModeSelector;

