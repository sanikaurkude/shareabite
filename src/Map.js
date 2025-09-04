import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Map({ posts }) {
  return (
    <MapContainer
      center={[20.5937, 78.9629]} // Center: India
      zoom={5}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* ✅ Loop through posts and add markers */}
      {posts.map(
        (post) =>
          post.lat &&
          post.lng && (
            <Marker key={post.id} position={[post.lat, post.lng]}>
              <Popup>
                <strong>{post.meal}</strong> <br />
                📍 {post.location} <br />
                👤 {post.userEmail}
              </Popup>
            </Marker>
          )
      )}
    </MapContainer>
  );
}
