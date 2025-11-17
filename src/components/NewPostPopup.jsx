import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function NewPostPopup({ isOpen, onClose, uploadFile, artTags, onPostSubmit }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Blocca scroll quando il popup è aperto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; }
  }, [isOpen]);

  useEffect(() => {
    if (!file) return setPreviewUrl(null);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!title.trim() && !description.trim() && !file) return;

    setLoading(true);
    let uploadedUrl = null;
    if (file && uploadFile) {
      uploadedUrl = await uploadFile(file, "posts");
    }

    onPostSubmit({
      title: title.trim(),
      description: description.trim(),
      tags: selectedTags,
      fileUrl: uploadedUrl,
    });

    setTitle("");
    setDescription("");
    setSelectedTags([]);
    setFile(null);
    setLoading(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4 text-center">Crea nuovo post</h2>

            <input
              type="text"
              placeholder="Titolo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg"
            />

            <textarea
              placeholder="Descrizione"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded-lg resize-none"
            />

            <div className="flex flex-wrap gap-2 mb-3">
              {artTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.name)}
                  className={`px-3 py-1 rounded-xl text-sm border transition-colors ${
                    selectedTags.includes(tag.name)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="mb-3 w-full"
            />

            {previewUrl && (
              <div className="mb-3">
                {file.type.startsWith("video")
                  ? <video src={previewUrl} controls className="w-full max-h-60 rounded-lg" />
                  : <img src={previewUrl} alt="preview" className="w-full max-h-60 rounded-lg" />
                }
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-semibold rounded-xl shadow hover:shadow-lg transition-all"
            >
              {loading ? "Caricamento..." : "Pubblica"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


