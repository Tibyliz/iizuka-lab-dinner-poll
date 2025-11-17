// Poll.js - Poll Submission with localStorage (GitHub Pages Compatible)
// Handles poll form submission and data storage

// Load poll title from settings
function loadPollTitle() {
    try {
        const settingsStr = localStorage.getItem('admin_settings');
        if (settingsStr) {
            const settings = JSON.parse(settingsStr);
            const title = settings.poll_title || getDefaultPollTitle();
            
            // Update page title and heading
            document.title = title;
            const heading = document.getElementById('poll-title');
            if (heading) {
                heading.textContent = title;
            }
        } else {
            // Use default title
            const defaultTitle = getDefaultPollTitle();
            document.title = defaultTitle;
            const heading = document.getElementById('poll-title');
            if (heading) {
                heading.textContent = defaultTitle;
            }
        }
    } catch (error) {
        console.error('Error loading poll title:', error);
    }
}

function getDefaultPollTitle() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Generate dates for selection
function generateDateOptions() {
    const datesContainer = document.getElementById('dates-container');
    if (!datesContainer) return;
    
    const dates = [];
    const today = new Date();
    
    // Generate next 14 days
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${month}/${day}`;
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayName = dayNames[date.getDay()];
        
        dates.push({ dateStr, dayName });
    }
    
    datesContainer.innerHTML = dates.map(({ dateStr, dayName }) => `
        <label class="date-option">
            <input type="checkbox" name="dates" value="${dateStr}">
            <span>${dateStr} (${dayName})</span>
        </label>
    `).join('');
}

// Handle attendance selection change
function handleAttendanceChange() {
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const titleGroup = document.getElementById('title-group');
    const datesGroup = document.getElementById('dates-group');
    
    if (attendance) {
        // Title is always visible
        titleGroup.style.display = 'block';
        
        if (attendance.value === 'yes') {
            datesGroup.style.display = 'block';
        } else {
            datesGroup.style.display = 'none';
        }
    }
}

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    
    try {
        // Get form data
        const name = document.getElementById('name').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked');
        const title = document.querySelector('input[name="title"]:checked');
        
        // Validation
        if (!name) {
            alert('Please enter your name');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }
        
        if (!attendance) {
            alert('Please select whether you will attend');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }
        
        if (!title) {
            alert('Please select your title');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
            return;
        }
        
        const willAttend = attendance.value;
        const titleValue = title.value;
        
        // Get selected dates if attending
        let selectedDates = [];
        if (willAttend === 'yes') {
            const dateCheckboxes = document.querySelectorAll('input[name="dates"]:checked');
            selectedDates = Array.from(dateCheckboxes).map(cb => cb.value);
            
            if (selectedDates.length === 0) {
                alert('Please select at least one available date');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                return;
            }
        }
        
        // Get current poll ID from settings
        let currentPollId = 'default_poll';
        const settingsStr = localStorage.getItem('admin_settings');
        if (settingsStr) {
            const settings = JSON.parse(settingsStr);
            currentPollId = settings.current_poll_id || currentPollId;
        }
        
        // Create response object
        const response = {
            id: generateId(),
            poll_id: currentPollId,
            name: name,
            will_attend: willAttend,
            title: titleValue,
            available_dates: selectedDates,
            payment_status: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        
        // Get existing responses
        let responses = [];
        const responsesStr = localStorage.getItem('poll_responses');
        if (responsesStr) {
            responses = JSON.parse(responsesStr);
        }
        
        // Add new response
        responses.push(response);
        
        // Save to localStorage
        localStorage.setItem('poll_responses', JSON.stringify(responses));
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        document.getElementById('title-group').style.display = 'none';
        document.getElementById('dates-group').style.display = 'none';
        
    } catch (error) {
        console.error('Error submitting poll:', error);
        alert('Failed to submit poll. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
}

function generateId() {
    return 'resp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function showSuccessMessage() {
    // Create success overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s;
    `;
    
    const message = document.createElement('div');
    message.style.cssText = `
        background: white;
        padding: 40px;
        border-radius: 12px;
        text-align: center;
        max-width: 400px;
        animation: slideUp 0.3s;
    `;
    
    message.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 20px;">✓</div>
        <h2 style="color: #10b981; margin-bottom: 10px;">Success!</h2>
        <p style="color: #666; margin-bottom: 20px;">Your response has been submitted successfully.</p>
        <button onclick="this.parentElement.parentElement.remove()" style="
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 500;
        ">OK</button>
    `;
    
    overlay.appendChild(message);
    document.body.appendChild(overlay);
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (overlay.parentElement) {
            overlay.remove();
        }
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('📝 Poll Page Loaded');
    
    // Load and display poll title
    loadPollTitle();
    
    // Generate date options
    generateDateOptions();
    
    // Attach event listeners
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', handleAttendanceChange);
    });
    
    const form = document.getElementById('poll-form');
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    console.log('✅ Poll form ready');
});
