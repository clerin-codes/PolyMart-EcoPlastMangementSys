import React, { useState, useEffect } from "react";
import axios from "axios";
import "./leaderboard.css";
import logo from "./assets/images/polymart-logo.png";

const initialFormState = {
  name: "",
  email: "",
  contactNumber: "",
  address: "",
  bottleType: "",
  weight: "",
  feedback: "",
  disposalPurpose: "",
  pickupDate: "",
  points: "",
  status: "Pending",
};

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/leaderboard");
      setEntries(data);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      setEntries([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/leaderboard/${editingId}`, formData);
      } else {
        await axios.post("http://localhost:5000/api/leaderboard", formData);
      }
      fetchEntries();
      resetForm();
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again later.");
    }
  };

  const handleEdit = (entry) => {
    setFormData({ ...entry, pickupDate: entry.pickupDate.split("T")[0] });
    setEditingId(entry._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leaderboard/${id}`);
      fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
      alert("Failed to delete entry. Please try again later.");
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  const topThree = entries.slice(0, 3);

  return (
    <div className="leaderboard-container">
      <img src={logo} alt="Polymart Logo" className="logo" />

      <section>
        <h2 className="section-heading">🏆 Top 3 Achievers</h2>
        <div className="top-achievers">
          {topThree.map((entry, index) => (
            <div className="top-card" key={entry._id}>
              <h3>#{index + 1} - {entry.name}</h3>
              <p>Points: {entry.points}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h1 className="section-heading2">🏅 Leaderboard 🎯</h1>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Bottle Type</th>
              <th>Weight (kg)</th>
              <th>Disposal Purpose</th>
              <th>Pickup Date</th>
              <th>Points</th>
              <th>Status</th>
             
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.name}</td>
                <td>{entry.email}</td>
                <td>{entry.contactNumber}</td>
                <td>{entry.address}</td>
                <td>{entry.bottleType}</td>
                <td>{entry.weight}</td>
                <td>{entry.disposalPurpose}</td>
                <td>{entry.pickupDate.split("T")[0]}</td>
                <td>{entry.points}</td>
                <td>{entry.status}</td>
                
                <td>
                  <button onClick={() => handleEdit(entry)} style={{ backgroundColor: 'orange' }}>Edit</button>
                  <button onClick={() => handleDelete(entry._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2>{editingId ? "Edit Entry" : "Add New Entry"}</h2>
        <form className="leaderboard-form" onSubmit={handleSubmit}>
  {Object.keys(formData).map((key) =>
    key !== "status" ? (
      <input
        key={key}
        type={key === "pickupDate" ? "date" : key === "points" || key === "weight" ? "number" : "text"}
        name={key}
        value={formData[key]}
        onChange={handleChange}
        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
        
      />
    ) : (
      <select key={key} name="status" value={formData.status} onChange={handleChange}>
        <option value="Pending">Pending</option>
        <option value="Picked Up">Picked Up</option>
        <option value="Completed">Completed</option>
      </select>
    )
  )}

  <div className="form-actions">
    <button type="submit">{editingId ? "Update" : "Add"}</button>
  </div>

  <div className="form-clear">
    <button type="button" onClick={resetForm}>Clear</button>
  </div>
</form>

      </section>
    </div>
  );
}

export default Leaderboard;
