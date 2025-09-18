// API base URL - will be different in production
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
  ? 'http://localhost:3000/api' 
  : '/api';

// State management
const S = {
  user: null,
  resources: { video: [], ebook: [], image: [] },
  challenges: [],
  rewards: [],
  leaderboard: [],
  unionDocs: []
};

// DOM utilities
const $ = sel => document.querySelector(sel);
const $$ = sel => document.querySelectorAll(sel);

// API functions
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// User authentication
async function loginUser(userData) {
  try {
    const user = await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    S.user = user;
    localStorage.setItem('ecoquest_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

async function registerUser(userData) {
  try {
    const user = await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
    
    S.user = user;
    localStorage.setItem('ecoquest_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

// Data fetching
async function loadUserData() {
  if (!S.user) return;
  
  try {
    const [resources, challenges, rewards, leaderboard, unionDocs] = await Promise.all([
      apiCall('/resources'),
      apiCall('/challenges'),
      apiCall('/rewards'),
      apiCall('/leaderboard'),
      apiCall('/union-docs')
    ]);
    
    S.resources = resources;
    S.challenges = challenges;
    S.rewards = rewards;
    S.leaderboard = leaderboard;
    S.unionDocs = unionDocs;
    
    return true;
  } catch (error) {
    console.error('Failed to load user data:', error);
    return false;
  }
}

// Your existing JavaScript code with modifications to use the API
// ... (rest of your JavaScript code with API integration)

// Initialize the application
async function initApp() {
  // Check if user is logged in
  const savedUser = localStorage.getItem('ecoquest_user');
  if (savedUser) {
    S.user = JSON.parse(savedUser);
    await loadUserData();
    applyUser();
  } else {
    go('welcome');
  }
}

// Start the app
initApp();