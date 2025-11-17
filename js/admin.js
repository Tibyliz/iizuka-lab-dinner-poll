// Admin Dashboard JavaScript with Complete Error Handling
console.log('Admin.js loaded successfully');

// Global Chart Instance
let chartInstance = null;

// Helper function to safely get element
function safeGetElement(id, context = 'Admin') {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`${context}: Element with ID '${id}' not found`);
    }
    return element;
}

// Helper function to safely set text content
function safeSetText(id, value, defaultValue = '0') {
    const element = safeGetElement(id);
    if (element) {
        element.textContent = value || defaultValue;
    }
}

// Check Authentication
function checkAuth() {
    const sessionData = localStorage.getItem('admin_session');
    if (!sessionData) {
        console.log('No session found, redirecting to login');
        window.location.href = 'admin-login.html';
        return false;
    }

    try {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        
        if (!session.authenticated || now > session.timestamp + session.expiresIn) {
            console.log('Session expired');
            localStorage.removeItem('admin_session');
            window.location.href = 'admin-login.html';
            return false;
        }
        
        // Update session info
        const sessionInfo = safeGetElement('sessionInfo');
        if (sessionInfo) {
            const hours = Math.floor((session.expiresIn - (now - session.timestamp)) / (1000 * 60 * 60));
            sessionInfo.textContent = `Session expires in ${hours} hours`;
        }
        
        return true;
    } catch (error) {
        console.error('Error checking auth:', error);
        window.location.href = 'admin-login.html';
        return false;
    }
}

// Initialize Data Storage
function initializeStorage() {
    if (!localStorage.getItem('poll_responses')) {
        localStorage.setItem('poll_responses', JSON.stringify([]));
    }
    if (!localStorage.getItem('admin_settings')) {
        const defaultSettings = {
            totalCost: 0,
            masterPercent: 20,
            doctoralPercent: 30,
            staffPercent: 50,
            pollTitle: getDefaultTitle()
        };
        localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
    }
    if (!localStorage.getItem('archived_polls')) {
        localStorage.setItem('archived_polls', JSON.stringify([]));
    }
}

// Get default poll title
function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Load Data
function loadData() {
    try {
        console.log('Loading data...');
        const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
        const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
        
        // Update statistics
        const total = responses.length;
        const attending = responses.filter(r => r.willAttend === 'yes').length;
        const notAttending = total - attending;
        const paid = responses.filter(r => r.paymentStatus === true).length;
        
        safeSetText('totalResponses', total);
        safeSetText('attendingCount', attending);
        safeSetText('notAttendingCount', notAttending);
        safeSetText('paidCount', `${paid} / ${attending}`);
        
        // Update chart
        updateChart(responses);
        
        // Update table
        updateTable(responses, settings);
        
        console.log('Data loaded successfully');
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Error loading data: ' + error.message);
    }
}

// Update Chart
function updateChart(responses) {
    const canvas = safeGetElement('dateChart');
    if (!canvas) {
        console.warn('Chart canvas not found');
        return;
    }

    // Get attending responses with dates
    const attendingWithDates = responses.filter(r => 
        r.willAttend === 'yes' && r.availableDates && r.availableDates.length > 0
    );

    if (attendingWithDates.length === 0) {
        // No data - show empty chart
        if (chartInstance) {
            chartInstance.destroy();
            chartInstance = null;
        }
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#999';
        ctx.textAlign = 'center';
        ctx.font = '16px Arial';
        ctx.fillText('No date data available yet', canvas.width / 2, canvas.height / 2);
        return;
    }

    // Count dates
    const dateCounts = {};
    attendingWithDates.forEach(response => {
        response.availableDates.forEach(date => {
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });
    });

    // Sort by date
    const sortedDates = Object.keys(dateCounts).sort();
    const counts = sortedDates.map(date => dateCounts[date]);

    // Destroy old chart instance
    if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
    }

    // Create new chart
    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Number of People Available',
                data: counts,
                backgroundColor: 'rgba(102, 126, 234, 0.6)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.parsed.y + ' people available';
                        }
                    }
                }
            }
        }
    });
}

