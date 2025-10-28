
import { useEffect, useState } from "react";

function SubmitPost() {
  const [posts, setPosts] = useState([]);
  const [err, setErr] = useState("");


  const [form, setForm] = useState({ title: "", content: "", category: "", image: "" });


  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", content: "", category: "" });

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await fetch("http://localhost:5000/api/posts/posts");
        const json = await res.json();
        const list = json?.data || json?.posts || (Array.isArray(json) ? json : []);
        setPosts(list);

      } catch {
        setErr("Failed to load posts");
      }
    }
    getPosts();
  }, []);


  async function addPost(e) {
    e.preventDefault();
    setErr("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/posts/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Create failed");
      let created = json?.post || json?.createdPost || json?.data || json;
      // If user_id is missing, re-fetch posts to ensure consistency
      if (!created.user_id) {
        // re-fetch posts from backend
        const res2 = await fetch("http://localhost:5000/api/posts/posts", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined
        });
        const json2 = await res2.json();
        const list = json2?.data || json2?.posts || (Array.isArray(json2) ? json2 : []);
        setPosts(list);
      } else {
        setPosts((p) => [created, ...p]);
      }
  setForm({ title: "", content: "", category: "", image: "" });
    } catch (e) {
      setErr(e.message);
    }
  }


  function startEdit(p) {
    setEditingId(p.id);
    setEditForm({ title: p.title, content: p.content, category: p.category || "" });
  }
  function cancelEdit() {
    setEditingId(null);
    setEditForm({ title: "", content: "", category: "" });
  }


  async function saveEdit(id) {
    setErr("");
    try {
      const token = localStorage.getItem("token");
      // Find the original post to get user_id
      const original = posts.find(x => x.id === id);
      const bodyWithUser = { ...editForm, user_id: original?.user_id };
      const res = await fetch(`http://localhost:5000/api/posts/posts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(bodyWithUser),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Update failed");
      const updated = json?.updatedPost || json?.data || json;
      setPosts((p) => p.map((x) =>
        x.id === id ? { ...x, ...updated } : x
      ));
      cancelEdit();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function removePost(id) {
    if (!window.confirm("Delete this post?")) return;
    setErr("");
    try {
      const res = await fetch(`http://localhost:5000/api/posts/posts/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Delete failed");
      setPosts((p) => p.filter((x) => x.id !== id));
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/submitPost.css" />

      <div className="sp-pro-wrap">
        <header className="sp-pro-header">
          <h1 className="sp-pro-title">Post Management</h1>
          <p className="sp-pro-desc">Create, edit, and manage your blog posts with ease.</p>
        </header>

        <section className="sp-pro-form-section">
          <form className="sp-pro-form" onSubmit={addPost}>
            <div className="sp-pro-form-group">
              <label>Title</label>
              <input
                className="sp-pro-input"
                placeholder="Enter post title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="sp-pro-form-group">
              <label>Content</label>
              <textarea
                className="sp-pro-textarea"
                placeholder="Write your post content"
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                required
              />
            </div>
            <div className="sp-pro-form-group">
              <label>Tag</label>
              <input
                className="sp-pro-input"
                placeholder="Tag (e.g. technology)"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <div className="sp-pro-form-group">
              <label>رابط الصورة (اختياري)</label>
              <input
                className="sp-pro-input"
                type="text"
                placeholder="ضع رابط الصورة هنا (https://...)"
                value={form.image}
                onChange={e => setForm({ ...form, image: e.target.value })}
              />
              {form.image && (
                <img src={form.image} alt="صورة المنشور" style={{ maxWidth: 120, marginTop: 8, borderRadius: 8 }} />
              )}
            </div>
            <button type="submit" className="sp-pro-btn">+ Create Post</button>
            {err && <p className="sp-pro-error">{err}</p>}
          </form>
        </section>

        <section className="sp-pro-list-section">
          <h2 className="sp-pro-list-title">All Posts</h2>
          <div className="sp-pro-list">
            {posts.map((d, idx) => (
              <div key={d.id || d._id || idx} className="sp-pro-card">
                {editingId === d.id ? (
                  <div className="sp-pro-edit">
                    <div className="sp-pro-form-group">
                      <label>Title</label>
                      <input
                        className="sp-pro-input"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      />
                    </div>
                    <div className="sp-pro-form-group">
                      <label>Content</label>
                      <textarea
                        className="sp-pro-textarea"
                        rows={4}
                        value={editForm.content}
                        onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                      />
                    </div>
                    <div className="sp-pro-form-group">
                      <label>Tag</label>
                      <input
                        className="sp-pro-input"
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        placeholder="Category"
                      />
                    </div>
                    <div className="sp-pro-actions">
                      <button type="button" className="sp-pro-btn" onClick={() => saveEdit(d.id)}>Save</button>
                      <button type="button" className="sp-pro-btn sp-pro-btn-cancel" onClick={cancelEdit}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className="sp-pro-card-content">
                    <div className="sp-pro-card-head">
                      <span className="sp-pro-card-title">{d.title}</span>
                      <div className="sp-pro-actions">
                        <button type="button" className="sp-pro-btn" onClick={() => startEdit(d)}>Edit</button>
                        <button type="button" className="sp-pro-btn sp-pro-btn-delete" onClick={() => removePost(d.id)}>Delete</button>
                      </div>
                    </div>
                    <p className="sp-pro-card-content-text">{d.content}</p>
                    <div className="sp-pro-meta">
                      <span>Tag: {d.category ?? "-"}</span>
                      <span>User ID: {d.user_id}</span>
                      <span>Created: {d.created_at ? new Date(d.created_at).toLocaleString() : "-"}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {!posts.length && <p className="sp-pro-noposts">No posts yet.</p>}
          </div>
        </section>
      </div>
    </>
  );
}

export default SubmitPost;
