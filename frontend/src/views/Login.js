import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom"; 
import { Form, Button, Container, Row, Col, Card, FormGroup } from "react-bootstrap";
import "../assets/scss/lbd/_login.scss";
import loginImage from "../assets/img/login1.jpg";
import axios from "axios";
import Heartbeat from "./Heartbeat.js";
import {FaUser, FaKey, FaBriefcase} from 'react-icons/fa'; 


function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [user_active, setUserActive] = useState("");
  const history = useHistory();
  const [redirecting, setRedirecting] = useState(false); 
  const [logoutTimer, setLogoutTimer] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!username || !password || !role) {
      alert("Semua field harus diisi!");
      return;
    }
  
    try {
      const response = await axios.post('http://10.70.10.139:5000/user-login', {
          username: username,
          password: password,
          role: role,
          user_active: true,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); 
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('username', response.data.username); 
        localStorage.setItem('user_active', response.data.user_active);
  
        alert(`Login sukses sebagai ${role}`);

        const lastRoute = localStorage.getItem("lastRoute");

        if (lastRoute) {
          setRedirecting(true);
          localStorage.removeItem("lastRoute"); 
          history.replace(lastRoute); 
        } else {
          navigateToRolePage(role);
        }
        } else {
          alert("Login gagal, periksa kembali kredensial Anda.");
        }
    } catch (error) {
      console.error("Error saat login:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  const handleUsername = (value) => {
    const numericValue = value.replace(/\D/g, "");
    setUsername(numericValue);
  };

  const navigateToRolePage = (role) => {
    if (role === "Admin") {
      history.push("/admin/beranda"); 
      <Heartbeat/>
    } else if (role === "Finance") {
      history.push("/finance/beranda-finance"); 
      <Heartbeat/>
    }
    else if (role === "Karyawan") {
      history.push("/karyawan/dashboard-karyawan2"); 
      <Heartbeat/>
    } 
    else if (role === "Super Admin") {
      history.push("/super-admin/master-user"); 
      <Heartbeat/>
    }
     else {
      history.push("/login"); 
    }
  }

  useEffect(() => {
    if (redirecting) {
      setRedirecting(false);
    }
  }, [redirecting]);

  return (
    <div className="sign-in__wrapper bg-light">
      <Container fluid className="d-flex align-items-center justify-content-center">
      <Row className="login-row element">
        {/* Kolom Gambar */}
        <Col xs={12} sm={6}>
          <img
            src={loginImage}
            alt="Login Illustration"
            className="login-illustration"
          />
        </Col>
        {/* Kolom untuk Form */}
        <Col xs={12} sm={6} className="form-container d-flex align-items-center">
          <Card className="login-card shadow mb-0 ">
            <Card.Body > 
              <h3 className="text-center font-form mt-3">Pijar Campina</h3>
              {/* <hr /> */}
              <div className="form-opening mt-3">
              Selamat datang di Sistem Pinjaman Karyawan.
              Silakan isi username, password, dan role terlebih dahulu.
              </div>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-2 mt-3" controlId="username">
                <span class="input-group-text bg-transparent  border-0" id="basic-addon1">
                <FaUser style={{ marginRight: '8px' }} />
                <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => handleUsername(e.target.value)}
                    required
                    style={{borderStyle: 'none', borderBottom:'solid', borderBottomWidth:1, borderRadius:0, borderColor:'#E3E3E3'}}
                  />
              </span>
                
                </Form.Group>
                <Form.Group className="mb-2" controlId="password">
                <span class="input-group-text bg-transparent  border-0" id="basic-addon1">
                <FaKey style={{ marginRight: '8px' }} />
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{borderStyle: 'none', borderBottom:'solid', borderBottomWidth:1, borderRadius:0, borderColor:'#E3E3E3'}}
                  />
                  </span>
                </Form.Group>
                <Form.Group className="mb-2" controlId="role">
                <span class="input-group-text bg-transparent  border-0" id="basic-addon1">
                <FaBriefcase style={{ marginRight: '8px' }} />
                  <Form.Select
                    className="form-control"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    required
                    style={{borderStyle: 'none', borderBottom:'solid', borderBottomWidth:1, borderRadius:0, borderColor:'#E3E3E3'}}
                  >
                    <option value="" hidden>
                      Pilih Role
                    </option>
                    <option value="Karyawan">Karyawan</option>
                    <option value="Finance">Finance</option>
                    <option value="Admin">Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </Form.Select>
                  </span>
                </Form.Group>

                <Button
                  // variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                  style={{ backgroundColor: "#fb7b6f", border: "none", color: "white", marginBottom:'15px'}}
                >
                  Masuk
                </Button>
                <p className="text-center font-footer" style={{fontSize:15}}>Lupa Password? Hubungi Admin</p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </Container>
    </div>
    
  );
}

export default Login;
