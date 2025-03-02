import axios from "axios";

const API_URL = "http://localhost:5000/api/focus";

// Save focus timer settings
const saveSettings = async (settings, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(`${API_URL}/settings`, settings, config);
    return response.data;
};

// Save focus session
const saveSession = async (sessionDuration, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(`${API_URL}/session`, { sessionDuration }, config);
    return response.data;
};

// Get focus timer settings
const getSettings = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(`${API_URL}/settings`, config);
    return response.data;
};

// Get all focus sessions
const getSessions = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(`${API_URL}/sessions`, config);
    return response.data;
};

export default { saveSettings, saveSession, getSettings, getSessions };