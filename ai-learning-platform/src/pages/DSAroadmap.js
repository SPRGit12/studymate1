// DSARoadmap.js
import React, { useState, useEffect } from 'react';
import { 
  FaCheck, FaChevronDown, FaChevronUp, FaExternalLinkAlt, 
  FaLock, FaSearch, FaFilter, FaCode, FaListAlt, 
  FaArrowsAltH, FaWindowMaximize, FaLayerGroup, FaLink, FaTree 
} from 'react-icons/fa';
import './DSAroadmap.css';

// Import Firebase
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';

function DsaRoadmap() {
  // Define category icons map outside of state
  const categoryIcons = {
    1: <FaLayerGroup />,
    2: <FaArrowsAltH />,
    3: <FaWindowMaximize />,
    4: <FaLayerGroup />,
    5: <FaSearch />,
    6: <FaLink />,
    7: <FaTree />
  };

  // Initial data structure for the roadmap
  const initialCategories = [
    {
      id: 1,
      name: "Arrays & Hashing",
      iconId: 1,
      expanded: true,
      completed: 0,
      total: 9,
      problems: [
        { id: 101, name: "Contains Duplicate", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/contains-duplicate/" },
        { id: 102, name: "Valid Anagram", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/valid-anagram/" },
        { id: 103, name: "Two Sum", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/two-sum/" },
        { id: 104, name: "Group Anagrams", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/group-anagrams/" },
        { id: 105, name: "Top K Frequent Elements", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/top-k-frequent-elements/" },
        { id: 106, name: "Product of Array Except Self", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/product-of-array-except-self/" },
        { id: 107, name: "Valid Sudoku", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/valid-sudoku/" },
        { id: 108, name: "Encode and Decode Strings", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/encode-and-decode-strings/" },
        { id: 109, name: "Longest Consecutive Sequence", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/longest-consecutive-sequence/" }
      ]
    },
    {
      id: 2,
      name: "Two Pointers",
      iconId: 2,
      expanded: false,
      completed: 0,
      total: 5,
      problems: [
        { id: 201, name: "Valid Palindrome", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/valid-palindrome/" },
        { id: 202, name: "Two Sum II", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
        { id: 203, name: "3Sum", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/3sum/" },
        { id: 204, name: "Container With Most Water", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/container-with-most-water/" },
        { id: 205, name: "Trapping Rain Water", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/trapping-rain-water/" }
      ]
    },
    {
      id: 3,
      name: "Sliding Window",
      iconId: 3,
      expanded: false,
      completed: 0,
      total: 6,
      problems: [
        { id: 301, name: "Best Time to Buy & Sell Stock", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
        { id: 302, name: "Longest Substring Without Repeating Characters", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
        { id: 303, name: "Longest Repeating Character Replacement", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
        { id: 304, name: "Permutation in String", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/permutation-in-string/" },
        { id: 305, name: "Minimum Window Substring", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/minimum-window-substring/" },
        { id: 306, name: "Sliding Window Maximum", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/sliding-window-maximum/" }
      ]
    },
    {
      id: 4,
      name: "Stack",
      iconId: 4,
      expanded: false,
      completed: 0,
      total: 7,
      problems: [
        { id: 401, name: "Valid Parentheses", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/valid-parentheses/" },
        { id: 402, name: "Min Stack", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/min-stack/" },
        { id: 403, name: "Evaluate Reverse Polish Notation", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
        { id: 404, name: "Generate Parentheses", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/generate-parentheses/" },
        { id: 405, name: "Daily Temperatures", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/daily-temperatures/" },
        { id: 406, name: "Car Fleet", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/car-fleet/" },
        { id: 407, name: "Largest Rectangle in Histogram", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" }
      ]
    },
    {
      id: 5,
      name: "Binary Search",
      iconId: 5,
      expanded: false,
      completed: 0,
      total: 7,
      problems: [
        { id: 501, name: "Binary Search", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/binary-search/" },
        { id: 502, name: "Search a 2D Matrix", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/search-a-2d-matrix/" },
        { id: 503, name: "Koko Eating Bananas", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/koko-eating-bananas/" },
        { id: 504, name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
        { id: 505, name: "Search in Rotated Sorted Array", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
        { id: 506, name: "Time Based Key-Value Store", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/time-based-key-value-store/" },
        { id: 507, name: "Median of Two Sorted Arrays", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" }
      ]
    },
    {
      id: 6,
      name: "Linked List",
      iconId: 6,
      expanded: false,
      completed: 0,
      total: 11,
      problems: [
        { id: 601, name: "Reverse Linked List", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/reverse-linked-list/" },
        { id: 602, name: "Merge Two Sorted Lists", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
        { id: 603, name: "Reorder List", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/reorder-list/" },
        { id: 604, name: "Remove Nth Node From End of List", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
        { id: 605, name: "Copy List with Random Pointer", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
        { id: 606, name: "Add Two Numbers", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/add-two-numbers/" },
        { id: 607, name: "Linked List Cycle", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/linked-list-cycle/" },
        { id: 608, name: "Find the Duplicate Number", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/find-the-duplicate-number/" },
        { id: 609, name: "LRU Cache", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/lru-cache/" },
        { id: 610, name: "Merge k Sorted Lists", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
        { id: 611, name: "Reverse Nodes in k-Group", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" }
      ]
    },
    {
      id: 7,
      name: "Trees",
      iconId: 7,
      expanded: false,
      completed: 0,
      total: 15,
      problems: [
        { id: 701, name: "Invert Binary Tree", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/invert-binary-tree/" },
        { id: 702, name: "Maximum Depth of Binary Tree", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
        { id: 703, name: "Diameter of Binary Tree", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/diameter-of-binary-tree/" },
        { id: 704, name: "Balanced Binary Tree", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/balanced-binary-tree/" },
        { id: 705, name: "Same Tree", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/same-tree/" },
        { id: 706, name: "Subtree of Another Tree", difficulty: "Easy", completed: false, locked: false, url: "https://leetcode.com/problems/subtree-of-another-tree/" },
        { id: 707, name: "Lowest Common Ancestor of a BST", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
        { id: 708, name: "Binary Tree Level Order Traversal", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
        { id: 709, name: "Binary Tree Right Side View", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
        { id: 710, name: "Count Good Nodes in Binary Tree", difficulty: "Medium", completed: false, locked: true, url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
        { id: 711, name: "Validate Binary Search Tree", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/validate-binary-search-tree/" },
        { id: 712, name: "Kth Smallest Element in a BST", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
        { id: 713, name: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", completed: false, locked: false, url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
        { id: 714, name: "Binary Tree Maximum Path Sum", difficulty: "Hard", completed: false, locked: false, url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
        { id: 715, name: "Serialize and Deserialize Binary Tree", difficulty: "Hard", completed: false, locked: true, url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" }
      ]
    }
  ];

  // State for categories
  const [categories, setCategories] = useState(initialCategories);
  // State to track loading state
  const [loading, setLoading] = useState(true);
  // State to track if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      
      if (user) {
        // Load user data from Firestore
        loadUserProgress(user.uid);
      } else {
        // If user is not logged in, try to get data from localStorage
        try {
          const savedData = localStorage.getItem('DsaRoadmap');
          if (savedData) {
            setCategories(JSON.parse(savedData));
          }
          setLoading(false);
        } catch (error) {
          console.error("Error loading data from localStorage:", error);
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Load user progress from Firestore
  const loadUserProgress = async (userId) => {
    try {
      setLoading(true);
      const userProgressRef = doc(db, 'dsaProgress', userId);
      const docSnap = await getDoc(userProgressRef);

      if (docSnap.exists()) {
        // Data exists in Firestore
        const userData = docSnap.data();
        setCategories(userData.categories);
      } else {
        // No data in Firestore yet, create a new document with initial data
        await setDoc(userProgressRef, { categories: initialCategories });
        setCategories(initialCategories);
      }
    } catch (error) {
      console.error("Error loading data from Firestore:", error);
      // Fallback to localStorage if Firestore fails
      try {
        const savedData = localStorage.getItem('DsaRoadmap');
        if (savedData) {
          setCategories(JSON.parse(savedData));
        }
      } catch (localStorageError) {
        console.error("Error loading from localStorage:", localStorageError);
      }
    } finally {
      setLoading(false);
    }
  };

  // Save user progress to Firestore
  const saveUserProgress = async (updatedCategories) => {
    if (isAuthenticated) {
      try {
        const userId = auth.currentUser.uid;
        const userProgressRef = doc(db, 'dsaProgress', userId);
        await updateDoc(userProgressRef, {
          categories: updatedCategories,
          lastUpdated: new Date()
        });
        console.log("Progress saved to Firestore");
      } catch (error) {
        console.error("Error saving to Firestore:", error);
      }
    }
    
    // Always save to localStorage as a backup
    try {
      localStorage.setItem('DsaRoadmap', JSON.stringify(updatedCategories));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  // Toggle expand/collapse for a category
  const toggleCategory = (categoryId) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        return { ...category, expanded: !category.expanded };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    saveUserProgress(updatedCategories);
  };

  // Toggle completion status of a problem
  const toggleProblemCompletion = (categoryId, problemId) => {
    const updatedCategories = categories.map(category => {
      if (category.id === categoryId) {
        const updatedProblems = category.problems.map(problem => {
          if (problem.id === problemId && !problem.locked) {
            return { ...problem, completed: !problem.completed };
          }
          return problem;
        });
        
        const completedCount = updatedProblems.filter(p => p.completed).length;
        
        return { 
          ...category, 
          problems: updatedProblems,
          completed: completedCount
        };
      }
      return category;
    });
    
    setCategories(updatedCategories);
    saveUserProgress(updatedCategories);
  };

  // Calculate total completion percentage
  const calculateTotalCompletion = () => {
    const totalProblems = categories.reduce((acc, category) => acc + category.total, 0);
    const completedProblems = categories.reduce((acc, category) => acc + category.completed, 0);
    return totalProblems > 0 ? Math.round((completedProblems / totalProblems) * 100) : 0;
  };

  // Get difficulty color class
  const getDifficultyClass = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'difficulty-easy';
      case 'Medium': return 'difficulty-medium';
      case 'Hard': return 'difficulty-hard';
      default: return '';
    }
  };

  // Open problem in a new tab
  const openProblem = (url) => {
    window.open(url, '_blank');
  };

  // Filter problems based on search query and filters
  const getFilteredProblems = (problems) => {
    return problems.filter(problem => {
      // Apply search filter
      const matchesSearch = searchQuery === '' || 
        problem.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply difficulty filter
      const matchesDifficulty = difficultyFilter === 'All' || 
        problem.difficulty === difficultyFilter;
      
      // Apply status filter
      const matchesStatus = 
        statusFilter === 'All' || 
        (statusFilter === 'Completed' && problem.completed) || 
        (statusFilter === 'Incomplete' && !problem.completed) ||
        (statusFilter === 'Locked' && problem.locked) ||
        (statusFilter === 'Unlocked' && !problem.locked);
      
      return matchesSearch && matchesDifficulty && matchesStatus;
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setDifficultyFilter('All');
    setStatusFilter('All');
  };

  // Check if any category has filtered problems
  const hasFilteredProblems = categories.some(category => 
    getFilteredProblems(category.problems).length > 0
  );

  if (loading) {
    return (
      <div className="DSA-roadmap">
        <div style={{ textAlign: 'center', padding: '50px 0' }}>
          <p>Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="DSA-roadmap">
      <header className="roadmap-header">
        <h1>Data Structures & Algorithms Roadmap</h1>
        <p className="roadmap-description">
          Track your progress through these essential DSA problems to master coding interviews.
          Mark problems as completed to track your progress.
          {!isAuthenticated && (
            <span style={{ display: 'block', marginTop: '10px', color: '#e53e3e' }}>
              <strong>Note:</strong> Sign in to save your progress to the cloud.
            </span>
          )}
        </p>
        <div className="progress-container">
          <div className="progress-stats">
            <span>Total Progress</span>
            <span>{calculateTotalCompletion()}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${calculateTotalCompletion()}%` }}
            ></div>
          </div>
        </div>
      </header>
      
      <div className="filters-container">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search problems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <select 
            className={`filter-button ${difficultyFilter !== 'All' ? 'active' : ''}`}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="All">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          
          <select 
            className={`filter-button ${statusFilter !== 'All' ? 'active' : ''}`}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Locked">Locked</option>
            <option value="Unlocked">Unlocked</option>
          </select>
          
          {(searchQuery || difficultyFilter !== 'All' || statusFilter !== 'All') && (
            <button 
              className="filter-button" 
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
      
      {!hasFilteredProblems && (
        <div style={{ textAlign: 'center', padding: '30px 0', color: '#6c757d' }}>
          No problems match your filters. Try adjusting your search criteria.
        </div>
      )}
      
      <div className="categories-container">
        {categories.map((category) => {
          const filteredProblems = getFilteredProblems(category.problems);
          
          // Skip rendering this category if it has no matching problems
          if (filteredProblems.length === 0) {
            return null;
          }
          
          return (
            <div key={category.id} className="category-card">
              <div 
                className="category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="category-info">
                  <div className="category-icon-wrapper">
                    {categoryIcons[category.iconId]}
                  </div>
                  <span className="category-name">{category.name}</span>
                  <span className="category-count">
                    {category.completed}/{category.total}
                  </span>
                </div>
                <div className="category-progress">
                  <div className="category-progress-bar">
                    <div 
                      className="category-progress-fill"
                      style={{ width: `${(category.completed / category.total) * 100}%` }}
                    ></div>
                  </div>
                  {category.expanded ? 
                    <FaChevronUp className="category-toggle-icon" /> : 
                    <FaChevronDown className="category-toggle-icon" />
                  }
                </div>
              </div>
              
              {category.expanded && (
                <div className="problems-table-container">
                  <table className="problems-table">
                    <thead>
                      <tr>
                        <th className="col-num">#</th>
                        <th className="col-problem">Problem</th>
                        <th className="col-difficulty">Difficulty</th>
                        <th className="col-status">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProblems.map((problem, idx) => (
                        <tr key={problem.id} className="problem-row">
                          <td className="problem-num">{idx + 1}</td>
                          <td className="problem-name">
                            <span onClick={() => !problem.locked && openProblem(problem.url)}>
                              {problem.name}
                            </span>
                            {problem.locked && <FaLock className="problem-icon lock-icon" title="Premium problem" />}
                            <FaExternalLinkAlt 
                              className="problem-icon link-icon" 
                              title="Open in LeetCode"
                              onClick={(e) => {
                                e.stopPropagation();
                                !problem.locked && openProblem(problem.url);
                              }}
                            />
                          </td>
                          <td className={`problem-difficulty ${getDifficultyClass(problem.difficulty)}`}>
                            {problem.difficulty}
                          </td>
                          <td className="problem-status">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleProblemCompletion(category.id, problem.id);
                              }}
                              className={`status-button ${problem.locked ? 'status-locked' : problem.completed ? 'status-completed' : ''}`}
                              disabled={problem.locked}
                              title={problem.locked ? "Premium problem" : problem.completed ? "Mark as incomplete" : "Mark as completed"}
                            >
                              {problem.completed && <FaCheck className="check-icon" />}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DsaRoadmap;