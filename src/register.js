import './style.css';

const USERS_KEY = 'macrosnap_users';

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

const regForm = document.getElementById('register-form');
const errorDiv = document.getElementById('register-error');

regForm.onsubmit = async function(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    
    if (!username || !password) {
        errorDiv.textContent = 'Please enter a username and password.';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ff4d4f';
        return;
    }
    
    if (password.length < 4) {
        errorDiv.textContent = 'Password must be at least 4 characters.';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ff4d4f';
        return;
    }
    
    const users = getUsers();
    if (users[username]) {
        errorDiv.textContent = 'Username already exists.';
        errorDiv.style.display = 'block';
        errorDiv.style.color = '#ff4d4f';
        return;
    }
    
    const hashedPassword = await hashPassword(password);
    users[username] = { password: hashedPassword, data: {} };
    saveUsers(users);
    window.location.href = '/login.html?registered=1';
};
