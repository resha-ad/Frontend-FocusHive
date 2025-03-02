// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../utils/auth'; // Import isAdmin from auth.js

const ProtectedRoute = ({ role = "user" }) => {
    // Check if the user is authenticated
    if (!isAuthenticated()) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // Check if the route is for admins and if the user is an admin
    if (role === "admin" && !isAdmin()) {
        // If the user is not an admin, redirect to task page
        return <Navigate to="/task" replace />;
    }

    // If authenticated and authorized, render the child components
    return <Outlet />;
};

export default ProtectedRoute;