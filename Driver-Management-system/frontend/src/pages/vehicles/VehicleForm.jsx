import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createVehicle, getVehicle, updateVehicle } from "../../api/vehicles";

const STATUS_OPTIONS = ["available", "maintenance", "retired"];

function VehicleForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    plate: "",
    make: "",
    model: "",
    year: "",
    capacity: 4,
    status: "available",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await getVehicle(id);
          setForm({
            plate: data.plate || "",
            make: data.make || "",
            model: data.model || "",
            year: data.year || "",
            capacity: data.capacity ?? 4,
            status: data.status || "available",
          });
        } catch (err) {
          console.error(err);
          setSubmitError("Failed to load vehicle.");
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
    if (!form.plate.trim()) errs.plate = "Plate is required.";
    if (!form.make.trim()) errs.make = "Make is required.";
    if (!form.model.trim()) errs.model = "Model is required.";
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
        ...form,
        year: form.year ? Number(form.year) : undefined,
        capacity: form.capacity ? Number(form.capacity) : undefined,
      };

      if (isEdit) {
        await updateVehicle(id, payload);
        setSubmitSuccess("Vehicle updated successfully.");
      } else {
        await createVehicle(payload);
        setSubmitSuccess("Vehicle created successfully.");
        setForm({
          plate: "",
          make: "",
          model: "",
          year: "",
          capacity: 4,
          status: "available",
        });
      }

      setTimeout(() => navigate("/vehicles"), 800);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to save vehicle.");
    }
  }

  return (
    <section>
      <h2>{isEdit ? "Edit Vehicle" : "Add Vehicle"}</h2>

      {submitError && <p className="error">{submitError}</p>}
      {submitSuccess && <p className="success">{submitSuccess}</p>}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="plate">Plate *</label>
          <input
            id="plate"
            name="plate"
            value={form.plate}
            onChange={handleChange}
          />
          {errors.plate && (
            <span className="error-field">{errors.plate}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="make">Make *</label>
          <input
            id="make"
            name="make"
            value={form.make}
            onChange={handleChange}
          />
          {errors.make && <span className="error-field">{errors.make}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="model">Model *</label>
          <input
            id="model"
            name="model"
            value={form.model}
            onChange={handleChange}
          />
          {errors.model && (
            <span className="error-field">{errors.model}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="year">Year</label>
          <input
            id="year"
            name="year"
            type="number"
            value={form.year}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="capacity">Capacity</label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            value={form.capacity}
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

        <button type="submit" className="btn primary">
          {isEdit ? "Update Vehicle" : "Create Vehicle"}
        </button>
      </form>
    </section>
  );
}

export default VehicleForm;
