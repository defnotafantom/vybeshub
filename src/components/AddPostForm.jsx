import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const AddPostForm = ({ user, onPostAdded, postToEdit, onPostUpdated, artTags }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || "");
      setDescription(postToEdit.description || "");
      setImageFile(null);
      setSelectedTags(postToEdit.art_tag ? postToEdit.art_tag.split(", ") : []);
    } else {
      setTitle("");
      setDescription("");
      setImageFile(null);
      setSelectedTags([]);
    }
  }, [postToEdit]);

  const uploadImage = async () => {
    if (!imageFile) return postToEdit?.image_url || null;
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data, error } = await supabase.storage
      .from("posts-images")
      .upload(filePath, imageFile, { upsert: true });
    if (error) throw error;

    const { publicUrl } = supabase.storage.from("posts-images").getPublicUrl(filePath);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const image_url = await uploadImage();

      if (postToEdit) {
        const { data, error } = await supabase
          .from("posts")
          .update({ title, description, image_url, art_tag: selectedTags.join(", ") })
          .eq("id", postToEdit.id)
          .single();
        if (error) throw error;
        onPostUpdated(data);
      } else {
        const { data, error } = await supabase
          .from("posts")
          .insert([{
            title,
            description,
            image_url,
            art_tag: selectedTags.join(", "),
            artist_id: user.id,
            created_at: new Date()
          }])
          .single();
        if (error) throw error;
        onPostAdded(data);
      }

      // reset form
      setTitle("");
      setDescription("");
      setImageFile(null);
      setSelectedTags([]);
    } catch (err) {
      console.error("Errore salvando post:", err.message);
      alert("Errore salvando post");
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow flex flex-col gap-3">
      <input
        type="text"
        placeholder="Titolo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        required
      />
      <textarea
        placeholder="Descrizione"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files[0])}
        className="border p-2 rounded"
      />

      {/* Tag selezionabili */}
      {artTags?.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {artTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 rounded-full text-sm border transition ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
      >
        {loading ? "Salvando..." : postToEdit ? "Aggiorna Post" : "Aggiungi Post"}
      </button>
    </form>
  );
};

export default AddPostForm;
