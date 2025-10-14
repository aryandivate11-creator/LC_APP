import { useState, useEffect } from 'react'
import AdminDashboard from '../Components/AdminDashboard'
import Student from '../Components/Student'
import LoginPage from '../Components/Login'

function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');

    if (token && savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData, userRole) => {
    setUser(userData);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (role === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  if (role === 'student') {
    return <Student onLogout={handleLogout} />;
  }

  return <LoginPage onLogin={handleLogin} />;
}

export default App
