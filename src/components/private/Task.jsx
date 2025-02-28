import React, { useState, useEffect } from 'react';
import '../../styles/Task.css';
import beeImage from '../../assets/bee.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faProjectDiagram, faClock, faCalendar, faBullseye, faSearch, faPlus, faBars, faEdit, faTrash, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Sidebar from './Sidebar';
import taskService from '../../services/taskService';


const Task = () => {
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isCompletedVisible, setIsCompletedVisible] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const tasks = await taskService.getTasks(token);
                setTasks(tasks);
            } catch (error) {
                console.error('Error fetching tasks:', error);
            }
        };
        fetchTasks();
    }, [token]);

    // Format date for input elements
    const formatDateForInput = (dateString) => {
        if (!dateString) return '';

        // If the date is already in YYYY-MM-DD format, return it
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString;
        }

        // Try to parse the date and format it
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const handleAddTask = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newTask = {
            title: formData.get('title'),
            description: formData.get('description'),
            deadline: formData.get('deadline'),
            category: formData.get('category'),
            important: formData.get('important') === 'on',
            addToCalendar: formData.get('addToCalendar') === 'on',
        };
        try {
            const addedTask = await taskService.addTask(newTask, token);
            setTasks([...tasks, addedTask]);
            setIsAddModalOpen(false); // Close the modal after adding
            event.target.reset();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    };

    const handleUpdateTask = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedTask = {
            ...selectedTask,
            title: formData.get('title'),
            description: formData.get('description'),
            deadline: formData.get('deadline'),
            category: formData.get('category'),
            important: formData.get('important') === 'on',
            addToCalendar: formData.get('addToCalendar') === 'on',
        };
        try {
            const updated = await taskService.updateTask(selectedTask.id, updatedTask, token);
            setTasks(tasks.map(task => task.id === selectedTask.id ? updated : task));
            setIsUpdateModalOpen(false); // Close the modal after updating
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId, token);
            setTasks(tasks.filter(task => task.id !== taskId));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const handleToggleComplete = async (taskId) => {
        const task = tasks.find(t => t.id === taskId);
        const updatedTask = { ...task, completed: !task.completed };
        try {
            const updated = await taskService.updateTask(taskId, updatedTask, token);
            setTasks(tasks.map(t => t.id === taskId ? updated : t));
        } catch (error) {
            console.error('Error toggling task completion:', error);
        }
    };

    const openUpdateModal = (task) => {
        setSelectedTask(task);
        setIsUpdateModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const closeUpdateModal = () => {
        setSelectedTask(null);
        setIsUpdateModalOpen(false);
    };

    const handleCategoryFilterChange = (e) => {
        setCategoryFilter(e.target.value);
        if (e.target.value) {
            setCurrentFilter('category');
        } else {
            setCurrentFilter('all');
        }
    };

    const filteredTasks = tasks.filter(task => {
        // Filter by search query
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by category or importance
        const matchesFilter =
            currentFilter === 'all' ||
            (currentFilter === 'important' && task.important) ||
            (currentFilter === 'category' && task.category === categoryFilter);

        return matchesSearch && matchesFilter;
    });

    const activeTasks = filteredTasks.filter(task => !task.completed);
    const completedTasks = filteredTasks.filter(task => task.completed);

    const renderTaskCard = (task) => (
        <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
            <div className="task-content">
                <div className="task-header">
                    <div className="task-title">
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleComplete(task.id)}
                            className="task-checkbox"
                        />
                        <h3>{task.title}</h3>
                    </div>
                    <div className="task-actions">
                        {!task.completed && (
                            <button onClick={() => openUpdateModal(task)}>
                                <FontAwesomeIcon icon={faEdit} />
                            </button>
                        )}
                        <button onClick={() => handleDeleteTask(task.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
                {task.description && (
                    <p className="task-description">{task.description}</p>
                )}
                <div className="task-tags">
                    <span className="tag category">{task.category}</span>
                    {task.important && <span className="tag important">Important</span>}
                    {task.addToCalendar && (
                        <span className="tag calendar">
                            <FontAwesomeIcon icon={faCalendar} /> Added to Calendar
                        </span>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div className="task-container">
            <Sidebar />
            <div className="main-content">
                <div className="header">
                    <h1>Focus Hive</h1>
                    <div className="search-add">
                        <div className="search-box">
                            <FontAwesomeIcon icon={faSearch} />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                            <FontAwesomeIcon icon={faPlus} /> Add Task
                        </button>
                    </div>
                </div>

                <div className="motivational">
                    <img src={beeImage} alt="Bee" className="bee-img" />
                    <div>
                        <h2>Welcome back!</h2>
                        <p>Stay busy as a bee! You'll achieve your goals, one task at a time!</p>
                    </div>
                </div>

                <div className="filters">
                    <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All</button>
                    <button className={`filter-btn ${currentFilter === 'important' ? 'active' : ''}`} onClick={() => setCurrentFilter('important')}>Important</button>
                    <select
                        id="categoryFilter"
                        className="filter-btn"
                        value={categoryFilter}
                        onChange={handleCategoryFilterChange}
                    >
                        <option value="">Select Category</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                        <option value="General">General</option>
                    </select>
                </div>

                <div className="tasks">
                    <h2>Active Tasks</h2>
                    {activeTasks.map(renderTaskCard)}
                    {/* Added bottom padding when no completed tasks */}
                    {completedTasks.length === 0 && <div className="tasks-bottom-padding"></div>}
                </div>

                {completedTasks.length > 0 && (
                    <div className="completed-tasks">
                        <div className="completed-header">
                            <h2>Completed Tasks</h2>
                            <FontAwesomeIcon
                                icon={faChevronUp}
                                className={`chevron ${isCompletedVisible ? 'rotated' : ''}`}
                                onClick={() => setIsCompletedVisible(!isCompletedVisible)}
                            />
                        </div>
                        <div className={`completed-tasks-content ${isCompletedVisible ? 'visible' : ''}`}>
                            {completedTasks.map(renderTaskCard)}
                        </div>
                    </div>
                )}

                {isAddModalOpen && (
                    <div className="modal" style={{ display: 'flex' }}>
                        <div className="modal-content">
                            <h2>Add New Task</h2>
                            <form onSubmit={handleAddTask}>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Task title"
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Description (optional)"
                                ></textarea>
                                <div className="date-category">
                                    <div className="input-with-label">
                                        <label htmlFor="add-deadline">Deadline Date:</label>
                                        <input
                                            id="add-deadline"
                                            type="date"
                                            name="deadline"
                                            required
                                        />
                                    </div>
                                    <div className="input-with-label">
                                        <label htmlFor="add-category">Category:</label>
                                        <select id="add-category" name="category" required>
                                            <option value="">Select Category</option>
                                            <option value="Work">Work</option>
                                            <option value="Personal">Personal</option>
                                            <option value="Study">Study</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="important"
                                        />
                                        Mark as important
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="addToCalendar"
                                        />
                                        Add to Calendar
                                    </label>
                                </div>
                                <div className="modal-actions">
                                    <button type="submit">Add Task</button>
                                    <button type="button" onClick={closeAddModal}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {isUpdateModalOpen && selectedTask && (
                    <div className="modal" style={{ display: 'flex' }}>
                        <div className="modal-content">
                            <h2>Update Task</h2>
                            <form onSubmit={handleUpdateTask}>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Task title"
                                    defaultValue={selectedTask.title}
                                    required
                                />
                                <textarea
                                    name="description"
                                    placeholder="Description (optional)"
                                    defaultValue={selectedTask.description}
                                ></textarea>
                                <div className="date-category">
                                    <div className="input-with-label">
                                        <label htmlFor="update-deadline">Deadline Date:</label>
                                        <input
                                            id="update-deadline"
                                            type="date"
                                            name="deadline"
                                            defaultValue={formatDateForInput(selectedTask.deadline)}
                                            required
                                        />
                                    </div>
                                    <div className="input-with-label">
                                        <label htmlFor="update-category">Category:</label>
                                        <select
                                            id="update-category"
                                            name="category"
                                            defaultValue={selectedTask.category}
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Work">Work</option>
                                            <option value="Personal">Personal</option>
                                            <option value="Study">Study</option>
                                            <option value="General">General</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="checkbox-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="important"
                                            defaultChecked={selectedTask.important}
                                        />
                                        Mark as important
                                    </label>
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="addToCalendar"
                                            defaultChecked={selectedTask.addToCalendar}
                                        />
                                        Add to Calendar
                                    </label>
                                </div>
                                <div className="modal-actions">
                                    <button type="submit">Update Task</button>
                                    <button
                                        type="button"
                                        onClick={closeUpdateModal}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Task;