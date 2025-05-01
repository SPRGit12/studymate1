import React, { useState, useRef, useEffect } from 'react';
import './RoadMapEditor.css';

// Node types with colors
const NODE_TYPES = {
  SKILL: { label: 'Skill', color: 'blue' },
  COURSE: { label: 'Course', color: 'green' },
  PROJECT: { label: 'Project', color: 'purple' },
  RESOURCE: { label: 'Resource', color: 'orange' }
};

// Basic template roadmaps
const TEMPLATES = [
  {
    id: 'web-dev',
    name: 'Web Development',
    nodes: [
      { id: '1', type: 'SKILL', label: 'HTML & CSS', x: 100, y: 100, dependencies: [] },
      { id: '2', type: 'SKILL', label: 'JavaScript', x: 100, y: 200, dependencies: ['1'] },
      { id: '3', type: 'SKILL', label: 'React', x: 100, y: 300, dependencies: ['2'] },
      { id: '4', type: 'PROJECT', label: 'Portfolio Site', x: 300, y: 300, dependencies: ['3'] }
    ]
  },
  {
    id: 'data-science',
    name: 'Data Science',
    nodes: [
      { id: '1', type: 'SKILL', label: 'Python', x: 100, y: 100, dependencies: [] },
      { id: '2', type: 'SKILL', label: 'Data Analysis', x: 100, y: 200, dependencies: ['1'] },
      { id: '3', type: 'PROJECT', label: 'Analysis Project', x: 300, y: 200, dependencies: ['2'] }
    ]
  }
];

