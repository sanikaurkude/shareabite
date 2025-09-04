import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase/firebase";
import { collection, onSnapshot, orderBy, query, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import Map from "./Map"; // ✅ Import Map

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [ngos, setNgos] = useState({});
  const navigate = useNavigate();

  // ✅ Fetch posts in real-time
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // ✅ Fetch NGOs once
  useEffect(() => {
    const fetchNgos = async () => {
      const querySnapshot = await getDocs(collection(db, "ngos"));
      const ngoMap = {};
      querySnapshot.forEach((doc) => {
        ngoMap[doc.id] = doc.data().name;
      });
      setNgos(ngoMap);
    };
    fetchNgos();
  }, []);

  // ✅ Logout
  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  return (
    <div>
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 shadow-md z-50">
        <h1 className="text-xl font-bold">ShareABite</h1>
        <div className="space-x-4">
          <Link to="/postfood" className="hover:underline">Post Food</Link>
          <Link to="/myposts" className="hover:underline">My Posts</Link>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      </nav>

      {/* ✅ Content */}
      <div className="p-6 mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Meal List */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Available Meals</h3>
          {posts.length === 0 ? (
            <p>No meals shared yet.</p>
          ) : (
            <ul className="space-y-2">
              {posts.map((post) => (
                <li key={post.id} className="border p-2 rounded">
                  🍲 {post.meal} <br />
                  📍 {post.location} <br />
                  🏢 NGO:{" "}
                  <span className="font-medium">
                    {post.ngoId ? ngos[post.ngoId] || "Unknown NGO" : "Not assigned"}
                  </span> <br />
                  <span className="text-sm text-gray-500">Posted by: {post.userEmail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right: Map */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Map View</h3>
          <Map posts={posts} /> {/* ✅ Pass posts with lat/lng to Map */}
        </div>
      </div>
    </div>
  );
}






