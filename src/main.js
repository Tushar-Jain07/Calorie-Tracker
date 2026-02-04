import './style.css';
import Chart from 'chart.js/auto';

// App version and data migration
const APP_VERSION = '2.0.0';
const VERSION_KEY = 'macrosnap_version';
const SESSION_KEY = 'macrosnap_session';
const USERS_KEY = 'macrosnap_users';

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Data migration function
function migrateData() {
    const currentVersion = localStorage.getItem(VERSION_KEY);
    if (!currentVersion || currentVersion !== APP_VERSION) {
        console.log('Migrating data from', currentVersion || 'unknown', 'to', APP_VERSION);
        // Perform any necessary data migrations here
        localStorage.setItem(VERSION_KEY, APP_VERSION);
    }
}

// Run migration on load
migrateData();

// Per-user data storage
const username = localStorage.getItem(SESSION_KEY);

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
}
function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getUserProfile() {
    const users = getUsers();
    return (users[username] && users[username].data) ? users[username].data : {};
}
function setUserProfile(data) {
    const users = getUsers();
    if (!users[username]) users[username] = { password: '', data: {} };
    users[username].data = data;
    saveUsers(users);
}

let userData = getUserProfile().userData || {};
let foodLog = getUserProfile().foodLog || [];
let weightLog = getUserProfile().weightLog || [];
let calculationResults = getUserProfile().calculationResults || null;

// ---------------------------------------------------------------------------
// Tab switching
// ---------------------------------------------------------------------------
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(tab).classList.add('active');

        if (tab === 'dashboard') updateDashboard();
        if (tab === 'food-log')  renderFoodLog();
        if (tab === 'progress')  updateProgress();
    });
});

// ---------------------------------------------------------------------------
// Unit toggles  (height cm ↔ ft/in  &  weight kg ↔ lbs)
// ---------------------------------------------------------------------------
document.querySelectorAll('.unit-toggle').forEach(toggle => {
    const buttons = toggle.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const unit = this.dataset.unit;

            // --- Height ---
            if (unit === 'cm' || unit === 'ft') {
                document.getElementById('height-cm').style.display = unit === 'cm' ? 'block' : 'none';
                document.getElementById('height-ft').style.display  = unit === 'ft'  ? 'block' : 'none';

                if (unit === 'ft' && document.getElementById('height-cm').value) {
                    const cm = parseFloat(document.getElementById('height-cm').value);
                    if (!isNaN(cm)) {
                        const totalInches = cm / 2.54;
                        document.getElementById('height-ft-val').value = Math.floor(totalInches / 12);
                        document.getElementById('height-in-val').value = Math.round(totalInches % 12);
                    }
                } else if (unit === 'cm') {
                    const ft     = parseInt(document.getElementById('height-ft-val').value)  || 0;
                    const inches = parseInt(document.getElementById('height-in-val').value) || 0;
                    const cm     = ((ft * 12) + inches) * 2.54;
                    document.getElementById('height-cm').value = cm ? cm.toFixed(1) : '';
                }
            }

            // --- Weight ---
            if (unit === 'kg' || unit === 'lbs') {
                const raw = parseFloat(document.getElementById('weight-kg').value);
                if (!isNaN(raw) && raw > 0) {
                    if (unit === 'lbs') {
                        document.getElementById('weight-kg').value       = (raw * 2.20462).toFixed(1);
                        document.getElementById('weight-kg').placeholder = '154';
                    } else {
                        document.getElementById('weight-kg').value       = (raw / 2.20462).toFixed(1);
                        document.getElementById('weight-kg').placeholder = '70';
                    }
                }
                document.getElementById('weight-kg').setAttribute('data-unit', unit);
            }
        });
    });
});

// ---------------------------------------------------------------------------
// Goal select → show/hide deficit / surplus inputs
// ---------------------------------------------------------------------------
document.getElementById('goal').addEventListener('change', function() {
    const deficitGroup = document.getElementById('deficit-group');
    const surplusGroup = document.getElementById('surplus-group');

    deficitGroup.style.display = 'none';
    surplusGroup.style.display = 'none';

    if (this.value === 'loss') {
        deficitGroup.style.display = 'block';
        document.getElementById('deficit').value = '20';
    } else if (this.value === 'gain') {
        surplusGroup.style.display = 'block';
        document.getElementById('surplus').value = '10';
    }
});

