// ============================================================================
// IIZUKA LAB DINNER POLL - ADMIN DASHBOARD
// Fixed Version - Chart Infinite Rendering Bug Fixed
// ============================================================================

console.log('Admin.js loaded successfully');

// Global chart instance - CRITICAL: Store chart globally to prevent duplicates
let dateChart = null;

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page DOM loaded');
    
    // Check authentication
    checkAuth();
    
    // Initialize data
    initializeData();
    
    // Load and display data - ONLY ONCE
    loadAndDisplayData();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log('Admin initialization complete');
});

// ============================================================================
// AUTHENTICATION
// ============================================================================

function checkAuth() {
    const sessionStr = localStorage.getItem('admin_session');
    
    if (!sessionStr) {
        console.log('No session found, redirecting to login');
        window.location.href = 'admin-login.html';
        return;
    }
    
    try {
        const session = JSON.parse(sessionStr);
        const now = Date.now();
        
        // Check if session is expired (24 hours)
        if (now - session.timestamp > session.expiresIn) {
            console.log('Session expired');
            localStorage.removeItem('admin_session');
            window.location.href = 'admin-login.html';
            return;
        }
        
        console.log('Session valid');
    } catch (e) {
        console.error('Session error:', e);
        window.location.href = 'admin-login.html';
    }
}

function logout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'admin-login.html';
}

// ============================================================================
// DATA INITIALIZATION
// ============================================================================

function initializeData() {
    // Initialize poll responses if not exists
    if (!localStorage.getItem('poll_responses')) {
        localStorage.setItem('poll_responses', JSON.stringify([]));
    }
    
    // Initialize admin settings if not exists
    if (!localStorage.getItem('admin_settings')) {
        const defaultSettings = {
            password: 'iizukalab',
            poll_title: getDefaultTitle(),
            total_cost: 0,
            master_percentage: 20,
            doctoral_percentage: 30,
            staff_percentage: 50,
            current_poll_id: generatePollId()
        };
        localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
    }
    
    // Initialize archived polls if not exists
    if (!localStorage.getItem('archived_polls')) {
        localStorage.setItem('archived_polls', JSON.stringify([]));
    }
}

function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

