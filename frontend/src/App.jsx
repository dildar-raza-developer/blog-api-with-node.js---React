
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/posts`
    : "http://localhost:3000/api/posts";

function App() {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    async function fetchPosts() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}?page=1&limit=50`
            );

            if (!response.ok) {
                throw new Error("Unable to load blog posts.");
            }

            const result = await response.json();
            setPosts(Array.isArray(result) ? result : result.data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchPosts();
    }, []);

    async function openPost(slug) {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `${API_URL}/${encodeURIComponent(slug)}`
            );

            if (!response.ok) {
                throw new Error("Blog post not found.");
            }

            const result = await response.json();
            setSelectedPost(result.data || result);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function goHome() {
        setSelectedPost(null);
        setError("");
    }

    return (
        <div className="app">
            <nav className="navbar">
                <button className="brand" onClick={goHome}>
                    <span className="brand-icon">B</span>
                    <span>
                        <strong>My Blog Website</strong>
                        <small>Node.js + Express + React</small>
                    </span>
                </button>

                <button className="home-btn" onClick={goHome}>
                    Home
                </button>
            </nav>

            <main className="container">
                {!selectedPost && (
                    <section className="hero">
                        <span className="hero-label">
                            THE BLOG CORNER
                        </span>
                        <h1>Ideas worth reading.</h1>
                        <p>
                            Discover articles, tutorials and ideas
                            from the world of technology.
                        </p>
                    </section>
                )}

                {selectedPost && (
                    <button className="back-btn" onClick={goHome}>
                        ← Back to Blogs
                    </button>
                )}

                {loading && (
                    <div className="status">
                        <div className="spinner"></div>
                        <p>Loading articles...</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="error-box">
                        <h3>Oops! Something went wrong.</h3>
                        <p>{error}</p>
                        <button
                            className="primary-btn"
                            onClick={
                                selectedPost
                                    ? () => openPost(selectedPost.slug)
                                    : fetchPosts
                            }
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {!loading && !error && !selectedPost && (
                    <section className="blog-section">
                        <div className="section-heading">
                            <div>
                                <h2>Latest Articles</h2>
                                <p>
                                    Explore our latest posts and tutorials.
                                </p>
                            </div>
                            <span className="post-count">
                                {posts.length} Articles
                            </span>
                        </div>

                        {posts.length === 0 ? (
                            <div className="empty-state">
                                <h3>No articles yet</h3>
                                <p>
                                    Add a blog using Postman to get started.
                                </p>
                            </div>
                        ) : (
                            <div className="posts-grid">
                                {posts.map((post) => (
                                    <article
                                        className="post-card"
                                        key={post.id}
                                    >
                                        <div className="card-art">
                                            <span>
                                                {post.category?.toLowerCase()
                                                    .includes("react")
                                                    ? "⚛"
                                                    : post.category?.toLowerCase()
                                                        .includes("backend")
                                                        ? "⌘"
                                                        : "✦"}
                                            </span>
                                        </div>

                                        <div className="card-body">
                                            <span className="category">
                                                {post.category}
                                            </span>

                                            <h3>{post.title}</h3>

                                            <p className="description">
                                                {post.description}
                                            </p>

                                            <div className="card-footer">
                                                <span className="author">
                                                    <span className="avatar">
                                                        {post.author?.charAt(0) || "A"}
                                                    </span>
                                                    {post.author}
                                                </span>

                                                <button
                                                    className="read-btn"
                                                    onClick={() =>
                                                        openPost(post.slug)
                                                    }
                                                >
                                                    Read More <span>→</span>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </section>
                )}

                {!loading && !error && selectedPost && (
                    <article className="detail-card">
                        <span className="category">
                            {selectedPost.category}
                        </span>

                        <h1>{selectedPost.title}</h1>

                        <div className="detail-author">
                            <span className="avatar">
                                {selectedPost.author?.charAt(0) || "A"}
                            </span>
                            <span>
                                <strong>{selectedPost.author}</strong>
                                <small>Article Author</small>
                            </span>
                        </div>

                        <p className="detail-description">
                            {selectedPost.description}
                        </p>

                        <div className="article-content">
                            <h2>About this article</h2>
                            <p>{selectedPost.content}</p>
                        </div>

                        <div className="article-bottom">
                            <span>Category: {selectedPost.category}</span>
                            <button className="primary-btn" onClick={goHome}>
                                Explore More Articles
                            </button>
                        </div>
                    </article>
                )}
            </main>

            <footer className="footer">
                <h3>My Blog Website</h3>
                <p>Built with React, Node.js and Express.</p>
                <span>© 2026 My Blog Website</span>
            </footer>
        </div>
    );
}

export default App;
