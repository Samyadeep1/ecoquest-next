// pages/profile.js
import { useEffect, useState } from "react";
import Router from "next/router";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    } else {
      Router.push("/");
    }
  }, []);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    Router.push("/");
  }

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>👤 Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <p><b>Age:</b> {user.age || <span style={{color:"red"}}>Missing</span>}</p>
      <p><b>Class / Grade:</b> {user.grade || <span style={{color:"red"}}>Missing</span>}</p>
      <p><b>Organization:</b> {user.organization || "-"}</p>
      <p><b>Points:</b> {user.points || 0}</p>
      <p><b>Badges:</b> {user.badges || 0}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
