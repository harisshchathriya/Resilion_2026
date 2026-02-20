import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* ================= PAGES ================= */
import HomePage from "./Pages/HomePage";

/* ================= AUTH & ROLE ================= */
import RoleSelect from "./components/RoleSelect";
import Login from "./components/Login";           
import Signup from "./components/Signup";
import WarehouseLogin from "./components/warehouse_login";
import DriverLogin from "./components/driver_login";   

/* ================= DASHBOARDS ================= */
import DriverDashboard from "./components/DriverDashboard";
import AdminDashboard from "./components/AdminDashboard";
import WarehouseDashboard from "./components/WarehouseDashboard";

/* ================= ADMIN FEATURES ================= */
import IdleVehicles from "./components/idleVehicles";
import AssignVehicles from "./components/AssignVehicles";
import EmissionCalculator from "./components/EmissionCalculator";
import CreateShipment from "./components/CreateShipment";
import Reports from "./components/Reports";

/* ================= DRIVER FEATURES ================= */
import DriverClaims from "./components/DriverClaims";

function App() {
  return (
    <Router>
      <Routes>

        {/* ================= LANDING ================= */}
        <Route path="/" element={<HomePage />} />

        {/* ================= ROLE SELECTION ================= */}
        <Route path="/roles" element={<RoleSelect />} />

        {/* ================= AUTH ================= */}
        <Route path="/login" element={<Login />} />              {/* Admin */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/driver_login" element={<DriverLogin />} /> {/* Driver */}
        <Route path="/warehouse_login" element={<WarehouseLogin />} />

        {/* ================= DASHBOARDS ================= */}
        <Route path="/driver-dashboard" element={<DriverDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/warehouse-dashboard" element={<WarehouseDashboard />} />

        {/* ================= ADMIN FEATURES ================= */}
        <Route path="/idle-vehicles" element={<IdleVehicles />} />
        <Route path="/assign-vehicles" element={<AssignVehicles />} />
        <Route path="/emission-calculator" element={<EmissionCalculator />} />
        <Route path="/driver-assignment" element={<CreateShipment />} />
        <Route path="/reports" element={<Reports />} />

        {/* ================= DRIVER FEATURES ================= */}
        <Route path="/driver-claims" element={<DriverClaims />} />

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<HomePage />} />

      </Routes>
    </Router>
  );
}

export default App;