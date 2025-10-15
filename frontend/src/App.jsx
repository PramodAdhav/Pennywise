import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import History from "./Pages/History";
import Insights from "./Pages/Insights";
import Calendar from "./Pages/Calendar";
import Track from "./Pages/Tracker";

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Track" element={<Track />} />
          <Route path="/History" element={<History />} />
          <Route path="/Insights" element={<Insights />} />
          <Route path="/Calendar" element={<Calendar />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
