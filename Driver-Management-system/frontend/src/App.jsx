import { BrowserRouter, NavLink, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DriversList from "./pages/drivers/DriversList";
import DriverForm from "./pages/drivers/DriverForm";
import VehiclesList from "./pages/vehicles/VehiclesList";
import VehicleForm from "./pages/vehicles/VehicleForm";
import TripsList from "./pages/trips/TripsList";
import TripForm from "./pages/trips/TripForm";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <h1>Driver Management System</h1>
        <nav>
          <NavLink to="/" className="nav-link">
            Dashboard
          </NavLink>
          <NavLink to="/drivers" className="nav-link">
            Drivers
          </NavLink>
          <NavLink to="/vehicles" className="nav-link">
            Vehicles
          </NavLink>
          <NavLink to="/trips" className="nav-link">
            Trips
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          
          <Route path="/drivers" element={<DriversList />} />
          <Route path="/drivers/new" element={<DriverForm mode="create" />} />
          <Route path="/drivers/:id/edit" element={<DriverForm mode="edit" />} />

          
          <Route path="/vehicles" element={<VehiclesList />} />
          <Route path="/vehicles/new" element={<VehicleForm mode="create" />} />
          <Route
            path="/vehicles/:id/edit"
            element={<VehicleForm mode="edit" />}
          />

        
          <Route path="/trips" element={<TripsList />} />
          <Route path="/trips/new" element={<TripForm mode="create" />} />
          <Route path="/trips/:id/edit" element={<TripForm mode="edit" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
