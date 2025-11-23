import React from "react";
import { Heart, Bookmark, Share2, Flag, Copy } from "lucide-react";
import { AiFillHeart } from "react-icons/ai";
import { FaBookmark } from "react-icons/fa";

const PostAction = ({ post, onLike, onSave, onShare, onReport, onCopyLink }) => {
  if (!post) return null;

  return (
    <div className="flex flex-wrap sm:flex-nowrap items-center justify-between mt-4 gap-2">
      
      {/* Like */}
      <button
        onClick={() => onLike(post.id)}
        className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
      >
        {post.isLiked ? <AiFillHeart className="text-red-500" /> : <Heart />}
        <span className="text-sm sm:block hidden">{post.likes}</span>
      </button>

      {/* Save */}
      <button
        onClick={() => onSave(post.id)}
        className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors"
      >
        {post.isSaved ? <AiFillBookmark className="text-blue-500" /> : <Bookmark />}
      </button>

      {/* Share */}
      <button
        onClick={() => onShare(post.id)}
        className="flex items-center gap-1 text-gray-600 hover:text-green-500 transition-colors"
      >
        <Share2 />
      </button>

      {/* Report */}
      <button
        onClick={() => onReport(post.id)}
        className="flex items-center gap-1 text-gray-600 hover:text-yellow-500 transition-colors"
      >
        <Flag />
      </button>

      {/* Copy Link */}
      <button
        onClick={() => onCopyLink(post.id)}
        className="flex items-center gap-1 text-gray-600 hover:text-purple-500 transition-colors"
      >
        <Copy />
      </button>
    </div>
  );
};

export default PostAction;






