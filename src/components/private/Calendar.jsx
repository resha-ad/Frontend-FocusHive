import React, { useState, useEffect } from 'react';
import '../../styles/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faChevronLeft, faChevronRight, faEdit } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../private/Sidebar';
import calendarService from '../../services/calendarService';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [calendarData, setCalendarData] = useState([]); // Combined events and tasks
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
    const [isUpdateEventModalOpen, setIsUpdateEventModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const token = localStorage.getItem('token');

    // Fetch calendar data (events and tasks)
    useEffect(() => {
        const fetchCalendarData = async () => {
            try {
                const data = await calendarService.getEvents(token);
                setCalendarData(data);
            } catch (error) {
                console.error("Error fetching calendar data:", error);
            }
        };
        fetchCalendarData();
    }, [token]);

    // Handle adding a new event
    const handleAddEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newEvent = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            color: 'pink', // Always set color to pink for calendar-added events
        };

        // Validation: Check if the event date is today or later
        const eventDate = new Date(newEvent.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to midnight for comparison
        if (eventDate < today) {
            setErrorMessage("You can only add events for today or later.");
            return;
        }

        // Validation: Check if the event date is within the current year
        const currentYear = new Date().getFullYear();
        if (eventDate.getFullYear() !== currentYear) {
            setErrorMessage("You can only add events for the current year.");
            return;
        }

        // Validation: Check if there are already 5 events for the selected date
        const eventsOnDate = calendarData.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate.toDateString() === eventDate.toDateString();
        });
        if (eventsOnDate.length >= 5) {
            setErrorMessage("You cannot add more than 5 events for a single day.");
            return;
        }

        try {
            const addedEvent = await calendarService.addEvent(newEvent, token);
            setCalendarData([...calendarData, { ...addedEvent, type: "event" }]);
            setIsAddEventModalOpen(false);
            setErrorMessage('');
            e.target.reset();
        } catch (error) {
            console.error("Error adding event:", error);
            setErrorMessage("Failed to add event. Please try again.");
        }
    };

    // Handle updating an event
    const handleUpdateEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedEvent = {
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            color: 'pink', // Preserve the pink color for calendar events
        };

        try {
            const updated = await calendarService.updateEvent(selectedEvent.id, updatedEvent, token);
            setCalendarData(calendarData.map(item =>
                item.id === selectedEvent.id ? { ...updated, type: "event" } : item
            ));
            setIsUpdateEventModalOpen(false);
        } catch (error) {
            console.error("Error updating event:", error);
        }
    };

    // Handle deleting an event
    const handleDeleteEvent = async (id) => {
        try {
            await calendarService.deleteEvent(id, token);
            setCalendarData(calendarData.filter(item => item.id !== id));
            setIsUpdateEventModalOpen(false); // Close the update modal after deletion
        } catch (error) {
            console.error("Error deleting event:", error);
        }
    };

    // Function to handle event click
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        // Only open update modal if it's not a task (tasks are blue and can't be edited)
        if (event.type !== "task") {
            setIsUpdateEventModalOpen(true);
        }
    };

    // Render calendar logic
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

            const dayData = calendarData.filter(item => {
                const itemDate = new Date(item.date);
                return itemDate.getDate() === i &&
                    itemDate.getMonth() === month &&
                    itemDate.getFullYear() === year;
            });

            calendarDays.push(
                <div key={`day-${i}`} className={`calendar-day ${isToday ? 'today' : ''}`}>
                    <div className="day-number">{i}</div>
                    {dayData.map(item => (
                        <div
                            key={item.id}
                            className={`event-card ${item.type === "task" ? 'blue' : 'pink'}`}
                            onClick={() => handleEventClick(item)}
                        >
                            <div className="event-content">
                                <span>{item.title} {item.type === "task" && "(Task)"}</span>
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        // Add empty days for next month
        const remainingDays = (7 - ((startingDay + daysInMonth) % 7)) % 7;
        for (let i = 0; i < remainingDays; i++) {
            calendarDays.push(
                <div key={`empty-next-${i}`} className="calendar-day empty"></div>
            );
        }

        return calendarDays;
    };

    return (
        <div className="calendar-container">
            <Sidebar />

            <div className="main-content">
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
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h2>{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>
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
                        {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                            <div className="date-time-container">
                                <div className="input-group">
                                    <label htmlFor="event-date">Event Date</label>
                                    <input
                                        id="event-date"
                                        type="date"
                                        name="date"
                                        required
                                        min={new Date().toISOString().split('T')[0]} // Only allow today or later
                                        max={new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0]} // Only allow current year
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="event-time">Event Time</label>
                                    <input
                                        id="event-time"
                                        type="time"
                                        name="time"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Add Event</button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddEventModalOpen(false);
                                        setErrorMessage('');
                                    }}
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
                        <form onSubmit={handleUpdateEvent}>
                            <input
                                type="text"
                                name="title"
                                defaultValue={selectedEvent.title}
                                required
                            />
                            <textarea
                                name="description"
                                defaultValue={selectedEvent.description}
                            ></textarea>
                            <div className="date-time-container">
                                <div className="input-group">
                                    <label htmlFor="update-event-date">Event Date</label>
                                    <input
                                        id="update-event-date"
                                        type="date"
                                        name="date"
                                        defaultValue={selectedEvent.date}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label htmlFor="update-event-time">Event Time</label>
                                    <input
                                        id="update-event-time"
                                        type="time"
                                        name="time"
                                        defaultValue={selectedEvent.time}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="submit">Update</button>
                                <button
                                    type="button"
                                    className="delete-btn"
                                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                                >
                                    Delete Event
                                </button>
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