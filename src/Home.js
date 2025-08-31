import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch posts in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between">
  <h1 className="text-xl font-bold">ShareABite</h1>
  <div className="space-x-4">
    {/* Removed Home link */}
    <Link to="/postfood" className="hover:underline">Post Food</Link>
    <Link to="/myposts" className="hover:underline">My Posts</Link>
    <button onClick={handleLogout} className="hover:underline">Logout</button>
  </div>
</nav>


      {/* ✅ Meal List */}
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Available Meals</h3>
        {posts.length === 0 ? (
          <p>No meals shared yet.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li key={post.id} className="border p-2 rounded">
                🍲 {post.meal} - 📍 {post.location} <br />
                <span className="text-sm text-gray-500">Posted by: {post.userEmail}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}


