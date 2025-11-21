import React from "react";

const PostCard = ({ post, mode }) => {
  const media = post.image_url?.[0];

  const RenderMedia = () => {
    if (!media) return null;
    const isVideo = /\.(mp4|webm|mov)$/i.test(media);

    return isVideo
      ? <video src={media} controls className="w-full h-full object-cover rounded-lg" />
      : <img src={media} className="w-full h-full object-cover rounded-lg" />;
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-200">
      {(mode === "cover" || mode === "masonry") && (
        <div className="w-full h-56 overflow-hidden rounded-lg mb-3">
          <RenderMedia />
        </div>
      )}

      <h3 className="font-semibold text-lg">{post.title}</h3>
      <span className="text-gray-500 text-sm">
        {post.author_name} · {new Date(post.created_at).toLocaleDateString()}
      </span>

      {mode !== "cover" && media && (
        <div className="mt-3">
          <RenderMedia />
        </div>
      )}

      <p className="text-gray-700 text-sm mt-2">{post.caption}</p>
    </div>
  );
};

export default PostCard;



