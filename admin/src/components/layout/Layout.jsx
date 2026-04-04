import { NavLink } from "react-router-dom";
import "./layout.css";

export default function Layout({ children }) {
  return (
    <div className="layout">
      
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🚗 PetroGo Admin</h2>

        <NavLink to="/dashboard">📊 Dashboard</NavLink>
        <NavLink to="/users">👥 Users</NavLink>
        <NavLink to="/delivery-partners">🚚 Delivery Partners</NavLink>
        <NavLink to="/petrol-bunks">⛽ Petrol Bunks</NavLink>
        <NavLink to="/orders">📦 Orders</NavLink>
        <NavLink to="/payments">💰 Payments</NavLink>
        <NavLink to="/analytics">📈 Analytics</NavLink>
        <NavLink to="/settings">⚙ Settings</NavLink>
        <NavLink to="/logout" className="logout">🚪 Logout</NavLink>
      </aside>

      {/* Main Content */}
      <main className="content">
        {children}
      </main>

    </div>
  );
}
