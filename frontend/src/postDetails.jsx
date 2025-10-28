import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../public/posts.css";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`http://localhost:5000/api/posts/posts/${id}`);
        const data = await res.json();
        setPost(data?.post || data?.data || data);
      } catch (e) {
        console.error(e);
        setErr("Failed to load post");
      }
    }
    fetchPost();
  }, [id]);

  if (err) return <div className="post-details-center-message">{err}</div>;
  if (!post) return <div className="post-details-center-message">Loading...</div>;

  return (
    <div className="post-details-container">
      <img
        className="post-details-image"
        src={post.image || "https://via.placeholder.com/700x300/4f46e5/ffffff?text=Blog+Image"}
        alt={post.title}
      />
      <span className="post-details-category-tag">{post.category || 'General'}</span>
      <h1 className="post-details-title">{post.title}</h1>
      <div className="post-details-meta">{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recently"} • By User {post.user_id}</div>
      {post.long_description && (
        <div className="post-details-description">{post.long_description}</div>
      )}
      <div className="post-details-content">{post.content}</div>
    </div>
  );
}
