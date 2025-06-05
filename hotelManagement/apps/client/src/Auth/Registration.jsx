import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/Auth";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (username, email, password) => {
    try {
      const response = await registerUser({ username, email, password });

      if (response.status === "success") {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  // Password validation regex (alphanumeric with at least 1 special character and 1 capital letter)
  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate password
    if (!passwordRegex.test(password)) {
      setError(
        "Password must be alphanumeric with at least one special character and one uppercase letter."
      );
      setSuccess("");
    } else {
      setError("");
      setSuccess("Registration Successful!");

      handleRegister(username, email, password);
      // Optionally, handle form submission, e.g., send data to server
      console.log("User Registered:", { username, email, password });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-800">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-violet-700 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-violet-600 text-sm font-semibold"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="w-full p-3 mt-1 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-violet-600 text-sm font-semibold"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 mt-1 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-violet-600 text-sm font-semibold"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 mt-1 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 text-red-600 text-sm font-semibold">
              <p>{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 text-green-600 text-sm font-semibold">
              <p>{success}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
