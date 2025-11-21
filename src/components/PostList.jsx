import React from "react";
import PostCard from "@/components/PostCard";

const PostList = ({ posts, filterTag, viewMode }) => {
  const filtered = posts.filter(p =>
    !filterTag || p.art_tag?.split(", ").includes(filterTag)
  );

  if (viewMode === "masonry") {
    return (
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 mt-4 overflow-y-auto max-h-[60vh]">
        {filtered.map(post => (
          <div key={post.id} className="break-inside-avoid mb-4">
            <PostCard post={post} mode="masonry" />
          </div>
        ))}
      </div>
    );
  }

  if (viewMode === "threads") {
    const grouped = filtered.reduce((acc, post) => {
      if (!acc[post.author_name]) acc[post.author_name] = [];
      acc[post.author_name].push(post);
      return acc;
    }, {});

    return (
      <div className="flex flex-col gap-4 mt-4">
        {Object.entries(grouped).map(([author, group]) => (
          <div key={author} className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-4">
              <img src={group[0].avatar_url || "https://i.pravatar.cc/40"} className="w-10 h-10 rounded-full" />
              <span className="font-bold">{author}</span>
            </div>
            {group.map(p => (
              <PostCard key={p.id} post={p} mode="threads" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={
      viewMode === "cover"
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
        : "flex flex-col gap-4 mt-4"
    }>
      {filtered.map(post => (
        <PostCard key={post.id} post={post} mode={viewMode} />
      ))}
    </div>
  );
};

export default PostList;
