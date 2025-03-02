import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faCog, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/FocusTimer.css';
import Sidebar from './Sidebar';
import focusTimerService from '../../services/focusTimerService'; // Import the service

// Import images
import purpleSkyImg from '../../assets/themepurplesky.jpeg';
import windowImg from '../../assets/themewindow.jpeg';
import meadowImg from '../../assets/thememeadow.jpeg';
import oceanImg from '../../assets/themeocean.jpeg';
import greenImg from '../../assets/themegreen.jpeg';
import officeImg from '../../assets/themeoffice.jpeg';
import beeImg from '../../assets/bee.png'; // Add bee image for streak icon

const FocusTimer = () => {
    // State variables
    const [currentMode, setCurrentMode] = useState('pomodoro');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('purplesky');
    const [showSessions, setShowSessions] = useState(false);
    const [sessions, setSessions] = useState([]);
    const [totalSessions, setTotalSessions] = useState(0);

    // Timer settings
    const [pomodoroDuration, setPomodoroDuration] = useState(25);
    const [shortBreakDuration, setShortBreakDuration] = useState(5);
    const [longBreakDuration, setLongBreakDuration] = useState(15);

    // Timer interval reference
    const timerIntervalRef = useRef(null);

    // Themes mapping
    const themes = {
        purplesky: purpleSkyImg,
        window: windowImg,
        meadow: meadowImg,
        ocean: oceanImg,
        green: greenImg,
        office: officeImg,
    };

    // Get token from localStorage
    const token = localStorage.getItem('token');

    // Format time to display (MM:SS)
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    };

    // Fetch settings and sessions when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings
                const settingsResponse = await focusTimerService.getSettings(token);
                if (settingsResponse.focusTimer) {
                    setPomodoroDuration(settingsResponse.focusTimer.pomodoroDuration);
                    setShortBreakDuration(settingsResponse.focusTimer.shortBreakDuration);
                    setLongBreakDuration(settingsResponse.focusTimer.longBreakDuration);
                }

                // Fetch sessions
                const sessionsResponse = await focusTimerService.getSessions(token);
                if (sessionsResponse && sessionsResponse.sessions) {
                    setSessions(sessionsResponse.sessions);
                    setTotalSessions(sessionsResponse.sessions.length);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, [token]);

    // Timer logic
    useEffect(() => {
        if (isRunning) {
            timerIntervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerIntervalRef.current);
                        playSound();
                        setIsRunning(false);
                        saveSession(); // Save session when timer ends
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerIntervalRef.current);
        }

        return () => clearInterval(timerIntervalRef.current);
    }, [isRunning]);

    // Save session when timer ends
    const saveSession = async () => {
        try {
            if (currentMode === 'pomodoro') {
                const response = await focusTimerService.saveSession(pomodoroDuration, token);
                // Refresh sessions list
                const sessionsResponse = await focusTimerService.getSessions(token);
                if (sessionsResponse && sessionsResponse.sessions) {
                    setSessions(sessionsResponse.sessions);
                    setTotalSessions(sessionsResponse.sessions.length);
                }
            }
        } catch (error) {
            console.error("Error saving session:", error);
        }
    };

    // Delete session
    const deleteSession = async (sessionId) => {
        try {
            await focusTimerService.deleteSession(sessionId, token);
            // Refresh sessions after deletion
            const sessionsResponse = await focusTimerService.getSessions(token);
            if (sessionsResponse && sessionsResponse.sessions) {
                setSessions(sessionsResponse.sessions);
                setTotalSessions(sessionsResponse.sessions.length);
            }
        } catch (error) {
            console.error("Error deleting session:", error);
        }
    };

    // Set mode (pomodoro, short break, long break)
    const handleSetMode = (mode) => {
        setCurrentMode(mode);
        setIsRunning(false);

        let duration;
        switch (mode) {
            case 'pomodoro':
                duration = pomodoroDuration;
                break;
            case 'shortBreak':
                duration = shortBreakDuration;
                break;
            case 'longBreak':
                duration = longBreakDuration;
                break;
            default:
                duration = pomodoroDuration;
        }

        setTimeLeft(duration * 60);
    };

    // Play sound when timer ends
    const playSound = () => {
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
        audio.play();
    };

    // Toggle timer start/pause
    const toggleTimer = () => {
        setIsRunning(!isRunning);
    };

    // Reset timer
    const resetTimer = () => {
        setIsRunning(false);
        handleSetMode(currentMode);
    };

    // Handle settings save
    const handleSaveSettings = async () => {
        try {
            // Save new settings
            await focusTimerService.saveSettings(
                { pomodoroDuration, shortBreakDuration, longBreakDuration },
                token
            );

            // Fetch the latest settings from the backend
            const response = await focusTimerService.getSettings(token);
            if (response.focusTimer) {
                setPomodoroDuration(response.focusTimer.pomodoroDuration || 25);
                setShortBreakDuration(response.focusTimer.shortBreakDuration || 5);
                setLongBreakDuration(response.focusTimer.longBreakDuration || 15);
            }

            // Close settings modal and update timer
            setShowSettings(false);
            handleSetMode(currentMode);

            // Show success message if toast is imported
            if (typeof toast !== 'undefined') {
                toast.success("Settings saved successfully! 🎉", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.error("Error saving settings:", error);
            if (typeof toast !== 'undefined') {
                toast.error("Failed to save settings. Please try again.", {
                    position: "top-center",
                    autoClose: 3000,
                });
            }
        }
    };

    // Change theme
    const changeTheme = (themeName) => {
        setCurrentTheme(themeName);
    };

    // Format date for session display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Validate timer duration inputs
    const validateDuration = (value) => {
        const numValue = parseInt(value) || 1;
        return Math.min(numValue, 999); // Max 3 digits
    };

    return (
        <div
            className="focus-timer"
            style={{ backgroundImage: `url(${themes[currentTheme]})` }}
        >
            <div className="focus-timer-layout">
                {/* Use the imported Sidebar component */}
                <Sidebar />

                {/* Main Content */}
                <div className="focus-timer-container">
                    <div className="focus-timer-content">
                        <div className="focus-timer-mode-buttons">
                            <button
                                className={`focus-timer-mode-btn ${currentMode === 'pomodoro' ? 'active' : ''}`}
                                onClick={() => handleSetMode('pomodoro')}
                            >
                                Focus
                            </button>
                            <button
                                className={`focus-timer-mode-btn ${currentMode === 'shortBreak' ? 'active' : ''}`}
                                onClick={() => handleSetMode('shortBreak')}
                            >
                                Short Break
                            </button>
                            <button
                                className={`focus-timer-mode-btn ${currentMode === 'longBreak' ? 'active' : ''}`}
                                onClick={() => handleSetMode('longBreak')}
                            >
                                Long Break
                            </button>
                        </div>

                        <div className="focus-timer-display">
                            {formatTime(timeLeft)}
                        </div>

                        <div className="focus-timer-streak" onClick={() => setShowSessions(true)}>
                            <img src={beeImg} alt="Bee" className="focus-timer-bee-icon" />
                            <span className="focus-timer-streak-count">{totalSessions}</span>
                        </div>

                        <div className="focus-timer-controls">
                            <button className="focus-timer-control-btn" onClick={resetTimer}>
                                <FontAwesomeIcon icon={faRedo} />
                            </button>
                            <button className="focus-timer-control-btn focus-timer-control-btn-main" onClick={toggleTimer}>
                                <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
                            </button>
                            <button className="focus-timer-control-btn" onClick={() => setShowSettings(true)}>
                                <FontAwesomeIcon icon={faCog} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="focus-timer-modal" onClick={(e) => {
                    if (e.target.className === 'focus-timer-modal') setShowSettings(false);
                }}>
                    <div className="focus-timer-modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3 className="focus-timer-modal-title">Settings</h3>

                        <div className="focus-timer-setting-section">
                            <h4 className="focus-timer-setting-title">Timer Duration (minutes)</h4>
                            <div className="focus-timer-duration-inputs">
                                <div className="focus-timer-duration-field">
                                    <label>Pomodoro</label>
                                    <input
                                        type="number"
                                        value={pomodoroDuration}
                                        onChange={(e) => setPomodoroDuration(validateDuration(e.target.value))}
                                        min="1"
                                        max="999"
                                    />
                                </div>
                                <div className="focus-timer-duration-field">
                                    <label>Short Break</label>
                                    <input
                                        type="number"
                                        value={shortBreakDuration}
                                        onChange={(e) => setShortBreakDuration(validateDuration(e.target.value))}
                                        min="1"
                                        max="999"
                                    />
                                </div>
                                <div className="focus-timer-duration-field">
                                    <label>Long Break</label>
                                    <input
                                        type="number"
                                        value={longBreakDuration}
                                        onChange={(e) => setLongBreakDuration(validateDuration(e.target.value))}
                                        min="1"
                                        max="999"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="focus-timer-setting-section">
                            <h4 className="focus-timer-setting-title">Theme</h4>
                            <div className="focus-timer-theme-options">
                                {Object.entries(themes).map(([name, path]) => (
                                    <div
                                        key={name}
                                        className={`focus-timer-theme-option ${currentTheme === name ? 'active' : ''}`}
                                        style={{ backgroundImage: `url(${path})` }}
                                        onClick={() => changeTheme(name)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="focus-timer-modal-footer">
                            <button className="focus-timer-save-btn" onClick={handleSaveSettings}>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Sessions Modal */}
            {showSessions && (
                <div className="focus-timer-modal" onClick={(e) => {
                    if (e.target.className === 'focus-timer-modal') setShowSessions(false);
                }}>
                    <div className="focus-timer-modal-content focus-timer-sessions-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="focus-timer-sessions-header">
                            <h3 className="focus-timer-modal-title">Focus Sessions</h3>
                            <div className="focus-timer-sessions-summary">
                                <img src={beeImg} alt="Bee" className="focus-timer-bee-icon-large" />
                                <span className="focus-timer-sessions-count">{totalSessions} sessions completed</span>
                            </div>
                        </div>

                        <div className="focus-timer-sessions-list">
                            {sessions.length === 0 ? (
                                <div className="focus-timer-no-sessions">
                                    <p>No sessions completed yet. Start your focus journey!</p>
                                </div>
                            ) : (
                                sessions.map((session) => (
                                    <div className="focus-timer-session-item" key={session._id}>
                                        <div className="focus-timer-session-info">
                                            <div className="focus-timer-session-duration">
                                                {session.duration} minutes
                                            </div>
                                            <div className="focus-timer-session-date">
                                                {formatDate(session.createdAt)}
                                            </div>
                                        </div>
                                        <button
                                            className="focus-timer-delete-btn"
                                            onClick={() => deleteSession(session._id)}
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="focus-timer-modal-footer">
                            <button className="focus-timer-save-btn" onClick={() => setShowSessions(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FocusTimer;