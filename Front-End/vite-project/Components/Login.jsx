import { useState } from "react";
import { motion } from "framer-motion";

export default function LoginPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("student");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    enrollmentNumber: "",
    motherName: "",
    motherTongue: "Marathi",   // was empty
    year: "Third",              // was empty
    religion: "",
    caste: "",
    nationality: "Indian",
    placeOfBirth: "",
    dateOfBirth: "",
    instituteLastAttended: "Government Polytechnic Mumbai",
    dateOfAdmission: "",
    branch: "",
    classAndYear: "Third "
  });
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000/api";

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleStudentSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/student/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.student));
        localStorage.setItem("role", "student");
        onLogin(data.student, "student");
      } else {
        setError(data.message || "Signup failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/student/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.student));
        localStorage.setItem("role", "student");
        onLogin(data.student, "student");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.admin));
        localStorage.setItem("role", "admin");
        onLogin(data.admin, "admin");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (activeTab === "student") {
      if (isSignup) {
        handleStudentSignup(e);
      } else {
        handleStudentLogin(e);
      }
    } else {
      handleAdminLogin(e);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-sky-50 px-4 py-6">
      <div className="bg-white shadow-xl rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-md">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold text-center text-emerald-600 mb-1">
          Welcome to LCG Portal
        </h1>
        <p className="text-gray-500 text-center mb-4 sm:mb-6 text-xs sm:text-sm px-2">
          Leaving Certificate Management System
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab("student")}
            className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
              activeTab === "student"
                ? "bg-emerald-500 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Student Login
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
              activeTab === "admin"
                ? "bg-emerald-500 text-white shadow"
                : "text-gray-600 hover:bg-gray-200"
            }`}
          >
            Admin Login
          </button>
        </div>

        {/* Student Signup/Login Toggle */}
        {activeTab === "student" && (
          <div className="flex mb-4 bg-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => setIsSignup(false)}
              className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                !isSignup
                  ? "bg-emerald-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsSignup(true)}
              className={`flex-1 py-2 text-sm font-medium transition-all duration-300 ${
                isSignup
                  ? "bg-emerald-500 text-white shadow"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              Signup
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Student Signup Fields */}
          {activeTab === "student" && isSignup && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Enrollment Number</label>
                <input
                  type="text"
                  name="enrollmentNumber"
                  placeholder="Enter your enrollment number"
                  value={formData.enrollmentNumber}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Mother's Name</label>
                <input
                  type="text"
                  name="motherName"
                  placeholder="Enter your mother's name"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Religion</label>
                <select
                  name="religion"
                  value={formData.religion}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="Hindu">Hindu</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Jain">Jain</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Caste & SubCaste</label>
                <input
                  type="text"
                  name="caste"
                  placeholder="e.g., OBC, SC, ST, General"
                  value={formData.caste}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  placeholder="e.g., Indian"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Place of Birth</label>
                <input
                  type="text"
                  name="placeOfBirth"
                  placeholder="e.g., Mumbai, Delhi"
                  value={formData.placeOfBirth}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Institute Last Attended</label>
                <input
                  type="text"
                  name="instituteLastAttended"
                  placeholder="e.g., ABC High School, Mumbai"
                  value={formData.instituteLastAttended}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Date of Admission</label>
                <input
                  type="date"
                  name="dateOfAdmission"
                  value={formData.dateOfAdmission}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Mother Tongue</label>
                <select
                  name="motherTongue"
                  value={formData.motherTongue}
                  onChange={handleInputChange}
                  required
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                >
                  <option value="Gujarati">Gujarati</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Marathi">Marathi</option>
                  <option value="English">English</option>
                  <option value="Bengali">Bengali</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Branch</label>
                <input
                  type="text"
                  name="branch"
                  placeholder="e.g., Diploma in Information Technology"
                  value={formData.branch}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Class and Year</label>
                <input
                  type="text"
                  name="classAndYear"
                  placeholder="e.g., Third Year, Second Year"
                  value={formData.classAndYear}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                />
              </div>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 sm:py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white rounded-lg font-medium shadow transition text-sm sm:text-base"
          >
            {loading ? "Processing..." : (
              activeTab === "student" 
                ? (isSignup ? "Signup as Student" : "Login as Student")
                : "Login as Admin"
            )}
          </button>

          {activeTab === "student" && !isSignup && (
            <div className="text-center">
              <button
                type="button"
                onClick={async () => {
                  setError("");
                  const email = prompt("Enter your email address:");
                  if (email) {
                    try {
                      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ email }),
                      });
                      const data = await response.json();
                      alert(data.message || "Password reset instructions sent to your email.");
                    } catch (error) {
                      alert("Error: Please contact admin for password reset.");
                    }
                  }
                }}
                className="text-sm text-emerald-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          )}
        </form>

        <p className="text-gray-400 text-xs text-center mt-4 sm:mt-6 px-2">
          Secure and modern certificate management
        </p>
      </div>
    </div>
  );
}