import React, { useState, useEffect } from "react";
import { db, auth } from "./Firebase/firebase";
import { addDoc, collection, serverTimestamp, getDocs } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";

export default function PostFood() {
  const [meal, setMeal] = useState("");
  const [location, setLocation] = useState("");
  const [ngoId, setNgoId] = useState("");   // ✅ Selected NGO
  const [ngos, setNgos] = useState([]);     // ✅ NGO list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch NGOs
  useEffect(() => {
    const fetchNgos = async () => {
      const querySnapshot = await getDocs(collection(db, "ngos"));
      setNgos(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNgos();
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  // ✅ Convert location to lat/lng (OpenStreetMap)
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error("Geocoding error:", err);
      return null;
    }
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const coords = await getCoordinates(location);

      await addDoc(collection(db, "posts"), {
        meal,
        location,
        lat: coords ? coords.lat : null,
        lng: coords ? coords.lng : null,
        ngoId,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        createdAt: serverTimestamp(),
      });

      setMeal("");
      setLocation("");
      setNgoId("");
      alert("Meal posted successfully ✅");
    } catch (err) {
      console.error("Error posting meal:", err);
      setError("Failed to post meal.");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 shadow-md z-50">
        <h1 className="text-xl font-bold">ShareABite</h1>
        <div className="space-x-4">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/myposts" className="hover:underline">My Posts</Link>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      </nav>

      {/* ✅ Form Section */}
      <div className="p-6 mt-20">
        <h2 className="text-xl font-semibold mb-4">Share a Meal</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Meal name"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Location (e.g. Nagpur, India)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="border p-2 w-full rounded"
          />

          {/* ✅ NGO Dropdown */}
          <select
            value={ngoId}
            onChange={(e) => setNgoId(e.target.value)}
            required
            className="border p-2 w-full rounded"
          >
            <option value="">Select NGO</option>
            {ngos.map((ngo) => (
              <option key={ngo.id} value={ngo.id}>
                {ngo.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading ? "Posting..." : "Post Food"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}

