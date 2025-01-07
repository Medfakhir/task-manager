"use client";
import React, { useState, useRef, useEffect } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { Undo2, Redo2, Trash2, Type, Pencil, Download,Home } from 'lucide-react';
import Link from 'next/link';

export default function NotesPage() {
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [brushColor, setBrushColor] = useState("#000000");
  const [brushRadius, setBrushRadius] = useState(3);
  const canvasRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [texts, setTexts] = useState([]);
  const [editingText, setEditingText] = useState(null);
  const canvasContainerRef = useRef(null);
  const editInputRef = useRef(null);

  // Load saved data
  useEffect(() => {
    const savedDrawingData = localStorage.getItem('drawingData');
    const savedTexts = localStorage.getItem('canvasTexts');

    if (savedDrawingData && canvasRef.current) {
      try {
        setTimeout(() => {
          canvasRef.current.loadSaveData(savedDrawingData);
          const historyData = JSON.parse(localStorage.getItem('drawingHistory') || '[]');
          setDrawingHistory(historyData);
          setHistoryIndex(historyData.length - 1);
          setIsLoaded(true);
        }, 100);
      } catch (error) {
        console.error("Error loading drawing data:", error);
      }
    } else {
      setIsLoaded(true);
    }

    if (savedTexts) {
      setTexts(JSON.parse(savedTexts));
    }
  }, []);

  // Auto-focus input when starting to edit
  useEffect(() => {
    if (editingText && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingText]);

  const saveDrawing = () => {
    if (canvasRef.current && isLoaded && isDrawingMode) {
      try {
        const data = canvasRef.current.getSaveData();
        localStorage.setItem('drawingData', data);

        const newHistory = [...drawingHistory.slice(0, historyIndex + 1), data].slice(-50);
        setDrawingHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        localStorage.setItem('drawingHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error("Error saving drawing data:", error);
      }
    }
  };

  const handleCanvasClick = (e) => {
    if (!isDrawingMode) {
      e.preventDefault();
      const rect = canvasContainerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // If we're already editing, save that text first
      if (editingText) {
        finishEditing();
      }

      // Create a new text entry in edit mode
      const newText = {
        content: "",
        x,
        y,
        color: brushColor,
        id: Date.now(),
        isEditing: true
      };
      
      setTexts([...texts, newText]);
      setEditingText(newText);
    }
  };

  const handleTextChange = (e, textId) => {
    const updatedTexts = texts.map(text => 
      text.id === textId ? { ...text, content: e.target.value } : text
    );
    setTexts(updatedTexts);
  };

  const finishEditing = () => {
    if (editingText) {
      const updatedTexts = texts.map(text => 
        text.id === editingText.id ? { ...text, isEditing: false } : text
      ).filter(text => text.content.trim() !== ""); // Remove empty texts
      
      setTexts(updatedTexts);
      setEditingText(null);
      localStorage.setItem('canvasTexts', JSON.stringify(updatedTexts));
    }
  };

  const handleKeyDown = (e, textId) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      finishEditing();
    }
  };

  const startEditing = (text, e) => {
    e.stopPropagation();
    if (!isDrawingMode) {
      setEditingText(text);
      const updatedTexts = texts.map(t => 
        t.id === text.id ? { ...t, isEditing: true } : t
      );
      setTexts(updatedTexts);
    }
  };

  const removeText = (idToRemove, e) => {
    e.stopPropagation();
    const updatedTexts = texts.filter(text => text.id !== idToRemove);
    setTexts(updatedTexts);
    localStorage.setItem('canvasTexts', JSON.stringify(updatedTexts));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const previousState = drawingHistory[newIndex];
      canvasRef.current.loadSaveData(previousState);
      localStorage.setItem('drawingData', previousState);
    }
  };

  const handleRedo = () => {
    if (historyIndex < drawingHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const nextState = drawingHistory[newIndex];
      canvasRef.current.loadSaveData(nextState);
      localStorage.setItem('drawingData', nextState);
    }
  };

  const handleClear = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
      localStorage.removeItem('drawingData');
      localStorage.removeItem('drawingHistory');
      localStorage.removeItem('canvasTexts');
      setDrawingHistory([]);
      setHistoryIndex(-1);
      setTexts([]);
      setEditingText(null);
    }
  };

  const handleExport = () => {
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.getDataURL();
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
          {/* Toolbar */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setIsDrawingMode(true);
                  finishEditing();
                }}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  isDrawingMode ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Pencil className="w-5 h-5" />
                Draw
              </button>
              <button
                onClick={() => setIsDrawingMode(false)}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  !isDrawingMode ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <Type className="w-5 h-5" />
                Text
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-8 h-8 rounded cursor-pointer"
              />
              {isDrawingMode && (
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushRadius}
                  onChange={(e) => setBrushRadius(parseInt(e.target.value))}
                  className="w-32"
                />
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleUndo}
                disabled={historyIndex <= 0}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Undo2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex >= drawingHistory.length - 1}
                className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Redo2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={handleExport}
                className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
              <button
                onClick={handleClear}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <button
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-medium shadow-lg shadow-blue-500/20 transition-all duration-200 flex items-center gap-2"
            >
              <Link href="/" passHref>
                <span className="flex items-center gap-2">
                  <Home className="text-sm" /> Home
                </span>
              </Link>
            </button>
            </div>
          </div>

          {/* Canvas Area */}
          <div 
            ref={canvasContainerRef}
            className="relative border rounded-lg shadow-inner bg-white"
            onClick={handleCanvasClick}
          >
            <CanvasDraw
              ref={canvasRef}
              brushColor={brushColor}
              brushRadius={isDrawingMode ? brushRadius : 0}
              lazyRadius={0}
              canvasWidth={window.innerWidth - 100}
              canvasHeight={window.innerHeight - 250}
              onChange={isDrawingMode ? saveDrawing : undefined}
              immediateLoading={true}
              hideGrid={true}
              className={!isDrawingMode ? 'pointer-events-none' : ''}
            />
            
            {/* Text Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {texts.map((text) => (
                <div
                  key={text.id}
                  style={{
                    position: 'absolute',
                    left: text.x,
                    top: text.y,
                    color: text.color,
                  }}
                  className="group"
                >
                  {text.isEditing ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={text.content}
                      onChange={(e) => handleTextChange(e, text.id)}
                      onKeyDown={(e) => handleKeyDown(e, text.id)}
                      onBlur={() => finishEditing()}
                      className="bg-transparent border-b border-gray-300 outline-none pointer-events-auto px-1"
                      autoFocus
                    />
                  ) : (
                    <div 
                      onClick={(e) => startEditing(text, e)}
                      className="pointer-events-auto cursor-text"
                    >
                      <span className="text-lg">{text.content}</span>
                      {!isDrawingMode && (
                        <button
                          onClick={(e) => removeText(text.id, e)}
                          className="ml-2 text-red-500 opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}