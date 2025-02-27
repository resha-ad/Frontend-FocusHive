import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
import { saveToken } from "../../utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/Login.css";
import spreadsheets from "../../assets/spreadsheets.jpg";
import desktoppink from "../../assets/desktoppink.jpg";
import desk from "../../assets/desk.jpg";
import { ToastContainer } from 'react-toastify';

const Register = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [formData, setFormData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });
    const [error, setError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const images = [spreadsheets, desktoppink, desk];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePassword = (password) =>
        password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);

    // validation functions
    const validateFullName = (name) => {
        const nameRegex = /^[A-Za-z\s]{3,25}$/;  // Only letters and spaces, 3-25 chars
        return nameRegex.test(name);
    };

    const validateUsername = (username) => {
        const usernameRegex = /^[A-Za-z][A-Za-z0-9]{2,14}$/;  // Start with letter, then letters/numbers, 3-15 chars
        return usernameRegex.test(username);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear errors when user changes inputs
        setError("");

        // Validation for different fields
        if (name === "fullName" && value.trim() && !validateFullName(value)) {
            setError("Full name must contain only letters (3-25 characters)");
        }

        if (name === "username" && value.trim() && !validateUsername(value)) {
            setError("Username must start with a letter and can contain letters and numbers (3-15 characters)");
        }

        // Special handling for password
        if (name === "password") {
            if (!validatePassword(value)) {
                setPasswordError("Password must be at least 8 characters and include a letter and a number.");
            } else {
                setPasswordError("");
            }
        }

        // Special handling for confirm password
        if (name === "confirmPassword" && formData.password !== value) {
            setError("Passwords do not match");
        } else if (name === "confirmPassword") {
            setError("");
        }

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validate all fields first
        let validationErrors = [];

        if (!formData.fullName.trim()) {
            validationErrors.push("Full name is required");
        } else if (!validateFullName(formData.fullName)) {
            validationErrors.push("Full name must contain only letters (3-25 characters)");
        }

        if (!formData.username.trim()) {
            validationErrors.push("Username is required");
        } else if (!validateUsername(formData.username)) {
            validationErrors.push("Username must start with a letter and can contain letters and numbers (3-15 characters)");
        }

        if (!formData.email.trim()) {
            validationErrors.push("Email is required");
        } else if (!validateEmail(formData.email)) {
            validationErrors.push("Please enter a valid email address");
        }

        if (!formData.password) {
            validationErrors.push("Password is required");
        } else if (!validatePassword(formData.password)) {
            validationErrors.push("Password must be at least 8 characters long and include at least one letter and one number");
        }

        if (!formData.confirmPassword) {
            validationErrors.push("Please confirm your password");
        } else if (formData.password !== formData.confirmPassword) {
            validationErrors.push("Passwords do not match");
        }

        if (!formData.agreeToTerms) {
            validationErrors.push("You must agree to the terms and conditions");
        }

        // If there are validation errors, display them and return
        if (validationErrors.length > 0) {
            setError(validationErrors.join("\n"));
            return;
        }

        // If validation passes, proceed with signup
        try {
            const { token } = await signup(
                formData.fullName,
                formData.username,
                formData.email,
                formData.password
            );
            saveToken(token);
            toast.success("Successfully registered! Redirecting to login...", {
                position: "top-center",
                autoClose: 3000,
            });
            // Add delay before redirect to show the success message
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error) {
            console.error("Signup Error:", error);
            setError(typeof error === "string" ? error : "Signup failed. Please try again.");
            toast.error(typeof error === "string" ? error : "Signup failed. Please try again.");
        }
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        e.stopPropagation(); // Add this to prevent event bubbling
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
                        <form id="signupForm" onSubmit={handleSubmit}>
                            <div className="logo">
                                <h1>Join Focus Hive</h1>
                                <p>Small steps, big wins</p>
                            </div>
                            {error && (
                                <div className="error-message">
                                    {error.split("\n").map((err, index) => (
                                        <p key={index}>{err}</p>
                                    ))}
                                </div>
                            )}
                            <div className="input-group">
                                <label htmlFor="signupName">
                                    Full Name <span className="input-hint"></span>
                                </label>
                                <input
                                    type="text"
                                    id="signupName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                    minLength="3"
                                    maxLength="25"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupUsername">
                                    Username <span className="input-hint"></span>
                                </label>
                                <input
                                    type="text"
                                    id="signupUsername"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                    minLength="3"
                                    maxLength="15"
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupEmail">Email</label>
                                <input
                                    type="email"
                                    id="signupEmail"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupPassword">Password</label>
                                <input
                                    type="password"
                                    id="signupPassword"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                {passwordError && <div className="error-message">{passwordError}</div>}
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupConfirmPassword">Confirm Password</label>
                                <input
                                    type="password"
                                    id="signupConfirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="terms">
                                <input
                                    type="checkbox"
                                    id="agreeTerms"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="agreeTerms">
                                    I agree to the{" "}
                                    <span
                                        onClick={handleTermsClick}
                                        className="terms-link"
                                        role="button"
                                        tabIndex={0}
                                    >
                                        terms and conditions
                                    </span>
                                </label>
                            </div>
                            <button type="submit" className="btn">
                                Sign Up
                            </button>
                            <div className="toggle-form">
                                <Link to="/login" className="toggle-btn">
                                    Already have an account? Log in
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Modal for Terms and Conditions */}
            {showModal && (
                <div className="modal" onClick={(e) => e.target === e.currentTarget && handleCloseModal()}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Terms and Conditions</h2>
                        <p>
                            By using Focus Hive, you agree to:
                            <br /><br />
                            1. Use the platform responsibly
                            <br />
                            2. Respect other users' privacy
                            <br />
                            3. Not share your account credentials
                            <br />
                            4. Comply with all applicable laws and regulations
                        </p>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;