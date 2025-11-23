import React from "react";
import PostAction from "@/components/HomeSection/Post/PostAction";
import { PostTags } from "@/components/HomeSection/TagFilters";

const FeedMasonry = ({ posts, onTagClick, onLike, onSave, onShare, onReport, onCopyLink }) => {
  if (!posts || posts.length === 0) return <div className="text-gray-500">Nessun post</div>;

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-4">
      {posts.map(post => (
        <div key={post.id} className="mb-4 break-inside-avoid bg-white rounded-2xl shadow hover:shadow-lg p-4">
          {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="w-full rounded-xl object-cover" />}
          <h3 className="font-semibold text-lg mt-2">{post.title}</h3>
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
      ))}
    </div>
  );
};

export default FeedMasonry;










