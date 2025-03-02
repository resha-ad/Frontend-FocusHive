import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import { saveToken } from "../../utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Login.css";
import spreadsheets from "../../assets/spreadsheets.jpg";
import desktoppink from "../../assets/desktoppink.jpg";
import desk from "../../assets/desk.jpg";
import { ToastContainer } from 'react-toastify';

const LoginForm = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const images = [spreadsheets, desktoppink, desk];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // LoginForm.jsx
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        try {
            // Destructure both user and token from the response
            const { user, token } = await login(email, password);

            // Save the token to localStorage
            saveToken(token);

            // Show success message
            toast.success("Successfully logged in!", {
                position: "top-center",
                autoClose: 3000,
            });

            // Redirect based on user role
            setTimeout(() => {
                if (user.isAdmin) {
                    navigate("/admin-dashboard"); // Redirect to admin dashboard
                } else {
                    navigate("/homepage"); // Redirect to homepage for regular users
                }
            }, 3000);
        } catch (error) {
            console.error("Login Error:", error);
            setError(error);
            toast.error(typeof error === "string" ? error : "Login failed. Please try again.");
        }
    };


    return (
        <>
            <ToastContainer />
            <div className="login-container">
                {/* Image Section */}
                <div className="split image-section">
                    <div className="image-container">
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Productivity ${index + 1}`}
                                className={`slider-image ${index === currentImage ? "active" : ""}`}
                            />
                        ))}
                    </div>
                    <div className="slider-controls">
                        {images.map((_, index) => (
                            <div
                                key={index}
                                className={`slider-dot ${index === currentImage ? "active" : ""}`}
                                onClick={() => setCurrentImage(index)}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <div className="split form-section">
                    <div className="form-container">
                        <form id="loginForm" onSubmit={handleLoginSubmit}>
                            <div className="logo">
                                <h1>Focus Hive</h1>
                                <p>Continue your Productivity Journey</p>
                            </div>
                            {error && <div className="error-message">{error}</div>}
                            <div className="input-group">
                                <label htmlFor="loginEmail">Email</label>
                                <input
                                    type="email"
                                    id="loginEmail"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="loginPassword">Password</label>
                                <input
                                    type="password"
                                    id="loginPassword"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit" className="btn">
                                Log In
                            </button>
                            <div className="toggle-form">
                                <Link to="/register" className="toggle-btn">
                                    Don't have an account? Sign up
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginForm;