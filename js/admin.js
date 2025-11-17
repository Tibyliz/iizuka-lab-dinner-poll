// Admin Dashboard JavaScript with Archive Management

// Global variables
let chartInstance = null;
let currentFilter = 'all';
let currentPaymentFilter = 'all';
let currentSearchTerm = '';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    
    // Check authentication
    checkAuth();
    
    // Initialize data
    initializeData();
    
    // Load and display data
    loadData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Display current poll name
    displayCurrentPollName();
});

// Check if user is authenticated
function checkAuth() {
    const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
    const now = Date.now();
    
    if (!session.authenticated || (session.timestamp + session.expiresIn) < now) {
        console.log('Session expired or not authenticated');
        window.location.href = 'admin-login.html';
        return false;
    }
    
    console.log('Session valid');
    return true;
}

// Initialize default data if not exists
function initializeData() {
    // Initialize poll responses
    if (!localStorage.getItem('poll_responses')) {
        localStorage.setItem('poll_responses', JSON.stringify([]));
    }
    
    // Initialize admin settings
    if (!localStorage.getItem('admin_settings')) {
        const defaultSettings = {
            password: 'iizukalab',
            totalCost: 0,
            masterPercent: 20,
            doctoralPercent: 30,
            staffPercent: 50,
            pollTitle: getDefaultTitle(),
            currentPollName: 'Default Poll'
        };
        localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
    }
    
    // Initialize archives
    if (!localStorage.getItem('poll_archives')) {
        localStorage.setItem('poll_archives', JSON.stringify([]));
    }
}

// Get default poll title
function getDefaultTitle() {
    const now = new Date();
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Display current poll name
function displayCurrentPollName() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const pollNameEl = document.getElementById('current-poll-name');
    if (pollNameEl) {
        pollNameEl.textContent = `Current: ${settings.currentPollName || 'Default Poll'}`;
    }
}

// Load all data and update display
function loadData() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    // Update statistics
    updateStatistics(responses);
    
    // Render chart
    renderChart(responses);
    
    // Render table
    renderTable(responses);
}

// Update statistics cards
function updateStatistics(responses) {
    const total = responses.length;
    const attending = responses.filter(r => r.willAttend === 'yes').length;
    const notAttending = responses.filter(r => r.willAttend === 'no').length;
    const paid = responses.filter(r => r.paymentStatus === true).length;
    
    safeSetText('total-responses', total);
    safeSetText('attending-count', attending);
    safeSetText('not-attending-count', notAttending);
    safeSetText('paid-count', `${paid} / ${attending}`);
}

