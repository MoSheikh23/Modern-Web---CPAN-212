import { useState } from "react";
import { verifyOtp } from "../../api/auth";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await verifyOtp({ email, otp });
      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      setError(err?.response?.data?.error || "Invalid OTP");
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
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <button style={{ width: "100%", padding: 10 }}>Verify</button>
      </form>
    </div>
  );
}
