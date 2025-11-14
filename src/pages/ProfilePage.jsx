// ProfilePage.jsx
import React from "react";

const dummyPosts = [
  { id: 1, img: "https://picsum.photos/200?1" },
  { id: 2, img: "https://picsum.photos/200?2" },
  { id: 3, img: "https://picsum.photos/200?3" },
  { id: 4, img: "https://picsum.photos/200?4" },
];

const ProfilePage = ({ user, onEdit }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold">{user.username}</h2>
          <p className="text-gray-500">{user.art_type}</p>
          <button
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-xl"
            onClick={onEdit}
          >
            Modifica Profilo
          </button>
        </div>
      </div>
      <p>{user.bio}</p>

      {/* Griglia post */}
      <div className="grid grid-cols-3 gap-2 mt-4">
        {dummyPosts.map((post) => (
          <img
            key={post.id}
            src={post.img}
            alt={`Post ${post.id}`}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
