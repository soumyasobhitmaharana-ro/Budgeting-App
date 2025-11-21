import { useEffect, useState, useContext } from "react";
import Dashboard from "../components/Dashboard";
import { AppContext } from "../context/AppContext";
import { listPosts, createPost, addComment, likePost } from "../util/communityClient";
import { toast } from "react-hot-toast";
import CreatePost from "../components/CreatePost";
import CommunityPost from "../components/CommunityPost";

const Community = () => {
  const { user } = useContext(AppContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newPost, setNewPost] = useState("");
  const [expanded, setExpanded] = useState(() => new Set());
  const [commentInputs, setCommentInputs] = useState({});

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await listPosts();
      setPosts(data || []);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim()) {
      toast.error("Write something to post");
      return;
    }
    setCreating(true);
    try {
      await createPost(newPost.trim());
      setNewPost("");
      toast.success("Post published");
      await fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("Failed to create post");
    } finally {
      setCreating(false);
    }
  };

  const toggleExpand = (postId) => {
    const next = new Set(expanded);
    if (next.has(postId)) next.delete(postId); else next.add(postId);
    setExpanded(next);
  };

  const handleAddComment = async (postId) => {
    const content = (commentInputs[postId] || "").trim();
    if (!content) {
      toast.error("Write a comment first");
      return;
    }
    try {
      await addComment(postId, content);
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      toast.success("Comment added");
      await fetchPosts();
      setExpanded((prev) => new Set(prev).add(postId));
    } catch (e) {
      console.error(e);
      toast.error("Failed to add comment");
    }
  };

  const handleLike = async (postId) => {
    try {
      await likePost(postId);
      await fetchPosts();
    } catch (e) {
      console.error(e);
      toast.error("Failed to like post");
    }
  };

  

  return (
    <Dashboard activeMenu="Community">
      <div className="p-6">
        <div className="mb-6">
          <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-[1px] shadow">
            <div className="rounded-2xl bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Community</h1>
                  <p className="text-sm text-gray-600 mt-1">Share tips, learn from others, and stay motivated.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CreatePost
              user={user}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              onSubmit={handleCreatePost}
              creating={creating}
              disabled={!newPost.trim()}
            />

            <div className="space-y-4">
              {loading ? (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                  <div className="mt-4 h-3 w-full animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-gray-200" />
                  <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-200" />
                </div>
              ) : posts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-600">
                  No posts yet. Be the first to share!
                </div>
              ) : (
                posts.map((p) => (
                  <CommunityPost
                    key={p.id}
                    post={p}
                    expanded={expanded.has(p.id)}
                    onToggle={() => toggleExpand(p.id)}
                    onLike={() => handleLike(p.id)}
                    commentValue={commentInputs[p.id] || ""}
                    onCommentChange={(e) => setCommentInputs((prev) => ({ ...prev, [p.id]: e.target.value }))}
                    onCommentSubmit={() => handleAddComment(p.id)}
                  />
                ))
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Community Guidelines</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Be respectful and constructive.</li>
                <li>• Keep tips actionable and concise.</li>
                <li>• Avoid sharing sensitive information.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Posting Tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>• Share your best budgeting wins.</li>
                <li>• Ask specific questions to get better answers.</li>
                <li>• Like helpful posts to boost them.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Dashboard>
  );
}
;

export default Community;
