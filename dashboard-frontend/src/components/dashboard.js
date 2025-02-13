// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [stars, setStars] = useState(10000);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data from API
  const fetchData = async (starValue, limitValue) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/data", {
        params: {
          stars: starValue,
          limit: limitValue,
        },
      });
      setData(response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch default data on component mount
  useEffect(() => {
    fetchData(stars, limit);
    // eslint-disable-next-line
  }, []);

  // Chart.js configuration
  const chartData = {
    labels: data.map((item) => item.name),
    datasets: [
      {
        label: "Stars",
        data: data.map((item) => item.stargazers_count),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `GitHub Repositories With Over ${stars} Stars (Top ${limit})`,
      },
    },
  };

  // Form submission handler
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(stars, limit);
  };

  return (
    <div style={{ width: "80%", margin: "0 auto", textAlign: "center" }}>
      <h2 style={{ margin: "20px 0" }}>GitHub Top Repositories</h2>

      {/* Form to update stars and limit */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>
          Minimum Stars:
          <input
            type="number"
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            style={{ marginLeft: "10px", width: "100px" }}
          />
        </label>

        <label style={{ marginRight: "10px" }}>
          Limit:
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            style={{ marginLeft: "10px", width: "60px" }}
          />
        </label>

        <button type="submit">Fetch Data</button>
      </form>

      {/* Loading Spinner / Error / Chart */}
      {loading && <div>Loading data...</div>}
      {!loading && error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && !error && data.length > 0 && (
        <Bar data={chartData} options={options} />
      )}
      {!loading && !error && data.length === 0 && (
        <div>No data found. Try adjusting the parameters.</div>
      )}
    </div>
  );
};

export default Dashboard;
