// src/components/HomeSection/NewPostButton.jsx
import React from "react";
import { Plus } from "lucide-react";

const NewPostButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full p-4 rounded-2xl shadow-md bg-white hover:bg-gray-100 transition-colors border border-gray-200"
    >
      <div className="w-10 h-10 bg-blue-500 rounded-full flex justify-center items-center text-white">
        <Plus />
      </div>
      <span className="text-gray-600 font-semibold">Crea nuovo post</span>
    </button>
  );
};

export default NewPostButton;
