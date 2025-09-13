import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "./Firebase/firebase"; // ✅ Import auth
import homepageImage from "./homepage.jpg";

const Home = () => {
  const navigate = useNavigate();

  // ✅ Define Logout Function
  const handleLogout = async () => {
    try {
      await signOut(auth); // ✅ Firebase Logout
      navigate("/login"); // ✅ Redirect to login after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{ backgroundImage: `url(${homepageImage})` }}
    >
      {/* ✅ Navbar */}
      <nav className="bg-blue-600 bg-opacity-80 text-white p-4 flex justify-between fixed top-0 left-0 right-0 shadow-md z-50">
        <h1 className="text-xl font-bold tracking-wide">🍽 ShareABite</h1>
        <div className="space-x-6 hidden sm:flex">
         
          <Link to="/postfood" className="hover:underline">Post Food</Link>
          <Link to="/myposts" className="hover:underline">My Posts</Link>
          <Link to="/Ngos" className="hover:underline">NGOs</Link>
          <button
            onClick={handleLogout}
            className="hover:underline text-red-300"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* ✅ Main Content */}
      <div className="flex flex-col justify-center items-center flex-grow pt-24 px-4 text-center bg-black bg-opacity-40">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 drop-shadow-lg">
          MEAL & FOOD DONATION
        </h1>

        <Link
          to="/postfood"
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg text-lg shadow-md"
        >
          Donate Now!
        </Link>
      </div>

      {/* ✅ Contact Section */}
      <div className="bg-white bg-opacity-90 shadow-md rounded-xl p-6 mx-auto mb-10 w-full max-w-2xl">
        <div className="flex flex-col sm:flex-row justify-around items-center text-gray-700">
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <span className="text-teal-600 text-xl">📧</span>
            <span>hello@reallygreatsite.com</span>
          </div>
          <div className="flex items-center space-x-2 mb-4 sm:mb-0">
            <span className="text-teal-600 text-xl">📞</span>
            <span>+123-456-7890</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-teal-600 text-xl">📍</span>
            <span>123 Anywhere St., Any City</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;


