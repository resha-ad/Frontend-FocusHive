// src/components/private/Login.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Login.css';
import spreadsheets from '../../assets/spreadsheets.jpg';
import desktoppink from '../../assets/desktoppink.jpg';
import desk from '../../assets/desk.jpg'


const LoginForm = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showLoginForm, setShowLoginForm] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const images = [spreadsheets, desktoppink, desk];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handleTermsClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted');
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        console.log('Signup submitted');
    };

    return (
        <div className="login-container">
            {/* Image Section */}
            <div className="split image-section">
                <div className="image-container">
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`Productivity ${index + 1}`}
                            className={`slider-image ${index === currentImage ? 'active' : ''}`}
                        />
                    ))}
                </div>
                <div className="slider-controls">
                    {images.map((_, index) => (
                        <div
                            key={index}
                            className={`slider-dot ${index === currentImage ? 'active' : ''}`}
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
                        <div className="input-group">
                            <label htmlFor="loginEmail">Email</label>
                            <input type="email" id="loginEmail" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="loginPassword">Password</label>
                            <input type="password" id="loginPassword" required />
                        </div>
                        <div className="input-group">
                            <a href="#" className="toggle-btn">Forgot Password?</a>
                        </div>
                        <button type="submit" className="btn">Log In</button>
                        <div className="toggle-form">
                            <Link to="/register" className="toggle-btn">
                                Don't have an account? Sign up
                            </Link>
                        </div>
                    </form>

                    {/* Signup Form */}
                    <form id="signupForm" onSubmit={handleSignupSubmit} style={{ display: showLoginForm ? 'none' : 'block' }}>
                        <div className="logo">
                            <h1>Join Focus Hive</h1>
                            <p>Small steps, big wins</p>
                        </div>
                        <div className="input-group">
                            <label htmlFor="signupName">Full Name</label>
                            <input type="text" id="signupName" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="signupUsername">Username</label>
                            <input type="text" id="signupUsername" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="signupEmail">Email</label>
                            <input type="email" id="signupEmail" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="signupPassword">Password</label>
                            <input type="password" id="signupPassword" required />
                        </div>
                        <div className="input-group">
                            <label htmlFor="signupConfirmPassword">Confirm Password</label>
                            <input type="password" id="signupConfirmPassword" required />
                        </div>
                        <div className="terms">
                            <input type="checkbox" id="agreeTerms" required />
                            <label htmlFor="agreeTerms">I agree to the <a href="#" id="termsLink" onClick={handleTermsClick}>terms and conditions</a></label>
                        </div>
                        <button type="submit" className="btn">Sign Up</button>
                        <div className="toggle-form">
                            <Link to="/login" className="toggle-btn">
                                Already have an account? Log in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal for Terms and Conditions */}
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Terms and Conditions</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque ipsum vitae justo tincidunt,
                            at tincidunt nisi tincidunt. Vivamus euismod, nisi vel consectetur interdum, nisl nisi tincidunt nisi,
                            nec tincidunt nisl nisi nec nisi. Nullam scelerisque ipsum vitae justo tincidunt, at tincidunt nisi
                            tincidunt.
                        </p>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;