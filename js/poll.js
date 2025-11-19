// Poll Form Logic
console.log('[Poll] Script loaded');

let pollConfig = null;

// DOM Elements
const loadingMessage = document.getElementById('loading-message');
const errorMessage = document.getElementById('error-message');
const pollForm = document.getElementById('poll-form');
const pollTitle = document.getElementById('poll-title');
const datesContainer = document.getElementById('dates-container');
const datesLoading = document.getElementById('dates-loading');

// Initialize poll form
async function initializePoll() {
    try {
        console.log('[Poll] Initializing...');
        
        // Initialize config if needed
        await firebaseAPI.initializeConfig();
        
        // Load configuration
        pollConfig = await firebaseAPI.getConfig();
        console.log('[Poll] Config loaded:', pollConfig);
        
        // Update poll title
        pollTitle.textContent = pollConfig.pollTitle || 'Iizuka Lab Dinner Poll';
        
        // Generate and display dates
        generateDates();
        
        // Show form
        loadingMessage.style.display = 'none';
        pollForm.style.display = 'block';
        
        console.log('[Poll] Initialization complete');
        
    } catch (error) {
        console.error('[Poll] Initialization error:', error);
        showError('Failed to initialize poll. Please check Firebase configuration.');
    }
}

// Generate date options from config
function generateDates() {
    try {
        const { startDate, endDate, availableDates } = pollConfig;
        
        // If availableDates is provided, use it
        if (availableDates && availableDates.trim()) {
            const dates = availableDates.split(',').map(d => d.trim()).filter(d => d);
            displayDates(dates);
            return;
        }
        
        // Otherwise, generate from start/end dates
        if (startDate && endDate) {
            const dates = generateDateRange(startDate, endDate);
            displayDates(dates);
        } else {
            datesLoading.textContent = 'No dates configured. Please contact admin.';
        }
    } catch (error) {
        console.error('[Poll] Error generating dates:', error);
        datesLoading.textContent = 'Error loading dates. Please try again later.';
    }
}

// Generate date range
function generateDateRange(start, end) {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(formatDate(new Date(d)));
    }
    
    return dates;
}

// Format date as YYYY-MM-DD
function formatDate(date) {
    return date.toISOString().split('T')[0];
}

// Display dates as checkboxes
function displayDates(dates) {
    datesLoading.style.display = 'none';
    datesContainer.style.display = 'grid';
    datesContainer.innerHTML = '';
    
    if (dates.length === 0) {
        datesContainer.innerHTML = '<p>No dates available</p>';
        return;
    }
    
    dates.forEach((date, index) => {
        const dateOption = document.createElement('div');
        dateOption.className = 'date-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `date-${index}`;
        checkbox.value = date;
        checkbox.name = 'dates';
        
        const label = document.createElement('label');
        label.htmlFor = `date-${index}`;
        label.textContent = formatDateDisplay(date);
        
        dateOption.appendChild(checkbox);
        dateOption.appendChild(label);
        datesContainer.appendChild(dateOption);
    });
    
    console.log('[Poll] Displayed', dates.length, 'dates');
}

// Format date for display (e.g., "Dec 15")
function formatDateDisplay(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Handle form submission
pollForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('[Poll] Form submitted');
    
    try {
        // Get form data
        const name = document.getElementById('name').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const position = document.getElementById('position').value;
        
        // Get selected dates
        const selectedDates = Array.from(document.querySelectorAll('input[name="dates"]:checked'))
            .map(cb => cb.value)
            .join(', ');
        
        // Validate
        if (!name || !attendance || !position) {
            showError('Please fill all required fields');
            return;
        }
        
        // Create response object
        const responseData = {
            name,
            attendance,
            position,
            selectedDates
        };
        
        console.log('[Poll] Submitting response:', responseData);
        
        // Submit to Firebase
        await firebaseAPI.addResponse(responseData);
        
        // Show success message
        showSuccess('Thank you! Your response has been submitted successfully.');
        
        // Reset form
        pollForm.reset();
        
        // Uncheck all date checkboxes
        document.querySelectorAll('input[name="dates"]:checked').forEach(cb => {
            cb.checked = false;
        });
        
    } catch (error) {
        console.error('[Poll] Submission error:', error);
        showError('Failed to submit response. Please try again.');
    }
});

// Show error message
function showError(message) {
    errorMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    pollForm.insertBefore(successDiv, pollForm.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePoll);
} else {
    initializePoll();
}
