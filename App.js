import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Policy from "./pages/Policy";
import Claims from "./pages/Claims";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("shieldride_user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (userData, token) => {
    localStorage.setItem("shieldride_token", token);
    localStorage.setItem("shieldride_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("shieldride_token");
    localStorage.removeItem("shieldride_user");
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={!user ? <Register login={login} /> : <Navigate to="/dashboard" />} />
        <Route path="/login" element={!user ? <Login login={login} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/policy" element={user ? <Policy user={user} logout={logout} /> : <Navigate to="/login" />} />
        <Route path="/claims" element={user ? <Claims user={user} logout={logout} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
