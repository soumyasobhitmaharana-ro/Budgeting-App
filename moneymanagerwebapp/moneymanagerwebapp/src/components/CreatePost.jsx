import { Loader2, Send } from "lucide-react";

const CreatePost = ({ user, value, onChange, onSubmit, creating, disabled }) => {
  const initial = (user?.fullName || user?.name || "U").charAt(0).toUpperCase();
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="p-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-semibold">
            {initial}
          </div>
          <div className="flex-1">
            <textarea
              value={value}
              onChange={onChange}
              rows={3}
              placeholder={user ? `Share a tip, ${user.fullName || user.name || "friend"}...` : "Share a tip..."}
              className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none shadow-sm focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-3 flex items-center justify-end">
              <button
                onClick={onSubmit}
                disabled={creating || disabled}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg hover:shadow-xl hover:brightness-105 active:scale-[0.98] transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {creating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Post
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
