import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Track from "./Pages/Tracker";
import History from "./Pages/History";
import Insights from "./Pages/Insights";
import Calendar from "./Pages/Calendar";
import SignupPage from "./Pages/SignupPage";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<SignupPage />} />

        {/* Protected routes with Navbar */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <LayoutWithNavbar />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

// Layout wrapper that includes Navbar and renders nested protected pages
function LayoutWithNavbar() {
  return (
    <>
      <Navbar />
      <div className="pt-20">
        <Routes>
          <Route path="home" element={<Home />} />
          <Route path="track" element={<Track />} />
          <Route path="history" element={<History />} />
          <Route path="insights" element={<Insights />} />
          <Route path="calendar" element={<Calendar />} />
          {/* Redirect any unknown protected route to /home */}
          <Route path="*" element={<Navigate to="home" />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
