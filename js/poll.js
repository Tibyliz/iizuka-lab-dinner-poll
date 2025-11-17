// Poll Form JavaScript
console.log('Poll.js loaded');

// Load and display poll title
function loadPollTitle() {
    try {
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        const title = settings.pollTitle || getDefaultTitle();
        
        const titleElement = document.getElementById('pollTitle');
        const pageTitleElement = document.getElementById('pageTitle');
        
        if (titleElement) {
            titleElement.textContent = title;
        }
        if (pageTitleElement) {
            pageTitleElement.textContent = title;
        }
        
        console.log('Poll title loaded:', title);
    } catch (error) {
        console.error('Error loading poll title:', error);
    }
}

function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    return `Iizuka Lab ${months[now.getMonth()]} ${now.getFullYear()} Group Dinner Poll`;
}

// Generate date options (next 14 days)
function generateDates() {
    const container = document.getElementById('datesContainer');
    if (!container) return;

    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        
        const dateStr = date.toISOString().split('T')[0];
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateDisplay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        dates.push({ value: dateStr, display: `${dayName}, ${dateDisplay}` });
    }

    container.innerHTML = dates.map(date => `
        <label class="date-option">
            <input type="checkbox" name="availableDates" value="${date.value}">
            <span>${date.display}</span>
        </label>
    `).join('');

    console.log('Dates generated');
}

// Show/hide dates based on attendance
const attendanceRadios = document.querySelectorAll('input[name="willAttend"]');
const datesGroup = document.getElementById('datesGroup');

attendanceRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        if (datesGroup) {
            if (this.value === 'yes') {
                datesGroup.style.display = 'block';
                // Make dates required
                const dateCheckboxes = document.querySelectorAll('input[name="availableDates"]');
                dateCheckboxes.forEach(cb => cb.required = true);
            } else {
                datesGroup.style.display = 'none';
                // Remove required from dates
                const dateCheckboxes = document.querySelectorAll('input[name="availableDates"]');
                dateCheckboxes.forEach(cb => {
                    cb.required = false;
                    cb.checked = false;
                });
            }
        }
    });
});

// Handle form submission
const pollForm = document.getElementById('pollForm');
if (pollForm) {
    pollForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');

        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');
        
        // Hide previous messages
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';

        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const willAttend = formData.get('willAttend');
        const title = formData.get('title');
        const availableDates = formData.getAll('availableDates');

        // Validate
        if (!name || !willAttend || !title) {
            if (errorMessage) {
                errorMessage.textContent = 'Please fill in all required fields.';
                errorMessage.style.display = 'block';
            }
            return;
        }

        if (willAttend === 'yes' && availableDates.length === 0) {
            if (errorMessage) {
                errorMessage.textContent = 'Please select at least one available date.';
                errorMessage.style.display = 'block';
            }
            return;
        }

        // Create response object
        const response = {
            id: Date.now(),
            name: name.trim(),
            willAttend: willAttend,
            title: title,
            availableDates: willAttend === 'yes' ? availableDates : [],
            paymentStatus: false,
            submittedAt: new Date().toISOString()
        };

        // Save to localStorage
        try {
            const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
            responses.push(response);
            localStorage.setItem('poll_responses', JSON.stringify(responses));
            
            console.log('Response saved:', response);

            // Show success message
            if (successMessage) {
                successMessage.style.display = 'block';
            }

            // Reset form
            this.reset();
            if (datesGroup) {
                datesGroup.style.display = 'none';
            }

            // Scroll to success message
            if (successMessage) {
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }

        } catch (error) {
            console.error('Error saving response:', error);
            if (errorMessage) {
                errorMessage.textContent = 'An error occurred. Please try again.';
                errorMessage.style.display = 'block';
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    loadPollTitle();
    generateDates();
});