// ---------------------------------------------------------------------------
// BMR  (Mifflin-St Jeor)
// ---------------------------------------------------------------------------
function calculateBMR(age, sex, weight_kg, height_cm) {
    const base = (10 * weight_kg) + (6.25 * height_cm) - (5 * age);
    return sex === 'male' ? base + 5 : base - 161;
}

// ---------------------------------------------------------------------------
// Main calculation
// ---------------------------------------------------------------------------
function calculate() {
    const age = parseInt(document.getElementById('age').value);
    const sex = document.getElementById('sex').value;
    let height_cm = parseFloat(document.getElementById('height-cm').value);
    let weight_kg = parseFloat(document.getElementById('weight-kg').value);

    // Honour the active unit button for weight
    const activeWeightBtn = document.querySelector('.unit-toggle button[data-unit="lbs"].active');
    if (activeWeightBtn) {
        weight_kg = weight_kg / 2.20462;
    }

    // Clear previous inline errors
    ['age', 'sex', 'height', 'weight'].forEach(id => {
        const el = document.getElementById('error-' + id);
        if (el) { el.style.display = 'none'; el.textContent = ''; }
    });

    const activity = parseFloat(document.getElementById('activity').value);
    const goal     = document.getElementById('goal').value;

    // Convert height from ft/in if that panel is visible
    if (document.getElementById('height-ft').style.display !== 'none') {
        const ft     = parseInt(document.getElementById('height-ft-val').value)  || 0;
        const inches = parseInt(document.getElementById('height-in-val').value) || 0;
        height_cm = ((ft * 12) + inches) * 2.54;
    }

    // --- Validation ---
    let hasError = false;
    
    // Age validation
    if (!age) {
        document.getElementById('error-age').textContent = 'Age is required.';
        document.getElementById('error-age').style.display = 'block';
        hasError = true;
    } else if (age < 13 || age > 100) {
        document.getElementById('error-age').textContent = 'Age must be 13–100.';
        document.getElementById('error-age').style.display = 'block';
        hasError = true;
    }
    
    // Sex validation
    if (!sex) {
        document.getElementById('error-sex').textContent = 'Sex is required.';
        document.getElementById('error-sex').style.display = 'block';
        hasError = true;
    }
    
    // Height validation
    if (!height_cm) {
        document.getElementById('error-height').textContent = 'Height is required.';
        document.getElementById('error-height').style.display = 'block';
        hasError = true;
    } else if (height_cm < 100 || height_cm > 250) {
        document.getElementById('error-height').textContent = 'Height seems unusual (100-250cm).';
        document.getElementById('error-height').style.display = 'block';
        hasError = true;
    }
    
    // Weight validation
    if (!weight_kg) {
        document.getElementById('error-weight').textContent = 'Weight is required.';
        document.getElementById('error-weight').style.display = 'block';
        hasError = true;
    } else if (weight_kg < 30 || weight_kg > 300) {
        document.getElementById('error-weight').textContent = 'Weight seems unusual (30-300kg).';
        document.getElementById('error-weight').style.display = 'block';
        hasError = true;
    }
    
    if (!activity || !goal) {
        alert('ERROR: Activity level and Goal are required.');
        return;
    }
    if (hasError) return;

    // --- Core maths ---
    const bmr  = calculateBMR(age, sex, weight_kg, height_cm);
    const tdee = bmr * activity;

    let target     = tdee;
    let adjustment = 0;
    let warnings   = [];

    if (goal === 'loss') {
        const deficit = parseFloat(document.getElementById('deficit').value) || 20;
        if (deficit < 10 || deficit > 25) warnings.push('WARNING: Deficit should be 10–25%');
        if (deficit > 20)                 warnings.push('WARNING: Deficit >20% – aggressive approach');
        adjustment = -deficit / 100;
        target     = tdee * (1 + adjustment);
    } else if (goal === 'gain') {
        const surplus = parseFloat(document.getElementById('surplus').value) || 10;
        if (surplus < 5 || surplus > 15) warnings.push('WARNING: Surplus should be 5–15%');
        adjustment = surplus / 100;
        target     = tdee * (1 + adjustment);
    }

    // Safety floor
    const minCalories = sex === 'male' ? 1500 : 1200;
    if (target < minCalories) {
        warnings.push(`DANGER: Target below minimum safe level (${minCalories} kcal)`);
        target = minCalories;
    }

    // --- Macros ---
    const protein_g  = weight_kg * 1.8;
    const fat_g      = Math.max(weight_kg * 0.8, target * 0.25 / 9);
    const protein_cal = protein_g * 4;
    const fat_cal     = fat_g * 9;
    const carbs_g     = (target - protein_cal - fat_cal) / 4;

    // --- Persist ---
    calculationResults = {
        bmr   : Math.round(bmr),
        tdee  : Math.round(tdee),
        target: Math.round(target),
        macros: {
            protein: Math.round(protein_g),
            fat    : Math.round(fat_g),
            carbs  : Math.round(carbs_g)
        },
        warnings
    };

    userData = { age, sex, weight_kg, height_cm, activity, goal };
    setUserProfile({ userData, foodLog, weightLog, calculationResults });

    displayResults();
}

