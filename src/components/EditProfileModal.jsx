// EditProfileModal.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";

const DEFAULT_AVATAR = "/default-avatar.png"; // avatar di default
const ROLES = ["Ballerino/Ballerina", "Cantante"];

const EditProfileModal = ({ user, onClose, onProfileUpdated }) => {
  const { updateUserPassword } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState(ROLES[0]);
  const [newAvatar, setNewAvatar] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setUsername(user.username || "");
    setBio(user.bio || "");
    setRole(user.role || ROLES[0]);
    setNewAvatar(user.avatar_url || DEFAULT_AVATAR);
  }, [user]);

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileName = `avatars/${user.id}_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { publicUrl, error: urlError } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      if (urlError) throw urlError;

      setNewAvatar(publicUrl);
    } catch (err) {
      alert("Errore upload avatar: " + err.message);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Aggiorna il profilo
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ username, bio, role, avatar_url: newAvatar })
        .eq("id", user.id);
      if (updateError) throw updateError;

      // Cambio password
      if (newPassword) {
        if (!currentPassword) {
          setMessage("Inserisci la password attuale per cambiare la password.");
          setLoading(false);
          return;
        }
        await updateUserPassword(currentPassword, newPassword);
      }

      setMessage("Profilo aggiornato!");
      onProfileUpdated(); // aggiorna il profilo nella pagina
      onClose();
    } catch (err) {
      console.error(err);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 relative">
        <h2 className="text-xl font-bold mb-4">Modifica Profilo</h2>

        {message && <p className="text-red-500 mb-2">{message}</p>}

        {/* Avatar */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Avatar</label>
          <div className="flex items-center gap-2">
            <img
              src={newAvatar || DEFAULT_AVATAR}
              alt="Anteprima avatar"
              className="w-16 h-16 rounded-full object-cover border"
            />
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* Username */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Username</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Ruolo / tipo di arte */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Tipo di arte</label>
          <select
            className="w-full border p-2 rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Bio</label>
          <textarea
            className="w-full border p-2 rounded"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block mb-1 font-semibold">Cambia password</label>
          <input
            type="password"
            placeholder="Password attuale"
            className="w-full border p-2 rounded mb-2"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Nuova password"
            className="w-full border p-2 rounded"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-xl"
            onClick={onClose}
            disabled={loading}
          >
            Annulla
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-xl"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;

