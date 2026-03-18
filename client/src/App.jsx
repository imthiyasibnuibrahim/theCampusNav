import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import MapContainer from './pages/MapContainer';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Home from './pages/Home';

import Directory from './pages/Directory';
import Events from './pages/Events';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';

// A simple wrapper to protect routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout wrapper to conditionally show navbar
const AppLayout = ({ children, showNav = true }) => {
  return (
    <div className="relative h-screen w-full bg-gray-50 overflow-hidden font-sans flex flex-col">
      <main className="flex-1 w-full overflow-y-auto">
        {children}
      </main>
      {showNav && <Navbar />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route (No Navbar) */}
        <Route path="/login" element={
          <AppLayout showNav={false}>
            <Auth />
          </AppLayout>
        } />

        {/* Protected Routes (With Navbar) */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppLayout><Home /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/map" element={
          <ProtectedRoute>
            <AppLayout><MapContainer /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/directory" element={
          <ProtectedRoute>
            <AppLayout><Directory /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute>
            <AppLayout><Events /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/favorites" element={
          <ProtectedRoute>
            <AppLayout><Favorites /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <AppLayout><Profile /></AppLayout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AppLayout><Admin /></AppLayout>
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
