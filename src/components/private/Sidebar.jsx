import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars, faTasks, faProjectDiagram,
    faClock, faCalendar, faBullseye, faHome,
    faSignOutAlt // Added logout icon
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Sidebar.css'; // Import CSS of the sidebar
import { removeToken } from '../../utils/auth.js'; // Import removeToken function
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Sidebar = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const navigate = useNavigate(); // Initialize navigate

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
    };

    const handleLogout = () => {
        removeToken(); // Remove token from localStorage
        navigate('/login'); // Redirect to login page
    };

    return (
        <div className={`sidebar ${isSidebarExpanded ? 'expanded' : ''}`}>
            <div className="nav-item" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faBars} />
                <span>Menu</span>
            </div>
            <div className="nav-item">
                <Link to="/task">
                    <FontAwesomeIcon icon={faTasks} />
                    <span>Tasks</span>
                </Link>
            </div>
            <div className="nav-item">
                <Link to="/calendar">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>Calendar</span>
                </Link>
            </div>
            <div className="nav-item">
                <Link to="/focustimer">
                    <FontAwesomeIcon icon={faBullseye} />
                    <span>Focus</span>
                </Link>
            </div>
            <div className="nav-item">
                <Link to="/homepage">
                    <FontAwesomeIcon icon={faHome} />
                    <span>Home</span>
                </Link>
            </div>
            {/* Logout button added at the bottom of the sidebar */}
            <div className="nav-item logout-item" onClick={handleLogout}>
                <FontAwesomeIcon icon={faSignOutAlt} />
                <span>Logout</span>
            </div>
        </div>
    );
};

export default Sidebar;