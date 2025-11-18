/**
 * Poll Form Logic - Firebase Version
 * Handles respondent form submission and date loading
 */

let availableDates = [];

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('[Poll] Initializing...');
    
    try {
        // Test Firebase connection
        await api.testConnection();
        
        // Initialize default config
        await api.initializeDefaultConfig();
        
        // Load poll title
        await loadPollTitle();
        
        // Load available dates
        await loadAvailableDates();
        
        // Setup form submission
        setupFormSubmission();
        
        console.log('[Poll] ✅ Initialization complete');
    } catch (error) {
        console.error('[Poll] ❌ Initialization error:', error);
        showStatus('Failed to initialize poll. Please check Firebase configuration.', 'error');
    }
});

// ============================================
// LOAD POLL TITLE
// ============================================

async function loadPollTitle() {
    try {
        const title = await api.getConfig('pollTitle');
        document.getElementById('pollTitle').textContent = title || 'Iizuka Lab Dinner Poll';
        console.log('[Poll] Poll title loaded:', title);
    } catch (error) {
        console.error('[Poll] Error loading title:', error);
        document.getElementById('pollTitle').textContent = 'Iizuka Lab Dinner Poll';
    }
}

// ============================================
// LOAD AVAILABLE DATES
// ============================================

async function loadAvailableDates() {
    const container = document.getElementById('datesContainer');
    
    try {
        const datesString = await api.getConfig('availableDates');
        
        if (!datesString) {
            container.innerHTML = '<p class="hint" style="text-align: center;">No dates have been set yet. Please check back later or contact the administrator.</p>';
            return;
        }
        
        availableDates = datesString.split(',').map(d => d.trim()).filter(d => d);
        
        if (availableDates.length === 0) {
            container.innerHTML = '<p class="hint" style="text-align: center;">No dates available yet.</p>';
            return;
        }
        
        // Generate date checkboxes
        container.innerHTML = availableDates.map((date, index) => `
            <label class="date-option">
                <input type="checkbox" name="dates" value="${date}" id="date_${index}">
                <span class="date-checkbox">
                    <i class="fas fa-calendar-day"></i> ${formatDate(date)}
                </span>
            </label>
        `).join('');
        
        console.log(`[Poll] Loaded ${availableDates.length} available dates`);
    } catch (error) {
        console.error('[Poll] Error loading dates:', error);
        container.innerHTML = '<p class="error" style="text-align: center; color: #e74c3c;">Failed to load dates. Please refresh the page.</p>';
    }
}

// ============================================
// FORMAT DATE
// ============================================

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return dateString;
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

function setupFormSubmission() {
    const form = document.getElementById('pollForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        console.log('[Poll] Form submitted');
        
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        try {
            // Collect form data
            const formData = new FormData(form);
            
            // Get selected dates
            const selectedDates = Array.from(document.querySelectorAll('input[name="dates"]:checked'))
                .map(cb => cb.value);
            
            // Prepare response data
            const responseData = {
                name: formData.get('name'),
                attendance: formData.get('attendance'),
                position: formData.get('position'),
                selectedDates: selectedDates.join(', '),
                paymentStatus: false,
                customAmount: null,
                isEdited: false
            };
            
            // Validate
            if (!responseData.name || !responseData.attendance || !responseData.position) {
                throw new Error('Please fill in all required fields');
            }
            
            console.log('[Poll] Submitting response:', responseData);
            
            // Submit to Firebase
            const result = await api.addResponse(responseData);
            
            if (result.success) {
                console.log('[Poll] ✅ Response submitted successfully');
                showStatus('Thank you! Your response has been submitted successfully. 🎉', 'success');
                
                // Reset form after 2 seconds
                setTimeout(() => {
                    form.reset();
                    // Uncheck all date checkboxes
                    document.querySelectorAll('input[name="dates"]:checked').forEach(cb => {
                        cb.checked = false;
                    });
                }, 2000);
            } else {
                throw new Error('Failed to submit response');
            }
            
        } catch (error) {
            console.error('[Poll] ❌ Submission error:', error);
            showStatus('Error: ' + error.message + ' Please try again.', 'error');
        } finally {
            // Re-enable button after 2 seconds
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Response';
            }, 2000);
        }
    });
}

// ============================================
// SHOW STATUS MESSAGE
// ============================================

function showStatus(message, type = 'info') {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';
    
    // Auto-hide after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            statusEl.style.display = 'none';
        }, 5000);
    }
}

// ============================================
// REAL-TIME TITLE UPDATES (BONUS)
// ============================================

// Listen for title changes in real-time
api.onConfigChange((config) => {
    if (config.pollTitle) {
        const currentTitle = document.getElementById('pollTitle').textContent;
        if (currentTitle !== config.pollTitle) {
            document.getElementById('pollTitle').textContent = config.pollTitle;
            console.log('[Poll] Title updated in real-time:', config.pollTitle);
        }
    }
});

console.log('[Poll] Script loaded');
