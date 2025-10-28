import React, { useState } from "react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      return;
    }
    const data = await res.json();
    if (data.role === "admin") {
      window.location.href = "/submitPost";
    } else if (data.role === "user") {
      window.location.href = "/posts";
    }
  };

  return (
    <>
      <link rel="stylesheet" href="/register.css" />
      <div className="register-full-bg">
        <div className="register-dialog">
          <div className="header">
            <h1>Sign In</h1>
            <p className="subtitle">Enter your email to sign in to your account</p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group flex flex-col items-start">
              <div>
                <label htmlFor="email">Email</label>
              </div>
              <div className="flex flex-1 w-full">
                <input
                  className="flex-1"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group flex flex-col items-start">
              <div>
                <label htmlFor="password">Password</label>
              </div>
              <div className="flex flex-1 w-full">
                <input
                  className="flex-1"
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="btn">
              Sign In
            </button>
            <p className="footnote">
              Don't have an account? <a href="/register">Sign up</a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

