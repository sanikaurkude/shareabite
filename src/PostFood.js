import React, { useState } from "react";
import { auth, db } from "./Firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function PostFood() {
  const [meal, setMeal] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  // ✅ Add new post
  const handleAddPost = async () => {
    if (!meal || !location) return;
    await addDoc(collection(db, "posts"), {
      meal,
      location,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.uid,
      email: auth.currentUser.email, // ✅ Save email with post
    });
    setMeal("");
    setLocation("");
    alert("Post added successfully!");
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
          <Link to="/myposts" className="hover:underline">
            My Posts
          </Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Post Form */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Share a Meal 🍲</h2>
        <input
          value={meal}
          onChange={(e) => setMeal(e.target.value)}
          placeholder="Enter your meal"
          className="border p-2 mr-2 rounded"
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter location"
          className="border p-2 mr-2 rounded"
        />
        <button
          onClick={handleAddPost}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </div>
  );
}







