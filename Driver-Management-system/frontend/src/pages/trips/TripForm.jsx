import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTrip, getTrip, updateTrip } from "../../api/trips";
import { listDrivers } from "../../api/drivers";
import { listVehicles } from "../../api/vehicles";

const STATUS_OPTIONS = ["scheduled", "in_progress", "completed", "canceled"];

function TripForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [form, setForm] = useState({
    driver: "",
    vehicle: "",
    origin: "",
    destination: "",
    startTime: "",
    endTime: "",
    status: "scheduled",
    fare: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // Load driver & vehicle options
  useEffect(() => {
    (async () => {
      try {
        const [driversData, vehiclesData] = await Promise.all([
          listDrivers({ limit: 100 }),
          listVehicles({ limit: 100 }),
        ]);
        setDrivers(driversData.items || []);
        setVehicles(vehiclesData.items || []);
      } catch (err) {
        console.error(err);
        setSubmitError("Failed to load drivers/vehicles.");
      }
    })();
  }, []);

  // Load existing trip if editing
  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await getTrip(id);
          setForm({
            driver: data.driver?._id || data.driver || "",
            vehicle: data.vehicle?._id || data.vehicle || "",
            origin: data.origin || "",
            destination: data.destination || "",
            startTime: data.startTime
              ? new Date(data.startTime).toISOString().slice(0, 16)
              : "",
            endTime: data.endTime
              ? new Date(data.endTime).toISOString().slice(0, 16)
              : "",
            status: data.status || "scheduled",
            fare: data.fare ?? "",
            notes: data.notes || "",
          });
        } catch (err) {
          console.error(err);
          setSubmitError("Failed to load trip.");
        }
      })();
    }
  }, [isEdit, id]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const errs = {};
    if (!form.driver) errs.driver = "Driver is required.";
    if (!form.vehicle) errs.vehicle = "Vehicle is required.";
    if (!form.origin.trim()) errs.origin = "Origin is required.";
    if (!form.destination.trim()) errs.destination = "Destination is required.";
    if (!form.startTime) errs.startTime = "Start time is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validate()) return;

    try {
      const payload = {
        driver: form.driver,
        vehicle: form.vehicle,
        origin: form.origin,
        destination: form.destination,
        startTime: new Date(form.startTime).toISOString(),
        status: form.status,
        fare: form.fare ? Number(form.fare) : 0,
        notes: form.notes || undefined,
      };

      if (form.endTime) {
        payload.endTime = new Date(form.endTime).toISOString();
      }

      if (isEdit) {
        await updateTrip(id, payload);
        setSubmitSuccess("Trip updated successfully.");
      } else {
        await createTrip(payload);
        setSubmitSuccess("Trip created successfully.");
        setForm({
          driver: "",
          vehicle: "",
          origin: "",
          destination: "",
          startTime: "",
          endTime: "",
          status: "scheduled",
          fare: "",
          notes: "",
        });
      }

      setTimeout(() => navigate("/trips"), 800);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to save trip.");
    }
  }

  return (
    <section>
      <h2>{isEdit ? "Edit Trip" : "Add Trip"}</h2>

      {submitError && <p className="error">{submitError}</p>}
      {submitSuccess && <p className="success">{submitSuccess}</p>}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="driver">Driver *</label>
          <select
            id="driver"
            name="driver"
            value={form.driver}
            onChange={handleChange}
          >
            <option value="">Select driver</option>
            {drivers.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name} ({d.licenseNumber})
              </option>
            ))}
          </select>
          {errors.driver && (
            <span className="error-field">{errors.driver}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="vehicle">Vehicle *</label>
          <select
            id="vehicle"
            name="vehicle"
            value={form.vehicle}
            onChange={handleChange}
          >
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v._id} value={v._id}>
                {v.plate} ({v.make} {v.model})
              </option>
            ))}
          </select>
          {errors.vehicle && (
            <span className="error-field">{errors.vehicle}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="origin">Origin *</label>
          <input
            id="origin"
            name="origin"
            value={form.origin}
            onChange={handleChange}
          />
          {errors.origin && (
            <span className="error-field">{errors.origin}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="destination">Destination *</label>
          <input
            id="destination"
            name="destination"
            value={form.destination}
            onChange={handleChange}
          />
          {errors.destination && (
            <span className="error-field">{errors.destination}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time *</label>
          <input
            id="startTime"
            name="startTime"
            type="datetime-local"
            value={form.startTime}
            onChange={handleChange}
          />
          {errors.startTime && (
            <span className="error-field">{errors.startTime}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            name="endTime"
            type="datetime-local"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fare">Fare</label>
          <input
            id="fare"
            name="fare"
            type="number"
            value={form.fare}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            rows="3"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn primary">
          {isEdit ? "Update Trip" : "Create Trip"}
        </button>
      </form>
    </section>
  );
}

export default TripForm;
