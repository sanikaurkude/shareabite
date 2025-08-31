import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch only logged-in user's posts
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "posts"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  // ✅ Delete post
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "posts", id));
  };

  // ✅ Logout
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-lg font-bold">ShareABite</h1>
        <div className="space-x-4">
          <Link to="/home" className="hover:underline">
            Home
          </Link>
          <Link to="/postfood" className="hover:underline">
            Post Food
          </Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ My Posts Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">My Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li
                key={post.id}
                className="p-4 border rounded flex justify-between items-center"
              >
                <div>
                  🍲 <strong>{post.meal}</strong> - 📍 {post.location}
                  <p className="text-sm text-gray-600">{post.email}</p>
                </div>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
