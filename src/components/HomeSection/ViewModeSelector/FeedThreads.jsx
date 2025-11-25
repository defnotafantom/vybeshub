// FeedThreads.jsx
import React from "react";
import PostAction from "@/components/HomeSection/Post/PostAction";
import { PostTags } from "@/components/HomeSection/TagFilters";

const FeedThreads = ({ posts, onTagClick, onLike, onSave, onShare, onReport, onCopyLink }) => {
  if (!posts || posts.length === 0) return <div className="text-gray-500">Nessun post</div>;

  return (
    <div className="flex flex-col gap-4 mt-4">
      {posts.map(post => (
        <div
          key={post.id}
          className="bg-white rounded-2xl shadow hover:shadow-lg p-4 flex flex-col justify-between"
          style={{ minHeight: "220px" }}
        >
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-gray-700 text-sm line-clamp-4">{post.description}</p>
            {post.imageUrl && (
              <img src={post.imageUrl} alt={post.title} className="w-full rounded-xl object-cover mt-2 h-36" />
            )}
            <PostTags tags={post.tags} onTagClick={onTagClick} />
          </div>
          <div className="mt-2 self-end">
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

export default FeedThreads;
























