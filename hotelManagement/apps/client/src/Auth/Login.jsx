import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/Auth";
import toast from "react-hot-toast";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    try {
      const response = await loginUser(email, password);

      if (response.status === "success") {
        toast.success(response.message);
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error(response.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-purple-700 via-indigo-400 to-blue-300">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
        <h2 className="text-3xl font-semibold text-center text-violet-700 mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
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

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-violet-600 text-white font-semibold rounded-lg hover:bg-violet-800 transition duration-300 cursor-pointer"
          >
            Log In
          </button>
        </form>

        {/* Forgot Password Link */}
        <div className="mt-4 text-center">
          <a href="#" className="text-violet-600 hover:text-violet-700 text-sm">
            Forgot Password?
          </a>
        </div>
        <div className="mt-4 text-center">
          <span className="text-sm mr-2 text-gray-600">
            Don't have an account?
          </span>
          <Link
            to="/register"
            className="text-violet-600 hover:text-violet-700 text-sm"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
