import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listVehicles, deleteVehicle } from "../../api/vehicles";

function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadVehicles(page = 1) {
    try {
      setLoading(true);
      setError("");
      const data = await listVehicles({ page, limit: 10 });
      setVehicles(data.items || []);
      setPageInfo({ page: data.page, pages: data.pages });
    } catch (err) {
      console.error(err);
      setError("Failed to load vehicles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadVehicles();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      setMessage("Vehicle deleted successfully.");
      loadVehicles(pageInfo.page);
    } catch (err) {
      console.error(err);
      setError("Failed to delete vehicle.");
    }
  }

  return (
    <section>
      <div className="section-header">
        <h2>Vehicles</h2>
        <Link to="/vehicles/new" className="btn">
          + Add Vehicle
        </Link>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!loading && vehicles.length === 0 && <p>No vehicles found.</p>}

      {vehicles.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Plate</th>
                <th>Make</th>
                <th>Model</th>
                <th>Year</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((v) => (
                <tr key={v._id}>
                  <td>{v.plate}</td>
                  <td>{v.make}</td>
                  <td>{v.model}</td>
                  <td>{v.year || "-"}</td>
                  <td>{v.capacity}</td>
                  <td>{v.status}</td>
                  <td>
                    <Link to={`/vehicles/${v._id}/edit`}>Edit</Link>{" "}
                    |{" "}
                    <button onClick={() => handleDelete(v._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={pageInfo.page <= 1}
              onClick={() => loadVehicles(pageInfo.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pageInfo.page} of {pageInfo.pages}
            </span>
            <button
              disabled={pageInfo.page >= pageInfo.pages}
              onClick={() => loadVehicles(pageInfo.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default VehiclesList;
