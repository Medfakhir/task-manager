"use client";

import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaPlus, FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null); // Track task to delete
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if modal is open

  // Load tasks and dark mode from localStorage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));

    // Check if there are no tasks, and if so, add a default task
    if (savedTasks.length === 0) {
      const defaultTask = {
        title: 'Default Task',
        subtasks: [],
        currentSubtask: '',
        completed: false,
        isEditing: false,
      };
      setTasks([defaultTask]);
    } else {
      setTasks(savedTasks); // Set the tasks state from localStorage
    }

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode); // Set dark mode from localStorage
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save dark mode preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Handle adding a new task with a title
  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        title: newTaskTitle,
        subtasks: [],
        currentSubtask: '',
        completed: false,
        isEditing: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle(''); // Clear the input field after adding the task
    }
  };

  // Handle editing a task title
  const handleEditTask = (taskIndex, newTitle) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);
  };

  // Toggle edit mode for a task
  const toggleEditTask = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, isEditing: !task.isEditing } : task
    );
    setTasks(updatedTasks);
  };

  // Handle adding a subtask to a specific task
  const handleAddSubtask = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex && task.currentSubtask.trim()
        ? {
            ...task,
            subtasks: [...task.subtasks, { text: task.currentSubtask, completed: false, isEditing: false }],
            currentSubtask: '',
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle subtask editing
  const handleEditSubtask = (taskIndex, subtaskIndex, newText) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask, j) =>
              j === subtaskIndex ? { ...subtask, text: newText } : subtask
            ),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Toggle edit mode for a subtask
  const toggleEditSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask, j) =>
              j === subtaskIndex ? { ...subtask, isEditing: !subtask.isEditing } : subtask
            ),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle task and all its subtasks completion
  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index
        ? {
            ...task,
            completed: !task.completed, // Toggle main task
            subtasks: task.subtasks.map((subtask) => ({
              ...subtask,
              completed: !task.completed, // Set all subtasks to the same completed state
            })),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle subtask completion
  const handleCompleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((task, i) =>
      i === taskIndex
        ? {
            ...task,
            subtasks: task.subtasks.map((subtask, j) =>
              j === subtaskIndex ? { ...subtask, completed: !subtask.completed } : subtask
            ),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle deleting a task
  const handleDeleteTask = (index) => {
    setTaskToDelete(index);
    setIsModalOpen(true); // Open modal for confirmation
  };

  // Confirm and delete the task
  const confirmDeleteTask = () => {
    if (taskToDelete !== null) {
      const updatedTasks = tasks.filter((_, i) => i !== taskToDelete);
      setTasks(updatedTasks);
      setTaskToDelete(null); // Reset taskToDelete
      setIsModalOpen(false); // Close modal
    }
  };

  // Handle deleting a subtask
  const handleDeleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((task, i) =>
      i === taskIndex
        ? {
            ...task,
            subtasks: task.subtasks.filter((_, j) => j !== subtaskIndex),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle subtask input change
  const handleSubtaskInputChange = (taskIndex, newSubtask) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, currentSubtask: newSubtask } : task
    );
    setTasks(updatedTasks);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      } transition-colors duration-300`}
    >
      <div className="mt-10 text-center">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${
            darkMode ? 'bg-yellow-500 text-gray-900' : 'bg-gray-800 text-white'
          }`}
        >
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
        </button>
      </div>

      {/* Task input */}
      <div className="mt-10 flex w-full max-w-xl items-center gap-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Enter task title"
          className={`w-full p-2 rounded-lg ${
            darkMode
              ? 'bg-gray-800 text-gray-100 border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          onClick={handleAddTask}
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <FaPlus />
        </button>
      </div>

      {/* Tasks List */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {tasks.map((task, taskIndex) => (
          <div
            key={taskIndex}
            className={`p-6 rounded-lg shadow-md ${
              darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                {/* Custom checkbox */}
                <div
                  onClick={() => handleCompleteTask(taskIndex)}
                  className={`relative w-6 h-6 flex items-center justify-center cursor-pointer rounded-full ${
                    task.completed
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-300 border-gray-500'
                  } border-2 transition-colors duration-200`}
                >
                  {task.completed && (
                    <svg
                      className="w-4 h-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                {task.isEditing ? (
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => handleEditTask(taskIndex, e.target.value)}
                    className={`p-1 rounded-lg ${
                      darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                    }`}
                  />
                ) : (
                  <span
                    className={`text-lg ${
                      task.completed ? 'line-through' : ''
                    }`}
                  >
                    {task.title}
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleEditTask(taskIndex)}
                  className="p-2 rounded-lg bg-green-500 text-white"
                >
                  {task.isEditing ? <FaSave /> : <FaEdit />}
                </button>
                <button
                  onClick={() => handleDeleteTask(taskIndex)}
                  className="p-2 rounded-lg bg-red-500 text-white"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>

            {/* Subtasks */}
            {task.subtasks.length > 0 && (
              <ul className="pl-4 list-disc">
                {task.subtasks.map((subtask, subtaskIndex) => (
                  <li key={subtaskIndex} className="mb-2 flex justify-between">
                    <div className="flex items-center gap-2">
                      {/* Custom checkbox for subtasks */}
                      <div
                        onClick={() => handleCompleteSubtask(taskIndex, subtaskIndex)}
                        className={`relative w-5 h-5 flex items-center justify-center cursor-pointer rounded-full ${
                          subtask.completed
                            ? 'bg-blue-500 border-blue-500'
                            : 'bg-gray-300 border-gray-500'
                        } border-2 transition-colors duration-200`}
                      >
                        {subtask.completed && (
                          <svg
                            className="w-3 h-3 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      {subtask.isEditing ? (
                        <input
                          type="text"
                          value={subtask.text}
                          onChange={(e) =>
                            handleEditSubtask(taskIndex, subtaskIndex, e.target.value)
                          }
                          className={`p-1 rounded-lg ${
                            darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                          }`}
                        />
                      ) : (
                        <span
                          className={`${
                            subtask.completed ? 'line-through' : ''
                          }`}
                        >
                          {subtask.text}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleEditSubtask(taskIndex, subtaskIndex)}
                        className="p-1 text-green-500"
                      >
                        {subtask.isEditing ? <FaSave size={14} /> : <FaEdit size={14} />}
                      </button>
                      <button
                        onClick={() => handleDeleteSubtask(taskIndex, subtaskIndex)}
                        className="p-1 text-red-500"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Subtask input */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={task.currentSubtask}
                onChange={(e) =>
                  handleSubtaskInputChange(taskIndex, e.target.value)
                }
                placeholder="Add a subtask"
                className={`w-full p-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-gray-100 border-gray-600'
                    : 'bg-gray-100 text-gray-900 border-gray-300'
                }`}
              />
              <button
                onClick={() => handleAddSubtask(taskIndex)}
                className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                <FaPlus size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Footer with Copyright */}
      <div className="mt-auto py-6 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} MEDEV. All rights reserved.</p>
      </div>

      {/* Modal for Delete Confirmation */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className={`bg-white ${darkMode ? 'dark:bg-gray-800' : ''} p-6 rounded-lg shadow-lg max-w-md w-full`}>
            <h2 className={`text-lg mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Are you sure you want to delete this task:{" "}
              <strong>{tasks[taskToDelete]?.title}</strong>?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className={`px-4 py-2 rounded-lg transition ${
                  darkMode
                    ? 'bg-gray-600 text-gray-100 hover:bg-gray-700'
                    : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteTask}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
