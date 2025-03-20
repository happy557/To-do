import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash, FaEdit, FaCheck, FaPlus, FaSun, FaMoon } from 'react-icons/fa';
import './App.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [priority, setPriority] = useState('Medium');
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/todos/');
            setTodos(response.data);
        } catch (err) {
            setError('Failed to fetch todos. Please check the backend server.');
            console.error(err);
        }
    };

    const addTodo = async () => {
        if (!title.trim()) {
            setError('Title cannot be empty.');
            return;
        }
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/todos/', {
                title,
                description,
                dueDate,
                priority,
                completed: false,
            });
            setTodos([...todos, response.data]);
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Medium');
            setError('');
        } catch (err) {
            setError('Failed to add todo. Please check the backend server.');
            console.error(err);
        }
    };

    const deleteTodo = async (id) => {
        try {
            await axios.delete(`http://127.0.0.1:8000/api/todos/${id}/`);
            setTodos(todos.filter(todo => todo.id !== id));
        } catch (err) {
            setError('Failed to delete todo. Please check the backend server.');
            console.error(err);
        }
    };

    const toggleComplete = async (id) => {
        try {
            const todo = todos.find(todo => todo.id === id);
            const response = await axios.put(`http://127.0.0.1:8000/api/todos/${id}/`, {
                ...todo,
                completed: !todo.completed,
            });
            setTodos(todos.map(todo => (todo.id === id ? response.data : todo)));
        } catch (err) {
            setError('Failed to update todo. Please check the backend server.');
            console.error(err);
        }
    };

    const editTodo = (id) => {
        const todo = todos.find(todo => todo.id === id);
        setTitle(todo.title);
        setDescription(todo.description);
        setDueDate(todo.dueDate);
        setPriority(todo.priority);
        setEditId(id);
    };

    const updateTodo = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/api/todos/${editId}/`, {
                title,
                description,
                dueDate,
                priority,
                completed: todos.find(todo => todo.id === editId).completed,
            });
            setTodos(todos.map(todo => (todo.id === editId ? response.data : todo)));
            setTitle('');
            setDescription('');
            setDueDate('');
            setPriority('Medium');
            setEditId(null);
        } catch (err) {
            setError('Failed to update todo. Please check the backend server.');
            console.error(err);
        }
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'Completed') return todo.completed;
        if (filter === 'Pending') return !todo.completed;
        return true;
    });

    return (
        <div className={`App ${darkMode ? 'dark' : ''}`}>
            <h1>My To-do App</h1>
            <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            {error && <p className="error">{error}</p>}
            <div className="todo-form">
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                />
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <button onClick={editId ? updateTodo : addTodo}>
                    {editId ? <FaEdit /> : <FaPlus />} {editId ? 'Update Todo' : 'Add Todo'}
                </button>
            </div>
            <div className="filter-buttons">
                <button onClick={() => setFilter('All')}>All</button>
                <button onClick={() => setFilter('Completed')}>Completed</button>
                <button onClick={() => setFilter('Pending')}>Pending</button>
            </div>
            <ul className="todo-list">
                {filteredTodos.map(todo => (
                    <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                        <div className="todo-content">
                            <h3>{todo.title}</h3>
                            <p>{todo.description}</p>
                            <p>Due: {todo.dueDate}</p>
                            <p>Priority: {todo.priority}</p>
                        </div>
                        <div className="todo-actions">
                            <button onClick={() => toggleComplete(todo.id)}>
                                <FaCheck />
                            </button>
                            <button onClick={() => editTodo(todo.id)}>
                                <FaEdit />
                            </button>
                            <button onClick={() => deleteTodo(todo.id)}>
                                <FaTrash />
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;