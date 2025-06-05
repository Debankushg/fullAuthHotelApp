import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Used to navigate to another page (Dashboard)
import { verifyOTP } from "../services/Auth";
import toast from "react-hot-toast";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [isVerified, setIsVerified] = useState(false); // State to check if OTP is verified

  const navigate = useNavigate();

  // Handle OTP input change
  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  // Handle OTP form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send OTP to your backend for verification (replace with your backend API)
      const response = await verifyOTP(Number(otp));

      if (response.status === "success") {
        setIsVerified(true); // OTP is verified
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isVerified) {
    return navigate("/dashboard"); // Redirect to the dashboard after OTP is verified
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-700 via-indigo-400 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Verify OTP
        </h2>

        {/* Display error if OTP is invalid */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-600"
            >
              Enter OTP:
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              maxLength="6"
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-800 transition duration-300 cursor-pointer"
          >
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OTPVerification;
