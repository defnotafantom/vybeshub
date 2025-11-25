import React from "react";
import { PostTags } from "@/components/HomeSection/TagFilters";
import PostAction from "@/components/HomeSection/Post/PostAction";

const PostCard = ({ post, onTagClick, onLike, onSave, onShare, onReport, onCopyLink }) => {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
      {/* Immagine o video se presente */}
      {post.imageUrl ? (
        /\.(mp4|webm|mov)$/i.test(post.imageUrl) ? (
          <video src={post.imageUrl} controls className="w-full h-56 object-cover" />
        ) : (
          <img src={post.imageUrl} alt={post.title} className="w-full h-56 object-cover" />
        )
      ) : null}

      {/* Contenuto */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-semibold text-lg">{post.title}</h3>
        <p className="text-gray-700 text-sm line-clamp-3">{post.description}</p>
        <PostTags tags={post.tags} onTagClick={onTagClick} />
        <PostAction
          post={post}
          onLike={onLike}
          onSave={onSave}
          onShare={onShare}
          onReport={onReport}
          onCopyLink={onCopyLink}
        />
      </div>
    </div>
  );
};

export default PostCard;