function generatePollId() {
    return 'poll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ============================================================================
// LOAD AND DISPLAY DATA - CALLED ONLY ONCE
// ============================================================================

function loadAndDisplayData() {
    console.log('Loading data...');
    
    try {
        // Get responses
        const responsesStr = localStorage.getItem('poll_responses');
        const responses = responsesStr ? JSON.parse(responsesStr) : [];
        
        console.log('Loaded responses:', responses.length);
        
        // Update statistics
        updateStatistics(responses);
        
        // Render chart - ONLY ONCE with safeguard
        renderDateChart(responses);
        
        // Display responses table
        displayResponses(responses);
        
    } catch (e) {
        console.error('Error loading data:', e);
        showNotification('Error loading data: ' + e.message, 'error');
    }
}

// ============================================================================
// STATISTICS
// ============================================================================

function updateStatistics(responses) {
    const totalResponses = responses.length;
    const attending = responses.filter(r => r.will_attend === 'yes').length;
    const notAttending = totalResponses - attending;
    
    // Count paid
    const paid = responses.filter(r => r.payment_status === true).length;
    
    // Update DOM
    document.getElementById('total-responses').textContent = totalResponses;
    document.getElementById('attending-count').textContent = attending;
    document.getElementById('not-attending-count').textContent = notAttending;
    
    // Update payment display
    const paidDisplay = document.getElementById('paid-count');
    if (paidDisplay) {
        paidDisplay.textContent = `${paid} / ${totalResponses}`;
    }
}

// ============================================================================
// CHART RENDERING - FIXED TO PREVENT INFINITE LOOP
// ============================================================================

function renderDateChart(responses) {
    console.log('Rendering chart (called once)...');
    
    // CRITICAL FIX: Destroy existing chart before creating new one
    if (dateChart) {
        console.log('Destroying existing chart');
        dateChart.destroy();
        dateChart = null;
    }
    
    const canvas = document.getElementById('dateChart');
    if (!canvas) {
        console.error('Chart canvas not found');
        return;
    }
    
    // Get context
    const ctx = canvas.getContext('2d');
    
    // Filter attending responses
    const attendingResponses = responses.filter(r => r.will_attend === 'yes');
    
    // Count dates
    const dateCounts = {};
    attendingResponses.forEach(response => {
        if (response.available_dates && Array.isArray(response.available_dates)) {
            response.available_dates.forEach(date => {
                dateCounts[date] = (dateCounts[date] || 0) + 1;
            });
        }
    });
    
    // Sort by count
    const sortedDates = Object.entries(dateCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 dates
    
    const labels = sortedDates.map(([date]) => date);
    const data = sortedDates.map(([, count]) => count);
    
    console.log('Chart data prepared:', labels.length, 'dates');
    
    // Create chart - ONLY ONCE
    try {
        dateChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Number of People Available',
                    data: data,
                    backgroundColor: 'rgba(147, 51, 234, 0.6)',
                    borderColor: 'rgba(147, 51, 234, 1)',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // IMPORTANT: Allow fixed height
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        enabled: true
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
        console.log('Chart created successfully');
    } catch (e) {
        console.error('Error creating chart:', e);
    }
}

// ============================================================================
// DISPLAY RESPONSES TABLE
// ============================================================================

function displayResponses(responses) {
    const tbody = document.querySelector('#responses-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    if (responses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 40px; color: #999;">No responses yet</td></tr>';
        return;
    }
    
    // Get settings for price calculation
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    responses.forEach((response, index) => {
        const row = document.createElement('tr');
        
        // Calculate price
        let price = 0;
        if (response.will_attend === 'yes' && settings.total_cost > 0) {
            price = calculateIndividualPrice(response.title, responses, settings);
        }
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${escapeHtml(response.name)}</td>
            <td><span class="badge badge-${response.will_attend === 'yes' ? 'success' : 'danger'}">${response.will_attend === 'yes' ? 'Yes' : 'No'}</span></td>
            <td>${escapeHtml(response.title)}</td>
            <td>${response.available_dates && response.available_dates.length > 0 ? response.available_dates.join(', ') : 'N/A'}</td>
            <td>¥${price.toFixed(2)}</td>
            <td>
                <label class="payment-checkbox">
                    <input type="checkbox" ${response.payment_status ? 'checked' : ''} onchange="togglePaymentStatus(${index})">
                    <span class="payment-status ${response.payment_status ? 'paid' : 'unpaid'}">
                        ${response.payment_status ? '✓ Paid' : '✗ Unpaid'}
                    </span>
                </label>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function calculateIndividualPrice(title, responses, settings) {
    // Count by title
    const attendingByTitle = {
        'Master Student': 0,
        'Doctoral Student': 0,
        'Teachers and Staff': 0
    };
    
    responses.forEach(r => {
        if (r.will_attend === 'yes') {
            attendingByTitle[r.title] = (attendingByTitle[r.title] || 0) + 1;
        }
    });
    
    const totalCost = settings.total_cost || 0;
    const masterPercentage = settings.master_percentage || 20;
    const doctoralPercentage = settings.doctoral_percentage || 30;
    const staffPercentage = settings.staff_percentage || 50;
    
    // Calculate price per person for each category
    const prices = {
        'Master Student': attendingByTitle['Master Student'] > 0 
            ? (totalCost * masterPercentage / 100) / attendingByTitle['Master Student'] 
            : 0,
        'Doctoral Student': attendingByTitle['Doctoral Student'] > 0 
            ? (totalCost * doctoralPercentage / 100) / attendingByTitle['Doctoral Student'] 
            : 0,
        'Teachers and Staff': attendingByTitle['Teachers and Staff'] > 0 
            ? (totalCost * staffPercentage / 100) / attendingByTitle['Teachers and Staff'] 
            : 0
    };
    
    return prices[title] || 0;
}

// ============================================================================
// PAYMENT STATUS TOGGLE
// ============================================================================

function togglePaymentStatus(index) {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    if (index >= 0 && index < responses.length) {
        responses[index].payment_status = !responses[index].payment_status;
        localStorage.setItem('poll_responses', JSON.stringify(responses));
        
        // Refresh display
        loadAndDisplayData();
        
        showNotification('Payment status updated', 'success');
    }
}

// ============================================================================
// EVENT LISTENERS SETUP
// ============================================================================

function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Price settings button
    const priceSettingsBtn = document.getElementById('price-settings-btn');
    if (priceSettingsBtn) {
        priceSettingsBtn.addEventListener('click', openPriceSettings);
    }
    
    // Poll title settings button
    const titleSettingsBtn = document.getElementById('title-settings-btn');
    if (titleSettingsBtn) {
        titleSettingsBtn.addEventListener('click', openTitleSettings);
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportToCSV);
    }
    
    const exportXlsxBtn = document.getElementById('export-xlsx-btn');
    if (exportXlsxBtn) {
        exportXlsxBtn.addEventListener('click', exportToXLSX);
    }
    
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportToPDF);
    }
    
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
}

// ============================================================================
// SETTINGS MODALS
// ============================================================================

function openPriceSettings() {
    // Implementation for price settings modal
    alert('Price Settings: Please refer to the documentation for implementation details.');
}

function openTitleSettings() {
    // Implementation for title settings modal
    alert('Title Settings: Please refer to the documentation for implementation details.');
}

// ============================================================================
// EXPORT FUNCTIONS
// ============================================================================

function exportToCSV() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    if (responses.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    let csv = 'Name,Will Attend,Title,Available Dates,Price,Payment Status\n';
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    responses.forEach(response => {
        const price = response.will_attend === 'yes' 
            ? calculateIndividualPrice(response.title, responses, settings) 
            : 0;
        
        csv += `"${response.name}",`;
        csv += `"${response.will_attend}",`;
        csv += `"${response.title}",`;
        csv += `"${response.available_dates ? response.available_dates.join('; ') : 'N/A'}",`;
        csv += `"¥${price.toFixed(2)}",`;
        csv += `"${response.payment_status ? 'Paid' : 'Unpaid'}"\n`;
    });
    
    downloadFile(csv, 'poll_responses.csv', 'text/csv');
    showNotification('Exported to CSV successfully', 'success');
}

function exportToXLSX() {
    showNotification('XLSX export requires external library. Please use CSV export.', 'info');
}

function exportToPDF() {
    showNotification('PDF export requires external library. Please use CSV export.', 'info');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ============================================================================
// SEARCH AND FILTER
// ============================================================================

function handleSearch() {
    applyFilters();
}

function applyFilters() {
    const searchTerm = document.getElementById('search-input')?.value.toLowerCase() || '';
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    let filtered = responses;
    
    // Apply search
    if (searchTerm) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm));
    }
    
    // Apply filter
    if (activeFilter !== 'all') {
        if (activeFilter === 'attending') {
            filtered = filtered.filter(r => r.will_attend === 'yes');
        } else if (activeFilter === 'not-attending') {
            filtered = filtered.filter(r => r.will_attend === 'no');
        } else if (activeFilter === 'paid') {
            filtered = filtered.filter(r => r.payment_status === true);
        } else if (activeFilter === 'unpaid') {
            filtered = filtered.filter(r => r.payment_status === false);
        }
    }
    
    displayResponses(filtered);
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============================================================================
// Make functions global for inline event handlers
// ============================================================================

window.togglePaymentStatus = togglePaymentStatus;
window.logout = logout;

console.log('Admin.js fully loaded - Chart bug fixed!');
