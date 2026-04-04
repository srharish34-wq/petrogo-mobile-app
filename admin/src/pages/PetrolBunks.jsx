import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/petrolBunks.css";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

export default function PetrolBunks() {
  const [bunks, setBunks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    registrationNumber: "",
    contactPerson: {
      name: "",
      phone: "",
      email: ""
    },
    address: {
      street: "",
      landmark: "",
      city: "",
      state: "",
      pincode: ""
    },
    location: {
      coordinates: [0, 0]
    },
    fuelAvailability: {
      diesel: { available: true, price: 95, stock: 1000 },
      petrol: { available: true, price: 105, stock: 1000 }
    },
    status: "active"
  });

  useEffect(() => {
    fetchBunks();
  }, []);

  // ======================
  // GET ALL BUNKS
  // ======================
  const fetchBunks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_BASE}/bunks/`
      );

      // Normalize data
      const normalized = res.data.data.bunks.map(b => ({
        _id: b._id,
        name: b.name,
        registrationNumber: b.registrationNumber,
        status: b.status || "active",
        location: b.fullAddress || b.address?.street || "—",
        contactPerson: b.contactPerson,
        fuelAvailability: b.fuelAvailability
      }));

      setBunks(normalized);
      console.log("✅ Bunks loaded:", normalized.length);
    } catch (err) {
      console.error("Fetch bunks error:", err);
      setError("Failed to load bunks. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // ======================
  // CREATE NEW BUNK
  // ======================
  // ======================
  // CREATE NEW BUNK
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.registrationNumber || !form.contactPerson.phone) {
      setError("Please fill in all required fields");
      return;
    }

    // ✅ VALIDATE PHONE NUMBER
    if (!/^[6-9]\d{9}$/.test(form.contactPerson.phone)) {
      setError("Phone number must be 10 digits and start with 6-9");
      return;
    }

    // ✅ VALIDATE PINCODE
    if (!/^[1-9][0-9]{5}$/.test(form.address.pincode)) {
      setError("Please enter a valid 6-digit pincode");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        registrationNumber: form.registrationNumber,
        contactPerson: {
          name: form.contactPerson.name || form.name,
          phone: form.contactPerson.phone,  // ✅ MUST be 10 digits, starting with 6-9
          email: form.contactPerson.email || ""
        },
        address: {
          street: form.address.street,
          landmark: form.address.landmark || "",
          city: form.address.city,
          state: form.address.state,
          pincode: form.address.pincode
        },
        location: {
          type: "Point",
          coordinates: [77.5, 12.9] // Default Bangalore coordinates
        },
        fuelAvailability: {
          diesel: {
            available: true,
            price: parseFloat(form.fuelAvailability.diesel.price) || 95,
            stock: parseInt(form.fuelAvailability.diesel.stock) || 1000
          },
          petrol: {
            available: true,
            price: parseFloat(form.fuelAvailability.petrol.price) || 105,
            stock: parseInt(form.fuelAvailability.petrol.stock) || 1000
          }
        },
        status: form.status
      };

      console.log("📤 Sending payload:", payload);

      const response = await axios.post(
        `${API_BASE}/bunks/create`,
        payload
      );

      console.log("✅ Response:", response.data);

      // Reset form
      setForm({
        name: "",
        registrationNumber: "",
        contactPerson: { name: "", phone: "", email: "" },
        address: { street: "", landmark: "", city: "", state: "", pincode: "" },
        location: { coordinates: [0, 0] },
        fuelAvailability: {
          diesel: { available: true, price: 95, stock: 1000 },
          petrol: { available: true, price: 105, stock: 1000 }
        },
        status: "active"
      });

      setShowForm(false);
      await fetchBunks();
      alert("✅ Bunk added successfully!");

    } catch (err) {
      console.error("❌ Create bunk error:", err);

      // Better error handling
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to add bunk";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const activeCount = bunks.filter(b => b.status === "active").length;

  return (
    <div className="bunks-page">

      {/* HEADER */}
      <div className="bunks-header">
        <div className="header-content">
          <h1>⛽ Petrol Bunks Management</h1>
          <p>Add and manage petrol bunks on your platform</p>
        </div>

        <button
          className="add-btn"
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? "✕ Cancel" : "+ Add New Bunk"}
        </button>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          <p>❌ {error}</p>
          <button onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* STATS */}
      <div className="bunks-stats">
        <div className="stat-card total">
          <div className="stat-icon">🏪</div>
          <div className="stat-info">
            <p>Total Bunks</p>
            <h2>{bunks.length}</h2>
          </div>
        </div>

        <div className="stat-card active">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p>Active Bunks</p>
            <h2>{activeCount}</h2>
          </div>
        </div>

        <div className="stat-card inactive">
          <div className="stat-icon">🔴</div>
          <div className="stat-info">
            <p>Inactive Bunks</p>
            <h2>{bunks.length - activeCount}</h2>
          </div>
        </div>
      </div>

      {/* ADD FORM */}
      {showForm && (
        <form className="bunk-form" onSubmit={handleSubmit}>
          <h3>➕ Add New Petrol Bunk</h3>

          <div className="form-grid">
            {/* Basic Info */}
            <div className="form-section">
              <h4>Basic Information</h4>

              <div className="form-group">
                <label>Bunk Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Shell Petrol Station"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Registration Number *</label>
                <input
                  type="text"
                  placeholder="e.g., PESREG2024001"
                  value={form.registrationNumber}
                  onChange={e => setForm({ ...form, registrationNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="form-section">
              <h4>Contact Information</h4>

              <div className="form-group">
                <label>Contact Person Name</label>
                <input
                  type="text"
                  placeholder="Manager name"
                  value={form.contactPerson.name}
                  onChange={e => setForm({
                    ...form,
                    contactPerson: { ...form.contactPerson, name: e.target.value }
                  })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={form.contactPerson.phone}
                  onChange={e => setForm({
                    ...form,
                    contactPerson: { ...form.contactPerson, phone: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={form.contactPerson.email}
                  onChange={e => setForm({
                    ...form,
                    contactPerson: { ...form.contactPerson, email: e.target.value }
                  })}
                />
              </div>
            </div>

            {/* Address */}
            <div className="form-section">
              <h4>Address</h4>

              <div className="form-group">
                <label>Street Address *</label>
                <input
                  type="text"
                  placeholder="Street name and number"
                  value={form.address.street}
                  onChange={e => setForm({
                    ...form,
                    address: { ...form.address, street: e.target.value }
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Landmark</label>
                <input
                  type="text"
                  placeholder="Nearby landmark"
                  value={form.address.landmark}
                  onChange={e => setForm({
                    ...form,
                    address: { ...form.address, landmark: e.target.value }
                  })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input
                    type="text"
                    placeholder="City"
                    value={form.address.city}
                    onChange={e => setForm({
                      ...form,
                      address: { ...form.address, city: e.target.value }
                    })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>State *</label>
                  <input
                    type="text"
                    placeholder="State"
                    value={form.address.state}
                    onChange={e => setForm({
                      ...form,
                      address: { ...form.address, state: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Pincode *</label>
                <input
                  type="text"
                  placeholder="6-digit pincode"
                  value={form.address.pincode}
                  onChange={e => setForm({
                    ...form,
                    address: { ...form.address, pincode: e.target.value }
                  })}
                  required
                />
              </div>
            </div>

            {/* Fuel Prices */}
            <div className="form-section">
              <h4>Fuel Pricing & Stock</h4>

              <div className="fuel-box">
                <h5>⚫ Diesel</h5>
                <div className="form-group">
                  <label>Price per Liter (₹)</label>
                  <input
                    type="number"
                    placeholder="95"
                    value={form.fuelAvailability.diesel.price}
                    onChange={e => setForm({
                      ...form,
                      fuelAvailability: {
                        ...form.fuelAvailability,
                        diesel: {
                          ...form.fuelAvailability.diesel,
                          price: parseFloat(e.target.value)
                        }
                      }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Stock (Liters)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={form.fuelAvailability.diesel.stock}
                    onChange={e => setForm({
                      ...form,
                      fuelAvailability: {
                        ...form.fuelAvailability,
                        diesel: {
                          ...form.fuelAvailability.diesel,
                          stock: parseInt(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
              </div>

              <div className="fuel-box">
                <h5>🟠 Petrol</h5>
                <div className="form-group">
                  <label>Price per Liter (₹)</label>
                  <input
                    type="number"
                    placeholder="105"
                    value={form.fuelAvailability.petrol.price}
                    onChange={e => setForm({
                      ...form,
                      fuelAvailability: {
                        ...form.fuelAvailability,
                        petrol: {
                          ...form.fuelAvailability.petrol,
                          price: parseFloat(e.target.value)
                        }
                      }
                    })}
                  />
                </div>

                <div className="form-group">
                  <label>Stock (Liters)</label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={form.fuelAvailability.petrol.stock}
                    onChange={e => setForm({
                      ...form,
                      fuelAvailability: {
                        ...form.fuelAvailability,
                        petrol: {
                          ...form.fuelAvailability.petrol,
                          stock: parseInt(e.target.value)
                        }
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="form-section">
              <h4>Status</h4>

              <div className="form-group">
                <label>Bunk Status</label>
                <select
                  value={form.status}
                  onChange={e => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">✅ Active</option>
                  <option value="inactive">⏸️ Inactive</option>
                  <option value="suspended">🚫 Suspended</option>
                </select>
              </div>
            </div>
          </div>

          {/* Form Buttons */}
          <div className="form-buttons">
            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading ? "⏳ Saving..." : "💾 Save Bunk"}
            </button>
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setShowForm(false)}
              disabled={loading}
            >
              ✕ Cancel
            </button>
          </div>
        </form>
      )}

      {/* LOADING STATE */}
      {loading && <div className="loading">Loading...</div>}

      {/* TABLE */}
      <div className="bunks-table-container">
        <h3>📋 All Petrol Bunks ({bunks.length})</h3>

        {bunks.length === 0 ? (
          <div className="empty-state">
            <p>🚫 No petrol bunks added yet</p>
            <p>Click "Add New Bunk" to get started!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Bunk Name</th>
                  <th>Registration #</th>
                  <th>Location</th>
                  <th>Contact</th>
                  <th>Diesel Price</th>
                  <th>Petrol Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bunks.map(b => (
                  <tr key={b._id}>
                    <td className="bold">{b.name}</td>
                    <td>{b.registrationNumber}</td>
                    <td>{b.location}</td>
                    <td>{b.contactPerson?.phone || "—"}</td>
                    <td>₹{b.fuelAvailability?.diesel?.price || "—"}</td>
                    <td>₹{b.fuelAvailability?.petrol?.price || "—"}</td>
                    <td>
                      <span className={`badge badge-${b.status}`}>
                        {b.status === "active" ? "✅ Active" :
                          b.status === "inactive" ? "⏸️ Inactive" :
                            "🚫 Suspended"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}