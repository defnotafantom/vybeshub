// FeedSocial.jsx
import React from "react";
import PostAction from "@/components/HomeSection/Post/PostAction";
import { PostTags } from "@/components/HomeSection/TagFilters";

const FeedSocial = ({ posts, onTagClick, onLike, onSave, onShare, onReport, onCopyLink }) => {
  if (!posts || posts.length === 0) return <div className="text-gray-500">Nessun post</div>;

  return (
    <div className="flex flex-col gap-6 mt-4">
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden"
          style={{ minHeight: "280px" }}
        >
          {post.imageUrl && (
            <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
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

export default FeedSocial;





















