import { Heart, MessageCircle } from "lucide-react";
import CommentList from "./CommentList";

const CommunityPost = ({
  post,
  expanded,
  onToggle,
  onLike,
  commentValue,
  onCommentChange,
  onCommentSubmit,
}) => {
  const initial = (post?.userName || "U").charAt(0).toUpperCase();
  const ts = post?.createdAt || post?.timestamp || null;
  return (
    <div className="rounded-2xl border border-[#eaeaea] bg-white/80 backdrop-blur-sm p-5 shadow-sm transition-all duration-200 ease-in-out hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-indigo-50 text-indigo-700 flex items-center justify-center text-sm font-semibold">
          {initial}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.userName}</p>
              {ts && <p className="text-xs text-gray-500">{new Date(ts).toLocaleString()}</p>}
            </div>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-7 text-gray-800">{post.content}</p>
          <div className="mt-4 flex items-center gap-3 text-sm">
            <button
              onClick={onLike}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-indigo-700 hover:bg-indigo-100 active:scale-95 transition-all duration-200 ease-in-out"
            >
              <Heart className={`h-4 w-4 ${post.liked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <button
              onClick={onToggle}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-gray-700 hover:bg-gray-200 active:scale-95 transition-all duration-200 ease-in-out"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Comments ({post.commentCount || (post.comments ? post.comments.length : 0)})</span>
            </button>
          </div>

          {expanded && (
            <CommentList
              comments={post.comments || []}
              value={commentValue}
              onChange={onCommentChange}
              onSubmit={onCommentSubmit}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPost;
