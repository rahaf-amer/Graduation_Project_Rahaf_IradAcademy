import React, { useState } from "react";


export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data?.error || "Registration failed");
        return;
      }


      if (data?.token) localStorage.setItem("token", data.token);
      alert("Done");
      
      if (data.user?.role === "admin") {
        window.location.href = "/submitPost";
      } else {
        window.location.href = "/posts";
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    }
  };

  return (
    <>

      <link rel="stylesheet" href="/register.css" />

      <div className="register-full-bg">
        <div className="register-dialog">
          <div className="header">
            <h1>Create Account</h1>
            <p className="subtitle">Register to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group flex flex-col items-start">
              <div>
                <label>Full Name</label>
              </div>
              <div className="flex flex-1 w-full">
                <input
                  className="flex-1"
                  type="text"
                  placeholder="Rahaf Test"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group flex flex-col items-start">
              <div>
                <label>Email</label>
              </div>
              <div className="flex flex-1 w-full">
                <input
                  className="flex-1"
                  type="email"
                  placeholder="rahaf@test.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group flex flex-col items-start">
              <div>
                <label>Password</label>
              </div>
              <div className="flex flex-1 w-full">
                <input
                  className="flex-1"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>
            <div className="form-group flex flex-col items-start">
              <div>
                <label>Role</label>
              </div>
              <div className="flex flex-1 w-full">
                <select value={role} className="flex-1" onChange={(e) => setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button className="btn" type="submit">Register</button>
              <p className="footnote">
                Already have an account? <a href="/">Sign in</a>
              </p>
          </form>
        </div>
      </div >
    </>
  );
}