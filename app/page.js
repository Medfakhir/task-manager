"use client";

import { useState, useEffect } from 'react';
import { FaSun, FaMoon, FaPlus, FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [newSubtask, setNewSubtask] = useState('');

  // Load tasks and dark mode from localStorage when the component mounts
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode') || 'false');

    if (savedTasks.length > 0) {
      setTasks(savedTasks);
    }

    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
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

  // Handle opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewTaskTitle('');
    setSelectedDate(null);
  };

  // Handle adding a new task with a title and date
  const handleAddTask = () => {
    if (newTaskTitle.trim() && selectedDate) {
      const newTask = {
        title: newTaskTitle,
        subtasks: [],
        completed: false,
        createdAt: selectedDate,
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setSelectedDate(null);
      setIsModalOpen(false);
    }
  };

  // Handle adding a subtask to a specific task
  const handleAddSubtask = (taskIndex) => {
    if (newSubtask.trim()) {
      const updatedTasks = tasks.map((task, index) =>
        index === taskIndex
          ? { ...task, subtasks: [...task.subtasks, { text: newSubtask, completed: false, isEditing: false }] }
          : task
      );
      setTasks(updatedTasks);
      setNewSubtask('');
    }
  };

  // Handle deleting a task
  const handleDeleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Handle deleting a subtask
  const handleDeleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex
        ? {
            ...task,
            subtasks: task.subtasks.filter((_, j) => j !== subtaskIndex),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Handle completing a subtask
  const handleCompleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex
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

  // Handle task editing toggle
  const toggleEditTask = (taskIndex) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, isEditing: !task.isEditing } : task
    );
    setTasks(updatedTasks);
  };

  // Handle editing a task title
  const handleEditTask = (taskIndex, newTitle) => {
    const updatedTasks = tasks.map((task, index) =>
      index === taskIndex ? { ...task, title: newTitle } : task
    );
    setTasks(updatedTasks);
  };

  // Handle subtask editing toggle
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

  // Handle editing a subtask text
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

  // Handle completing a task
  const handleCompleteTask = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index
        ? {
            ...task,
            completed: !task.completed,
            subtasks: task.subtasks.map((subtask) => ({
              ...subtask,
              completed: !task.completed,
            })),
          }
        : task
    );
    setTasks(updatedTasks);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      {/* Header Section */}
      <header className="fixed top-0 w-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Task Manager
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleOpenModal}
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center gap-2"
            >
              <FaPlus className="text-sm" /> New Task
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-all duration-200 ${
                darkMode 
                  ? 'bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30' 
                  : 'bg-gray-800/20 text-gray-800 hover:bg-gray-800/30'
              }`}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, taskIndex) => (
            <div
              key={taskIndex}
              className={`group rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              {/* Task Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => handleCompleteTask(taskIndex)}
                    className={`mt-1 relative shrink-0 w-6 h-6 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
                      task.completed 
                        ? 'bg-green-500 border-green-500' 
                        : 'bg-transparent border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {task.completed && (
                      <svg
                        className="absolute inset-0 m-auto w-4 h-4 text-white"
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
                  <div className="flex-1">
                    {task.isEditing ? (
                      <input
                        type="text"
                        value={task.title}
                        onChange={(e) => handleEditTask(taskIndex, e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <h3 className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                        {task.title}
                      </h3>
                    )}
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {task.createdAt && format(new Date(task.createdAt), "MMMM d, yyyy h:mm aa")}
                    </p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => toggleEditTask(taskIndex)}
                      className="p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                      {task.isEditing ? <FaSave size={14} /> : <FaEdit size={14} />}
                    </button>
                    <button
                      onClick={() => handleDeleteTask(taskIndex)}
                      className="p-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                    >
                      <FaTrashAlt size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="p-6">
                {task.subtasks.length > 0 && (
                  <ul className="space-y-3 mb-4">
                    {task.subtasks.map((subtask, subtaskIndex) => (
                      <li key={subtaskIndex} className="flex items-center justify-between group/subtask">
                        <div className="flex items-center gap-3 flex-1">
                          <div
                            onClick={() => handleCompleteSubtask(taskIndex, subtaskIndex)}
                            className={`relative w-5 h-5 cursor-pointer rounded-full border-2 transition-colors duration-200 ${
                              subtask.completed 
                                ? 'bg-blue-500 border-blue-500' 
                                : 'bg-transparent border-gray-300 dark:border-gray-600'
                            }`}
                          >
                            {subtask.completed && (
                              <svg
                                className="absolute inset-0 m-auto w-3 h-3 text-white"
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
                              onChange={(e) => handleEditSubtask(taskIndex, subtaskIndex, e.target.value)}
                              className="flex-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          ) : (
                            <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-gray-500' : ''}`}>
                              {subtask.text}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover/subtask:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => toggleEditSubtask(taskIndex, subtaskIndex)}
                            className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                          >
                            {subtask.isEditing ? <FaSave size={12} /> : <FaEdit size={12} />}
                          </button>
                          <button
                            onClick={() => handleDeleteSubtask(taskIndex, subtaskIndex)}
                            className="p-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
                          >
                            <FaTrashAlt size={12} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Add Subtask Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Add a subtask"
                    className={`flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  />
                  <button
                    onClick={() => handleAddSubtask(taskIndex)}
                    className="px-3 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className={`w-full max-w-md p-6 rounded-xl shadow-xl ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="Enter task title"
              className={`w-full px-4 py-2 mb-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="MMMM d, yyyy h:mm aa"
              className={`w-full px-4 py-2 mb-6 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-gray-50 border-gray-200'
              }`}
              placeholderText="Select date and time"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="fixed bottom-0 w-full border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} MEDEV. All rights reserved.
        </div>
      </footer>
    </div>
  );
}