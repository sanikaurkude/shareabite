import React, { useEffect, useState } from "react";
import { db } from "./Firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Ngos() {
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    const fetchNgos = async () => {
      const snapshot = await getDocs(collection(db, "ngos"));
      setNgos(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchNgos();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Partner NGOs</h2>
      <ul className="space-y-4">
        {ngos.map((ngo) => (
          <li key={ngo.id} className="p-4 border rounded shadow">
            <h3 className="text-lg font-semibold">{ngo.name}</h3>
            <p>📍 {ngo.address}</p>
            <p>📞 {ngo.contact}</p>
            {/* Later we can add "Donate" button here */}
          </li>
        ))}
      </ul>
      <Link to="/home" className="block mt-4 text-blue-600 hover:underline">⬅ Back to Home</Link>
    </div>
  );
}
