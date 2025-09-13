import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ngosData = [
  {
    name: "jesus force foundation",
    address:
      "Plot No. 5 Hanuman Nagar, Near Rupam Traders, Baidyan Road, Medical Square-440024 (Near Rupam Traders)",
    phone: "9130137467",
    location: [21.1458, 79.0882],
  },
  {
    name: "CHALO KHUSHIYAN BATEIN",
    address:
      "First Floor, , Rughwani Building, Near Chai Villa, Mohanlal Rughwani Marg, Jaripatka-440014 (Near Chai Villa)",
    phone: "1800120327733",
    location: [21.1904, 79.1000],
  },
  {
    name: "Gaurishankar Bahuddeshiya Shikshan Sanstha",
    address:
      "Plot No 2, Behind Hanuman Mandir, Near Manewada Wasti, Manewada Besa Road, Manewada Road-440024 (Near Manewada Wasti)",
    phone: "9765257197",
    location: [21.1100, 79.0900],
  },
];

const Ngos = () => {
  const [search, setSearch] = useState("");

  const filteredNgos = ngosData.filter((ngo) =>
    ngo.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">🏢 All NGOs</h1>

      {/* ✅ Search Bar */}
      <input
        type="text"
        placeholder="Search NGOs by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-lg px-4 py-2 mb-6 rounded-lg shadow-md border border-gray-300 focus:ring-2 focus:ring-blue-500"
      />

      {/* ✅ NGO Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNgos.map((ngo, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {ngo.name}
            </h2>
            <p className="text-gray-600 mb-2">📍 {ngo.address}</p>

            {/* ✅ Action Buttons */}
            <div className="flex space-x-3 mb-3">
              <a
                href={`tel:${ngo.phone}`}
                className="bg-green-600 text-white px-3 py-1 rounded-md shadow hover:bg-green-700"
              >
                📞 Call
              </a>
              <a
                href={`https://wa.me/${ngo.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white px-3 py-1 rounded-md shadow hover:bg-green-600"
              >
                💬 WhatsApp
              </a>
            </div>

            {/* ✅ Google Maps Link */}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${ngo.location[0]},${ngo.location[1]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline mb-3"
            >
              📍 View on Google Maps
            </a>

            {/* ✅ Embedded Map */}
            <div className="h-40 w-full">
              <MapContainer
                center={ngo.location}
                zoom={15}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <Marker position={ngo.location}>
                  <Popup>{ngo.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ngos;
