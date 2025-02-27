import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import api from '../../services/api';
import '../../styles/Login.css';
import spreadsheets from '../../assets/spreadsheets.jpg';
import desktoppink from '../../assets/desktoppink.jpg';
import desk from '../../assets/desk.jpg';

const Register = () => {
    const [currentImage, setCurrentImage] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });
    const [error, setError] = useState('');
    const [showTerms, setShowTerms] = useState(false);
    const navigate = useNavigate();
    // const { login } = useAuth();

    const images = [spreadsheets, desktoppink, desk];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % images.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [images.length]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await api.post('/auth/register', {
                fullName: formData.fullName,
                username: formData.username,
                email: formData.email,
                password: formData.password
            });
            login(response.data.token);
            navigate('/calendar');
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred during registration');
        }
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <>
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
                        <form id="signupForm" onSubmit={handleSubmit}>
                            <div className="logo">
                                <h1>Join Focus Hive</h1>
                                <p>Small steps, big wins</p>
                            </div>
                            {error && <div className="error-message text-red-500 mb-4">{error}</div>}
                            <div className="input-group">
                                <label htmlFor="signupName">Full Name</label>
                                <input
                                    type="text"
                                    id="signupName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label htmlFor="signupUsername">Username</label>
                                <input
                                    type="text"
                                    id="signupUsername"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
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
                                    I agree to the{' '}
                                    <a
                                        href="#"
                                        onClick={handleTermsClick}
                                        className="terms-link"
                                    >
                                        terms and conditions
                                    </a>
                                </label>
                            </div>
                            <button type="submit" className="btn" disabled={!formData.agreeToTerms}>
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

            {/* Modal rendered outside the login-container */}
            {showModal && (
                <div className="modal" onClick={handleCloseModal}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Terms and Conditions</h2>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque ipsum vitae justo tincidunt,
                            at tincidunt nisi tincidunt. Vivamus euismod, nisi vel consectetur interdum, nisl nisi tincidunt nisi,
                            nec tincidunt nisl nisi nec nisi.
                        </p>
                        <button onClick={handleCloseModal}>Close</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;