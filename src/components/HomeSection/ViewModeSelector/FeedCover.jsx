// FeedCover.jsx
import React from "react";
import PostAction from "@/components/HomeSection/Post/PostAction";
import { PostTags } from "@/components/HomeSection/TagFilters";

const FeedCover = ({ posts, onTagClick, onLike, onSave, onShare, onReport, onCopyLink }) => {
  if (!posts || posts.length === 0) return <div className="text-gray-500">Nessun post</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {posts.map(post => (
        <div
          key={post.id}
          className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
          style={{ minHeight: "320px" }}
        >
          {post.imageUrl ? (
            /\.(mp4|webm|mov)$/i.test(post.imageUrl) ? (
              <video src={post.imageUrl} controls className="w-full h-48 object-cover" />
            ) : (
              <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
            )
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
              Nessuna immagine
            </div>
          )}
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
      ))}
    </div>
  );
};

export default FeedCover;























