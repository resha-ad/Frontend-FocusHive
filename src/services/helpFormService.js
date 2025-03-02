// services/helpFormService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/help-form"; // Backend URL

// Submit Help Form
export const submitHelpForm = async (name, email, subject, message) => {
    try {
        const response = await axios.post(`${API_URL}/submit`, {
            name,
            email,
            subject,
            message,
        });
        return response.data; // Returns the submitted form data
    } catch (error) {
        throw error.response?.data?.message || "Failed to submit the form";
    }
};

// Get all Help Forms for Admin Dashboard
export const getAllHelpForms = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/all`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Returns an array of help forms
    } catch (error) {
        throw error.response?.data?.message || "Failed to fetch help forms";
    }
};

// Update Remarks by Admin
export const updateRemarks = async (id, remarks) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/update-remarks/${id}`, { remarks }, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Returns the updated form data
    } catch (error) {
        throw error.response?.data?.message || "Failed to update remarks";
    }
};

// Delete Help Form by Admin
export const deleteHelpForm = async (id) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/delete/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data; // Returns the deletion success message
    } catch (error) {
        throw error.response?.data?.message || "Failed to delete help form";
    }
};