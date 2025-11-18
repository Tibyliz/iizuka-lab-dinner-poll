// Admin Dashboard Controller - Enhanced with Editable Pricing Inputs
// Two-way binding between sliders and input fields with decimal support

console.log('[Admin] Script loaded');

// Global state
let responses = [];
let archives = [];
let config = {
    pollTitle: 'Iizuka Lab Dinner Poll',
    basePrice: 10000,
    pricing: {
        bachelor: 15,
        master: 20,
        phd: 30,
        faculty: 35
    }
};

let charts = {
    position: null,
    datePopularity: null
};

let currentEditingResponseId = null;

// Initialize dashboard when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[Admin] Dashboard initializing...');
    
    // Check authentication
    if (!checkAuth()) {
        window.location.href = 'admin-login.html';
        return;
    }

    // Initialize pricing controls with two-way binding
    initializePricingControls();
    
    // Initialize other event listeners
    initializeEventListeners();
    
    // Load data
    await loadDashboardData();
    
    // Hide loading overlay
    hideLoading();
    
    console.log('[Admin] Dashboard ready!');
});

// Authentication check
function checkAuth() {
    return sessionStorage.getItem('adminLoggedIn') === 'true';
}

// Initialize pricing controls with two-way binding
function initializePricingControls() {
    console.log('[Admin] Initializing pricing controls with two-way binding...');
    
    const positions = ['bachelor', 'master', 'phd', 'faculty'];
    
    positions.forEach(position => {
        const slider = document.getElementById(`${position}Slider`);
        const input = document.getElementById(`${position}Input`);
        
        if (!slider || !input) {
            console.error(`[Admin] Missing slider or input for ${position}`);
            return;
        }
        
        // Slider → Input (two-way binding)
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            input.value = value;
            config.pricing[position] = value;
            updatePricingDisplay();
            updateTotalValidation();
        });
        
        // Input → Slider (two-way binding)
        input.addEventListener('input', (e) => {
            let value = parseFloat(e.target.value);
            
            // Validate range
            if (isNaN(value) || value < 0) value = 0;
            if (value > 100) value = 100;
            
            // Round to nearest 0.5 for better UX
            value = Math.round(value * 2) / 2;
            
            e.target.value = value;
            slider.value = value;
            config.pricing[position] = value;
            updatePricingDisplay();
            updateTotalValidation();
        });
        
        // Blur event for final validation
        input.addEventListener('blur', (e) => {
            let value = parseFloat(e.target.value);
            if (isNaN(value)) value = 0;
            value = Math.round(value * 2) / 2;
            e.target.value = value;
            slider.value = value;
            config.pricing[position] = value;
            updatePricingDisplay();
            updateTotalValidation();
        });
    });
    
    // Base price input
    const basePriceInput = document.getElementById('basePrice');
    if (basePriceInput) {
        basePriceInput.addEventListener('input', (e) => {
            let value = parseInt(e.target.value);
            if (isNaN(value) || value < 0) value = 0;
            config.basePrice = value;
            updatePricingDisplay();
        });
    }
    
    console.log('[Admin] Pricing controls initialized with two-way binding');
}

// Update pricing display (amounts per position)
function updatePricingDisplay() {
    const positions = ['bachelor', 'master', 'phd', 'faculty'];
    
    positions.forEach(position => {
        const amountElement = document.getElementById(`${position}Amount`);
        if (amountElement) {
            const percentage = config.pricing[position];
            const amount = Math.round((config.basePrice * percentage) / 100);
            amountElement.textContent = `¥${amount.toLocaleString()}`;
        }
    });
}

// Update total percentage validation
function updateTotalValidation() {
    const total = Object.values(config.pricing).reduce((sum, val) => sum + val, 0);
    const totalValueElement = document.getElementById('totalPercentValue');
    const totalIconElement = document.getElementById('totalValidIcon');
    const totalWarningElement = document.getElementById('totalWarning');
    
    if (totalValueElement) {
        totalValueElement.textContent = `${total.toFixed(1)}%`;
    }
    
    const isValid = Math.abs(total - 100) < 0.1; // Allow 0.1% tolerance for floating point
    
    if (totalIconElement) {
        if (isValid) {
            totalIconElement.className = 'fas fa-check-circle total-icon valid';
        } else {
            totalIconElement.className = 'fas fa-exclamation-circle total-icon invalid';
        }
    }
    
    if (totalWarningElement) {
        totalWarningElement.style.display = isValid ? 'none' : 'flex';
    }
    
    return isValid;
}

