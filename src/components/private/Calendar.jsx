import React, { useState } from 'react';
import '../../styles/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBars, faTasks, faProjectDiagram,
    faClock, faCalendar, faBullseye,
    faPlus, faChevronLeft, faChevronRight,
    faEdit, faTrash
} from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../private/Sidebar'; // Import Sidebar component

const Calendar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isUpdateEventModalOpen, setIsUpdateEventModalOpen] = useState(false);

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        const calendarDays = [];

        // Add empty days for previous month
        for (let i = 0; i < startingDay; i++) {
            calendarDays.push(
                <div key={`empty-${i}`} className="calendar-day empty"></div>
            );
        }

        // Add days for current month
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() &&
                month === new Date().getMonth() &&
                year === new Date().getFullYear();

            const dayEvents = events.filter(event => {
                const eventDate = new Date(event.date);
                return eventDate.getDate() === i &&
                    eventDate.getMonth() === month &&
                    eventDate.getFullYear() === year;
            });

            calendarDays.push(
                <div key={`day-${i}`} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    <div className="day-number">{i}</div>
                    {dayEvents.map(event => (
                        <div
                            key={event.id}
                            className={`event-card ${event.color}`}
                            onClick={() => handleEventClick(event)}
                        >
                            {event.title}
                        </div>
                    ))}
                </div>
            );
        }

        // Add empty days for next month only if needed to complete the week
        const remainingDays = (7 - ((startingDay + daysInMonth) % 7)) % 7;
        for (let i = 0; i < remainingDays; i++) {
            calendarDays.push(
                <div key={`empty-next-${i}`} className="calendar-day empty"></div>
            );
        }

        return calendarDays;
    };

    const handleEventClick = (event) => {
        setSelectedEvent(event);
        setIsUpdateEventModalOpen(true);
    };

    const handleAddEvent = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newEvent = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            color: Math.random() > 0.5 ? 'pink' : ''
        };

        // Validate the date is within the current month
        const eventDate = new Date(newEvent.date);
        if (eventDate.getMonth() !== currentDate.getMonth() ||
            eventDate.getFullYear() !== currentDate.getFullYear()) {
            alert('Please select a date within the current month');
            return;
        }

        setEvents(prevEvents => [...prevEvents, newEvent]);
        setIsAddEventModalOpen(false);
        e.target.reset();
    };

    return (
        <div className="calendar-container">
            <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

            <div className={`main-content ${isExpanded ? 'sidebar-expanded' : ''}`}>
                {/* Header */}
                <div className="header-card">
                    <h1>Focus Hive - Calendar</h1>
                    <button
                        className="add-event-btn"
                        onClick={() => setIsAddEventModalOpen(true)}
                    >
                        <FontAwesomeIcon icon={faPlus} /> Add Event
                    </button>
                </div>

                {/* Calendar */}
                <div className="calendar-card">
                    <div className="calendar-header">
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                        <button onClick={() => setCurrentDate(new Date())}>Today</button>
                    </div>

                    <div className="calendar-grid">
                        {/* Day labels */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="day-label">{day}</div>
                        ))}
                        {/* Calendar days */}
                        {renderCalendar()}
                    </div>
                </div>
            </div>

            {/* Add Event Modal */}
            {isAddEventModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add New Event</h2>
                        <form onSubmit={handleAddEvent}>
                            <input
                                type="text"
                                name="title"
                                placeholder="Event title"
                                required
                            />
                            <textarea
                                name="description"
                                placeholder="Description (optional)"
                            ></textarea>
                            <div className="date-time">
                                <input
                                    type="date"
                                    name="date"
                                    required
                                    min={new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0]}
                                    max={new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString().split('T')[0]}
                                />
                                <input
                                    type="time"
                                    name="time"
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Add Event</button>
                                <button
                                    type="button"
                                    onClick={() => setIsAddEventModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Update Event Modal */}
            {isUpdateEventModalOpen && selectedEvent && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Update Event</h2>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            // Handle update logic
                            setIsUpdateEventModalOpen(false);
                        }}>
                            <input
                                type="text"
                                defaultValue={selectedEvent.title}
                                required
                            />
                            <textarea
                                defaultValue={selectedEvent.description}
                            ></textarea>
                            <div className="date-time">
                                <input
                                    type="date"
                                    defaultValue={selectedEvent.date}
                                    required
                                />
                                <input
                                    type="time"
                                    defaultValue={selectedEvent.time}
                                    required
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Update</button>
                                <button
                                    type="button"
                                    onClick={() => setIsUpdateEventModalOpen(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;