// ---------------------------------------------------------------------------
// Display calculation results
// ---------------------------------------------------------------------------
function displayResults() {
    const results = calculationResults;

    // Metrics
    document.getElementById('bmr').textContent = results.bmr;
    document.getElementById('tdee').textContent = results.tdee;
    document.getElementById('target').textContent = results.target;
    document.getElementById('macro-protein').textContent = results.macros.protein;
    document.getElementById('macro-fat').textContent = results.macros.fat;
    document.getElementById('macro-carbs').textContent = results.macros.carbs;

    // Show the results panel
    document.getElementById('results-panel').style.display = 'block';
}

// ---------------------------------------------------------------------------
// USDA Food search
// ---------------------------------------------------------------------------
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || window.USDA_API_KEY || '';

const foodNameInput   = document.getElementById('food-name');
const foodSuggestions = document.getElementById('food-suggestions');
const servingHint     = document.getElementById('food-serving-hint');

let usdaFoodCache = {};

if (foodNameInput) {
    let lastQuery = '';

    foodNameInput.addEventListener('input', async function() {
        const query = this.value.trim();
        if (query.length < 3) { 
            foodSuggestions.innerHTML = ''; 
            servingHint.style.display = 'none';
            return; 
        }
        if (query === lastQuery) return;
        lastQuery = query;

        if (!USDA_API_KEY) {
            foodSuggestions.innerHTML = '';
            return;
        }

        // Show loading state
        servingHint.textContent = 'Searching...';
        servingHint.style.display = 'block';
        servingHint.style.color = 'var(--accent)';

        const url = `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=8`;
        try {
            const res  = await fetch(url);
            const data = await res.json();
            if (data.foods) {
                foodSuggestions.innerHTML = data.foods
                    .map(f => `<option value="${f.description.replace(/"/g, '&quot;')}"></option>`)
                    .join('');
                data.foods.forEach(f => { usdaFoodCache[f.description] = f; });
                servingHint.style.display = 'none';
            }
        } catch (e) {
            foodSuggestions.innerHTML = '';
            servingHint.textContent = 'Search failed';
            servingHint.style.color = '#ff4d4f';
            setTimeout(() => servingHint.style.display = 'none', 2000);
        }
    });

    foodNameInput.addEventListener('change', function() {
        const desc = this.value.trim();
        if (!usdaFoodCache[desc]) { servingHint.style.display = 'none'; return; }

        const food = usdaFoodCache[desc];

        let servingSize = food.servingSize || 100;
        let servingUnit = food.servingSizeUnit || 'g';

        document.getElementById('food-serving').value = servingSize;
        servingHint.textContent = `Typical serving: ${servingSize} ${servingUnit}`;
        servingHint.style.display = 'inline';

        let cal = 0, protein = 0, fat = 0, carbs = 0;
        food.foodNutrients.forEach(n => {
            if (n.nutrientName === 'Energy' && n.unitName === 'KCAL') cal = n.value;
            if (n.nutrientName === 'Protein') protein = n.value;
            if (n.nutrientName === 'Total lipid (fat)') fat = n.value;
            if (n.nutrientName === 'Carbohydrate, by difference') carbs = n.value;
        });

        const scale = servingSize / 100;
        document.getElementById('food-calories').value = (cal * scale).toFixed(1);
        document.getElementById('food-protein').value = (protein * scale).toFixed(1);
        document.getElementById('food-fat').value = (fat * scale).toFixed(1);
        document.getElementById('food-carbs').value = (carbs * scale).toFixed(1);
    });
}