// Initialize all event listeners
function initializeEventListeners() {
    // Header actions
    document.getElementById('startNewVoteBtn').addEventListener('click', startNewVote);
    document.getElementById('saveArchiveBtn').addEventListener('click', saveArchiveManually);
    document.getElementById('refreshBtn').addEventListener('click', loadDashboardData);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Export buttons
    document.getElementById('exportExcelBtn').addEventListener('click', exportToExcel);
    document.getElementById('exportPdfBtn').addEventListener('click', exportToPdf);
    document.getElementById('exportCsvBtn').addEventListener('click', exportToCsv);
    
    // Filter controls
    document.getElementById('filterPaidOnly').addEventListener('change', filterResponses);
    document.getElementById('filterUnpaidOnly').addEventListener('change', filterResponses);
    
    // Save pricing button
    document.getElementById('savePricingBtn').addEventListener('click', savePricingConfig);
    
    // Poll configuration
    document.getElementById('generateDatesBtn').addEventListener('click', generateDates);
    document.getElementById('saveConfigBtn').addEventListener('click', saveConfig);
    
    // Modal close
    const modal = document.getElementById('editAmountModal');
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
    
    // Modal actions
    document.getElementById('saveAmountBtn').addEventListener('click', saveCustomAmount);
    document.getElementById('resetAmountBtn').addEventListener('click', resetAmount);
}

// Load all dashboard data
async function loadDashboardData() {
    try {
        showLoading('Loading dashboard data...');
        
        // Load config
        await loadConfig();
        
        // Load responses
        await loadResponses();
        
        // Load archives
        await loadArchives();
        
        // Update UI
        updateStatistics();
        updateCharts();
        updateResponsesTable();
        updateArchivesList();
        
        hideLoading();
        showToast('Dashboard loaded successfully!', 'success');
    } catch (error) {
        console.error('[Admin] Error loading dashboard:', error);
        hideLoading();
        showToast('Error loading dashboard: ' + error.message, 'error');
    }
}

// Load configuration from Firebase
async function loadConfig() {
    try {
        console.log('[Admin] Loading config...');
        const data = await firebaseAPI.getConfig();
        
        if (data) {
            config = {
                pollTitle: data.pollTitle || 'Iizuka Lab Dinner Poll',
                startDate: data.startDate || '',
                endDate: data.endDate || '',
                basePrice: data.basePrice || 10000,
                pricing: data.pricing || {
                    bachelor: 15,
                    master: 20,
                    phd: 30,
                    faculty: 35
                }
            };
            
            // Update UI
            document.getElementById('pollTitle').value = config.pollTitle;
            document.getElementById('startDate').value = config.startDate;
            document.getElementById('endDate').value = config.endDate;
            document.getElementById('basePrice').value = config.basePrice;
            
            // Update pricing controls
            ['bachelor', 'master', 'phd', 'faculty'].forEach(position => {
                const value = config.pricing[position];
                document.getElementById(`${position}Slider`).value = value;
                document.getElementById(`${position}Input`).value = value;
            });
            
            updatePricingDisplay();
            updateTotalValidation();
            
            console.log('[Admin] Config loaded successfully');
        }
    } catch (error) {
        console.error('[Admin] Error loading config:', error);
        throw error;
    }
}

// Load responses from Firebase
async function loadResponses() {
    try {
        console.log('[Admin] Loading responses...');
        responses = await firebaseAPI.getResponses();
        console.log(`[Admin] Loaded ${responses.length} responses`);
    } catch (error) {
        console.error('[Admin] Error loading responses:', error);
        throw error;
    }
}

// Load archives from Firebase
async function loadArchives() {
    try {
        console.log('[Admin] Loading archives...');
        const data = await firebaseAPI.getArchives();
        archives = data ? Object.entries(data).map(([id, archive]) => ({ id, ...archive })) : [];
        console.log(`[Admin] Loaded ${archives.length} archives`);
    } catch (error) {
        console.error('[Admin] Error loading archives:', error);
        // Not critical, continue
    }
}

// Update statistics cards
function updateStatistics() {
    const attending = responses.filter(r => r.attendance === "Yes, I'll attend");
    const totalCost = config.basePrice;
    
    // Calculate total paid
    let totalPaid = 0;
    attending.forEach(response => {
        if (response.paymentStatus) {
            const amount = response.customAmount || calculateAmount(response.position);
            totalPaid += amount;
        }
    });
    
    document.getElementById('totalResponses').textContent = responses.length;
    document.getElementById('attendingCount').textContent = attending.length;
    document.getElementById('totalCost').textContent = `¥${totalCost.toLocaleString()}`;
    document.getElementById('totalPaid').textContent = `¥${totalPaid.toLocaleString()}`;
}

