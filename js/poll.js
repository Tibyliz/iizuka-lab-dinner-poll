// Poll Form JavaScript

// Load poll title on page load
window.addEventListener('DOMContentLoaded', () => {
    loadPollTitle();
    generateDates();
    setupEventListeners();
});

// Load poll title
function loadPollTitle() {
    const title = localStorage.getItem('poll_title') || getDefaultTitle();
    document.getElementById('pollTitle').textContent = title;
    document.title = title;
}

// Get default title with current month and year
function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Generate next 14 days
function generateDates() {
    const datesGrid = document.getElementById('datesGrid');
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateStr = formatDate(date);
        const dayName = getDayName(date);
        
        const label = document.createElement('label');
        label.className = 'date-checkbox';
        label.innerHTML = `
            <input type="checkbox" name="dates" value="${dateStr}">
            <div class="date-card">
                <div style="font-size: 0.9rem; margin-top: 5px;">${dayName} ${dateStr}</div>
            </div>
        `;
        
        datesGrid.appendChild(label);
    }
}

// Format date as MM-DD
//function formatDate(date) {
//    const year = date.getFullYear();
//    const month = String(date.getMonth() + 1).padStart(2, '0');
//    const day = String(date.getDate()).padStart(2, '0');
//    return `${month}-${day}`;
//}

// Get day name
function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

// Setup event listeners
function setupEventListeners() {
    // Show/hide dates based on attendance
    const willAttendRadios = document.getElementsByName('willAttend');
    willAttendRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            const datesGroup = document.getElementById('datesGroup');
            if (radio.value === 'yes') {
                datesGroup.style.display = 'block';
            } else {
                datesGroup.style.display = 'none';
                // Uncheck all dates
                document.querySelectorAll('input[name="dates"]').forEach(cb => cb.checked = false);
            }
        });
    });
    
    // Form submission
    document.getElementById('pollForm').addEventListener('submit', handleSubmit);
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const willAttend = formData.get('willAttend');
    const title = formData.get('title');
    const dates = formData.getAll('dates');
    
    // Create response object
    const response = {
        id: Date.now().toString(),
        name: name,
        willAttend: willAttend,
        title: title,
        availableDates: dates,
        paymentStatus: false,
        submittedAt: new Date().toISOString()
    };
    
    // Get existing responses
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    // Add new response
    responses.push(response);
    
    // Save to localStorage
    localStorage.setItem('poll_responses', JSON.stringify(responses));
    
    // Show success message
    document.getElementById('pollForm').style.display = 'none';
    document.getElementById('successMessage').style.display = 'block';
    
    // Reset form and hide success message after 3 seconds
    setTimeout(() => {
        e.target.reset();
        document.getElementById('datesGroup').style.display = 'none';
        document.getElementById('pollForm').style.display = 'block';
        document.getElementById('successMessage').style.display = 'none';
    }, 3000);
}

// Toggle password visibility (for login page)
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}
