import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listTrips, deleteTrip } from "../../api/trips";

function TripsList() {
  const [trips, setTrips] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTrips(page = 1) {
    try {
      setLoading(true);
      setError("");
      const data = await listTrips({ page, limit: 10 });
      setTrips(data.items || []);
      setPageInfo({ page: data.page, pages: data.pages });
    } catch (err) {
      console.error(err);
      setError("Failed to load trips.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTrips();
  }, []);

  async function handleDelete(id) {
    if (!window.confirm("Delete this trip?")) return;
    try {
      await deleteTrip(id);
      setMessage("Trip deleted successfully.");
      loadTrips(pageInfo.page);
    } catch (err) {
      console.error(err);
      setError("Failed to delete trip.");
    }
  }

  return (
    <section>
      <div className="section-header">
        <h2>Trips</h2>
        <Link to="/trips/new" className="btn">
          + Add Trip
        </Link>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {!loading && trips.length === 0 && <p>No trips found.</p>}

      {trips.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Driver</th>
                <th>Vehicle</th>
                <th>Origin</th>
                <th>Destination</th>
                <th>Start</th>
                <th>Status</th>
                <th>Fare</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => (
                <tr key={t._id}>
                  <td>{t.driver?.name || "-"}</td>
                  <td>{t.vehicle ? `${t.vehicle.plate} ${t.vehicle.make}` : "-"}</td>
                  <td>{t.origin}</td>
                  <td>{t.destination}</td>
                  <td>
                    {t.startTime
                      ? new Date(t.startTime).toLocaleString()
                      : "-"}
                  </td>
                  <td>{t.status}</td>
                  <td>{t.fare ?? 0}</td>
                  <td>
                    <Link to={`/trips/${t._id}/edit`}>Edit</Link>{" "}
                    |{" "}
                    <button onClick={() => handleDelete(t._id)}>
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
              onClick={() => loadTrips(pageInfo.page - 1)}
            >
              Previous
            </button>
            <span>
              Page {pageInfo.page} of {pageInfo.pages}
            </span>
            <button
              disabled={pageInfo.page >= pageInfo.pages}
              onClick={() => loadTrips(pageInfo.page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default TripsList;
