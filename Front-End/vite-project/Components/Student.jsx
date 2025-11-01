import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import logo from "/GPM-LOGO-2021.png";

const Student = ({ onLogout }) => {
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPage, setShowPage] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/student/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStudentData(data.dashboard);
      } else {
        setError("Failed to fetch student data");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e0f7fa] via-[#f8ffff] to-[#e0f2f1]">
      {/* 🔹 Glass Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/40 border-b border-white/30 shadow-md">
        <div className="flex justify-between items-center px-6 py-3">
          {/* Left: Logo / Title */}
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="GPM Logo"
              className="h-10 w-10 rounded-full shadow-md"
            />
            <h1 className="text-xl font-semibold text-teal-700 tracking-wide">
              Student Portal
            </h1>
          </div>

          {/* Center: Navigation Links */}
          <div className="hidden md:flex gap-8 text-gray-700 font-medium">
            {["Help", "About", "Contact"].map((item) => (
              <button
                key={item}
                onClick={() => setShowPage(item.toLowerCase())}
                className="relative group cursor-pointer transition duration-300"
              >
                <span className="hover:text-teal-600 transition duration-300">
                  {item}
                </span>
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-teal-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>

          {/* Right: Logout */}
          <button 
            onClick={onLogout}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-lg shadow-md hover:shadow-teal-300/50 transition-all duration-300 hover:-translate-y-0.5"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* 🔹 Header Section */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center py-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <img
          src={logo}
          alt="Government Polytechnic Mumbai Logo"
          className="h-36 w-36 rounded-full object-cover shadow-lg mb-4 sm:mb-0"
        />
        <div className="text-center sm:text-left sm:ml-6">
          <h1 className="text-4xl sm:text-5xl text-teal-700 font-bold">
            Government Polytechnic Mumbai
          </h1>
          <p className="text-2xl sm:text-3xl text-teal-600">
            शासकीय तंत्रनिकेतन मुंबई
          </p>
          <p className="text-lg text-gray-600">
            (An autonomous Institute Government of Maharashtra)
          </p>
        </div>
      </motion.div>

      {/* 🔹 Page Header (No Button Now) */}
      <div className="mx-8 mb-8 p-4 bg-teal-600 text-white rounded-xl shadow-lg flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Welcome, Student</h2>
      </div>

      {/* 🔹 Main Section */}
      <main className="max-w-3xl mx-auto mt-10 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            <p className="mt-2 text-gray-600">Loading your dashboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          </div>
        ) : studentData ? (
          <>
            {/* Welcome Banner */}
            <motion.div
              className="backdrop-blur-md bg-white/70 shadow-lg rounded-xl flex items-center justify-between p-6 border border-white/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div>
                <h2 className="font-semibold text-gray-800">
                  Welcome, {studentData.student.name}
                </h2>
                <p className="text-gray-600 text-sm">{studentData.student.email}</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm shadow-sm ${
                studentData.student.status === 'approved' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-yellow-500 text-white'
              }`}>
                {studentData.student.status === 'approved' ? 'Approved' : 'Pending'}
              </span>
            </motion.div>

            {/* Certificate Overview */
            }
            <motion.section
              className="mt-8 backdrop-blur-md bg-white/70 shadow-lg rounded-xl p-6 border border-white/30"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="font-semibold text-lg mb-4 text-teal-700">
                Certificate Overview
              </h3>

              {studentData.student.status === 'approved' ? (
                <>
                  {(() => {
                    const pd = studentData.student.personalDetails || {};
                    return (
                      <div className="bg-teal-50 p-4 rounded-md text-gray-700 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <p><span className="font-semibold">Name:</span> {studentData.student.name}</p>
                        <p><span className="font-semibold">Mother's Name:</span> {studentData.student.motherName}</p>
                        <p><span className="font-semibold">Enrollment Number:</span> {studentData.student.enrollmentNumber}</p>
                        <p><span className="font-semibold">Course:</span> {studentData.student.course}</p>
                        <p><span className="font-semibold">Year:</span> {studentData.student.year}</p>
                        <p><span className="font-semibold">Branch:</span> {studentData.student.branch || '-'}</p>
                        <p><span className="font-semibold">Class and Year:</span> {studentData.student.classAndYear || '-'}</p>
                        <p><span className="font-semibold">Religion:</span> {pd.religion || '-'}</p>
                        <p><span className="font-semibold">Caste:</span> {pd.caste || '-'}</p>
                        <p><span className="font-semibold">Nationality:</span> {pd.nationality || '-'}</p>
                        <p><span className="font-semibold">Place of Birth:</span> {pd.placeOfBirth || '-'}</p>
                        <p><span className="font-semibold">Date of Birth:</span> {pd.dateOfBirth ? new Date(pd.dateOfBirth).toLocaleDateString() : '-'}</p>
                        <p><span className="font-semibold">Institute Last Attended:</span> {pd.instituteLastAttended || '-'}</p>
                        <p><span className="font-semibold">Date of Admission:</span> {pd.dateOfAdmission ? new Date(pd.dateOfAdmission).toLocaleDateString() : '-'}</p>
                        <p><span className="font-semibold">Conduct:</span> {pd.conduct || '-'}</p>
                        <p><span className="font-semibold">Reason for Leaving:</span> {pd.reasonForLeaving || '-'}</p>
                        <p className="md:col-span-2"><span className="font-semibold">Remarks:</span> {pd.remarks || '-'}</p>
                        <p><span className="font-semibold">Date of Leaving:</span> {pd.dateOfLeaving ? new Date(pd.dateOfLeaving).toLocaleDateString() : '-'}</p>
                      </div>
                    );
                  })()}

                  <p className="mt-4 text-sm text-gray-600">
                    Created: {new Date(studentData.certificate.createdAt).toLocaleDateString()}
                  </p>
                  
                  {studentData.certificate.generated ? (
                    <p className="mt-2 text-emerald-600 font-medium">
                      ✓ Your certificate is ready and approved
                    </p>
                  ) : (
                    <p className="mt-2 text-blue-600 font-medium">
                      📋 Your application is approved. Certificate generation is pending.
                    </p>
                  )}
                </>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-md text-gray-700">
                  <p className="text-yellow-800 font-medium mb-2">
                    ⏳ Your application is currently under review
                  </p>
                  <p className="text-sm text-gray-600">
                    Please wait for admin approval to view your certificate details.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Application submitted: {new Date(studentData.certificate.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </motion.section>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No data available</p>
          </div>
        )}
      </main>

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
                        <h4 className="font-semibold">Student Portal Guide</h4>
                        <p>Welcome to your student portal. Here you can view your certificate status and information.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Viewing Your Certificate</h4>
                        <p>Once your application is approved by the admin, you can view all your certificate details in the Certificate Overview section.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Certificate Status</h4>
                        <p>Your certificate status can be either "Pending" (under review) or "Approved" (ready to view).</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Need Assistance?</h4>
                        <p>If you have any questions or need help, please contact the administrative office or refer to the Contact section.</p>
                      </div>
                    </div>
                  </>
                )}

                {showPage === 'about' && (
                  <>
                    <h3 className="text-xl font-semibold text-teal-700 mb-2">About</h3>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-semibold">Government Polytechnic Mumbai</h4>
                        <p>An autonomous institute under the Government of Maharashtra, dedicated to providing quality technical education.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Address</h4>
                        <p>49, KHERWADI, ALI YAWAK JUNG MARG<br />
                        BANDRA (EAST), MUMBAI-400 051</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Leaving Certificate System</h4>
                        <p>This digital platform allows students to register, track, and receive their leaving certificates online, making the process efficient and transparent.</p>
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
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowPage(null)}
                  className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors duration-200"
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

export default Student;