// Calculate amount for a position
function calculateAmount(position) {
    const positionKey = position.toLowerCase().replace(/['\/\s]/g, '').replace('students', '').replace('student', '').replace('facultystaff', 'faculty');
    const percentage = config.pricing[positionKey] || 0;
    return Math.round((config.basePrice * percentage) / 100);
}

// Update charts
function updateCharts() {
    updatePositionChart();
    updateDatePopularityChart();
}

// Update position breakdown chart
function updatePositionChart() {
    const canvas = document.getElementById('positionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (charts.position) {
        charts.position.destroy();
    }
    
    // Count by position
    const positionCounts = {
        'Bachelor Student': 0,
        "Master's Student": 0,
        'PhD Student': 0,
        'Faculty/Staff': 0
    };
    
    responses.filter(r => r.attendance === "Yes, I'll attend").forEach(r => {
        if (positionCounts.hasOwnProperty(r.position)) {
            positionCounts[r.position]++;
        }
    });
    
    // Create chart
    charts.position = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(positionCounts),
            datasets: [{
                data: Object.values(positionCounts),
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)',
                    'rgba(241, 147, 251, 0.8)',
                    'rgba(79, 172, 254, 0.8)',
                    'rgba(67, 233, 123, 0.8)'
                ],
                borderColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(241, 147, 251, 1)',
                    'rgba(79, 172, 254, 1)',
                    'rgba(67, 233, 123, 1)'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                title: {
                    display: false
                }
            }
        }
    });
}

