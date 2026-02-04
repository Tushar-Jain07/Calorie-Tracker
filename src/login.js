import './style.css';

const USERS_KEY = 'macrosnap_users';
const SESSION_KEY = 'macrosnap_session';

// Password hashing function
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function setSession(username) {
    localStorage.setItem(SESSION_KEY, username);
}

// Create default demo user if none exists
(async function ensureDemoUser() {
    let users = getUsers();
    if (!users['demo']) {
        const hashedPassword = await hashPassword('demo');
        users['demo'] = { password: hashedPassword, data: {} };
        saveUsers(users);
    }
})();

// Check for registration success message
(function checkRegistrationRedirect() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('registered') === '1') {
        const errorDiv = document.getElementById('login-error');
        errorDiv.textContent = 'Account created successfully! Please log in.';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#00e600';
        history.replaceState(null, '', window.location.pathname);
    }
})();

const form = document.getElementById('login-form');
const errorDiv = document.getElementById('login-error');

form.onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const users = getUsers();
    
    if (!username || !password) {
        errorDiv.textContent = 'Username and password are required';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ff4d4f';
        return;
    }
    
    const hashedPassword = await hashPassword(password);
    
    if (!users[username] || users[username].password !== hashedPassword) {
        errorDiv.textContent = 'Invalid username or password';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ff4d4f';
        return;
    }
    
    setSession(username);
    window.location.href = '/';
};
