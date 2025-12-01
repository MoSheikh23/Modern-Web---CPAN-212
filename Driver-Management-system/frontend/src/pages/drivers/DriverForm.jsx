import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createDriver, getDriver, updateDriver } from "../../api/drivers";

const STATUS_OPTIONS = ["active", "inactive", "suspended"];

function DriverForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [form, setForm] = useState({
    name: "",
    licenseNumber: "",
    phone: "",
    status: "active",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      (async () => {
        try {
          const data = await getDriver(id);
          setForm({
            name: data.name || "",
            licenseNumber: data.licenseNumber || "",
            phone: data.phone || "",
            status: data.status || "active",
          });
        } catch (err) {
          console.error(err);
          setSubmitError("Failed to load driver.");
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
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.licenseNumber.trim())
      errs.licenseNumber = "License number is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!validate()) return;

    try {
      if (isEdit) {
        await updateDriver(id, form);
        setSubmitSuccess("Driver updated successfully.");
      } else {
        await createDriver(form);
        setSubmitSuccess("Driver created successfully.");
        setForm({
          name: "",
          licenseNumber: "",
          phone: "",
          status: "active",
        });
      }
      setTimeout(() => navigate("/drivers"), 800);
    } catch (err) {
      console.error(err);
      setSubmitError("Failed to save driver.");
    }
  }

  return (
    <section>
      <h2>{isEdit ? "Edit Driver" : "Add Driver"}</h2>

      {submitError && <p className="error">{submitError}</p>}
      {submitSuccess && <p className="success">{submitSuccess}</p>}

      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />
          {errors.name && <span className="error-field">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="licenseNumber">License Number *</label>
          <input
            id="licenseNumber"
            name="licenseNumber"
            value={form.licenseNumber}
            onChange={handleChange}
          />
          {errors.licenseNumber && (
            <span className="error-field">{errors.licenseNumber}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            name="phone"
            value={form.phone}
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
          {isEdit ? "Update Driver" : "Create Driver"}
        </button>
      </form>
    </section>
  );
}

export default DriverForm;