// ---------------------------------------------------------------------------
// Add food entry
// ---------------------------------------------------------------------------
function addFood() {
    const name     = document.getElementById('food-name').value.trim();
    const serving  = parseFloat(document.getElementById('food-serving').value);
    const calories = parseFloat(document.getElementById('food-calories').value);
    const protein  = parseFloat(document.getElementById('food-protein').value)  || 0;
    const fat      = parseFloat(document.getElementById('food-fat').value)      || 0;
    const carbs    = parseFloat(document.getElementById('food-carbs').value)    || 0;

    if (!name || !serving || !calories) {
        alert('ERROR: Name, serving, and calories are required.');
        return;
    }

    const today = new Date().toISOString().split('T')[0];

    foodLog.push({ id: Date.now(), date: today, name, serving, calories, protein, fat, carbs });
    setUserProfile({ userData, foodLog, weightLog, calculationResults });

    // Reset form
    ['food-name','food-serving','food-calories','food-protein','food-fat','food-carbs']
        .forEach(id => { document.getElementById(id).value = ''; });
    servingHint.textContent = '';
    servingHint.style.display = 'none';

    renderFoodLog();
    updateDashboard();
}

// ---------------------------------------------------------------------------
// Delete food entry
// ---------------------------------------------------------------------------
window.deleteFood = function(id) {
    foodLog = foodLog.filter(f => f.id !== id);
    setUserProfile({ userData, foodLog, weightLog, calculationResults });
    renderFoodLog();
    updateDashboard();
}

// ---------------------------------------------------------------------------
// Render today's food log
// ---------------------------------------------------------------------------
function renderFoodLog() {
    const today        = new Date().toISOString().split('T')[0];
    const todayEntries = foodLog.filter(f => f.date === today);
    const container    = document.getElementById('food-entries');

    if (todayEntries.length === 0) {
        container.innerHTML = '<div class="no-data">NO ENTRIES YET</div>';
        return;
    }

    container.innerHTML = todayEntries.map(entry => `
        <div class="food-log-entry">
            <div class="food-info">
                <div class="food-name">${entry.name}</div>
                <div class="food-macros">
                    ${entry.serving}g &nbsp;|&nbsp; ${entry.calories} kcal &nbsp;|&nbsp;
                    P: ${entry.protein}g &nbsp;|&nbsp; F: ${entry.fat}g &nbsp;|&nbsp; C: ${entry.carbs}g
                </div>
            </div>
            <button class="delete-btn" onclick="deleteFood(${entry.id})">DELETE</button>
        </div>
    `).join('');
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
function updateDashboard() {
    if (!calculationResults) {
        document.getElementById('dash-target').textContent = '--';
        document.getElementById('dash-remaining').textContent = '--';
        return;
    }

    const today        = new Date().toISOString().split('T')[0];
    const todayEntries = foodLog.filter(f => f.date === today);

    const consumed        = todayEntries.reduce((s, e) => s + e.calories, 0);
    const consumedProtein = todayEntries.reduce((s, e) => s + e.protein, 0);
    const consumedFat     = todayEntries.reduce((s, e) => s + e.fat, 0);
    const consumedCarbs   = todayEntries.reduce((s, e) => s + e.carbs, 0);

    const target    = calculationResults.target;
    const remaining = target - consumed;
    const progress  = Math.min((consumed / target) * 100, 100);

    document.getElementById('dash-target').textContent = target;
    document.getElementById('dash-consumed').textContent = consumed;
    document.getElementById('dash-remaining').textContent = remaining;
    document.getElementById('calorie-progress').style.width = progress + '%';
    document.getElementById('progress-text').textContent = Math.round(progress) + '%';

    // Macro bars
    const tP = calculationResults.macros.protein;
    const tF = calculationResults.macros.fat;
    const tC = calculationResults.macros.carbs;

    document.getElementById('protein-consumed').textContent = Math.round(consumedProtein);
    document.getElementById('fat-consumed').textContent = Math.round(consumedFat);
    document.getElementById('carbs-consumed').textContent = Math.round(consumedCarbs);

    document.getElementById('protein-bar').style.height = Math.min((consumedProtein / tP) * 60, 60) + 'px';
    document.getElementById('fat-bar').style.height = Math.min((consumedFat / tF) * 60, 60) + 'px';
    document.getElementById('carbs-bar').style.height = Math.min((consumedCarbs / tC) * 60, 60) + 'px';
}

// ---------------------------------------------------------------------------
// Progress tab
// ---------------------------------------------------------------------------
function updateProgress() {
    if (!calculationResults) return;

    const today   = new Date();
    const last7   = [];

    for (let i = 0; i < 7; i++) {
        const d       = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const cal     = foodLog.filter(f => f.date === dateStr).reduce((s, e) => s + e.calories, 0);
        if (cal > 0) last7.push(cal);
    }

    if (last7.length > 0) {
        const avg        = Math.round(last7.reduce((a, b) => a + b, 0) / last7.length);
        const compliance = Math.round((avg / calculationResults.target) * 100);
        document.getElementById('avg-calories').textContent = avg;
        document.getElementById('compliance').textContent = compliance + '%';
    } else {
        document.getElementById('avg-calories').textContent = '--';
        document.getElementById('compliance').textContent = '--%';
    }

    // Weekly chart
    const chartEl = document.getElementById('weeklyProgressChart');
    if (chartEl) {
        let labels = [], calories = [], protein = [];
        for (let i = 6; i >= 0; i--) {
            const d       = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const dayEnt  = foodLog.filter(f => f.date === dateStr);
            labels.push(dateStr.slice(5));
            calories.push(dayEnt.reduce((s, e) => s + e.calories, 0));
            protein.push(dayEnt.reduce((s, e) => s + e.protein, 0));
        }

        if (window.weeklyChart) window.weeklyChart.destroy();
        window.weeklyChart = new Chart(chartEl, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Calories',
                        data: calories,
                        backgroundColor: 'rgba(0,255,0,0.3)',
                        borderColor: 'rgba(0,255,0,1)',
                        borderWidth: 2,
                        yAxisID: 'y'
                    },
                    {
                        label: 'Protein (g)',
                        data: protein,
                        backgroundColor: 'rgba(0,200,255,0.2)',
                        borderColor: 'rgba(0,200,255,1)',
                        borderWidth: 2,
                        type: 'line',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: { 
                    legend: { 
                        labels: { 
                            color: '#00ff00', 
                            font: { size: 14 } 
                        } 
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    x: { 
                        ticks: { color: '#e0e0e0' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: { 
                        beginAtZero: true, 
                        title: { 
                            display: true, 
                            text: 'Calories', 
                            color: '#00ff00' 
                        }, 
                        ticks: { color: '#00ff00' },
                        grid: { color: 'rgba(0, 255, 0, 0.1)' }
                    },
                    y1: { 
                        beginAtZero: true, 
                        position: 'right', 
                        title: { 
                            display: true, 
                            text: 'Protein (g)', 
                            color: '#00c8ff' 
                        }, 
                        grid: { drawOnChartArea: false }, 
                        ticks: { color: '#00c8ff' }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }
}

// ---------------------------------------------------------------------------
// Weight log
// ---------------------------------------------------------------------------
function logWeight() {
    const weight = parseFloat(document.getElementById('weight-log').value);
    if (!weight) { alert('ERROR: Enter weight'); return; }

    const today = new Date().toISOString().split('T')[0];
    weightLog   = weightLog.filter(w => w.date !== today);
    weightLog.push({ date: today, weight });

    setUserProfile({ userData, foodLog, weightLog, calculationResults });
    document.getElementById('weight-log').value = '';
    renderWeightLog();
    alert('Weight logged: ' + weight + ' kg');
}

function renderWeightLog() {
    const container = document.getElementById('weight-log-table');
    if (!container) return;

    if (weightLog.length === 0) {
        container.innerHTML = '<div class="no-data">No weight logs yet</div>';
        return;
    }

    let html = '<table style="width:100%;color:var(--text);border-collapse:collapse;"><tr><th style="border-bottom:1px solid var(--border);padding:4px;">Date</th><th style="border-bottom:1px solid var(--border);padding:4px;">Weight (kg)</th></tr>';
    weightLog.slice(-14).reverse().forEach(entry => {
        html += `<tr><td style="padding:4px;">${entry.date}</td><td style="padding:4px;">${entry.weight}</td></tr>`;
    });
    html += '</table>';
    container.innerHTML = html;
}

// ---------------------------------------------------------------------------
// Event listeners
// ---------------------------------------------------------------------------
document.getElementById('calculate-btn').addEventListener('click', calculate);
document.getElementById('add-food-btn').addEventListener('click', addFood);
document.getElementById('log-weight-btn').addEventListener('click', logWeight);

// ---------------------------------------------------------------------------
// Profile dropdown
// ---------------------------------------------------------------------------
const profileBtn = document.getElementById('profile-btn');
const dropdown = document.getElementById('profile-dropdown');
const usernameSpan = document.getElementById('profile-username');
const logoutBtn = document.getElementById('logout-btn');
const recordsDiv = document.getElementById('profile-records');
const avatar = document.getElementById('profile-avatar');
const avatarDropdown = document.getElementById('profile-avatar-dropdown');

if (profileBtn && dropdown && usernameSpan && logoutBtn && recordsDiv && avatar && avatarDropdown) {
    const displayName = username || 'User';
    usernameSpan.textContent = displayName;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00e600&color=fff&rounded=true&size=44`;
    avatar.src = avatarUrl;
    avatarDropdown.src = avatarUrl;

    profileBtn.onclick = function() {
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    };

    document.addEventListener('click', function(e) {
        if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });

    logoutBtn.onclick = function() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = '/login.html';
    };

    // Render user data summary
    const data = getUserProfile();
    let html = '';

    html += '<div style="margin-bottom:10px;"><span style="font-weight:600;color:var(--accent);">Profile</span><br>';
    if (data.userData) {
        html += `<span style="color:var(--text-dim);">Age:</span> ${data.userData.age || '-'} &nbsp; <span style="color:var(--text-dim);">Sex:</span> ${data.userData.sex || '-'}<br>`;
        html += `<span style="color:var(--text-dim);">Height:</span> ${data.userData.height_cm || '-'} cm &nbsp; <span style="color:var(--text-dim);">Weight:</span> ${data.userData.weight_kg || '-'} kg`;
    } else {
        html += '<span style="color:var(--text-dim);">No profile data</span>';
    }
    html += '</div>';

    recordsDiv.innerHTML = html;
}

// ---------------------------------------------------------------------------
// Share achievement
// ---------------------------------------------------------------------------
const shareBtn = document.getElementById('share-achievement');
if (shareBtn) {
    shareBtn.onclick = function() {
        const avgCal = document.getElementById('avg-calories').textContent;
        const compliance = document.getElementById('compliance').textContent;
        const msg = `My 7-day average calories: ${avgCal} kcal\nCompliance: ${compliance}\nShared via MacroSnap`;

        if (navigator.share) {
            navigator.share({ title: 'My Nutrition Progress', text: msg, url: window.location.href });
        } else {
            prompt('Copy and share your achievement:', msg);
        }
    };
}

// ---------------------------------------------------------------------------
// Initialize on page load
// ---------------------------------------------------------------------------
(function init() {
    if (calculationResults && userData && userData.age && userData.sex && userData.weight_kg && userData.height_cm && userData.activity && userData.goal) {
        document.getElementById('results-panel').style.display = 'block';
        displayResults();
    } else {
        document.getElementById('results-panel').style.display = 'none';
    }

    renderFoodLog();
    updateDashboard();
    renderWeightLog();
})();

// ---------------------------------------------------------------------------
// Service worker registration (PWA)
// ---------------------------------------------------------------------------
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // Service worker registration failed (expected in dev mode)
        });
    });
}
