import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./footer";

function Posts() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function getPosts() {
      const res = await fetch("http://localhost:5000/api/posts/posts");
      const data = await res.json();
      
      const list = data?.data || data?.posts || (Array.isArray(data) ? data : []);
      setPosts(list);
    }
    getPosts();
  }, []);


  const navigate = useNavigate();
  const categories = ["All", "technology", "cybersecurity", "energy"];
  const filteredPosts = selectedCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  return (
    <>
      <link rel="stylesheet" href="/posts.css" />
      <div className="blog-container">
        <section className="hero-section">
          <h1 className="hero-title">Latest Blogs</h1>
          <p className="hero-description">
            <b>Rahaf Blog is simply dummy text of the printing and typesetting industry. Rahaf Blog has been the
            industry's standard dummy text ever.</b>
          </p>
        </section>

        <section className="filter-section">
          {categories.map(category => (
            <button 
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </section>

        <section className="posts-grid">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="post-card"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/posts/${post.id}`)}
            >
              <div className="post-image">
                <img
                  src={post.image && typeof post.image === 'string' && post.image.startsWith('http')
                    ? post.image
                    : "https://via.placeholder.com/300x200/4f46e5/ffffff?text=Blog+Image"}
                  alt={post.title}
                  style={{ objectFit: 'cover', width: '100%', height: '200px', background: '#f6f8fa' }}
                />
                <span className="post-category">{post.category || "General"}</span>
              </div>
              <div className="post-content">
                <h3 className="post-title">{post.title}</h3>
                <p className="post-excerpt">{post.content}</p>
                <div className="post-meta">
                  <span>By User {post.user_id}</span>
                  <span>{post.created_at ? new Date(post.created_at).toLocaleDateString() : "Recently"}</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
  <Footer/>
    </>
  );
}

export default Posts;