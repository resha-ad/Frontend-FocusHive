import React, { useState, useEffect } from 'react';
import '../../styles/Task.css';
import beeImage from '../../assets/bee.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTasks, faProjectDiagram, faClock, faCalendar, faBullseye, faSearch, faPlus, faBars, faEdit, faTrash, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Sidebar from '../private/Sidebar';

const Task = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [tasks, setTasks] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [username, setUsername] = useState('');
    const [currentFilter, setCurrentFilter] = useState('all');
    const [isCompletedVisible, setIsCompletedVisible] = useState(true);

    // Debug: Log when component renders
    console.log('Current tasks:', tasks);

    // Load tasks from localStorage
    useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }
    }, []);

    // Save tasks to localStorage
    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const newTask = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            deadline: formData.get('deadline'),
            category: formData.get('category'),
            important: formData.get('important') === 'on',
            addToCalendar: formData.get('addToCalendar') === 'on',
            completed: false,
        };
        setTasks(prevTasks => [...prevTasks, newTask]);
        closeAddModal();
        event.target.reset();
    };

    const handleUpdateTask = (event) => {
        event.preventDefault();

        try {
            if (!selectedTask) return;

            const formData = new FormData(event.target);

            const updatedTask = {
                id: selectedTask.id,
                title: formData.get('title'),
                description: formData.get('description'),
                deadline: formData.get('deadline'),
                category: formData.get('category'),
                important: formData.get('important') === 'on',
                addToCalendar: formData.get('addToCalendar') === 'on',
                completed: selectedTask.completed
            };

            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === selectedTask.id ? updatedTask : task
                )
            );

            closeUpdateModal();
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const toggleTaskCompletion = (taskId, isCompleted = false) => {
        if (isCompleted) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = false;
                setTasks([...tasks, task]);
            }
        } else {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completedAt = new Date();
                setTasks(tasks.filter(t => t.id !== taskId));
            }
        }
    };

    const deleteTask = (taskId, isCompleted = false) => {
        if (isCompleted) {
            setTasks(tasks.filter(t => t.id !== taskId));
        } else {
            setTasks(tasks.filter(t => t.id !== taskId));
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = currentFilter === 'all' ||
            (currentFilter === 'important' && task.important) ||
            (currentFilter === 'category' && task.category === document.getElementById('categoryFilter').value);
        return matchesSearch && matchesFilter;
    });

    const toggleSidebar = () => {
        setIsExpanded(!isExpanded);
    };

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openUpdateModal = (task) => {
        try {
            setSelectedTask({ ...task });
            setIsUpdateModalOpen(true);
        } catch (error) {
            console.error('Error opening update modal:', error);
        }
    };

    const closeUpdateModal = () => {
        try {
            setIsUpdateModalOpen(false);
            setSelectedTask(null);
        } catch (error) {
            console.error('Error closing update modal:', error);
        }
    };

    // Separate active and completed tasks
    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);

    const handleToggleComplete = (taskId) => {
        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
            )
        );
    };

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
                        <button onClick={() => {
                            setTasks(tasks.filter(t => t.id !== task.id));
                        }}>
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

    const renderTasks = () => {
        return tasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
                <div className="task-content">
                    <div className="task-info">
                        <div className="task-header">
                            <input
                                type="checkbox"
                                checked={task.completed}
                                onChange={() => handleToggleComplete(task.id)}
                                className="task-checkbox"
                            />
                            <h3>{task.title}</h3>
                        </div>
                        <p>{task.description}</p>
                        <div className="task-details">
                            <span>{task.deadline}</span>
                            <span className="category">{task.category}</span>
                        </div>
                    </div>
                    <div className="task-actions">
                        <button onClick={() => openUpdateModal(task)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => deleteTask(task.id)}>
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                </div>
            </div>
        ));
    };

    // Cleanup function
    useEffect(() => {
        return () => {
            // Cleanup when component unmounts
            setIsUpdateModalOpen(false);
            setSelectedTask(null);
        };
    }, []);

    return (
        <div className="task-container">
            <Sidebar isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

            <div className={`main-content ${isExpanded ? 'sidebar-expanded' : ''}`}>
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
                        <button className="add-btn" onClick={openAddModal}>
                            <FontAwesomeIcon icon={faPlus} /> Add Task
                        </button>
                    </div>
                </div>

                <div className="motivational">
                    <img src={beeImage} alt="Bee" className="bee-img" />
                    <div>
                        <h2>Welcome back, {username}!</h2>
                        <p>Stay busy as a bee! You'll achieve your goals, one task at a time!</p>
                    </div>
                </div>

                <div className="filters">
                    <button className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>All</button>
                    <button className={`filter-btn ${currentFilter === 'important' ? 'active' : ''}`} onClick={() => setCurrentFilter('important')}>Important</button>
                    <select id="categoryFilter" className="filter-btn" onChange={() => setCurrentFilter('category')}>
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
            </div>

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
                                <input
                                    type="date"
                                    name="deadline"
                                    required
                                />
                                <select name="category" required>
                                    <option value="">Select Category</option>
                                    <option value="Work">Work</option>
                                    <option value="Personal">Personal</option>
                                    <option value="Study">Study</option>
                                    <option value="General">General</option>
                                </select>
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
                <div className="modal">
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
                                <input
                                    type="date"
                                    name="deadline"
                                    defaultValue={selectedTask.deadline}
                                    required
                                />
                                <select
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
    );
};

export default Task;