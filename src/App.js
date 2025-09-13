import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";
import PostFood from "./PostFood";
import MyPosts from "./MyPosts";
import Ngos from "./NGOs";   // ✅ Admin-only NGO management page
import AllNgos from "./AllNgos"; // ✅ New page to display all NGOs
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/postfood"
          element={
            <ProtectedRoute>
              <PostFood />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myposts"
          element={
            <ProtectedRoute>
              <MyPosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngos"
          element={
            <ProtectedRoute>
              <Ngos />
            </ProtectedRoute>
          }
        />
        {/* ✅ New Route for NGO Listing */}
        <Route
          path="/allngos"
          element={
            <ProtectedRoute>
              <AllNgos />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
