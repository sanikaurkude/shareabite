import React, { useState, useEffect } from "react";
import { collection, addDoc, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";


export default function TestFirestore() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState(""); // input state

  // Fetch users in real-time
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  // Add user
  const addUser = async () => {
    if (!name.trim()) {
      alert("Please enter a name!");
      return;
    }
    await addDoc(collection(db, "users"), {
      name,
      createdAt: serverTimestamp(),
    });
    alert("User added!");
    setName(""); // clear input
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>🔥 Firestore Test</h2>

      {/* Input field */}
      <input
        type="text"
        value={name}
        placeholder="Enter name"
        onChange={(e) => setName(e.target.value)}
        style={{ padding: "5px", marginRight: "10px" }}
      />

      <button onClick={addUser}>Add User</button>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.name} –{" "}
            {u.createdAt?.toDate
              ? u.createdAt.toDate().toString()
              : "No date"}
          </li>
        ))}
      </ul>
    </div>
  );
}
