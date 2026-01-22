import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import HomePage from "./Pages/HomePage";

// Auth & Role Components
import RoleSelect from "./components/RoleSelect";
import Login from "./components/Login";
import Signup from "./components/Signup";
import WarehouseLogin from "./components/warehouse_login";

// Dashboards
import DriverDashboard from "./components/DriverDashboard";
import AdminDashboard from "./components/AdminDashboard";
import WarehouseDashboard from "./components/WarehouseDashboard"; // ✅ ADDED

// Admin Features
import IdleVehicles from "./components/idleVehicles";
import AssignVehicles from "./components/AssignVehicles";
import EmissionCalculator from "./components/EmissionCalculator";
import CreateShipment from "./components/CreateShipment";
import Reports from "./components/Reports";

// Optional
import Map from "./components/Map";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= LANDING ================= */}
        <Route path="/" element={<HomePage />} />

        {/* ================= AUTH ================= */}
        <Route path="/roles" element={<RoleSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/warehouse_login" element={<WarehouseLogin />} />

        {/* ================= DASHBOARDS ================= */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/warehouse-dashboard" element={<WarehouseDashboard />} /> {/* ✅ */}

        {/* ================= ADMIN FEATURES ================= */}
        <Route path="/idle-vehicles" element={<IdleVehicles />} />
        <Route path="/assign-vehicles" element={<AssignVehicles />} />
        <Route path="/emission-calculator" element={<EmissionCalculator />} />
        <Route path="/driver-assignment" element={<CreateShipment />} />
        <Route path="/reports" element={<Reports />} />

        {/* ================= OPTIONAL ================= */}
        <Route path="/map" element={<Map />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<HomePage />} />

      </Routes>
    </Router>
  );
}

export default App;
