import React from "react";

export default function Footer() {
  return (
    <>
    <link rel="stylesheet" href="/footer.css"/>
    
    <footer className="footer glass-footer">
      <div className="footer-container">
        <div className="footer-section about">
          <h3>About Us</h3>
          <p>
            We are a creative tech team passionate about building modern and
            innovative web applications with love .
          </p>
        </div>

        <div className="footer-section contact">
          <h3>Contact With Us</h3>
          <ul>
            <li>Email: contact@rahafapp.com</li>
            <li>Phone: +49 123 456 789</li>
            <li>Location: Berlin, Germany</li>
          </ul>
        </div>

        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/posts">Posts</a></li>
          
            <li><a href="/login">Login</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Rahaf App. All rights reserved.</p>
      </div>
    </footer>
    </>
  );
}