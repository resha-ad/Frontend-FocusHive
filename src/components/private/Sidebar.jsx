import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars, faTasks, faProjectDiagram,
    faClock, faCalendar, faBullseye
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/Sidebar.css'; // Import the scoped CSS for the sidebar

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
                <FontAwesomeIcon icon={faTasks} />
                <span>Tasks</span>
            </div>
            <div className="nav-item">
                <FontAwesomeIcon icon={faProjectDiagram} />
                <span>Projects</span>
            </div>
            <div className="nav-item">
                <FontAwesomeIcon icon={faClock} />
                <span>Timeline</span>
            </div>
            <div className="nav-item active">
                <FontAwesomeIcon icon={faCalendar} />
                <span>Calendar</span>
            </div>
            <div className="nav-item">
                <FontAwesomeIcon icon={faBullseye} />
                <span>Focus</span>
            </div>
        </div>
    );
};

export default Sidebar;