// Update date popularity chart
function updateDatePopularityChart() {
    const canvas = document.getElementById('datePopularityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Destroy existing chart
    if (charts.datePopularity) {
        charts.datePopularity.destroy();
    }
    
    // Count date selections
    const dateCounts = {};
    responses.filter(r => r.attendance === "Yes, I'll attend" && r.selectedDates).forEach(r => {
        const dates = r.selectedDates.split(',').map(d => d.trim());
        dates.forEach(date => {
            if (date) {
                dateCounts[date] = (dateCounts[date] || 0) + 1;
            }
        });
    });
    
    // Sort by count (descending)
    const sortedDates = Object.entries(dateCounts).sort((a, b) => b[1] - a[1]);
    
    // Create chart
    charts.datePopularity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedDates.map(d => d[0]),
            datasets: [{
                label: 'Number of Selections',
                data: sortedDates.map(d => d[1]),
                backgroundColor: 'rgba(67, 233, 123, 0.8)',
                borderColor: 'rgba(67, 233, 123, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: false
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
}

// Update responses table
function updateResponsesTable() {
    const tbody = document.getElementById('responsesTableBody');
    tbody.innerHTML = '';
    
    responses.forEach(response => {
        const amount = response.customAmount || calculateAmount(response.position);
        const isCustom = response.customAmount ? 'amount-custom' : '';
        const editIcon = response.customAmount ? ' <i class="fas fa-edit"></i>' : '';
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${response.name}</td>
            <td>${response.attendance}</td>
            <td>${response.position}</td>
            <td>${response.selectedDates || 'N/A'}</td>
            <td class="amount-cell ${isCustom}" data-id="${response.id}">
                ¥${amount.toLocaleString()}${editIcon}
            </td>
            <td>
                <input type="checkbox" class="payment-checkbox" data-id="${response.id}" ${response.paymentStatus ? 'checked' : ''}>
            </td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="deleteResponse('${response.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Add click handlers for amount cells
    document.querySelectorAll('.amount-cell').forEach(cell => {
        cell.addEventListener('click', (e) => {
            const id = e.currentTarget.getAttribute('data-id');
            openEditAmountModal(id);
        });
    });
    
    // Add change handlers for payment checkboxes
    document.querySelectorAll('.payment-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const id = e.target.getAttribute('data-id');
            const paid = e.target.checked;
            await updatePaymentStatus(id, paid);
        });
    });
}

// Open edit amount modal
function openEditAmountModal(responseId) {
    const response = responses.find(r => r.id === responseId);
    if (!response) return;
    
    currentEditingResponseId = responseId;
    const defaultAmount = calculateAmount(response.position);
    const customAmount = response.customAmount || defaultAmount;
    
    document.getElementById('editName').textContent = response.name;
    document.getElementById('editPosition').textContent = response.position;
    document.getElementById('editDefaultAmount').textContent = `¥${defaultAmount.toLocaleString()}`;
    document.getElementById('customAmount').value = customAmount;
    
    document.getElementById('editAmountModal').style.display = 'block';
}

// Save custom amount
async function saveCustomAmount() {
    if (!currentEditingResponseId) return;
    
    const amount = parseInt(document.getElementById('customAmount').value);
    if (isNaN(amount) || amount < 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    try {
        await firebaseAPI.updateResponse(currentEditingResponseId, {
            customAmount: amount,
            isEdited: true
        });
        
        // Update local data
        const response = responses.find(r => r.id === currentEditingResponseId);
        if (response) {
            response.customAmount = amount;
            response.isEdited = true;
        }
        
        updateResponsesTable();
        updateStatistics();
        document.getElementById('editAmountModal').style.display = 'none';
        showToast('Amount updated successfully!', 'success');
    } catch (error) {
        console.error('[Admin] Error updating amount:', error);
        showToast('Error updating amount: ' + error.message, 'error');
    }
}

// Reset amount to default
async function resetAmount() {
    if (!currentEditingResponseId) return;
    
    try {
        await firebaseAPI.updateResponse(currentEditingResponseId, {
            customAmount: null,
            isEdited: false
        });
        
        // Update local data
        const response = responses.find(r => r.id === currentEditingResponseId);
        if (response) {
            delete response.customAmount;
            response.isEdited = false;
        }
        
        updateResponsesTable();
        updateStatistics();
        document.getElementById('editAmountModal').style.display = 'none';
        showToast('Amount reset to default!', 'success');
    } catch (error) {
        console.error('[Admin] Error resetting amount:', error);
        showToast('Error resetting amount: ' + error.message, 'error');
    }
}

// Update payment status
async function updatePaymentStatus(responseId, paid) {
    try {
        await firebaseAPI.updateResponse(responseId, { paymentStatus: paid });
        
        // Update local data
        const response = responses.find(r => r.id === responseId);
        if (response) {
            response.paymentStatus = paid;
        }
        
        updateStatistics();
        showToast('Payment status updated!', 'success');
    } catch (error) {
        console.error('[Admin] Error updating payment status:', error);
        showToast('Error updating payment status: ' + error.message, 'error');
    }
}

// Delete response
async function deleteResponse(responseId) {
    if (!confirm('Are you sure you want to delete this response?')) return;
    
    try {
        await firebaseAPI.deleteResponse(responseId);
        responses = responses.filter(r => r.id !== responseId);
        
        updateResponsesTable();
        updateStatistics();
        updateCharts();
        showToast('Response deleted!', 'success');
    } catch (error) {
        console.error('[Admin] Error deleting response:', error);
        showToast('Error deleting response: ' + error.message, 'error');
    }
}

// Filter responses
function filterResponses() {
    const paidOnly = document.getElementById('filterPaidOnly').checked;
    const unpaidOnly = document.getElementById('filterUnpaidOnly').checked;
    
    let filteredResponses = [...responses];
    
    if (paidOnly) {
        filteredResponses = filteredResponses.filter(r => r.paymentStatus);
    }
    if (unpaidOnly) {
        filteredResponses = filteredResponses.filter(r => !r.paymentStatus);
    }
    
    // Temporarily replace responses for table update
    const originalResponses = responses;
    responses = filteredResponses;
    updateResponsesTable();
    responses = originalResponses;
}

// Save pricing configuration
async function savePricingConfig() {
    // Validate total percentage
    if (!updateTotalValidation()) {
        showToast('Total percentage must equal 100%!', 'error');
        return;
    }
    
    try {
        await firebaseAPI.updateConfig({
            basePrice: config.basePrice,
            pricing: config.pricing
        });
        
        showToast('Pricing configuration saved!', 'success');
        updatePricingDisplay();
        updateResponsesTable();
        updateStatistics();
    } catch (error) {
        console.error('[Admin] Error saving pricing:', error);
        showToast('Error saving pricing: ' + error.message, 'error');
    }
}

// Generate dates
function generateDates() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        showToast('Please select both start and end dates', 'error');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
        showToast('Start date must be before end date', 'error');
        return;
    }
    
    const dates = [];
    const current = new Date(start);
    
    while (current <= end) {
        dates.push(current.toISOString().split('T')[0]);
        current.setDate(current.getDate() + 1);
    }
    
    const preview = document.getElementById('datePreview');
    preview.textContent = `${dates.length} dates from ${startDate} to ${endDate}`;
    
    config.startDate = startDate;
    config.endDate = endDate;
    config.availableDates = dates;
    
    showToast('Dates generated! Click "Save Configuration" to apply.', 'info');
}

// Save configuration
async function saveConfig() {
    const pollTitle = document.getElementById('pollTitle').value;
    
    if (!pollTitle.trim()) {
        showToast('Please enter a poll title', 'error');
        return;
    }
    
    try {
        config.pollTitle = pollTitle;
        await firebaseAPI.updateConfig(config);
        
        showToast('Configuration saved successfully!', 'success');
    } catch (error) {
        console.error('[Admin] Error saving config:', error);
        showToast('Error saving configuration: ' + error.message, 'error');
    }
}

// Start new vote
async function startNewVote() {
    const confirmed = confirm('This will archive the current poll data and start fresh. Continue?');
    if (!confirmed) return;
    
    try {
        showLoading('Starting new vote...');
        
        // Create archive name
        const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
        const archiveName = `${config.pollTitle} - ${timestamp}`;
        
        // Save archive
        await firebaseAPI.saveArchive(archiveName, {
            responses,
            config,
            createdDate: new Date().toISOString()
        });
        
        // Clear responses
        await firebaseAPI.clearResponses();
        
        hideLoading();
        showToast('New vote started! Previous data archived.', 'success');
        
        // Reload dashboard
        await loadDashboardData();
    } catch (error) {
        console.error('[Admin] Error starting new vote:', error);
        hideLoading();
        showToast('Error starting new vote: ' + error.message, 'error');
    }
}

// Save archive manually
async function saveArchiveManually() {
    const archiveName = prompt('Enter archive name:', `${config.pollTitle} - ${new Date().toISOString().substring(0, 10)}`);
    if (!archiveName) return;
    
    try {
        showLoading('Saving archive...');
        
        await firebaseAPI.saveArchive(archiveName, {
            responses,
            config,
            createdDate: new Date().toISOString()
        });
        
        hideLoading();
        showToast('Archive saved successfully!', 'success');
        
        // Reload archives
        await loadArchives();
        updateArchivesList();
    } catch (error) {
        console.error('[Admin] Error saving archive:', error);
        hideLoading();
        showToast('Error saving archive: ' + error.message, 'error');
    }
}

// Update archives list
function updateArchivesList() {
    const container = document.getElementById('archivesList');
    
    if (archives.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #718096;">No archives yet</p>';
        return;
    }
    
    container.innerHTML = archives.map(archive => `
        <div class="archive-item">
            <div class="archive-info">
                <h3>${archive.archiveName || archive.id}</h3>
                <p>${new Date(archive.createdDate).toLocaleString()}</p>
            </div>
            <div class="archive-actions">
                <button class="btn btn-sm btn-info" onclick="viewArchive('${archive.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteArchive('${archive.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// View archive (placeholder)
function viewArchive(archiveId) {
    showToast('Archive viewing feature coming soon!', 'info');
}

// Delete archive
async function deleteArchive(archiveId) {
    if (!confirm('Are you sure you want to delete this archive?')) return;
    
    try {
        await firebaseAPI.deleteArchive(archiveId);
        archives = archives.filter(a => a.id !== archiveId);
        
        updateArchivesList();
        showToast('Archive deleted!', 'success');
    } catch (error) {
        console.error('[Admin] Error deleting archive:', error);
        showToast('Error deleting archive: ' + error.message, 'error');
    }
}

// Export functions (placeholder implementations)
function exportToExcel() {
    showToast('Excel export feature coming soon!', 'info');
}

function exportToPdf() {
    showToast('PDF export feature coming soon!', 'info');
}

function exportToCsv() {
    const csvContent = convertToCSV(responses);
    downloadFile(csvContent, 'poll-responses.csv', 'text/csv');
    showToast('CSV downloaded!', 'success');
}

function convertToCSV(data) {
    const headers = ['Name', 'Attendance', 'Position', 'Selected Dates', 'Amount', 'Payment Status'];
    const rows = data.map(r => [
        r.name,
        r.attendance,
        r.position,
        r.selectedDates || '',
        r.customAmount || calculateAmount(r.position),
        r.paymentStatus ? 'Paid' : 'Unpaid'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Logout
function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    window.location.href = 'admin-login.html';
}

// UI Helper functions
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.querySelector('p').textContent = message;
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showToast(message, type = 'info') {
    console.log(`[Toast ${type.toUpperCase()}] ${message}`);
    alert(message); // Simple implementation, can be enhanced with a toast library
}

console.log('[Admin] Script initialization complete');
