// Poll Form JavaScript with localStorage

document.addEventListener('DOMContentLoaded', function() {
    console.log('Poll page loaded');
    
    // Load and set poll title
    loadPollTitle();
    
    // Generate date options
    generateDateOptions();
    
    // Set up event listeners
    setupEventListeners();
});

// Load poll title from localStorage
function loadPollTitle() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    let title = settings.poll_title || getDefaultTitle();
    
    // Update page title and heading
    document.getElementById('page-title').textContent = title;
    document.getElementById('poll-title').textContent = title;
    
    console.log('Poll title loaded:', title);
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

// Generate next 14 days as date options
function generateDateOptions() {
    const dateOptionsContainer = document.getElementById('dateOptions');
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateStr = formatDate(date);
        const dateValue = date.toISOString().split('T')[0];
        
        const dateOption = document.createElement('label');
        dateOption.className = 'date-option';
        dateOption.innerHTML = `
            <input type="checkbox" name="dates" value="${dateValue}">
            <span class="date-label">
                <i class="fas fa-calendar-day"></i>
                ${dateStr}
            </span>
        `;
        
        dateOptionsContainer.appendChild(dateOption);
    }
    
    console.log('Generated 14 date options');
}

// Format date as "Mon, Nov 17"
function formatDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const dayNum = date.getDate();
    
    return `${dayName}, ${monthName} ${dayNum}`;
}

// Set up event listeners
function setupEventListeners() {
    // Show/hide date selection based on attendance
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const dateGroup = document.getElementById('dateGroup');
            if (this.value === 'yes') {
                dateGroup.style.display = 'block';
                // Make date selection required
                const dateCheckboxes = document.querySelectorAll('input[name="dates"]');
                dateCheckboxes.forEach(cb => cb.required = true);
            } else {
                dateGroup.style.display = 'none';
                // Remove required from dates
                const dateCheckboxes = document.querySelectorAll('input[name="dates"]');
                dateCheckboxes.forEach(cb => {
                    cb.required = false;
                    cb.checked = false;
                });
            }
        });
    });
    
    // Form submission
    const form = document.getElementById('pollForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission();
    });
}

// Handle form submission
function handleFormSubmission() {
    console.log('Form submitted');
    
    // Get form data
    const name = document.getElementById('name').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const title = document.querySelector('input[name="title"]:checked').value;
    
    // Get selected dates
    const selectedDates = [];
    const dateCheckboxes = document.querySelectorAll('input[name="dates"]:checked');
    dateCheckboxes.forEach(checkbox => {
        selectedDates.push(checkbox.value);
    });
    
    // Validate dates if attending
    if (attendance === 'yes' && selectedDates.length === 0) {
        alert('Please select at least one available date.');
        return;
    }
    
    // Create response object
    const response = {
        id: generateId(),
        name: name,
        will_attend: attendance,
        title: title,
        available_dates: selectedDates,
        payment_status: false,
        submitted_at: new Date().toISOString(),
        poll_id: getCurrentPollId()
    };
    
    // Save to localStorage
    saveResponse(response);
    
    // Show success message
    showSuccessMessage();
}

// Generate unique ID
function generateId() {
    return 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get current poll ID
function getCurrentPollId() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    return settings.current_poll_id || 'poll_1';
}

// Save response to localStorage
function saveResponse(response) {
    // Get existing responses
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    // Add new response
    responses.push(response);
    
    // Save back to localStorage
    localStorage.setItem('poll_responses', JSON.stringify(responses));
    
    console.log('Response saved:', response);
}

// Show success message
function showSuccessMessage() {
    const form = document.querySelector('.poll-form');
    const successMessage = document.getElementById('successMessage');
    
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Reset form after 3 seconds
    setTimeout(() => {
        form.reset();
        form.style.display = 'flex';
        successMessage.style.display = 'none';
        document.getElementById('dateGroup').style.display = 'none';
    }, 3000);
}
