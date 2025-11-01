import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import LeavingCertificate from "./LeavingCertificate";

const AdminDashboard = ({ onLogout }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    approvedStudents: 0,
    pendingStudents: 0,
    certificatesGenerated: 0
  });

  const API_BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  const [newStudent, setNewStudent] = useState({
    name: "",
    email: "",
    enrollmentNumber: "",
    motherName: "",
    motherTongue: "Gujarati",
    year: "",
    // LC related fields
    branch: "",
    classAndYear: "",
    religion: "",
    caste: "",
    nationality: "",
    placeOfBirth: "",
    dateOfBirth: "",
    instituteLastAttended: "",
    dateOfAdmission: "",
    conduct: "",
    reasonForLeaving: "",
    remarks: "",
    dateOfLeaving: ""
  });

  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showPage, setShowPage] = useState(null);

  // Fetch students from API
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/students?search=${searchTerm}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudents(data.students);
      } else {
        setError("Failed to fetch students");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, []);

  // Search functionality
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchStudents();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/students/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setStudents(students.filter((s) => s._id !== id));
          fetchStats();
        } else {
          setError("Failed to delete student");
        }
      } catch (error) {
        setError("Network error");
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setNewStudent({
      name: student.name,
      email: student.email,
      enrollmentNumber: student.enrollmentNumber,
      motherName: student.motherName,
      motherTongue: student.motherTongue || student.personalDetails?.motherTongue || "Gujarati",
      year: student.year,
      branch: student.branch || "",
      classAndYear: student.classAndYear || student.year || "",
      religion: student.religion || student.personalDetails?.religion || "",
      caste: student.caste || student.personalDetails?.caste || "",
      nationality: student.nationality || student.personalDetails?.nationality || "",
      placeOfBirth: student.placeOfBirth || student.personalDetails?.placeOfBirth || "",
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString().split("T")[0]
        : (student.personalDetails?.dateOfBirth
            ? new Date(student.personalDetails.dateOfBirth).toISOString().split("T")[0]
            : ""),
      instituteLastAttended: student.instituteLastAttended || student.personalDetails?.instituteLastAttended || "",
      dateOfAdmission: student.dateOfAdmission
        ? new Date(student.dateOfAdmission).toISOString().split("T")[0]
        : (student.personalDetails?.dateOfAdmission
            ? new Date(student.personalDetails.dateOfAdmission).toISOString().split("T")[0]
            : ""),
      conduct: student.personalDetails?.conduct || "",
      reasonForLeaving: student.personalDetails?.reasonForLeaving || "",
      remarks: student.personalDetails?.remarks || "",
      dateOfLeaving: student.personalDetails?.dateOfLeaving
        ? new Date(student.personalDetails.dateOfLeaving).toISOString().split("T")[0]
        : ""
    });
    setShowAddForm(true);
  };

  const handleGenerateLC = (student) => {
    setSelectedStudent(student);
    setShowCertificateModal(true);
  };

  const handleSaveCertificate = async (certificateData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/students/${selectedStudent._id}/generate-certificate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          certificateData: certificateData,
          personalDetails: {
            religion: certificateData.religion,
            caste: certificateData.caste,
            nationality: certificateData.nationality,
            placeOfBirth: certificateData.placeOfBirth,
            dateOfBirth: certificateData.dateOfBirth,
            instituteLastAttended: certificateData.instituteLastAttended,
            dateOfAdmission: certificateData.dateOfAdmission,
            conduct: certificateData.conduct,
            reasonForLeaving: certificateData.reasonForLeaving,
            remarks: certificateData.remarks
          }
        })
      });

      if (response.ok) {
        alert("Certificate generated successfully!");
        fetchStudents();
        fetchStats();
        setShowCertificateModal(false);
        setSelectedStudent(null);
      } else {
        const data = await response.json();
        alert(data.message || "Failed to generate certificate");
      }
    } catch (error) {
      alert("Network error");
    }
  };

  const handleCloseCertificateModal = () => {
    setShowCertificateModal(false);
    setSelectedStudent(null);
  };

  const handleStatusChange = async (id, status) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/students/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        setStudents(students.map(s => 
          s._id === id ? { ...s, status } : s
        ));
        fetchStats();
      } else {
        setError("Failed to update status");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const url = editingStudent 
        ? `${API_BASE_URL}/admin/students/${editingStudent._id}`
        : `${API_BASE_URL}/admin/students`;
      
      const method = editingStudent ? 'PUT' : 'POST';

      // Prepare payload with top-level and personalDetails mapping
      const payload = {
        name: newStudent.name,
        email: newStudent.email,
        enrollmentNumber: newStudent.enrollmentNumber,
        motherName: newStudent.motherName,
        motherTongue: newStudent.motherTongue,
        year: newStudent.year,
        // These will be respected on PUT; on POST backend currently ignores them but harmless to include
        branch: newStudent.branch || undefined,
        classAndYear: newStudent.classAndYear || undefined,
        personalDetails: {
          religion: newStudent.religion || undefined,
          caste: newStudent.caste || undefined,
          motherTongue: newStudent.motherTongue || undefined,
          nationality: newStudent.nationality || undefined,
          placeOfBirth: newStudent.placeOfBirth || undefined,
          dateOfBirth: newStudent.dateOfBirth || undefined,
          instituteLastAttended: newStudent.instituteLastAttended || undefined,
          dateOfAdmission: newStudent.dateOfAdmission || undefined,
          conduct: newStudent.conduct || undefined,
          reasonForLeaving: newStudent.reasonForLeaving || undefined,
          remarks: newStudent.remarks || undefined,
          dateOfLeaving: newStudent.dateOfLeaving || undefined
        }
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        setShowAddForm(false);
        setEditingStudent(null);
        setNewStudent({
          name: "",
          email: "",
          enrollmentNumber: "",
          motherName: "",
          motherTongue: "Gujarati",
          year: "",
          branch: "",
          classAndYear: "",
          religion: "",
          caste: "",
          nationality: "",
          placeOfBirth: "",
          dateOfBirth: "",
          instituteLastAttended: "",
          dateOfAdmission: "",
          conduct: "",
          reasonForLeaving: "",
          remarks: "",
          dateOfLeaving: ""
        });
        fetchStudents();
        fetchStats();
      } else {
        const data = await response.json();
        setError(data.message || "Failed to save student");
      }
    } catch (error) {
      setError("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#e6fffa] to-[#ccfbf1] text-gray-800">
      {/* 🌊 Teal Navbar */}
      <nav className="bg-gradient-to-r from-[#0f766e] to-[#0d9488] shadow-lg sticky top-0 z-50 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide hover:scale-105 transition-transform duration-300">
            Admin Portal
          </div>

          {/* Links */}
          <ul className="flex space-x-8 text-lg">
            {["Help", "About", "Contact"].map((item, i) => (
              <li key={i}>
                <button
                  onClick={() => {
                    // This will be handled by modal state
                    setShowPage(item.toLowerCase());
                  }}
                  className="relative hover:text-[#a7f3d0] transition-colors duration-300 group cursor-pointer"
                >
                  {item}
                  <span className="absolute left-0 bottom-[-5px] w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </button>
              </li>
            ))}
          </ul>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="bg-white text-[#0f766e] font-semibold px-5 py-2 rounded-lg hover:bg-[#a7f3d0] hover:text-[#064e3b] transition-transform duration-300 hover:-translate-y-0.5 shadow-md"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🏛️ Header */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center py-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src="/GPM-LOGO-2021.png"
          alt="Logo"
          className="h-36 w-36 rounded-full object-cover shadow-lg border-2 border-[#0d9488] mb-4 sm:mb-0"
        />
        <div className="text-center sm:text-left sm:ml-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0f766e]">
            Government Polytechnic Mumbai
          </h1>
          <p className="text-2xl sm:text-3xl text-[#115e59]">
            शासकीय तंत्रनिकेतन मुंबई
          </p>
          <p className="text-lg text-gray-600 italic">
            (An autonomous Institute, Govt. of Maharashtra)
          </p>
        </div>
      </motion.div>

      {/* 🧭 Dashboard Header */}
      <div className="bg-gradient-to-r from-[#0f766e] to-[#0d9488] text-white px-8 py-3 flex justify-between items-center shadow-lg">
        <h2 className="text-2xl font-semibold">Admin Dashboard</h2>
        <span className="font-medium">Welcome, Admin</span>
      </div>

      {/* 🧾 Main Section */}
      <main className="p-8">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-[#0d9488]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
            <p className="text-3xl font-bold text-[#0f766e]">{stats.totalStudents}</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-[#0d9488]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="text-lg font-semibold text-gray-700">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{stats.approvedStudents}</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-[#0d9488]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingStudents}</p>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg border border-[#0d9488]/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-gray-700">Certificates</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.certificatesGenerated}</p>
          </motion.div>
        </div>

        {/* Search & Add Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search students..."
              className="border border-[#0d9488]/40 bg-white text-gray-800 rounded-lg px-3 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:shadow-md transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => {
              setShowAddForm(true);
              setEditingStudent(null);
              setNewStudent({
                name: "",
                email: "",
                enrollmentNumber: "",
                motherName: "",
                motherTongue: "Gujarati",
                year: "",
                branch: "",
                classAndYear: "",
                religion: "",
                caste: "",
                nationality: "",
                placeOfBirth: "",
                dateOfBirth: "",
                instituteLastAttended: "",
                dateOfAdmission: "",
                conduct: "",
                reasonForLeaving: "",
                remarks: "",
                dateOfLeaving: ""
              });
            }}
            className="bg-[#059669] hover:bg-[#047857] hover:shadow-[#34d399]/40 text-white px-5 py-2 rounded-lg transition-transform duration-200 hover:-translate-y-0.5"
          >
            Add Student
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Add/Edit Student Form */}
        {showAddForm && (
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-[#0d9488]/20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-4 text-[#0f766e]">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                <input
                  type="email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({...newStudent, email: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Enrollment Number</label>
                <input
                  type="text"
                  value={newStudent.enrollmentNumber}
                  onChange={(e) => setNewStudent({...newStudent, enrollmentNumber: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mother's Name</label>
                <input
                  type="text"
                  value={newStudent.motherName}
                  onChange={(e) => setNewStudent({...newStudent, motherName: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mother Tongue</label>
                <select
                  value={newStudent.motherTongue}
                  onChange={(e) => setNewStudent({...newStudent, motherTongue: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Year</label>
                <select
                  value={newStudent.year}
                  onChange={(e) => setNewStudent({...newStudent, year: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                >
                  <option value="">Select Year</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>
              </div>

              {/* LC Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Branch</label>
                <input
                  type="text"
                  value={newStudent.branch}
                  onChange={(e) => setNewStudent({...newStudent, branch: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Class and Year</label>
                <input
                  type="text"
                  value={newStudent.classAndYear}
                  onChange={(e) => setNewStudent({...newStudent, classAndYear: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Religion</label>
                <input
                  type="text"
                  value={newStudent.religion}
                  onChange={(e) => setNewStudent({...newStudent, religion: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Caste</label>
                <input
                  type="text"
                  value={newStudent.caste}
                  onChange={(e) => setNewStudent({...newStudent, caste: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nationality</label>
                <input
                  type="text"
                  value={newStudent.nationality}
                  onChange={(e) => setNewStudent({...newStudent, nationality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Place of Birth</label>
                <input
                  type="text"
                  value={newStudent.placeOfBirth}
                  onChange={(e) => setNewStudent({...newStudent, placeOfBirth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={(e) => setNewStudent({...newStudent, dateOfBirth: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Institute Last Attended</label>
                <input
                  type="text"
                  value={newStudent.instituteLastAttended}
                  onChange={(e) => setNewStudent({...newStudent, instituteLastAttended: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Admission</label>
                <input
                  type="date"
                  value={newStudent.dateOfAdmission}
                  onChange={(e) => setNewStudent({...newStudent, dateOfAdmission: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Conduct</label>
                <select
                  value={newStudent.conduct}
                  onChange={(e) => setNewStudent({...newStudent, conduct: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                >
                  <option value="">Select Conduct</option>
                  <option value="Excellent">Excellent</option>
                  <option value="Very Good">Very Good</option>
                  <option value="Good">Good</option>
                  <option value="Satisfactory">Satisfactory</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Reason for Leaving</label>
                <input
                  type="text"
                  value={newStudent.reasonForLeaving}
                  onChange={(e) => setNewStudent({...newStudent, reasonForLeaving: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Remarks</label>
                <textarea
                  rows={3}
                  value={newStudent.remarks}
                  onChange={(e) => setNewStudent({...newStudent, remarks: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Date of Leaving</label>
                <input
                  type="date"
                  value={newStudent.dateOfLeaving}
                  onChange={(e) => setNewStudent({...newStudent, dateOfLeaving: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#0d9488] focus:border-[#0d9488] outline-none"
                />
              </div>
              
              <div className="md:col-span-2 flex gap-2">
                <button
                  type="submit"
                  className="bg-[#0d9488] hover:bg-[#115e59] text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  {editingStudent ? 'Update Student' : 'Add Student'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingStudent(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Student Table */}
        <motion.div
          className="bg-white shadow-xl rounded-2xl overflow-hidden border border-[#0d9488]/30"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d9488]"></div>
              <p className="mt-2 text-gray-600">Loading students...</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#0f766e] text-white uppercase text-sm tracking-wider">
                <tr>
                  <th className="py-3 px-6">Name</th>
                  <th className="py-3 px-6">Email</th>
                  <th className="py-3 px-6">Enrollment Number</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student._id}
                      className="border-t hover:bg-[#ccfbf1] transition"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="py-3 px-6 font-medium">{student.name}</td>
                      <td className="py-3 px-6">{student.email}</td>
                      <td className="py-3 px-6">{student.enrollmentNumber}</td>
                      <td className="py-3 px-6">
                        <select
                          value={student.status}
                          onChange={(e) => handleStatusChange(student._id, e.target.value)}
                          className={`px-2 py-1 rounded text-sm font-medium ${
                            student.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                        </select>
                      </td>
                      <td className="py-3 px-6 flex gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="bg-[#0ea5e9] hover:bg-[#0284c7] hover:shadow-blue-300/50 text-white px-3 py-1 rounded transition-all duration-200 hover:-translate-y-0.5"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleGenerateLC(student)}
                          disabled={student.status !== 'approved'}
                          className={`px-3 py-1 rounded transition-all duration-200 hover:-translate-y-0.5 ${
                            student.status === 'approved'
                              ? 'bg-[#10b981] hover:bg-[#059669] hover:shadow-green-300/50 text-white'
                              : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          }`}
                        >
                          Generate LC
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="bg-[#ef4444] hover:bg-[#dc2626] hover:shadow-red-300/50 text-white px-3 py-1 rounded transition-all duration-200 hover:-translate-y-0.5"
                        >
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-6 text-gray-500 italic"
                    >
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </motion.div>
      </main>

      {/* Leaving Certificate Modal */}
      {showCertificateModal && selectedStudent && (
        <LeavingCertificate
          student={selectedStudent}
          onClose={handleCloseCertificateModal}
          onSave={handleSaveCertificate}
        />
      )}

      {/* Help/About/Contact Modal */}
      {showPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800 capitalize">{showPage}</h2>
                <button
                  onClick={() => setShowPage(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="text-gray-700 space-y-4">
                {showPage === 'help' && (
                  <>
                    <h3 className="text-xl font-semibold text-teal-700 mb-2">Help & Support</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Getting Started</h4>
                        <p>Welcome to the Leaving Certificate Management System. Use this portal to manage student certificates efficiently.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">How to Add a Student</h4>
                        <p>Click the "Add Student" button, fill in all required fields including Mother Tongue, and click "Add Student" to save.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Generating Certificates</h4>
                        <p>Once a student is approved, click "Generate LC" to create their leaving certificate. You can then print or download it as PDF.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Managing Students</h4>
                        <p>Use the Edit button to modify student information, or the Delete button to remove a student record.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Need More Help?</h4>
                        <p>For additional assistance, please contact the administrator or refer to the About section for more information.</p>
                      </div>
                    </div>
                  </>
                )}

                {showPage === 'about' && (
                  <>
                    <h3 className="text-xl font-semibold text-teal-700 mb-2">About the System</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Leaving Certificate Management System</h4>
                        <p>A comprehensive digital solution for managing leaving certificates at Government Polytechnic Mumbai.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Features</h4>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          <li>Student registration and management</li>
                          <li>Certificate generation and tracking</li>
                          <li>Print and PDF download functionality</li>
                          <li>Secure admin and student portals</li>
                          <li>Real-time status updates</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold">Institution</h4>
                        <p><strong>Government Polytechnic Mumbai</strong></p>
                        <p>49, KHERWADI, ALI YAWAK JUNG MARG, BANDRA (EAST), MUMBAI-400 051</p>
                        <p className="mt-1">(Autonomous status granted by Govt. of Maharashtra)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Version</h4>
                        <p>Version 1.0.0 - Last Updated: 2024</p>
                      </div>
                    </div>
                  </>
                )}

                {showPage === 'contact' && (
                  <>
                    <h3 className="text-xl font-semibold text-teal-700 mb-2">Contact Information</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Administrative Office</h4>
                        <p><strong>Address:</strong><br />
                        49, KHERWADI, ALI YAWAK JUNG MARG<br />
                        BANDRA (EAST), MUMBAI-400 051<br />
                        Maharashtra, India</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Contact Details</h4>
                        <p><strong>Phone:</strong> +91-XX-XXXX-XXXX</p>
                        <p><strong>Email:</strong> admin@gpmumbai.ac.in</p>
                        <p><strong>Website:</strong> www.gpmumbai.ac.in</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Office Hours</h4>
                        <p>Monday to Friday: 9:00 AM - 5:00 PM<br />
                        Saturday: 9:00 AM - 1:00 PM<br />
                        Sunday: Closed</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Support</h4>
                        <p>For technical support or queries related to the Leaving Certificate Management System, please contact the system administrator or visit the administrative office during office hours.</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPage(null)}
                  className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
