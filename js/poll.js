// Generate default title with current month and year
function getDefaultTitle() {
    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Load poll title
async function loadPollTitle() {
    try {
        const response = await fetch('tables/admin_settings?limit=1');
        const data = await response.json();
        
        let title = getDefaultTitle();
        
        if (data.data && data.data.length > 0 && data.data[0].poll_title) {
            title = data.data[0].poll_title;
        }
        
        // Update both the page title and heading
        document.getElementById('page-title').textContent = title;
        document.getElementById('poll-title').textContent = title;
    } catch (error) {
        console.error('Error loading poll title:', error);
        // Use default title on error
        const defaultTitle = getDefaultTitle();
        document.getElementById('page-title').textContent = defaultTitle;
        document.getElementById('poll-title').textContent = defaultTitle;
    }
}

// Generate dates for the next 14 days
function generateDates() {
    const container = document.getElementById('datesContainer');
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = dayNames[date.getDay()];
        const monthName = monthNames[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();
        
        const dateStr = `${year}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        const label = document.createElement('label');
        label.className = 'date-option';
        label.innerHTML = `
            <input type="checkbox" name="dates" value="${dateStr}">
            <span class="date-custom">
                <div class="date-day">${dayName}</div>
                <div class="date-date">${monthName} ${day}</div>
            </span>
        `;
        
        container.appendChild(label);
    }
}

// Show/hide dates based on attendance selection
function setupAttendanceToggle() {
    const attendanceRadios = document.querySelectorAll('input[name="attendance"]');
    const datesGroup = document.getElementById('datesGroup');
    const dateCheckboxes = document.querySelectorAll('input[name="dates"]');
    
    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'yes') {
                datesGroup.style.display = 'block';
            } else {
                datesGroup.style.display = 'none';
                // Uncheck all dates if not attending
                dateCheckboxes.forEach(cb => cb.checked = false);
            }
        });
    });
}

// Get current poll ID
async function getCurrentPollId() {
    try {
        const response = await fetch('tables/admin_settings?limit=1');
        const data = await response.json();
        
        if (data.data && data.data.length > 0 && data.data[0].current_poll_id) {
            return data.data[0].current_poll_id;
        }
        
        // If no poll ID exists, create one
        const newPollId = 'poll_' + Date.now();
        return newPollId;
    } catch (error) {
        console.error('Error getting poll ID:', error);
        return 'poll_' + Date.now();
    }
}

// Form submission
document.getElementById('pollForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked').value;
    const title = document.querySelector('input[name="title"]:checked').value;
    
    let availableDates = [];
    if (attendance === 'yes') {
        const selectedDates = document.querySelectorAll('input[name="dates"]:checked');
        if (selectedDates.length === 0) {
            alert('Please select at least one available date.');
            return;
        }
        availableDates = Array.from(selectedDates).map(cb => cb.value);
    }
    
    try {
        const pollId = await getCurrentPollId();
        
        const response = await fetch('tables/poll_responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                will_attend: attendance,
                title: title,
                available_dates: availableDates,
                poll_id: pollId,
                payment_status: false
            })
        });
        
        if (response.ok) {
            document.querySelector('.poll-form').style.display = 'none';
            document.getElementById('successMessage').style.display = 'block';
        } else {
            alert('Error submitting response. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error submitting response. Please try again.');
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPollTitle();
    generateDates();
    setupAttendanceToggle();
});
