// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { getAllHelpForms, updateRemarks, deleteHelpForm } from "../../services/helpFormService";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const [helpForms, setHelpForms] = useState([]);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        fetchHelpForms();
    }, []);

    const fetchHelpForms = async () => {
        try {
            const forms = await getAllHelpForms();
            setHelpForms(forms);
        } catch (error) {
            toast.error(error || "Failed to fetch help forms", {
                position: "top-center",
                autoClose: 3000,
            });
        }
    };

    const handleUpdateRemarks = async (id) => {
        try {
            await updateRemarks(id, remarks);
            toast.success("Remarks updated successfully!", {
                position: "top-center",
                autoClose: 3000,
            });
            fetchHelpForms(); // Refresh the list
            setRemarks(""); // Clear the remarks input
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
            <h1>Admin Dashboard</h1>
            <table>
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
                            <td>{form.message}</td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="Add remarks"
                                    value={remarks}
                                    onChange={(e) => setRemarks(e.target.value)}
                                />
                                <button onClick={() => handleUpdateRemarks(form.id)}>Update</button>
                            </td>
                            <td>
                                <button onClick={() => handleDeleteHelpForm(form.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;