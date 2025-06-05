import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/Auth";
import toast from "react-hot-toast";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [type, setType] = useState("customer");

  const navigate = useNavigate();

  const handleRegister = async (username, email, password, type) => {
    try {
      const response = await registerUser({ username, email, password, type });

      if (response.status === "success") {
        toast.success(response.message);
        navigate("/verify-otp");
      }
    } catch (error) {
      toast.error(response.message);
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
      return;
    }
    handleRegister(username, email, password, type);
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

          <div className="mb-6">
            <label
              htmlFor="employee"
              className="block text-violet-600 text-sm font-semibold mb-2"
            >
              Select User
            </label>
            <div className="flex items-center space-x-6">
              {/* Employee Radio Button */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="employee"
                  value="employee"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "employee"}
                  className="h-4 w-4 text-violet-500 focus:ring-violet-500"
                />
                <label
                  htmlFor="employee"
                  className="ml-2 text-violet-600 text-sm font-medium"
                >
                  Employee
                </label>
              </div>

              {/* Customer Radio Button */}
              <div className="flex items-center">
                <input
                  type="radio"
                  id="customer"
                  value="customer"
                  onChange={(e) => setType(e.target.value)}
                  checked={type === "customer"}
                  className="h-4 w-4 text-violet-500 focus:ring-violet-500"
                />
                <label
                  htmlFor="customer"
                  className="ml-2 text-violet-600 text-sm font-medium"
                >
                  Customer
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-700 transition duration-300 cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
