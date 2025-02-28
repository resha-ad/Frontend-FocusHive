import axios from "axios";

const API_URL = "http://localhost:5000/api/calendar";

const getEvents = async (token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL, config);
    return response.data;
};

const addEvent = async (event, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL, event, config);
    return response.data;
};

const updateEvent = async (id, event, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(`${API_URL}/${id}`, event, config);
    return response.data;
};

const deleteEvent = async (id, token) => {
    const config = {
        headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
};

export default { getEvents, addEvent, updateEvent, deleteEvent };