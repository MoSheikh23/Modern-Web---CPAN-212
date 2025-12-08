import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import DriversList from "./pages/drivers/DriversList";
import DriverForm from "./pages/drivers/DriverForm";
import VehiclesList from "./pages/vehicles/VehiclesList";
import VehicleForm from "./pages/vehicles/VehicleForm";
import TripsList from "./pages/trips/TripsList";
import TripForm from "./pages/trips/TripForm";

import Login from "./pages/auth/Login";
import VerifyOtp from "./pages/auth/VerifyOtp";


function ProtectedRoute({ children, roles }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (roles && roles.length > 0) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (!roles.includes(payload.role)) {
        alert("Unauthorized");
        navigate("/");
      }
    }
  }, []);

  return children;
}

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="navbar">
      <h1>Driver Management System</h1>
      <nav>
        {token ? (
          <>
            <NavLink to="/" className="nav-link">Dashboard</NavLink>
            <NavLink to="/drivers" className="nav-link">Drivers</NavLink>
            <NavLink to="/vehicles" className="nav-link">Vehicles</NavLink>
            <NavLink to="/trips" className="nav-link">Trips</NavLink>

            <button
              onClick={logout}
              style={{
                marginLeft: "20px",
                padding: "6px 12px",
                background: "red",
                color: "white",
                borderRadius: "4px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link">Login</NavLink>
        )}
      </nav>
    </header>
  );
}


function App() {
  return (
    <div className="app">
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route
            path="/drivers"
            element={
              <ProtectedRoute roles={["admin", "customer"]}>
                <DriversList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers/new"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DriverForm mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/drivers/:id/edit"
            element={
              <ProtectedRoute roles={["admin"]}>
                <DriverForm mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedRoute roles={["admin", "customer"]}>
                <VehiclesList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/new"
            element={
              <ProtectedRoute roles={["admin"]}>
                <VehicleForm mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vehicles/:id/edit"
            element={
              <ProtectedRoute roles={["admin"]}>
                <VehicleForm mode="edit" />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trips"
            element={
              <ProtectedRoute roles={["admin", "customer"]}>
                <TripsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/new"
            element={
              <ProtectedRoute roles={["admin"]}>
                <TripForm mode="create" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id/edit"
            element={
              <ProtectedRoute roles={["admin"]}>
                <TripForm mode="edit" />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
