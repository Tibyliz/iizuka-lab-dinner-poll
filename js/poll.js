// Poll form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Poll page loaded');
    
    // Load poll title
    loadPollTitle();
    
    // Generate date options
    generateDates();
    
    // Setup event listeners
    setupEventListeners();
});

// Load poll title from settings
function loadPollTitle() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const title = settings.pollTitle || getDefaultTitle();
    
    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = title;
    }
    
    // Update h1 title
    const pollTitle = document.getElementById('poll-title');
    if (pollTitle) {
        pollTitle.textContent = title;
    }
}

// Get default title
function getDefaultTitle() {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Generate next 14 days as date options
function generateDates() {
    const container = document.getElementById('dates-container');
    if (!container) return;
    
    const today = new Date();
    const dates = [];
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateStr = date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            weekday: 'short'
        });
        
        const value = date.toISOString().split('T')[0];
        
        dates.push({ dateStr, value });
    }
    
    container.innerHTML = dates.map(({ dateStr, value }) => `
        <label class="date-option">
            <input type="checkbox" name="dates" value="${value}">
            <span>${dateStr}</span>
        </label>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // Show/hide dates section based on attendance
    const attendanceInputs = document.querySelectorAll('input[name="willAttend"]');
    attendanceInputs.forEach(input => {
        input.addEventListener('change', handleAttendanceChange);
    });
    
    // Form submission
    const form = document.getElementById('poll-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    // Toggle password visibility (if on login page)
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
}

// Handle attendance change
function handleAttendanceChange(e) {
    const datesSection = document.getElementById('dates-section');
    if (!datesSection) return;
    
    if (e.target.value === 'yes') {
        datesSection.style.display = 'block';
        // Make at least one date required
        const dateInputs = document.querySelectorAll('input[name="dates"]');
        dateInputs.forEach(input => input.required = true);
    } else {
        datesSection.style.display = 'none';
        // Remove date requirement
        const dateInputs = document.querySelectorAll('input[name="dates"]');
        dateInputs.forEach(input => {
            input.required = false;
            input.checked = false;
        });
    }
}

// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const willAttend = formData.get('willAttend');
    const title = formData.get('title');
    const dates = formData.getAll('dates');
    
    // Validate
    if (!name || !willAttend || !title) {
        alert('Please fill in all required fields');
        return;
    }
    
    if (willAttend === 'yes' && dates.length === 0) {
        alert('Please select at least one available date');
        return;
    }
    
    // Create response object
    const response = {
        id: Date.now().toString(),
        name: name.trim(),
        willAttend: willAttend,
        title: title,
        availableDates: dates,
        paymentStatus: false,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    responses.push(response);
    localStorage.setItem('poll_responses', JSON.stringify(responses));
    
    // Show success message
    const form = document.getElementById('poll-form');
    const successMessage = document.getElementById('success-message');
    
    if (form) form.style.display = 'none';
    if (successMessage) successMessage.style.display = 'block';
    
    // Reset form after 3 seconds
    setTimeout(() => {
        if (form) {
            form.reset();
            form.style.display = 'block';
        }
        if (successMessage) successMessage.style.display = 'none';
        
        // Hide dates section
        const datesSection = document.getElementById('dates-section');
        if (datesSection) datesSection.style.display = 'none';
    }, 3000);
}
