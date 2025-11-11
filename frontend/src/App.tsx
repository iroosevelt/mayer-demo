import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function AppContent() {
  return (
    <Routes>
      {/* Public Routes - No Layout */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Public Routes - With Layout */}
      <Route path="/" element={<Layout><Home /></Layout>} />

      {/* Protected Routes - No Layout (Dashboard has its own) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard/*" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
