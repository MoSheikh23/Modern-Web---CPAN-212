import { useState, useEffect } from "react";
import { verifyOtp } from "../../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await verifyOtp({ email, otp });

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h2>Verify OTP</h2>
      <p>OTP sent to <strong>{email}</strong></p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleVerify}>
        <input
          value={otp}
          placeholder="Enter OTP"
          onChange={(e) => setOtp(e.target.value)}
          required
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button
          disabled={loading}
          style={{
            width: "100%",
            padding: 10,
            background: loading ? "#888" : "#333",
            color: "white",
            cursor: "pointer"
          }}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
