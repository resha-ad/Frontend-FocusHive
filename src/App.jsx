import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Import Navigate
import Task from './components/private/Task';
import LoginForm from './components/public/LoginForm';
import Calendar from './components/private/Calendar';
import FocusTimer from './components/private/FocusTimer';
import Register from './components/public/Register';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/focustimer" element={<FocusTimer />} />
          <Route path="/task" element={<Task />} />
        </Route>

        {/* Default Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;