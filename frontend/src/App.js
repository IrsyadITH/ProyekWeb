import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import DashboardAdmin from "./components/DashboardAdmin";
import DashboardUser from "./components/DashboardUser";
import Pengguna from './components/Pengguna';
import RuanganAdmin from './components/RuanganAdmin';
import RuanganUser from './components/RuanganUser';
import Dashboard from './components/Dashboard';

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStatus, setUserStatus] = useState(null); // "Admin" / "Mahasiswa" / "Dosen"

  useEffect(() => {
    const token = localStorage.getItem("token");
    const status = localStorage.getItem("status");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("token");
          localStorage.removeItem("status");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
          setUserStatus(status);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={<Login onLoginSuccess={() => {
            setIsAuthenticated(true);
            setUserStatus(localStorage.getItem("status"));
          }} />}
        />

        <Route
          path="/DashboardAdmin"
          element={
            isAuthenticated && userStatus === "Admin" ? <DashboardAdmin /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/DashboardUser"
          element={
            isAuthenticated && userStatus !== "Admin" ? <DashboardUser /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/Pengguna"
          element={
            isAuthenticated && userStatus === "Admin" ? <Pengguna /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/RuanganAdmin"
          element={
            isAuthenticated && userStatus === "Admin" ? <RuanganAdmin /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/RuanganUser"
          element={
            isAuthenticated && (userStatus === "Mahasiswa" || userStatus === "Dosen")
              ? <RuanganUser />
              : <Navigate to="/login" replace />
          }

        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
