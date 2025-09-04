import React, { useEffect, useState } from "react";
import { auth, db } from "./Firebase/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  const [ngos, setNgos] = useState({}); // ✅ Store NGO data
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
      <nav className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 shadow-md z-50">
        <h1 className="text-xl font-bold">ShareABite</h1>
        <div className="space-x-4">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/myposts" className="hover:underline">My Posts</Link>
          <Link to="/postfood" className="hover:underline">Post Food</Link>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      </nav>

      {/* ✅ My Posts Section */}
      <div className="p-6 mt-20">
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
                  🍲 <strong>{post.meal}</strong> <br />
                  📍 {post.location} <br />
                  🏢 NGO:{" "}
                  <span className="font-medium">
                    {post.ngoId ? ngos[post.ngoId] || "Unknown NGO" : "Not assigned"}
                  </span> <br />
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

