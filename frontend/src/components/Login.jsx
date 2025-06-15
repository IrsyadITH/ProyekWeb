import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import loginBg from "../img/background.jpeg"; // Gambar latar

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("status", res.data.user.status);
      onLoginSuccess();

      if (res.data.user.status === "Admin") {
        navigate("/DashboardAdmin");
      } else {
        navigate("/DashboardUser");
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Login gagal");
    }
  };

  return (
    <div className="login-page"           style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}>
      <div className="login-container">
        <div
          className="left-panel"
          style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="overlay">
            <h2 className="left-title">Sistem Manajemen Ruangan</h2>
            <p className="left-desc">
              Sistem ini memungkinkan pengguna untuk melihat ketersediaan,
              melakukan pemesanan, serta mengatur jadwal penggunaan ruangan
              dengan mudah dan transparan.
            </p>
          </div>
        </div>

        <div className="right-panel">
          <div className="form-box">
            <h1 className="main-title">
              <span className="orange">SiMaruk</span>
            </h1>
            <h2 className="subtitle">Sistem Manajemen Ruang Kelas</h2>
            <p className="instruction">
              Silahkan login menggunakan Username & Password anda!
            </p>

            {msg && <p className="error-message">{msg}</p>}

            <form onSubmit={handleLogin} className="login-form">
              <label className="form-label">Username</label>
              <input
                type="email"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />

              <label className="form-label">Password</label>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />

              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
