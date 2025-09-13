import React, { useState } from "react";
import { db, storage, auth } from "./Firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

const PostFood = () => {
  const [meal, setMeal] = useState("");
  const [location, setLocation] = useState("");
  const [ngo, setNgo] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  const handlePostFood = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("🔵 Starting post...");
      let imageUrl = "";

      // 1️⃣ Upload image if file exists
      if (file) {
        console.log("🟢 Uploading file:", file.name);
        const storageRef = ref(storage, `meals/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(storageRef, file);
        console.log("✅ File uploaded:", snapshot.metadata.fullPath);

        imageUrl = await getDownloadURL(snapshot.ref);
        console.log("✅ Got download URL:", imageUrl);
      }

      // 2️⃣ Save post in Firestore
      const docRef = await addDoc(collection(db, "posts"), {
        meal,
        location,
        ngo,
        imageUrl,
        userId: auth.currentUser?.uid,
        createdAt: serverTimestamp(),
      });

      console.log("✅ Post saved with ID:", docRef.id);

      // Reset form
      setMeal("");
      setLocation("");
      setNgo("");
      setFile(null);
      alert("✅ Meal posted successfully!");
    } catch (err) {
      console.error("❌ Error posting meal:", err);
      setError("Failed to post meal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Inline Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 shadow-md z-50">
        <h1 className="text-xl font-bold tracking-wide">🍽 Share a Meal</h1>
        <div className="space-x-6 hidden sm:flex">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/myposts" className="hover:underline">My Posts</Link>
          <Link to="/Ngos" className="hover:underline">NGOs</Link>
          <button onClick={handleLogout} className="hover:underline">
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Centered Form */}
      <div className="flex justify-center items-center pt-24">
        <form
          onSubmit={handlePostFood}
          className="bg-white p-8 shadow-lg rounded-2xl w-96"
        >
          <h2 className="text-xl font-bold mb-4 text-center">🍲 Share a Meal</h2>

          <input
            type="text"
            placeholder="Meal Name"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            className="border w-full mb-3 p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="border w-full mb-3 p-2 rounded"
            required
          />
          <select
            value={ngo}
            onChange={(e) => setNgo(e.target.value)}
            className="border w-full mb-3 p-2 rounded"
            required
          >
            <option value="">Select NGO</option>
            <option value="CHALO KHUSHIYAN BATEIN">CHALO KHUSHIYAN BATEIN</option>
            <option value="jesus force foundation">jesus force foundation</option>
          </select>

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border w-full mb-3 p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full p-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Food"}
          </button>

          {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default PostFood;

