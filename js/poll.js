// Poll Form JavaScript - Date Selection Optional
// Iizuka Lab Dinner Poll System

document.addEventListener('DOMContentLoaded', function() {
    console.log('Poll page loaded');
    
    // Load and display poll title
    loadPollTitle();
    
    // Generate date options (next 14 days)
    generateDateOptions();
    
    // Handle form submission
    const form = document.getElementById('pollForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Handle attendance change
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', handleAttendanceChange);
    });
});

/**
 * Load and display the poll title
 */
function loadPollTitle() {
    try {
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        const title = settings.poll_title || getDefaultTitle();
        
        // Update page title and heading
        const titleElement = document.querySelector('h1');
        if (titleElement) {
            titleElement.textContent = title;
        }
        
        // Update document title (browser tab)
        document.title = title;
        
        console.log('Poll title loaded:', title);
    } catch (error) {
        console.error('Error loading poll title:', error);
    }
}

/**
 * Get default poll title with current month and year
 */
function getDefaultTitle() {
    const now = new Date();
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

/**
 * Generate date options for the next 14 days
 */
function generateDateOptions() {
    const dateContainer = document.getElementById('dateOptions');
    if (!dateContainer) {
        console.error('Date container not found');
        return;
    }
    
    // Clear existing options
    dateContainer.innerHTML = '';
    
    const today = new Date();
    const dateOptions = [];
    
    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateStr = formatDate(date);
        const dayOfWeek = getDayOfWeek(date);
        
        dateOptions.push({
            value: dateStr,
            display: `${dateStr} (${dayOfWeek})`
        });
    }
    
    // Create checkboxes - NO REQUIRED ATTRIBUTE!
    dateOptions.forEach(option => {
        const wrapper = document.createElement('div');
        wrapper.className = 'date-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = 'dates';
        checkbox.value = option.value;
        checkbox.id = `date-${option.value}`;
        // IMPORTANT: No required attribute - dates are optional!
        // checkbox.required = false; // Explicitly set to false (or just omit)
        
        const label = document.createElement('label');
        label.htmlFor = `date-${option.value}`;
        label.textContent = option.display;
        
        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);
        dateContainer.appendChild(wrapper);
    });
    
    console.log('Generated', dateOptions.length, 'date options (all optional)');
}

/**
 * Format date as YYYY-MM-DD
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Get day of week name
 */
function getDayOfWeek(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

/**
 * Handle attendance radio button change
 */
function handleAttendanceChange(event) {
    const willAttend = event.target.value === 'yes';
    const dateSection = document.getElementById('dateSection');
    
    if (dateSection) {
        if (willAttend) {
            dateSection.style.display = 'block';
        } else {
            dateSection.style.display = 'none';
            // Clear all date selections when selecting "No"
            const dateCheckboxes = document.querySelectorAll('input[name="dates"]');
            dateCheckboxes.forEach(cb => cb.checked = false);
        }
    }
}

/**
 * Handle form submission
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    console.log('Form submitted');
    
    // Get form values
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const attendance = formData.get('attendance');
    const title = formData.get('title');
    
    // Get selected dates (optional - may be empty array)
    const selectedDates = [];
    const dateCheckboxes = document.querySelectorAll('input[name="dates"]:checked');
    dateCheckboxes.forEach(cb => selectedDates.push(cb.value));
    
    // Validation - only name, attendance, and title are required
    if (!name || !name.trim()) {
        alert('Please enter your name.');
        return;
    }
    
    if (!attendance) {
        alert('Please select whether you will attend.');
        return;
    }
    
    if (!title) {
        alert('Please select your title.');
        return;
    }
    
    // If attending, dates are still optional (no validation needed)
    // Users can indicate they will attend without selecting specific dates
    
    // Create response object
    const response = {
        id: generateId(),
        name: name.trim(),
        will_attend: attendance === 'yes',
        title: title,
        available_dates: selectedDates,
        payment_status: false, // Default to not paid
        submitted_at: new Date().toISOString()
    };
    
    // Save response
    try {
        const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
        responses.push(response);
        localStorage.setItem('poll_responses', JSON.stringify(responses));
        
        console.log('Response saved:', response);
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        event.target.reset();
        
        // Hide date section
        const dateSection = document.getElementById('dateSection');
        if (dateSection) {
            dateSection.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error saving response:', error);
        alert('Error saving your response. Please try again.');
    }
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Show success message
 */
function showSuccessMessage() {
    // Remove any existing success message
    const existingMsg = document.querySelector('.success-message');
    if (existingMsg) {
        existingMsg.remove();
    }
    
    // Create success message
    const message = document.createElement('div');
    message.className = 'success-message';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <strong>Success!</strong> Your response has been submitted.
    `;
    
    // Add styles
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    // Add to page
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}
