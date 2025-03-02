import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars, faTasks, faProjectDiagram,
    faClock, faCalendar, faBullseye, faHome
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Sidebar.css'; // Import CSS of the sidebar

const Sidebar = () => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarExpanded(!isSidebarExpanded);
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
        </div>
    );
};

export default Sidebar;