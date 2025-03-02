import React, { useState, useEffect } from "react";
import { getAllHelpForms, updateRemarks, deleteHelpForm } from "../../services/helpFormService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutButton from "../public/LogoutButton";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [helpForms, setHelpForms] = useState([]);
    const [formRemarks, setFormRemarks] = useState({});
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchHelpForms();
    }, []);

    const fetchHelpForms = async () => {
        try {
            const forms = await getAllHelpForms();
            setHelpForms(forms);

            // Initialize remarks state for each form
            const remarksState = {};
            forms.forEach(form => {
                remarksState[form.id] = form.remarks || "";
            });
            setFormRemarks(remarksState);
        } catch (error) {
            toast.error(error || "Failed to fetch help forms", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const validateRemarks = (id, value) => {
        let newErrors = { ...errors };

        if (value.length < 3) {
            newErrors[id] = "Remarks must be at least 3 characters";
        } else if (!/[a-zA-Z]/.test(value)) {
            newErrors[id] = "Remarks must contain letters";
        } else {
            delete newErrors[id];
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRemarksChange = (id, value) => {
        setFormRemarks(prev => ({
            ...prev,
            [id]: value
        }));
        validateRemarks(id, value);
    };

    const handleUpdateRemarks = async (id) => {
        const remarks = formRemarks[id];

        if (!validateRemarks(id, remarks)) {
            return;
        }

        try {
            await updateRemarks(id, remarks);
            toast.success("Remarks updated successfully!", {
                position: "top-center",
                autoClose: 3000,
            });
            fetchHelpForms(); // Refresh the list
        } catch (error) {
            toast.error(error || "Failed to update remarks", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleDeleteHelpForm = async (id) => {
        try {
            await deleteHelpForm(id);
            toast.success("Help form deleted successfully!", {
                position: "top-center",
                autoClose: 3000,
            });
            fetchHelpForms(); // Refresh the list
        } catch (error) {
            toast.error(error || "Failed to delete help form", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Add ToastContainer to render notifications */}
            <ToastContainer />

            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <LogoutButton />
            </div>

            <div className="table-container">
                <table className="forms-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Remarks</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {helpForms.map((form) => (
                            <tr key={form.id}>
                                <td>{form.name}</td>
                                <td>{form.email}</td>
                                <td>{form.subject}</td>
                                <td className="message-cell">{form.message}</td>
                                <td className="remarks-cell">
                                    <div className="remarks-container">
                                        <input
                                            type="text"
                                            placeholder="Add remarks"
                                            value={formRemarks[form.id] || ""}
                                            onChange={(e) => handleRemarksChange(form.id, e.target.value)}
                                            className={errors[form.id] ? "error-input" : ""}
                                        />
                                        {errors[form.id] && (
                                            <div className="error-message">{errors[form.id]}</div>
                                        )}
                                    </div>
                                    <button
                                        className="update-btn"
                                        onClick={() => handleUpdateRemarks(form.id)}
                                        disabled={!!errors[form.id]}
                                    >
                                        Update
                                    </button>
                                </td>
                                <td>
                                    <button
                                        className="delete-btn"
                                        onClick={() => handleDeleteHelpForm(form.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;