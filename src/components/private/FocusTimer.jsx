import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faRedo, faCog } from '@fortawesome/free-solid-svg-icons';
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

const FocusTimer = () => {
    // State variables
    const [currentMode, setCurrentMode] = useState('pomodoro');
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [currentTheme, setCurrentTheme] = useState('purplesky');

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

    // Fetch settings when the component mounts
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await focusTimerService.getSettings(token);
                if (response.focusTimer) {
                    setPomodoroDuration(response.focusTimer.pomodoroDuration);
                    setShortBreakDuration(response.focusTimer.shortBreakDuration);
                    setLongBreakDuration(response.focusTimer.longBreakDuration);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
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
            await focusTimerService.saveSession(pomodoroDuration, token);
        } catch (error) {
            console.error("Error saving session:", error);
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
            await focusTimerService.saveSettings(
                { pomodoroDuration, shortBreakDuration, longBreakDuration },
                token
            );
            setShowSettings(false);
            handleSetMode(currentMode);
        } catch (error) {
            console.error("Error saving settings:", error);
        }
    };

    // Change theme
    const changeTheme = (themeName) => {
        setCurrentTheme(themeName);
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

                    <div className="focus-timer-controls">
                        <button className="focus-timer-control-btn" onClick={resetTimer}>
                            <FontAwesomeIcon icon={faRedo} />
                        </button>
                        <button className="focus-timer-control-btn" onClick={toggleTimer}>
                            <FontAwesomeIcon icon={isRunning ? faPause : faPlay} />
                        </button>
                        <button className="focus-timer-control-btn" onClick={() => setShowSettings(true)}>
                            <FontAwesomeIcon icon={faCog} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="focus-timer-modal" onClick={(e) => {
                    if (e.target.className === 'focus-timer-modal') handleSaveSettings();
                }}>
                    <div className="focus-timer-modal-content">
                        <h3 className="focus-timer-modal-title">Settings</h3>

                        <div className="focus-timer-setting-section">
                            <h4 className="focus-timer-setting-title">Timer Duration (minutes)</h4>
                            <div className="focus-timer-duration-inputs">
                                <div className="focus-timer-duration-field">
                                    <label>Pomodoro</label>
                                    <input
                                        type="number"
                                        value={pomodoroDuration}
                                        onChange={(e) => setPomodoroDuration(parseInt(e.target.value) || 1)}
                                        min="1"
                                    />
                                </div>
                                <div className="focus-timer-duration-field">
                                    <label>Short Break</label>
                                    <input
                                        type="number"
                                        value={shortBreakDuration}
                                        onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 1)}
                                        min="1"
                                    />
                                </div>
                                <div className="focus-timer-duration-field">
                                    <label>Long Break</label>
                                    <input
                                        type="number"
                                        value={longBreakDuration}
                                        onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 1)}
                                        min="1"
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
        </div>
    );
};

export default FocusTimer;