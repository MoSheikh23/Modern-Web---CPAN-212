import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listDrivers, deleteDriver } from "../../api/drivers";

function DriversList() {
  const [drivers, setDrivers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadDrivers(page = 1) {
    try {
      setLoading(true);
      setError("");
      const data = await listDrivers({ page, limit: 10 });
      setDrivers(data.items || []);
      setPageInfo({ page: data.page, pages: data.pages });
    } catch (err) {
      console.error(err);
      setError("Failed to load drivers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDrivers();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this driver?")) return;
    try {
      setError("");
      await deleteDriver(id);
      setMessage("Driver deleted successfully.");
      loadDrivers(pageInfo.page);
    } catch (err) {
      console.error(err);
      setError("Failed to delete driver.");
    }
  }

  return (
    <section>
      <div className="section-header">
        <h2>Drivers</h2>
        <Link to="/drivers/new" className="btn">
          + Add Driver
        </Link>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!loading && drivers.length === 0 && <p>No drivers found.</p>}

      {drivers.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>License</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((d) => (
                <tr key={d._id}>
                  <td>{d.name}</td>
                  <td>{d.licenseNumber}</td>
                  <td>{d.phone || "-"}</td>
                  <td>{d.status}</td>
                  <td>
                    <Link to={`/drivers/${d._id}/edit`}>Edit</Link>{" "}
                    |{" "}
                    <button onClick={() => handleDelete(d._id)}>
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
              onClick={() => loadDrivers(pageInfo.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pageInfo.page} of {pageInfo.pages}
            </span>
            <button
              disabled={pageInfo.page >= pageInfo.pages}
              onClick={() => loadDrivers(pageInfo.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default DriversList;
