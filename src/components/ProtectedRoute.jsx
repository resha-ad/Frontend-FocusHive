import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth'; // Import from auth.js

const ProtectedRoute = () => {
    // Check if the user is authenticated
    if (!isAuthenticated()) {
        // If not authenticated, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child components
    return <Outlet />;
};

export default ProtectedRoute;