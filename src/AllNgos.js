import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "./Firebase/firebase";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search } from "lucide-react"; // Icon for search

// ✅ Fix leaflet marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function AllNgos() {
  const [ngos, setNgos] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNgos = async () => {
      const snapshot = await getDocs(collection(db, "ngos"));
      setNgos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchNgos();
  }, []);

  const handleLogout = () => {
    signOut(auth);
    navigate("/login");
  };

  // ✅ Filter NGOs by search
  const filteredNgos = ngos.filter((ngo) =>
    ngo.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 text-white p-4 flex justify-between fixed top-0 left-0 right-0 shadow-md z-50">
        <h1 className="text-2xl font-bold tracking-wide">🏢 All NGOs</h1>
        <div className="space-x-6 hidden sm:flex">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/postfood" className="hover:underline">Post Food</Link>
          <Link to="/myposts" className="hover:underline">My Posts</Link>
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        </div>
      </nav>

      {/* ✅ Search Bar */}
      <div className="pt-24 px-6 max-w-4xl mx-auto">
        <div className="flex items-center bg-white shadow-md rounded-xl p-3">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Search NGOs by name..."
            className="w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ✅ NGO List */}
      <div className="px-6 pb-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mt-6">
        {filteredNgos.length === 0 ? (
          <p className="col-span-full text-center text-gray-600">
            No NGOs available.
          </p>
        ) : (
          filteredNgos.map((ngo) => (
            <div
              key={ngo.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden border flex flex-col"
            >
              {/* NGO Info */}
              <div className="p-4 flex-1">
                <h3 className="text-lg font-bold text-gray-800">{ngo.name}</h3>
                <p className="text-gray-600">📍 {ngo.address}</p>

                {/* ✅ Call / WhatsApp buttons */}
                <div className="mt-2 flex gap-3">
                  <a
                    href={`tel:${ngo.contact}`}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700"
                  >
                    📞 Call
                  </a>
                  <a
                    href={`https://wa.me/${ngo.contact}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
                  >
                    💬 WhatsApp
                  </a>
                </div>

                {/* View on Map button */}
                {ngo.lat && ngo.lng && (
                  <a
                    href={`https://www.google.com/maps?q=${ngo.lat},${ngo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-3 text-blue-600 hover:underline text-sm"
                  >
                    📍 View on Google Maps
                  </a>
                )}
              </div>

              {/* ✅ Mini Map */}
              {ngo.lat && ngo.lng && (
                <div className="h-40 w-full">
                  <MapContainer
                    center={[ngo.lat, ngo.lng]}
                    zoom={15}
                    className="w-full h-40 rounded-b-xl z-0 relative"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution="© OpenStreetMap contributors"
                    />
                    <Marker position={[ngo.lat, ngo.lng]}>
                      <Popup>{ngo.name}<br />{ngo.address}</Popup>
                    </Marker>
                  </MapContainer>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}



