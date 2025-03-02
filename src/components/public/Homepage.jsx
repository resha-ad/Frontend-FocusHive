// Homepage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { submitHelpForm } from '../../services/helpFormService'; // Import the service
import '../../styles/Homepage.css';
import { toast } from 'react-toastify';

const Homepage = () => {
    const [activeFaq, setActiveFaq] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [errors, setErrors] = useState({});

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = "Name is required";
        if (!formData.email) newErrors.email = "Email is required";
        else if (!validateEmail(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.subject) newErrors.subject = "Subject is required";
        else if (formData.subject.length > 50) newErrors.subject = "Subject must be less than 50 characters";
        if (!formData.message) newErrors.message = "Message is required";
        else if (formData.message.length > 500) newErrors.message = "Message must be less than 500 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            await submitHelpForm(formData.name, formData.email, formData.subject, formData.message);
            toast.success("Thank you for your message! We will get back to you soon.", {
                position: "top-center",
                autoClose: 3000,
            });
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
        } catch (error) {
            toast.error(error || "Failed to submit the form. Please try again.", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const faqItems = [
        {
            question: "How can FocusHive help me stay organized?",
            answer: "FocusHive offers simple, intuitive tools for managing your daily tasks, calendar events, and work sessions. Our streamlined approach helps you stay organized without overwhelming you with complex features."
        },
        {
            question: "What features are available on the Tasks page?",
            answer: "Our Tasks page lets you create, organize, and prioritize to-do items with minimal effort. Add due dates, set priorities, and track completion with a clean, distraction-free interface."
        },
        {
            question: "How does the Calendar page work?",
            answer: "The Calendar page provides a straightforward view of your schedule. Easily add events, set reminders, and get a clear overview of your day, week, or month ahead without complicated settings."
        },
        {
            question: "What makes the Focus Timer useful?",
            answer: "Our Focus Timer uses a simple Pomodoro technique to help you work in productive intervals. Start a timer, focus on your task, and take short breaks - all with minimal setup and maximum effectiveness."
        },
        {
            question: "Is FocusHive difficult to learn?",
            answer: "Not at all! FocusHive is designed with simplicity in mind. The clean interface and essential features mean you can get started immediately with no learning curve or complicated onboarding."
        }
    ];

    const tools = [
        {
            title: "Task Management",
            description: "Organize and track your tasks with our intuitive task management system. Set priorities, deadlines, and never miss important work again."
        },
        {
            title: "Focus Timer",
            description: "Stay focused and productive with our customizable Pomodoro timer. Track your work sessions and maintain peak productivity."
        },
        {
            title: "Smart Calendar",
            description: "Plan your schedule effectively with our intelligent calendar. Sync with your favorite tools and stay on top of your commitments."
        }
    ];

    return (
        <div className="homepage">
            <nav className="homepage-navbar">
                <div className="homepage-nav-content">
                    <Link to="/" className="homepage-logo">FocusHive</Link>
                    <div className="homepage-nav-links">
                        <Link to="/task">Tasks</Link>
                        <Link to="/calendar">Calendar</Link>
                        <Link to="/focustimer">Focus Timer</Link>
                    </div>
                </div>
            </nav>

            <section className="homepage-hero">
                <h1>Welcome to FocusHive</h1>
                <p>Your all-in-one productivity hub. Stay organized, focused, and efficient with our powerful suite of tools.</p>
                <Link to="/task" className="homepage-submit-btn">Get Started Now</Link>
            </section>

            <section className="homepage-tools-section">
                <h2>Essential Productivity Tools</h2>
                <div className="homepage-tools-grid">
                    {tools.map((tool, index) => (
                        <div className="homepage-tool-card" key={index}>
                            <img src={`/api/placeholder/400/320`} alt={tool.title} className="homepage-tool-image" />
                            <div className="homepage-tool-overlay">
                                <h3>{tool.title}</h3>
                                <p>{tool.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="homepage-help-section">
                <div className="homepage-help-form">
                    <h2>Need Help?</h2>
                    <p>Fill out the form below and we'll get back to you as soon as possible.</p>
                    <form id="helpForm" onSubmit={handleFormSubmit}>
                        <div className="homepage-form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                            {errors.name && <span className="error">{errors.name}</span>}
                        </div>
                        <div className="homepage-form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                            {errors.email && <span className="error">{errors.email}</span>}
                        </div>
                        <div className="homepage-form-group">
                            <label htmlFor="subject">Subject</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                            {errors.subject && <span className="error">{errors.subject}</span>}
                        </div>
                        <div className="homepage-form-group">
                            <label htmlFor="message">Message</label>
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                            />
                            {errors.message && <span className="error">{errors.message}</span>}
                        </div>
                        <button type="submit" className="homepage-submit-btn">Submit</button>
                    </form>
                </div>
            </section>

            <section className="homepage-faq">
                <h2>Frequently Asked Questions</h2>
                {faqItems.map((item, index) => (
                    <div className="homepage-faq-item" key={index}>
                        <div
                            className="homepage-faq-question"
                            onClick={() => toggleFaq(index)}
                        >
                            {item.question}
                            <i
                                className="fas fa-chevron-down"
                                style={{ transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0)' }}
                            ></i>
                        </div>
                        <div className={`homepage-faq-answer ${activeFaq === index ? 'active' : ''}`}>
                            {item.answer}
                        </div>
                    </div>
                ))}
            </section>

            <footer className="homepage-footer">
                <div className="homepage-copyright">
                    <p>© 2025 FocusHive. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;