// Render chart
function renderChart(responses) {
    const canvas = document.getElementById('dateChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Count dates
    const dateCounts = {};
    responses.forEach(response => {
        if (response.willAttend === 'yes' && response.availableDates) {
            response.availableDates.forEach(date => {
                dateCounts[date] = (dateCounts[date] || 0) + 1;
            });
        }
    });
    
    // Sort by count
    const sortedDates = Object.entries(dateCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sortedDates.map(([date]) => date);
    const data = sortedDates.map(([, count]) => count);
    
    // Destroy old chart
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }
    
    // Create new chart
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of People Available',
                data: data,
                backgroundColor: 'rgba(124, 58, 237, 0.8)',
                borderColor: 'rgba(124, 58, 237, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
}

// Render responses table
function renderTable(responses) {
    const tbody = document.getElementById('responses-tbody');
    if (!tbody) return;
    
    // Apply filters
    let filteredResponses = responses.filter(response => {
        // Attendance filter
        if (currentFilter === 'attending' && response.willAttend !== 'yes') return false;
        if (currentFilter === 'not-attending' && response.willAttend !== 'no') return false;
        
        // Payment filter
        if (currentPaymentFilter === 'paid' && !response.paymentStatus) return false;
        if (currentPaymentFilter === 'unpaid' && response.paymentStatus) return false;
        
        // Search filter
        if (currentSearchTerm && !response.name.toLowerCase().includes(currentSearchTerm.toLowerCase())) {
            return false;
        }
        
        return true;
    });
    
    if (filteredResponses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No responses match the current filters</td></tr>';
        return;
    }
    
    // Get price settings
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const prices = calculatePrices(responses, settings);
    
    tbody.innerHTML = filteredResponses.map(response => {
        const price = response.willAttend === 'yes' ? (prices[response.title] || 0) : 0;
        const paymentIcon = response.paymentStatus ? 
            '<i class="fas fa-check-circle" style="color: #10b981;"></i>' : 
            '<i class="fas fa-times-circle" style="color: #ef4444;"></i>';
        
        return `
            <tr>
                <td>${escapeHtml(response.name)}</td>
                <td><span class="badge ${response.willAttend === 'yes' ? 'badge-success' : 'badge-danger'}">
                    ${response.willAttend === 'yes' ? 'Yes' : 'No'}
                </span></td>
                <td>${escapeHtml(response.title)}</td>
                <td>${response.availableDates ? response.availableDates.join(', ') : 'N/A'}</td>
                <td>¥${price.toFixed(2)}</td>
                <td>
                    <input type="checkbox" 
                           class="payment-checkbox" 
                           data-id="${response.id}"
                           ${response.paymentStatus ? 'checked' : ''}>
                    ${paymentIcon}
                </td>
                <td>
                    <button class="btn-small btn-danger delete-response" data-id="${response.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Add event listeners for payment checkboxes
    document.querySelectorAll('.payment-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handlePaymentChange);
    });
    
    // Add event listeners for delete buttons
    document.querySelectorAll('.delete-response').forEach(button => {
        button.addEventListener('click', handleDeleteResponse);
    });
}

// Calculate prices based on percentages
function calculatePrices(responses, settings) {
    const totalCost = parseFloat(settings.totalCost) || 0;
    const masterPercent = parseFloat(settings.masterPercent) || 0;
    const doctoralPercent = parseFloat(settings.doctoralPercent) || 0;
    const staffPercent = parseFloat(settings.staffPercent) || 0;
    
    // Count attending people by title
    const counts = {
        'Master Student': 0,
        'Doctoral Student': 0,
        'Teachers and Staff': 0
    };
    
    responses.forEach(r => {
        if (r.willAttend === 'yes' && counts.hasOwnProperty(r.title)) {
            counts[r.title]++;
        }
    });
    
    // Calculate prices
    const prices = {};
    if (counts['Master Student'] > 0) {
        prices['Master Student'] = (totalCost * masterPercent / 100) / counts['Master Student'];
    }
    if (counts['Doctoral Student'] > 0) {
        prices['Doctoral Student'] = (totalCost * doctoralPercent / 100) / counts['Doctoral Student'];
    }
    if (counts['Teachers and Staff'] > 0) {
        prices['Teachers and Staff'] = (totalCost * staffPercent / 100) / counts['Teachers and Staff'];
    }
    
    return prices;
}

// Handle payment status change
function handlePaymentChange(e) {
    const checkbox = e.target;
    const id = checkbox.dataset.id;
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    const response = responses.find(r => r.id === id);
    if (response) {
        response.paymentStatus = checkbox.checked;
        localStorage.setItem('poll_responses', JSON.stringify(responses));
        loadData(); // Reload to update statistics
    }
}

// Handle delete response
function handleDeleteResponse(e) {
    if (!confirm('Are you sure you want to delete this response?')) {
        return;
    }
    
    const id = e.currentTarget.dataset.id;
    let responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    responses = responses.filter(r => r.id !== id);
    localStorage.setItem('poll_responses', JSON.stringify(responses));
    loadData();
}

// Setup all event listeners
function setupEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Poll Management button
    const pollMgmtBtn = document.getElementById('poll-management-btn');
    if (pollMgmtBtn) {
        pollMgmtBtn.addEventListener('click', () => openModal('poll-management-modal'));
    }
    
    // Save poll button
    const savePollBtn = document.getElementById('save-poll-btn');
    if (savePollBtn) {
        savePollBtn.addEventListener('click', () => {
            closeModal('poll-management-modal');
            openModal('save-poll-modal');
        });
    }
    
    // Confirm save poll
    const confirmSaveBtn = document.getElementById('confirm-save-poll');
    if (confirmSaveBtn) {
        confirmSaveBtn.addEventListener('click', handleSavePoll);
    }
    
    // Start new poll button
    const newPollBtn = document.getElementById('new-poll-btn');
    if (newPollBtn) {
        newPollBtn.addEventListener('click', handleNewPoll);
    }
    
    // View archives button
    const viewArchivesBtn = document.getElementById('view-archives-btn');
    if (viewArchivesBtn) {
        viewArchivesBtn.addEventListener('click', handleViewArchives);
    }
    
    // Price settings button
    const priceBtn = document.getElementById('price-settings-btn');
    if (priceBtn) {
        priceBtn.addEventListener('click', openPriceSettings);
    }
    
    // Save prices button
    const savePricesBtn = document.getElementById('save-prices');
    if (savePricesBtn) {
        savePricesBtn.addEventListener('click', handleSavePrices);
    }
    
    // Title settings button
    const titleBtn = document.getElementById('title-settings-btn');
    if (titleBtn) {
        titleBtn.addEventListener('click', openTitleSettings);
    }
    
    // Save title button
    const saveTitleBtn = document.getElementById('save-title');
    if (saveTitleBtn) {
        saveTitleBtn.addEventListener('click', handleSaveTitle);
    }
    
    // Reset title button
    const resetTitleBtn = document.getElementById('reset-title');
    if (resetTitleBtn) {
        resetTitleBtn.addEventListener('click', handleResetTitle);
    }
    
    // Settings button
    const settingsBtn = document.getElementById('settings-btn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => openModal('settings-modal'));
    }
    
    // Change password button
    const changePasswordBtn = document.getElementById('change-password');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', handleChangePassword);
    }
    
    // Export buttons
    const exportCsvBtn = document.getElementById('export-csv-btn');
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', exportCSV);
    }
    
    const exportXlsxBtn = document.getElementById('export-xlsx-btn');
    if (exportXlsxBtn) {
        exportXlsxBtn.addEventListener('click', exportXLSX);
    }
    
    const exportPdfBtn = document.getElementById('export-pdf-btn');
    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', exportPDF);
    }
    
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', handleFilterChange);
    });
    
    document.querySelectorAll('.payment-filter-btn').forEach(btn => {
        btn.addEventListener('click', handlePaymentFilterChange);
    });
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
    
    // Price percentage inputs - real-time validation
    ['master-percent', 'doctoral-percent', 'staff-percent'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updatePercentTotal);
        }
    });
    
    // Modal close buttons
    document.querySelectorAll('.modal .close, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
}

// ===== ARCHIVE MANAGEMENT FUNCTIONS =====

// Save current poll to archive
function handleSavePoll() {
    const pollNameInput = document.getElementById('poll-name-input');
    const pollName = pollNameInput.value.trim();
    
    if (!pollName) {
        alert('Please enter a poll name');
        return;
    }
    
    // Get current data
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    // Create archive object
    const archive = {
        id: Date.now().toString(),
        name: pollName,
        date: new Date().toISOString(),
        responses: responses,
        settings: {
            totalCost: settings.totalCost,
            masterPercent: settings.masterPercent,
            doctoralPercent: settings.doctoralPercent,
            staffPercent: settings.staffPercent,
            pollTitle: settings.pollTitle
        },
        statistics: {
            total: responses.length,
            attending: responses.filter(r => r.willAttend === 'yes').length,
            notAttending: responses.filter(r => r.willAttend === 'no').length,
            paid: responses.filter(r => r.paymentStatus === true).length
        }
    };
    
    // Save to archives
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    archives.push(archive);
    localStorage.setItem('poll_archives', JSON.stringify(archives));
    
    // Close modal and clear input
    closeModal('save-poll-modal');
    pollNameInput.value = '';
    
    alert(`Poll "${pollName}" has been saved to archives!`);
}

// Start new poll
function handleNewPoll() {
    const confirmed = confirm(
        'Are you sure you want to start a new poll?\n\n' +
        'This will:\n' +
        '- Clear all current responses\n' +
        '- Keep your admin settings (password, prices, title)\n\n' +
        'Make sure you have saved the current poll to archives if needed!'
    );
    
    if (!confirmed) return;
    
    // Clear responses
    localStorage.setItem('poll_responses', JSON.stringify([]));
    
    // Update current poll name
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.currentPollName = 'New Poll - ' + new Date().toLocaleDateString();
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    // Close modal and reload
    closeModal('poll-management-modal');
    displayCurrentPollName();
    loadData();
    
    alert('New poll started! All responses have been cleared.');
}

// View archived polls
function handleViewArchives() {
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    const archivesList = document.getElementById('archives-list');
    
    if (!archivesList) return;
    
    if (archives.length === 0) {
        archivesList.innerHTML = '<p class="no-data">No archived polls yet</p>';
    } else {
        archivesList.innerHTML = archives.map(archive => `
            <div class="archive-card">
                <div class="archive-header">
                    <h3>${escapeHtml(archive.name)}</h3>
                    <span class="archive-date">${new Date(archive.date).toLocaleDateString()}</span>
                </div>
                <div class="archive-stats">
                    <div class="archive-stat">
                        <i class="fas fa-users"></i>
                        <span>${archive.statistics.total} responses</span>
                    </div>
                    <div class="archive-stat">
                        <i class="fas fa-user-check"></i>
                        <span>${archive.statistics.attending} attending</span>
                    </div>
                    <div class="archive-stat">
                        <i class="fas fa-money-bill-wave"></i>
                        <span>${archive.statistics.paid} paid</span>
                    </div>
                </div>
                <div class="archive-actions">
                    <button class="btn btn-small btn-info restore-archive" data-id="${archive.id}">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="btn btn-small btn-success export-archive-xlsx" data-id="${archive.id}">
                        <i class="fas fa-file-excel"></i> Export
                    </button>
                    <button class="btn btn-small btn-danger delete-archive" data-id="${archive.id}">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners
        document.querySelectorAll('.restore-archive').forEach(btn => {
            btn.addEventListener('click', () => handleRestoreArchive(btn.dataset.id));
        });
        
        document.querySelectorAll('.export-archive-xlsx').forEach(btn => {
            btn.addEventListener('click', () => handleExportArchive(btn.dataset.id));
        });
        
        document.querySelectorAll('.delete-archive').forEach(btn => {
            btn.addEventListener('click', () => handleDeleteArchive(btn.dataset.id));
        });
    }
    
    closeModal('poll-management-modal');
    openModal('archives-modal');
}

// Restore archived poll
function handleRestoreArchive(archiveId) {
    const confirmed = confirm(
        'Are you sure you want to restore this archived poll?\n\n' +
        'This will replace the current poll data with the archived data.\n' +
        'Make sure you have saved the current poll if needed!'
    );
    
    if (!confirmed) return;
    
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    const archive = archives.find(a => a.id === archiveId);
    
    if (!archive) {
        alert('Archive not found');
        return;
    }
    
    // Restore responses
    localStorage.setItem('poll_responses', JSON.stringify(archive.responses));
    
    // Restore settings (except password)
    const currentSettings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    currentSettings.totalCost = archive.settings.totalCost;
    currentSettings.masterPercent = archive.settings.masterPercent;
    currentSettings.doctoralPercent = archive.settings.doctoralPercent;
    currentSettings.staffPercent = archive.settings.staffPercent;
    currentSettings.pollTitle = archive.settings.pollTitle;
    currentSettings.currentPollName = archive.name;
    localStorage.setItem('admin_settings', JSON.stringify(currentSettings));
    
    // Close modal and reload
    closeModal('archives-modal');
    displayCurrentPollName();
    loadData();
    
    alert(`Poll "${archive.name}" has been restored!`);
}

// Export archived poll as XLSX
function handleExportArchive(archiveId) {
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    const archive = archives.find(a => a.id === archiveId);
    
    if (!archive) {
        alert('Archive not found');
        return;
    }
    
    // Use the same export function but with archived data
    exportXLSXWithData(archive.responses, archive.settings, archive.name);
}

// Delete archived poll
function handleDeleteArchive(archiveId) {
    const confirmed = confirm('Are you sure you want to delete this archived poll? This cannot be undone!');
    
    if (!confirmed) return;
    
    let archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    archives = archives.filter(a => a.id !== archiveId);
    localStorage.setItem('poll_archives', JSON.stringify(archives));
    
    // Refresh the archives list
    handleViewArchives();
    
    alert('Archive deleted successfully');
}

// ===== MODAL FUNCTIONS =====

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ===== PRICE SETTINGS =====

function openPriceSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    safeSetValue('total-cost', settings.totalCost || '');
    safeSetValue('master-percent', settings.masterPercent || 20);
    safeSetValue('doctoral-percent', settings.doctoralPercent || 30);
    safeSetValue('staff-percent', settings.staffPercent || 50);
    
    updatePercentTotal();
    openModal('price-modal');
}

function updatePercentTotal() {
    const master = parseFloat(document.getElementById('master-percent')?.value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoral-percent')?.value) || 0;
    const staff = parseFloat(document.getElementById('staff-percent')?.value) || 0;
    
    const total = master + doctoral + staff;
    const totalEl = document.getElementById('percent-total');
    
    if (totalEl) {
        totalEl.textContent = `Total: ${total}%`;
        totalEl.style.color = total === 100 ? '#10b981' : '#ef4444';
    }
    
    // Update preview
    updatePricePreview();
}

function updatePricePreview() {
    const totalCost = parseFloat(document.getElementById('total-cost')?.value) || 0;
    const master = parseFloat(document.getElementById('master-percent')?.value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoral-percent')?.value) || 0;
    const staff = parseFloat(document.getElementById('staff-percent')?.value) || 0;
    
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const counts = {
        master: responses.filter(r => r.willAttend === 'yes' && r.title === 'Master Student').length,
        doctoral: responses.filter(r => r.willAttend === 'yes' && r.title === 'Doctoral Student').length,
        staff: responses.filter(r => r.willAttend === 'yes' && r.title === 'Teachers and Staff').length
    };
    
    const preview = document.getElementById('price-preview');
    if (preview && totalCost > 0) {
        let html = '<h4>Price Preview:</h4>';
        
        if (counts.master > 0) {
            const price = (totalCost * master / 100) / counts.master;
            html += `<p>Master Student: ¥${price.toFixed(2)} each (${counts.master} people)</p>`;
        }
        if (counts.doctoral > 0) {
            const price = (totalCost * doctoral / 100) / counts.doctoral;
            html += `<p>Doctoral Student: ¥${price.toFixed(2)} each (${counts.doctoral} people)</p>`;
        }
        if (counts.staff > 0) {
            const price = (totalCost * staff / 100) / counts.staff;
            html += `<p>Teachers and Staff: ¥${price.toFixed(2)} each (${counts.staff} people)</p>`;
        }
        
        preview.innerHTML = html;
    }
}

function handleSavePrices() {
    const master = parseFloat(document.getElementById('master-percent')?.value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoral-percent')?.value) || 0;
    const staff = parseFloat(document.getElementById('staff-percent')?.value) || 0;
    
    if (master + doctoral + staff !== 100) {
        alert('Percentages must add up to 100%!');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.totalCost = parseFloat(document.getElementById('total-cost')?.value) || 0;
    settings.masterPercent = master;
    settings.doctoralPercent = doctoral;
    settings.staffPercent = staff;
    
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    closeModal('price-modal');
    loadData(); // Reload to show new prices
    alert('Price settings saved successfully!');
}

// ===== TITLE SETTINGS =====

function openTitleSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    safeSetValue('poll-title-input', settings.pollTitle || getDefaultTitle());
    openModal('title-modal');
}

function handleSaveTitle() {
    const title = document.getElementById('poll-title-input')?.value.trim();
    if (!title) {
        alert('Please enter a poll title');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.pollTitle = title;
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    closeModal('title-modal');
    alert('Poll title saved successfully!');
}

function handleResetTitle() {
    const defaultTitle = getDefaultTitle();
    safeSetValue('poll-title-input', defaultTitle);
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.pollTitle = defaultTitle;
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    alert('Title reset to default!');
}

// ===== ADMIN SETTINGS =====

function handleChangePassword() {
    const currentPassword = document.getElementById('current-password')?.value;
    const newPassword = document.getElementById('new-password')?.value;
    const confirmPassword = document.getElementById('confirm-password')?.value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    if (currentPassword !== settings.password) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    settings.password = newPassword;
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    closeModal('settings-modal');
    alert('Password changed successfully!');
    
    // Clear fields
    safeSetValue('current-password', '');
    safeSetValue('new-password', '');
    safeSetValue('confirm-password', '');
}

// ===== FILTER AND SEARCH =====

function handleFilterChange(e) {
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentFilter = e.target.dataset.filter;
    
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    renderTable(responses);
}

function handlePaymentFilterChange(e) {
    document.querySelectorAll('.payment-filter-btn').forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
    currentPaymentFilter = e.target.dataset.payment;
    
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    renderTable(responses);
}

function handleSearch(e) {
    currentSearchTerm = e.target.value;
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    renderTable(responses);
}

// ===== EXPORT FUNCTIONS =====

function exportCSV() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const prices = calculatePrices(responses, settings);
    
    let csv = 'Name,Attendance,Title,Available Dates,Price,Payment Status\n';
    
    responses.forEach(response => {
        const price = response.willAttend === 'yes' ? (prices[response.title] || 0) : 0;
        const dates = response.availableDates ? response.availableDates.join('; ') : 'N/A';
        const paid = response.paymentStatus ? 'Paid' : 'Unpaid';
        
        csv += `"${response.name}","${response.willAttend}","${response.title}","${dates}","¥${price.toFixed(2)}","${paid}"\n`;
    });
    
    downloadFile(csv, 'poll-responses.csv', 'text/csv');
}

function exportXLSX() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    exportXLSXWithData(responses, settings, 'Current Poll');
}

function exportXLSXWithData(responses, settings, sheetName) {
    const prices = calculatePrices(responses, settings);
    
    // Prepare data
    const data = responses.map(response => {
        const price = response.willAttend === 'yes' ? (prices[response.title] || 0) : 0;
        return {
            'Name': response.name,
            'Attendance': response.willAttend === 'yes' ? 'Yes' : 'No',
            'Title': response.title,
            'Available Dates': response.availableDates ? response.availableDates.join(', ') : 'N/A',
            'Price (¥)': price.toFixed(2),
            'Payment Status': response.paymentStatus ? 'Paid' : 'Unpaid'
        };
    });
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    
    // Download
    XLSX.writeFile(wb, `${sheetName.replace(/[^a-z0-9]/gi, '_')}.xlsx`);
}

function exportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const prices = calculatePrices(responses, settings);
    
    // Title
    doc.setFontSize(18);
    doc.text('Poll Responses Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    // Statistics
    const attending = responses.filter(r => r.willAttend === 'yes').length;
    const paid = responses.filter(r => r.paymentStatus === true).length;
    
    doc.text(`Total Responses: ${responses.length}`, 14, 38);
    doc.text(`Attending: ${attending}`, 14, 44);
    doc.text(`Paid: ${paid} / ${attending}`, 14, 50);
    
    // Table
    let y = 60;
    responses.forEach((response, index) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        const price = response.willAttend === 'yes' ? (prices[response.title] || 0) : 0;
        const paid = response.paymentStatus ? 'Paid' : 'Unpaid';
        
        doc.text(`${index + 1}. ${response.name}`, 14, y);
        doc.text(`   ${response.title} - ${response.willAttend === 'yes' ? 'Attending' : 'Not Attending'}`, 14, y + 5);
        doc.text(`   Price: ¥${price.toFixed(2)} - ${paid}`, 14, y + 10);
        
        y += 18;
    });
    
    doc.save('poll-responses.pdf');
}

// ===== LOGOUT =====

function handleLogout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'admin-login.html';
}

// ===== UTILITY FUNCTIONS =====

function safeSetText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function safeSetValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