// Update Table
function updateTable(responses, settings) {
    const tbody = safeGetElement('responsesTableBody');
    if (!tbody) {
        console.warn('Table body not found');
        return;
    }

    if (responses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No responses yet</td></tr>';
        return;
    }

    // Calculate prices
    const prices = calculatePrices(responses, settings);

    tbody.innerHTML = responses.map((response, index) => {
        const price = prices[response.title] || 0;
        const paidClass = response.paymentStatus ? 'paid' : 'unpaid';
        const paidIcon = response.paymentStatus ? 
            '<i class="fas fa-check-circle" style="color: #43e97b;"></i>' : 
            '<i class="fas fa-times-circle" style="color: #f5576c;"></i>';
        
        return `
            <tr>
                <td>${escapeHtml(response.name)}</td>
                <td>
                    <span class="badge badge-${response.willAttend === 'yes' ? 'success' : 'danger'}">
                        ${response.willAttend === 'yes' ? 'Yes' : 'No'}
                    </span>
                </td>
                <td>${escapeHtml(response.title)}</td>
                <td>${response.availableDates ? response.availableDates.join(', ') : 'N/A'}</td>
                <td class="price-cell">¥${price.toFixed(2)}</td>
                <td class="${paidClass}">
                    <label class="checkbox-label">
                        <input type="checkbox" 
                               class="payment-checkbox" 
                               data-index="${index}" 
                               ${response.paymentStatus ? 'checked' : ''}>
                        ${paidIcon}
                    </label>
                </td>
                <td>
                    <button class="btn-icon btn-delete" data-index="${index}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    // Attach event listeners
    attachTableEventListeners();
}

// Calculate Prices
function calculatePrices(responses, settings) {
    const totalCost = parseFloat(settings.totalCost) || 0;
    const masterPercent = parseFloat(settings.masterPercent) || 0;
    const doctoralPercent = parseFloat(settings.doctoralPercent) || 0;
    const staffPercent = parseFloat(settings.staffPercent) || 0;

    if (totalCost === 0) {
        return { 'Master Student': 0, 'Doctoral Student': 0, 'Teachers and Staff': 0 };
    }

    // Count attending people by title
    const attending = responses.filter(r => r.willAttend === 'yes');
    const masterCount = attending.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attending.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attending.filter(r => r.title === 'Teachers and Staff').length;

    // Calculate prices
    const masterPrice = masterCount > 0 ? (totalCost * masterPercent / 100) / masterCount : 0;
    const doctoralPrice = doctoralCount > 0 ? (totalCost * doctoralPercent / 100) / doctoralCount : 0;
    const staffPrice = staffCount > 0 ? (totalCost * staffPercent / 100) / staffCount : 0;

    return {
        'Master Student': masterPrice,
        'Doctoral Student': doctoralPrice,
        'Teachers and Staff': staffPrice
    };
}

// Attach Table Event Listeners
function attachTableEventListeners() {
    // Payment checkboxes
    const checkboxes = document.querySelectorAll('.payment-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            updatePaymentStatus(index, this.checked);
        });
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (confirm('Are you sure you want to delete this response?')) {
                deleteResponse(index);
            }
        });
    });
}

// Update Payment Status
function updatePaymentStatus(index, paid) {
    try {
        const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
        if (responses[index]) {
            responses[index].paymentStatus = paid;
            localStorage.setItem('poll_responses', JSON.stringify(responses));
            loadData();
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
        showError('Failed to update payment status');
    }
}

// Delete Response
function deleteResponse(index) {
    try {
        const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
        responses.splice(index, 1);
        localStorage.setItem('poll_responses', JSON.stringify(responses));
        loadData();
        showSuccess('Response deleted successfully');
    } catch (error) {
        console.error('Error deleting response:', error);
        showError('Failed to delete response');
    }
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show Error
function showError(message) {
    alert('Error: ' + message);
}

// Show Success
function showSuccess(message) {
    alert('Success: ' + message);
}

// Modal Functions
function openModal(modalId) {
    const modal = safeGetElement(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = safeGetElement(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Initialize Modals
function initializeModals() {
    const modals = ['pollTitleModal', 'priceModal', 'pollManagementModal', 'settingsModal'];
    
    modals.forEach(modalId => {
        const modal = safeGetElement(modalId);
        if (modal) {
            const closeBtn = modal.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => closeModal(modalId));
            }
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal(modalId);
                }
            });
        }
    });
}

// Poll Title Functions
function initializePollTitle() {
    const btn = safeGetElement('pollTitleBtn');
    const input = safeGetElement('pollTitleInput');
    const resetBtn = safeGetElement('resetTitleBtn');
    const saveBtn = safeGetElement('saveTitleBtn');

    if (btn) {
        btn.addEventListener('click', () => {
            const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
            if (input) {
                input.value = settings.pollTitle || getDefaultTitle();
            }
            openModal('pollTitleModal');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (input) {
                input.value = getDefaultTitle();
            }
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const title = input ? input.value.trim() : '';
            if (title) {
                const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
                settings.pollTitle = title;
                localStorage.setItem('admin_settings', JSON.stringify(settings));
                closeModal('pollTitleModal');
                showSuccess('Poll title updated successfully');
            } else {
                showError('Please enter a poll title');
            }
        });
    }
}

// Price Settings Functions
function initializePriceSettings() {
    const btn = safeGetElement('priceSettingsBtn');
    const saveBtn = safeGetElement('savePriceBtn');
    const totalInput = safeGetElement('totalCostInput');
    const masterInput = safeGetElement('masterPercent');
    const doctoralInput = safeGetElement('doctoralPercent');
    const staffInput = safeGetElement('staffPercent');

    if (btn) {
        btn.addEventListener('click', () => {
            const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
            if (totalInput) totalInput.value = settings.totalCost || '';
            if (masterInput) masterInput.value = settings.masterPercent || 20;
            if (doctoralInput) doctoralInput.value = settings.doctoralPercent || 30;
            if (staffInput) staffInput.value = settings.staffPercent || 50;
            updatePercentageTotal();
            updatePricePreview();
            openModal('priceModal');
        });
    }

    // Update percentage total on input
    [masterInput, doctoralInput, staffInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                updatePercentageTotal();
                updatePricePreview();
            });
        }
    });

    if (totalInput) {
        totalInput.addEventListener('input', updatePricePreview);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            const total = parseFloat(totalInput?.value) || 0;
            const master = parseFloat(masterInput?.value) || 0;
            const doctoral = parseFloat(doctoralInput?.value) || 0;
            const staff = parseFloat(staffInput?.value) || 0;

            if (master + doctoral + staff !== 100) {
                showError('Percentages must add up to 100%');
                return;
            }

            const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
            settings.totalCost = total;
            settings.masterPercent = master;
            settings.doctoralPercent = doctoral;
            settings.staffPercent = staff;
            localStorage.setItem('admin_settings', JSON.stringify(settings));
            
            closeModal('priceModal');
            loadData();
            showSuccess('Price settings saved successfully');
        });
    }
}

function updatePercentageTotal() {
    const master = parseFloat(safeGetElement('masterPercent')?.value) || 0;
    const doctoral = parseFloat(safeGetElement('doctoralPercent')?.value) || 0;
    const staff = parseFloat(safeGetElement('staffPercent')?.value) || 0;
    const total = master + doctoral + staff;
    
    const element = safeGetElement('percentageTotal');
    if (element) {
        element.textContent = `Total: ${total}%`;
        element.className = 'percentage-total ' + (total === 100 ? 'valid' : 'invalid');
    }
}

function updatePricePreview() {
    const totalCost = parseFloat(safeGetElement('totalCostInput')?.value) || 0;
    const master = parseFloat(safeGetElement('masterPercent')?.value) || 0;
    const doctoral = parseFloat(safeGetElement('doctoralPercent')?.value) || 0;
    const staff = parseFloat(safeGetElement('staffPercent')?.value) || 0;

    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const attending = responses.filter(r => r.willAttend === 'yes');
    const masterCount = attending.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attending.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attending.filter(r => r.title === 'Teachers and Staff').length;

    const masterPrice = masterCount > 0 ? (totalCost * master / 100) / masterCount : 0;
    const doctoralPrice = doctoralCount > 0 ? (totalCost * doctoral / 100) / doctoralCount : 0;
    const staffPrice = staffCount > 0 ? (totalCost * staff / 100) / staffCount : 0;

    const preview = safeGetElement('pricePreviewContent');
    if (preview) {
        preview.innerHTML = `
            <div class="preview-item">
                <span>Master Students (${masterCount} people):</span>
                <strong>¥${masterPrice.toFixed(2)} per person</strong>
            </div>
            <div class="preview-item">
                <span>Doctoral Students (${doctoralCount} people):</span>
                <strong>¥${doctoralPrice.toFixed(2)} per person</strong>
            </div>
            <div class="preview-item">
                <span>Teachers/Staff (${staffCount} people):</span>
                <strong>¥${staffPrice.toFixed(2)} per person</strong>
            </div>
        `;
    }
}

// Poll Management Functions
function initializePollManagement() {
    const btn = safeGetElement('pollManagementBtn');
    const saveBtn = safeGetElement('saveCurrentPollBtn');
    const newBtn = safeGetElement('startNewPollBtn');

    if (btn) {
        btn.addEventListener('click', () => {
            loadArchives();
            openModal('pollManagementModal');
        });
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveCurrentPoll);
    }

    if (newBtn) {
        newBtn.addEventListener('click', startNewPoll);
    }
}

function saveCurrentPoll() {
    const nameInput = safeGetElement('archiveName');
    const name = nameInput ? nameInput.value.trim() : '';
    
    if (!name) {
        showError('Please enter a name for the archived poll');
        return;
    }

    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const archives = JSON.parse(localStorage.getItem('archived_polls') || '[]');
    
    archives.push({
        id: Date.now(),
        name: name,
        date: new Date().toISOString(),
        responses: responses,
        totalResponses: responses.length,
        attending: responses.filter(r => r.willAttend === 'yes').length
    });
    
    localStorage.setItem('archived_polls', JSON.stringify(archives));
    if (nameInput) nameInput.value = '';
    loadArchives();
    showSuccess('Poll archived successfully');
}

function startNewPoll() {
    if (confirm('Are you sure? This will clear all current responses. Make sure you have saved the current poll if needed.')) {
        localStorage.setItem('poll_responses', JSON.stringify([]));
        loadData();
        closeModal('pollManagementModal');
        showSuccess('New poll started successfully');
    }
}

function loadArchives() {
    const container = safeGetElement('archivesList');
    if (!container) return;

    const archives = JSON.parse(localStorage.getItem('archived_polls') || '[]');
    
    if (archives.length === 0) {
        container.innerHTML = '<p>No archived polls</p>';
        return;
    }

    container.innerHTML = archives.map(archive => `
        <div class="archive-item">
            <h4>${escapeHtml(archive.name)}</h4>
            <p>Date: ${new Date(archive.date).toLocaleDateString()}</p>
            <p>Responses: ${archive.totalResponses} (${archive.attending} attending)</p>
        </div>
    `).join('');
}

// Settings Functions
function initializeSettings() {
    const btn = safeGetElement('settingsBtn');
    const changePasswordBtn = safeGetElement('changePasswordBtn');

    if (btn) {
        btn.addEventListener('click', () => openModal('settingsModal'));
    }

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', changePassword);
    }
}

function changePassword() {
    const currentInput = safeGetElement('currentPassword');
    const newInput = safeGetElement('newPassword');
    const confirmInput = safeGetElement('confirmPassword');

    const current = currentInput ? currentInput.value : '';
    const newPass = newInput ? newInput.value : '';
    const confirm = confirmInput ? confirmInput.value : '';

    const storedPassword = localStorage.getItem('admin_password') || 'iizukalab';

    if (current !== storedPassword) {
        showError('Current password is incorrect');
        return;
    }

    if (newPass.length < 6) {
        showError('New password must be at least 6 characters');
        return;
    }

    if (newPass !== confirm) {
        showError('New passwords do not match');
        return;
    }

    localStorage.setItem('admin_password', newPass);
    closeModal('settingsModal');
    if (currentInput) currentInput.value = '';
    if (newInput) newInput.value = '';
    if (confirmInput) confirmInput.value = '';
    showSuccess('Password changed successfully');
}

// Logout
function initializeLogout() {
    const btn = safeGetElement('logoutBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('admin_session');
                window.location.href = 'admin-login.html';
            }
        });
    }
}

// Filter and Search Functions
function initializeFilters() {
    const searchInput = safeGetElement('searchInput');
    const attendanceFilter = safeGetElement('attendanceFilter');
    const paymentFilter = safeGetElement('paymentFilter');

    [searchInput, attendanceFilter, paymentFilter].forEach(element => {
        if (element) {
            element.addEventListener('input', applyFilters);
            element.addEventListener('change', applyFilters);
        }
    });
}

function applyFilters() {
    const searchInput = safeGetElement('searchInput');
    const attendanceFilter = safeGetElement('attendanceFilter');
    const paymentFilter = safeGetElement('paymentFilter');

    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const attendanceValue = attendanceFilter ? attendanceFilter.value : 'all';
    const paymentValue = paymentFilter ? paymentFilter.value : 'all';

    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');

    const filtered = responses.filter(response => {
        // Search filter
        if (searchTerm && !response.name.toLowerCase().includes(searchTerm)) {
            return false;
        }

        // Attendance filter
        if (attendanceValue === 'attending' && response.willAttend !== 'yes') {
            return false;
        }
        if (attendanceValue === 'not-attending' && response.willAttend !== 'no') {
            return false;
        }

        // Payment filter
        if (paymentValue === 'paid' && !response.paymentStatus) {
            return false;
        }
        if (paymentValue === 'unpaid' && response.paymentStatus) {
            return false;
        }

        return true;
    });

    updateTable(filtered, settings);
}

// Export Functions
function initializeExports() {
    const csvBtn = safeGetElement('exportCsvBtn');
    const xlsxBtn = safeGetElement('exportXlsxBtn');
    const pdfBtn = safeGetElement('exportPdfBtn');

    if (csvBtn) {
        csvBtn.addEventListener('click', exportCSV);
    }
    if (xlsxBtn) {
        xlsxBtn.addEventListener('click', exportXLSX);
    }
    if (pdfBtn) {
        pdfBtn.addEventListener('click', exportPDF);
    }
}

function exportCSV() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const prices = calculatePrices(responses, settings);

    let csv = 'Name,Attendance,Title,Available Dates,Price,Paid\n';
    
    responses.forEach(r => {
        const price = prices[r.title] || 0;
        const dates = r.availableDates ? r.availableDates.join('; ') : '';
        csv += `"${r.name}","${r.willAttend}","${r.title}","${dates}","${price.toFixed(2)}","${r.paymentStatus ? 'Yes' : 'No'}"\n`;
    });

    downloadFile(csv, 'poll-responses.csv', 'text/csv');
}

function exportXLSX() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const prices = calculatePrices(responses, settings);

    const data = responses.map(r => ({
        Name: r.name,
        Attendance: r.willAttend,
        Title: r.title,
        'Available Dates': r.availableDates ? r.availableDates.join(', ') : '',
        Price: prices[r.title] || 0,
        Paid: r.paymentStatus ? 'Yes' : 'No'
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    XLSX.writeFile(wb, 'poll-responses.xlsx');
}

function exportPDF() {
    showError('PDF export requires jsPDF library. Please use XLSX or CSV export.');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    // Check authentication first
    if (!checkAuth()) {
        return;
    }

    // Initialize storage
    initializeStorage();

    // Initialize all components
    initializeModals();
    initializePollTitle();
    initializePriceSettings();
    initializePollManagement();
    initializeSettings();
    initializeLogout();
    initializeFilters();
    initializeExports();

    // Load initial data
    loadData();

    console.log('Admin dashboard initialized successfully');
});
