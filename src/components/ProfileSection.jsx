// src/components/ProfileSection.jsx
import React from "react";
import EditProfileModal from "@/components/EditProfileModal";

const ProfileSection = ({ profile, setEditOpen, uploadFile }) => {
  if (!profile) return null;

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl p-4">
        <div className="bg-gray-100/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 flex flex-col gap-4 border border-blue-200/40">
          <div className="flex items-center gap-4">
            <img src={profile.avatar_url || "https://i.imgur.com/placeholder.png"} alt="Avatar" className="w-24 h-24 rounded-full border object-cover"/>
            <div>
              <h1 className="text-3xl font-bold">{profile.username || "Artista"}</h1>
              <p className="text-gray-600">{profile.art_type}</p>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
            <button className="ml-auto bg-blue-500 text-white px-4 py-2 rounded-xl" onClick={() => setEditOpen(true)}>Modifica Profilo</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;

