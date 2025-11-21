import React, { useState } from "react";

const NewPostPopup = ({ isOpen, onClose, uploadFile, artTags, onPostSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    let fileUrl = null;
    if (file) fileUrl = await uploadFile(file, "posts");

    await onPostSubmit({ title, description, tags, fileUrl });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-bold mb-4">Nuovo Post</h2>

        <input
          type="text"
          placeholder="Titolo"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full p-2 border rounded-lg mb-3"
        />

        <textarea
          placeholder="Descrizione"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full p-2 border rounded-lg mb-3"
        />

        <label className="block mb-3">
          File:
          <input type="file" onChange={e => setFile(e.target.files[0])} className="mt-1" />
        </label>

        <p className="font-semibold mb-2">Tags</p>
        <div className="flex gap-2 flex-wrap mb-4">
          {artTags.map(tag => (
            <button
              key={tag.id}
              onClick={() =>
                setTags(prev => prev.includes(tag.name)
                  ? prev.filter(t => t !== tag.name)
                  : [...prev, tag.name])
              }
              className={`px-3 py-1 rounded-full border ${tags.includes(tag.name) ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {tag.name}
            </button>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg">Annulla</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Pubblica</button>
        </div>
      </div>
    </div>
  );
};

export default NewPostPopup;


