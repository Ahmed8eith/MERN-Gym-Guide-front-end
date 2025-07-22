import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username.length < 5 || password.length < 5) {
      toast.error("Username and password must be at least 5 characters long!", {
        style: { background: "#222", color: "#fff" },
      });
      return;
    }

    try {
      const response = await axios.post("https://mern-gym-guide-backend-production.up.railway.app/api/auth/register", {
        username,
        password,
      });

      if (response.status === 201) {
        toast.success("Account created successfully!", {
          style: { background: "#222", color: "#fff" },
        });

        console.log("Success!");
        setUsername("");
        setPassword("");
          navigate('/login');
      }
    } catch (error) {
      console.log("error: ", error);
      toast.error(error.response?.data?.message || "Registration failed", {
        style: { background: "#222", color: "#fff" },
      });
    }
  };

  return (
    <div className="min-h-screen flex mt-12 pl-10">
      <div className="w-full max-w-md">
        <h2 className="text-4xl font-bold mb-8 text-white">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label htmlFor="username" className="label">
              <span className="label-text text-white">Username</span>
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Choose a username"
              className="input input-bordered w-full bg-gray-900 text-white border-gray-700 focus:border-gray-500"
            />
          </div>

          <div className="form-control relative">
            <label htmlFor="password" className="label">
              <span className="label-text text-white">Password</span>
            </label>
            <input
              type={showPassword ? "text" : "password"} 
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Create a strong password"
              className="input input-bordered w-full bg-gray-900 text-white border-gray-700 focus:border-gray-500 pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-white cursor-pointer mt-6 absolute inset-y-0 right-3 flex items-center px-2 text-gray-400 hover:text-white"
            >
              {showPassword ? " Hide" : " Show"}
            </button>
          </div>

          <button
            type="submit"
            className="text-white transition duration-300 ease-in-out hover:text-black border border-gray-800 hover:bg-white focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800 btn-block"
          >
            Register Now
          </button>
        </form>

        <h1 className="text-white mt-2">
          Already have an account? Sign in
          <Link to="/login" className="text-blue-500 underline hover:text-blue-400 ml-1">
            here
          </Link>
          !
        </h1>

      </div>
    </div>
  );
}

export default Register;
