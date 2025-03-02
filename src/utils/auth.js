import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

// Save token to localStorage
export const saveToken = (token) => {
    localStorage.setItem("token", token);
};

// Get token from localStorage
export const getToken = () => {
    return localStorage.getItem("token");
};

// Remove token from localStorage (logout)
export const removeToken = () => {
    localStorage.removeItem("token");
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getToken();
    if (!token) return false;

    // Decode the token to check expiration
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000; // Convert to seconds

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
            removeToken(); // Remove expired token
            return false;
        }

        return true;
    } catch (error) {
        console.error("Error decoding token:", error);
        removeToken(); // Remove invalid token
        return false;
    }
};

export const isAdmin = () => {
    const token = getToken();
    if (!token) return false;

    try {
        const decodedToken = jwtDecode(token);
        return decodedToken.isAdmin === true; // Check the isAdmin claim in the token
    } catch (error) {
        console.error("Error decoding token:", error);
        return false;
    }
};