import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '../../utils/auth.js';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken(); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;