const RoadMapEditor = () => {
  // Core state
  const [nodes, setNodes] = useState([]);
  const [roadmapTitle, setRoadmapTitle] = useState('My Roadmap');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  
  // UI state
  const [activeNodeId, setActiveNodeId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState('');
  
  // Form state
  const [newNode, setNewNode] = useState({ 
    label: '', 
    type: 'SKILL', 
    dependencies: [] 
  });
  
  // Refs
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  // Load saved roadmaps from localStorage
  useEffect(() => {
    const savedRoadmap = localStorage.getItem('currentRoadmap');
    if (savedRoadmap) {
      const { title, nodeData } = JSON.parse(savedRoadmap);
      setRoadmapTitle(title);
      setNodes(nodeData);
    }
  }, []);

  // Save current roadmap to localStorage
  const saveRoadmap = () => {
    if (nodes.length === 0) {
      alert('Add some nodes to your roadmap first!');
      return;
    }
    
    localStorage.setItem('currentRoadmap', JSON.stringify({
      title: roadmapTitle,
      nodeData: nodes,
      savedAt: new Date().toISOString()
    }));
    
    alert('Roadmap saved successfully!');
  };

  // Toggle dropdowns
  const toggleDropdown = (dropdown) => {
    setDropdownOpen(dropdownOpen === dropdown ? '' : dropdown);
  };

  // Load a template
  const loadTemplate = (templateId) => {
    const template = TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setNodes(JSON.parse(JSON.stringify(template.nodes)));
      setRoadmapTitle(template.name);
    }
    setDropdownOpen('');
  };

  // Clear the roadmap
  const clearRoadmap = () => {
    if (nodes.length > 0 && window.confirm('Are you sure you want to clear all nodes?')) {
      setNodes([]);
    }
    setDropdownOpen('');
  };

  // Node dragging handlers
  const handleNodeMouseDown = (e, nodeId) => {
    e.preventDefault();
    setActiveNodeId(nodeId);
    setIsDragging(true);
    
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasMouseMove = (e) => {
    if (!isDragging) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    setNodes(nodes.map(node => 
      node.id === activeNodeId ? { ...node, x, y } : node
    ));
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setActiveNodeId(null);
  };

  // Form handlers
  const handleAddNode = () => {
    if (!newNode.label.trim()) {
      alert('Please enter a node label');
      return;
    }
    
    const newNodeObject = {
      id: Date.now().toString(),
      ...newNode,
      x: 100,
      y: 100 + nodes.length * 70
    };
    
    setNodes([...nodes, newNodeObject]);
    setNewNode({ label: '', type: 'SKILL', dependencies: [] });
    setShowNodeForm(false);
  };

  const handleDeleteNode = (nodeId) => {
    // Remove node and any dependencies pointing to it
    setNodes(
      nodes.filter(node => node.id !== nodeId)
           .map(node => ({
             ...node,
             dependencies: node.dependencies.filter(dep => dep !== nodeId)
           }))
    );
  };

  // Render connection lines between nodes
  const renderConnections = () => {
    return nodes.map(node => 
      node.dependencies.map(depId => {
        const dependency = nodes.find(n => n.id === depId);
        if (!dependency) return null;
        
        // Calculate connection positions
        const startX = dependency.x + 75;
        const startY = dependency.y + 25;
        const endX = node.x;
        const endY = node.y + 25;
        
        return (
          <g key={`${depId}-${node.id}`}>
            <line
              x1={startX}
              y1={startY}
              x2={endX}
              y2={endY}
              stroke="#555"
              strokeWidth="2"
              strokeDasharray="4,4"
              className="connection"
            />
            <polygon
              points={`${endX},${endY} ${endX-8},${endY-4} ${endX-8},${endY+4}`}
              fill="#555"
            />
          </g>
        );
      })
    ).flat().filter(Boolean);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleOutsideClick = () => {
      if (dropdownOpen) setDropdownOpen('');
    };
    
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [dropdownOpen]);

  return (
    <div className="roadmap-editor">
      {/* Header */}
      <header className="editor-header">
        <div className="roadmap-title">
          {isEditingTitle ? (
            <div className="title-edit">
              <input
                type="text"
                value={roadmapTitle}
                onChange={(e) => setRoadmapTitle(e.target.value)}
                autoFocus
              />
              <button onClick={() => setIsEditingTitle(false)}>✓</button>
            </div>
          ) : (
            <div className="title-display">
              <h1>{roadmapTitle}</h1>
              <button onClick={() => setIsEditingTitle(true)}>✎</button>
            </div>
          )}
        </div>
        
        <div className="editor-controls">
          <div className="dropdown">
            <button 
              className="btn template-btn" 
              onClick={(e) => {
                e.stopPropagation();
                toggleDropdown('templates');
              }}
            >
              Templates ▼
            </button>
            {dropdownOpen === 'templates' && (
              <div className="dropdown-menu">
                {TEMPLATES.map(template => (
                  <button
                    key={template.id}
                    onClick={() => loadTemplate(template.id)}
                  >
                    {template.name}
                  </button>
                ))}
                <button onClick={clearRoadmap} className="danger">
                  Clear Roadmap
                </button>
              </div>
            )}
          </div>
          
          <button onClick={saveRoadmap} className="btn save-btn">
            Save
          </button>
        </div>
      </header>
      
      {/* Main content */}
      <div className="editor-body">
        {/* Sidebar */}
        <aside className="editor-sidebar">
          <div className="sidebar-header">
            <h2>Nodes</h2>
            <button 
              onClick={() => setShowNodeForm(true)} 
              className="add-btn"
            >
              +
            </button>
          </div>
          
          {showNodeForm ? (
            <div className="node-form">
              <h3>Add New Node</h3>
              <div className="form-group">
                <label>Label:</label>
                <input
                  type="text"
                  value={newNode.label}
                  onChange={(e) => setNewNode({...newNode, label: e.target.value})}
                  placeholder="Node Label"
                />
              </div>
              
              <div className="form-group">
                <label>Type:</label>
                <select
                  value={newNode.type}
                  onChange={(e) => setNewNode({...newNode, type: e.target.value})}
                >
                  {Object.entries(NODE_TYPES).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
              
              {nodes.length > 0 && (
                <div className="form-group">
                  <label>Dependencies:</label>
                  <div className="dependencies-list">
                    {nodes.map(node => (
                      <div key={node.id} className="dependency-item">
                        <input
                          type="checkbox"
                          id={`dep-${node.id}`}
                          checked={newNode.dependencies.includes(node.id)}
                          onChange={(e) => {
                            setNewNode({
                              ...newNode,
                              dependencies: e.target.checked
                                ? [...newNode.dependencies, node.id]
                                : newNode.dependencies.filter(id => id !== node.id)
                            });
                          }}
                        />
                        <label htmlFor={`dep-${node.id}`}>{node.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="form-actions">
                <button 
                  onClick={() => setShowNodeForm(false)}
                  className="btn cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddNode}
                  className="btn confirm-btn"
                  disabled={!newNode.label.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          ) : (
            <div className="node-list">
              {nodes.map(node => (
                <div 
                  key={node.id} 
                  className={`node-item node-${NODE_TYPES[node.type].color}`}
                >
                  <div className="node-item-content">
                    <span className="node-label">{node.label}</span>
                    <span className="node-type">{NODE_TYPES[node.type].label}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteNode(node.id)}
                    className="delete-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
              
              {nodes.length === 0 && (
                <div className="empty-list">
                  <p>No nodes added yet</p>
                  <p>Click the + button to add a node</p>
                </div>
              )}
            </div>
          )}
        </aside>
        
        {/* Canvas */}
        <div 
          className="editor-canvas"
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          ref={canvasRef}
        >
          <svg 
            className="connections-svg"
            ref={svgRef}
          >
            {renderConnections()}
          </svg>
          
          {nodes.map(node => (
            <div
              key={node.id}
              className={`roadmap-node node-${NODE_TYPES[node.type].color} ${
                activeNodeId === node.id ? 'active' : ''
              }`}
              style={{ 
                left: `${node.x}px`, 
                top: `${node.y}px`
              }}
              onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            >
              <div className="node-content">
                <div className="node-title">{node.label}</div>
                <div className="node-subtext">{NODE_TYPES[node.type].label}</div>
              </div>
            </div>
          ))}
          
          {nodes.length === 0 && (
            <div className="empty-canvas">
              <p>Your roadmap is empty</p>
              <p>Add nodes or select a template to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoadMapEditor;