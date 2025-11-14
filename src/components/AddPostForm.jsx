// AddPostForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

const AddPostForm = ({ onPostAdded, postToEdit, onPostUpdated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setDescription(postToEdit.description);
      setImageFile(null); // mantiene immagine esistente se non ne scegli una nuova
    } else {
      setTitle("");
      setDescription("");
      setImageFile(null);
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
        // Aggiorna post esistente
        const { data, error } = await supabase
          .from("posts")
          .update({ title, description, image_url })
          .eq("id", postToEdit.id)
          .single();

        if (error) throw error;
        onPostUpdated(data);
      } else {
        // Crea nuovo post
        const { data, error } = await supabase
          .from("posts")
          .insert([{ title, description, image_url, artist_id: supabase.auth.user().id }])
          .single();

        if (error) throw error;
        onPostAdded(data);
      }

      setTitle("");
      setDescription("");
      setImageFile(null);
    } catch (err) {
      console.error("Errore salvando post:", err.message);
      alert("Errore salvando post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow mb-6 flex flex-col gap-3">
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


