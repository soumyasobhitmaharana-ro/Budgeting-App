import { Send } from "lucide-react";

const CommentList = ({
  comments = [],
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <div className="mt-4 space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="rounded-xl border border-purple-100 bg-white/60 backdrop-blur-sm p-3">
          <div className="flex items-start gap-2">
            <div className="h-7 w-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-semibold">
              {(c.userName || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-700">
                {c.userName}
              </p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-gray-800">
                {c.content}
              </p>
            </div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Write a comment..."
          className="flex-1 rounded-xl border border-purple-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={onSubmit}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-sm font-medium text-white shadow hover:shadow-md hover:brightness-105 active:scale-[0.98] transition-all duration-200 ease-in-out"
        >
          <Send className="h-4 w-4" />
          Comment
        </button>
      </div>
    </div>
  );
};

export default CommentList;
