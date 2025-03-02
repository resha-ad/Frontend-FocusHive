import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; //backend URL

// Signup
export const signup = async (fullName, username, email, password) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, {
            fullName,
            username,
            email,
            password,
        });
        return response.data; // Returns { user, token }
    } catch (error) {
        throw error.response?.data?.message || "Signup failed";
    }
};

// Login
export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            email,
            password,
        });
        localStorage.setItem('token', response.data.token);
        localStorage.setItem("isAdmin", response.data.user.isAdmin); // Store admin status
        return response.data; // Returns { user, token }
    } catch (error) {
        throw error.response?.data?.message || "Login failed";
    }
};
