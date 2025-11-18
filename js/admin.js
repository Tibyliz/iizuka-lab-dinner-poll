/**
 * Admin Dashboard Logic - Firebase Version
 * Complete dashboard with real-time updates, charts, and all features
 */

// ============================================
// GLOBAL VARIABLES
// ============================================

let allResponses = [];
let config = {};
let attendanceChart = null;
let datePopularityChart = null;
let currentEditingId = null;

// ============================================
// AUTHENTICATION CHECK
// ============================================

const SESSION_KEY = 'adminLoggedIn';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function checkAuth() {
    const isLoggedIn = sessionStorage.getItem(SESSION_KEY) === 'true';
    const loginTime = sessionStorage.getItem('loginTime');
    const now = Date.now();
    
    if (!isLoggedIn || !loginTime || (now - parseInt(loginTime)) > SESSION_DURATION) {
        console.log('[Admin] Not authenticated, redirecting to login...');
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem('loginTime');
    window.location.href = 'admin-login.html';
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', async function() {
    console.log('[Admin] Dashboard initializing...');
    
    // Check authentication
    if (!checkAuth()) return;
    
    try {
        // Test Firebase connection
        await api.testConnection();
        
        // Initialize default config
        config = await api.initializeDefaultConfig();
        
        // Load all data
        await loadDashboard();
        
        // Setup real-time listeners
        setupRealtimeUpdates();
        
        // Setup event handlers
        setupEventHandlers();
        
        // Hide loading, show dashboard
        document.getElementById('loadingScreen').style.display = 'none';
        document.getElementById('dashboardContent').style.display = 'block';
        
        console.log('[Admin] ✅ Dashboard initialized successfully!');
        
    } catch (error) {
        console.error('[Admin] ❌ Initialization error:', error);
        alert('Failed to load dashboard. Please check Firebase configuration and try again.');
    }
});

// ============================================
// LOAD DASHBOARD DATA
// ============================================

async function loadDashboard() {
    console.log('[Admin] Loading dashboard data...');
    
    // Load responses
    allResponses = await api.getAllResponses();
    console.log(`[Admin] Loaded ${allResponses.length} responses`);
    
    // Load config
    config = await api.getConfig();
    console.log('[Admin] Config loaded:', config);
    
    // Update UI
    updateStatistics();
    updateCharts();
    renderResponsesTable();
    loadConfigToUI();
    loadArchives();
}

// ============================================
// REAL-TIME UPDATES
// ============================================

function setupRealtimeUpdates() {
    console.log('[Admin] Setting up real-time listeners...');
    
    // Listen for response changes
    api.onResponsesChange((responses) => {
        console.log('[Admin] 🔄 Real-time update: Responses changed');
        allResponses = responses;
        updateStatistics();
        updateCharts();
        renderResponsesTable();
    });
    
    // Listen for config changes
    api.onConfigChange((newConfig) => {
        console.log('[Admin] 🔄 Real-time update: Config changed');
        config = newConfig;
        loadConfigToUI();
    });
}

// ============================================
// STATISTICS
// ============================================

function updateStatistics() {
    const total = allResponses.length;
    const attending = allResponses.filter(r => r.attendance === "Yes, I'll attend").length;
    const notAttending = total - attending;
    
    document.getElementById('totalResponses').textContent = total;
    document.getElementById('totalAttending').textContent = attending;
    document.getElementById('totalNotAttending').textContent = notAttending;
    
    // Calculate total cost
    const totalCost = calculateTotalCost();
    document.getElementById('totalCost').textContent = `¥${totalCost.toLocaleString()}`;
}

function calculateTotalCost() {
    const basePrice = parseFloat(config.basePrice) || 10000;
    const attendingResponses = allResponses.filter(r => r.attendance === "Yes, I'll attend");
    
    const percents = {
        'Bachelor Student': parseFloat(config.bachelorPercent) || 15,
        "Master's Student": parseFloat(config.masterPercent) || 20,
        'PhD Student': parseFloat(config.phdPercent) || 30,
        'Faculty/Staff': parseFloat(config.facultyPercent) || 35
    };
    
    // Count by position
    const counts = {};
    attendingResponses.forEach(r => {
        counts[r.position] = (counts[r.position] || 0) + 1;
    });
    
    // Calculate total percentage needed
    const totalPercent = Object.keys(counts).reduce((sum, position) => {
        return sum + (percents[position] * counts[position]);
    }, 0);
    
    // If total percent is 0, no cost
    if (totalPercent === 0) return 0;
    
    // Calculate actual cost per person
    let totalCost = 0;
    attendingResponses.forEach(r => {
        if (r.customAmount !== null && r.customAmount !== undefined && r.isEdited) {
            totalCost += parseFloat(r.customAmount);
        } else {
            const percent = percents[r.position] || 0;
            const cost = (basePrice * percent) / totalPercent;
            totalCost += cost;
        }
    });
    
    return Math.round(totalCost);
}

function calculateIndividualAmount(response) {
    if (response.customAmount !== null && response.customAmount !== undefined && response.isEdited) {
        return parseFloat(response.customAmount);
    }
    
    if (response.attendance !== "Yes, I'll attend") {
        return 0;
    }
    
    const basePrice = parseFloat(config.basePrice) || 10000;
    const attendingResponses = allResponses.filter(r => r.attendance === "Yes, I'll attend");
    
    const percents = {
        'Bachelor Student': parseFloat(config.bachelorPercent) || 15,
        "Master's Student": parseFloat(config.masterPercent) || 20,
        'PhD Student': parseFloat(config.phdPercent) || 30,
        'Faculty/Staff': parseFloat(config.facultyPercent) || 35
    };
    
    const counts = {};
    attendingResponses.forEach(r => {
        counts[r.position] = (counts[r.position] || 0) + 1;
    });
    
    const totalPercent = Object.keys(counts).reduce((sum, position) => {
        return sum + (percents[position] * counts[position]);
    }, 0);
    
    if (totalPercent === 0) return 0;
    
    const percent = percents[response.position] || 0;
    return Math.round((basePrice * percent) / totalPercent);
}

// ============================================
// CHARTS
// ============================================

function updateCharts() {
    updateAttendanceChart();
    updateDatePopularityChart();
}

function updateAttendanceChart() {
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    
    // Count by position (attending only)
    const attendingResponses = allResponses.filter(r => r.attendance === "Yes, I'll attend");
    const counts = {
        'Bachelor Student': 0,
        "Master's Student": 0,
        'PhD Student': 0,
        'Faculty/Staff': 0
    };
    
    attendingResponses.forEach(r => {
        if (counts.hasOwnProperty(r.position)) {
            counts[r.position]++;
        }
    });
    
    // Destroy old chart
    if (attendanceChart) {
        attendanceChart.destroy();
    }
    
    // Create new chart
    attendanceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f39c12',
                    '#e74c3c'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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

function updateDatePopularityChart() {
    const ctx = document.getElementById('datePopularityChart').getContext('2d');
    
    // Get available dates
    const datesString = config.availableDates || '';
    if (!datesString) {
        if (datePopularityChart) datePopularityChart.destroy();
        ctx.canvas.parentElement.querySelector('canvas').style.display = 'none';
        return;
    }
    
    ctx.canvas.style.display = 'block';
    
    const availableDates = datesString.split(',').map(d => d.trim()).filter(d => d);
    
    // Count how many people selected each date
    const dateCounts = {};
    availableDates.forEach(date => {
        dateCounts[date] = 0;
    });
    
    allResponses.forEach(response => {
        if (!response.selectedDates) return;
        const selectedDates = response.selectedDates.split(',').map(d => d.trim());
        selectedDates.forEach(date => {
            if (dateCounts.hasOwnProperty(date)) {
                dateCounts[date]++;
            }
        });
    });
    
    // Format dates for display
    const labels = availableDates.map(date => formatDateShort(date));
    const data = availableDates.map(date => dateCounts[date]);
    
    // Destroy old chart
    if (datePopularityChart) {
        datePopularityChart.destroy();
    }
    
    // Create new chart
    datePopularityChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of People',
                data: data,
                backgroundColor: '#667eea',
                borderColor: '#5568d3',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
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

function formatDateShort(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
        return dateString;
    }
}

// ============================================
// RESPONSES TABLE
// ============================================

function renderResponsesTable() {
    const tbody = document.getElementById('responsesTableBody');
    
    if (allResponses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="no-data">No responses yet</td></tr>';
        return;
    }
    
    // Get filter values
    const positionFilter = document.getElementById('positionFilter').value;
    const paymentFilter = document.getElementById('paymentFilter').value;
    
    // Filter responses
    let filteredResponses = allResponses;
    
    if (positionFilter !== 'all') {
        filteredResponses = filteredResponses.filter(r => r.position === positionFilter);
    }
    
    if (paymentFilter === 'paid') {
        filteredResponses = filteredResponses.filter(r => r.paymentStatus === true);
    } else if (paymentFilter === 'unpaid') {
        filteredResponses = filteredResponses.filter(r => r.paymentStatus !== true);
    }
    
    tbody.innerHTML = filteredResponses.map(response => {
        const amount = calculateIndividualAmount(response);
        const amountClass = response.isEdited ? 'amount-cell edited' : 'amount-cell';
        const editIcon = response.isEdited ? '<i class="fas fa-edit"></i>' : '';
        
        return `
            <tr>
                <td><strong>${response.name}</strong></td>
                <td>
                    ${response.attendance === "Yes, I'll attend" 
                        ? '<span style="color: #2ecc71;"><i class="fas fa-check-circle"></i> Yes</span>'
                        : '<span style="color: #e74c3c;"><i class="fas fa-times-circle"></i> No</span>'
                    }
                </td>
                <td>${response.position}</td>
                <td>${response.selectedDates || '-'}</td>
                <td>
                    <span class="${amountClass}" onclick="openEditAmountModal('${response.id}')">
                        ¥${amount.toLocaleString()} ${editIcon}
                    </span>
                </td>
                <td>
                    <input type="checkbox" class="payment-checkbox" 
                           ${response.paymentStatus ? 'checked' : ''} 
                           onchange="togglePayment('${response.id}', this.checked)">
                </td>
                <td>
                    <button class="action-btn delete" onclick="deleteResponse('${response.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function togglePayment(id, paid) {
    try {
        await api.updateResponse(id, { paymentStatus: paid });
        console.log(`[Admin] Payment status updated for ${id}`);
    } catch (error) {
        console.error('[Admin] Error updating payment:', error);
        alert('Failed to update payment status');
    }
}

async function deleteResponse(id) {
    if (!confirm('Are you sure you want to delete this response?')) return;
    
    try {
        await api.deleteResponse(id);
        console.log(`[Admin] Response deleted: ${id}`);
    } catch (error) {
        console.error('[Admin] Error deleting response:', error);
        alert('Failed to delete response');
    }
}

// ============================================
// EDIT AMOUNT MODAL
// ============================================

function openEditAmountModal(id) {
    const response = allResponses.find(r => r.id === id);
    if (!response) return;
    
    currentEditingId = id;
    
    document.getElementById('editName').textContent = response.name;
    const currentAmount = response.customAmount !== null && response.customAmount !== undefined && response.isEdited
        ? response.customAmount
        : calculateIndividualAmount(response);
    document.getElementById('editAmount').value = currentAmount;
    
    document.getElementById('editAmountModal').classList.add('show');
}

function closeEditAmountModal() {
    document.getElementById('editAmountModal').classList.remove('show');
    currentEditingId = null;
}

document.getElementById('saveAmountBtn').addEventListener('click', async function() {
    if (!currentEditingId) return;
    
    const newAmount = document.getElementById('editAmount').value;
    
    try {
        if (newAmount === '' || newAmount === null) {
            // Reset to default
            await api.updateResponse(currentEditingId, {
                customAmount: null,
                isEdited: false
            });
        } else {
            // Set custom amount
            await api.updateResponse(currentEditingId, {
                customAmount: parseFloat(newAmount),
                isEdited: true
            });
        }
        
        closeEditAmountModal();
        console.log('[Admin] Amount updated');
    } catch (error) {
        console.error('[Admin] Error updating amount:', error);
        alert('Failed to update amount');
    }
});

// Close modal on outside click
document.getElementById('editAmountModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeEditAmountModal();
    }
});

// ============================================
// PRICING CONFIGURATION
// ============================================

function loadConfigToUI() {
    document.getElementById('pollTitle').value = config.pollTitle || 'Iizuka Lab Dinner Poll';
    document.getElementById('basePrice').value = config.basePrice || 10000;
    document.getElementById('bachelorPercent').value = config.bachelorPercent || 15;
    document.getElementById('masterPercent').value = config.masterPercent || 20;
    document.getElementById('phdPercent').value = config.phdPercent || 30;
    document.getElementById('facultyPercent').value = config.facultyPercent || 35;
    document.getElementById('startDate').value = config.startDate || '';
    document.getElementById('endDate').value = config.endDate || '';
    
    updatePercentageDisplays();
}

function updatePercentageDisplays() {
    document.getElementById('bachelorPercentValue').textContent = document.getElementById('bachelorPercent').value;
    document.getElementById('masterPercentValue').textContent = document.getElementById('masterPercent').value;
    document.getElementById('phdPercentValue').textContent = document.getElementById('phdPercent').value;
    document.getElementById('facultyPercentValue').textContent = document.getElementById('facultyPercent').value;
}

// ============================================
// DATE RANGE GENERATION
// ============================================

document.getElementById('generateDatesBtn').addEventListener('click', function() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        alert('Please select both start and end dates');
        return;
    }
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
        alert('Start date must be before end date');
        return;
    }
    
    const dates = [];
    const currentDate = new Date(start);
    
    while (currentDate <= end) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const datePreview = document.getElementById('datePreview');
    const datePreviewText = document.getElementById('datePreviewText');
    
    datePreviewText.textContent = `${dates.length} dates from ${formatDateShort(startDate)} to ${formatDateShort(endDate)}`;
    datePreview.style.display = 'block';
    
    config.availableDates = dates.join(',');
    
    console.log('[Admin] Generated dates:', dates);
});

// ============================================
// SAVE CONFIGURATIONS
// ============================================

document.getElementById('savePricingBtn').addEventListener('click', async function() {
    try {
        const updates = {
            basePrice: parseFloat(document.getElementById('basePrice').value),
            bachelorPercent: parseFloat(document.getElementById('bachelorPercent').value),
            masterPercent: parseFloat(document.getElementById('masterPercent').value),
            phdPercent: parseFloat(document.getElementById('phdPercent').value),
            facultyPercent: parseFloat(document.getElementById('facultyPercent').value)
        };
        
        await api.updateConfig(updates);
        alert('✅ Pricing configuration saved!');
        console.log('[Admin] Pricing saved');
    } catch (error) {
        console.error('[Admin] Error saving pricing:', error);
        alert('Failed to save pricing configuration');
    }
});

document.getElementById('savePollConfigBtn').addEventListener('click', async function() {
    try {
        const updates = {
            pollTitle: document.getElementById('pollTitle').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            availableDates: config.availableDates || ''
        };
        
        await api.updateConfig(updates);
        alert('✅ Poll configuration saved!');
        console.log('[Admin] Poll config saved');
    } catch (error) {
        console.error('[Admin] Error saving poll config:', error);
        alert('Failed to save poll configuration');
    }
});

// ============================================
// ARCHIVE MANAGEMENT
// ============================================

async function loadArchives() {
    try {
        const archives = await api.getAllArchives();
        const container = document.getElementById('archivesList');
        
        if (archives.length === 0) {
            container.innerHTML = '<p class="no-data">No archives yet</p>';
            return;
        }
        
        container.innerHTML = archives.map(archive => `
            <div class="archive-item">
                <div class="archive-info">
                    <h3><i class="fas fa-folder"></i> ${archive.archiveName}</h3>
                    <p><i class="fas fa-clock"></i> ${new Date(archive.createdDate).toLocaleString()}</p>
                </div>
                <div class="archive-actions">
                    <button class="archive-btn restore" onclick="restoreArchive('${archive.id}')">
                        <i class="fas fa-undo"></i> Restore
                    </button>
                    <button class="archive-btn delete" onclick="deleteArchive('${archive.id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('[Admin] Error loading archives:', error);
    }
}

document.getElementById('saveArchiveBtn').addEventListener('click', async function() {
    const name = prompt('Enter archive name:', `${config.pollTitle} - ${new Date().toLocaleDateString()}`);
    if (!name) return;
    
    try {
        const archiveData = {
            responses: allResponses,
            config: config
        };
        
        await api.saveArchive(name, archiveData);
        alert('✅ Archive saved successfully!');
        await loadArchives();
        console.log('[Admin] Archive saved');
    } catch (error) {
        console.error('[Admin] Error saving archive:', error);
        alert('Failed to save archive');
    }
});

async function restoreArchive(id) {
    if (!confirm('This will replace all current data with the archived data. Continue?')) return;
    
    try {
        await api.restoreArchive(id);
        alert('✅ Archive restored successfully!');
        await loadDashboard();
        console.log('[Admin] Archive restored');
    } catch (error) {
        console.error('[Admin] Error restoring archive:', error);
        alert('Failed to restore archive');
    }
}

async function deleteArchive(id) {
    if (!confirm('Are you sure you want to delete this archive?')) return;
    
    try {
        await api.deleteArchive(id);
        await loadArchives();
        console.log('[Admin] Archive deleted');
    } catch (error) {
        console.error('[Admin] Error deleting archive:', error);
        alert('Failed to delete archive');
    }
}

document.getElementById('startNewVoteBtn').addEventListener('click', async function() {
    const confirmed = confirm(
        'This will:\n' +
        '1. Save current poll to archives\n' +
        '2. Clear all current responses\n' +
        '3. Start with a fresh poll\n\n' +
        'Continue?'
    );
    
    if (!confirmed) return;
    
    try {
        // Save to archive first
        const archiveName = `${config.pollTitle} - ${new Date().toLocaleString()}`;
        const archiveData = {
            responses: allResponses,
            config: config
        };
        
        await api.saveArchive(archiveName, archiveData);
        
        // Clear all responses
        await api.clearAllResponses();
        
        alert('✅ New vote started! Previous data saved to archives.');
        await loadDashboard();
        console.log('[Admin] Started new vote');
    } catch (error) {
        console.error('[Admin] Error starting new vote:', error);
        alert('Failed to start new vote');
    }
});

// ============================================
// EXPORT FUNCTIONS
// ============================================

document.getElementById('exportExcelBtn').addEventListener('click', function() {
    exportToExcel();
});

document.getElementById('exportPDFBtn').addEventListener('click', function() {
    exportToPDF();
});

document.getElementById('exportCSVBtn').addEventListener('click', function() {
    exportToCSV();
});

function exportToExcel() {
    const data = allResponses.map(r => ({
        'Name': r.name,
        'Attendance': r.attendance,
        'Position': r.position,
        'Selected Dates': r.selectedDates || '-',
        'Amount': calculateIndividualAmount(r),
        'Payment Status': r.paymentStatus ? 'Paid' : 'Unpaid',
        'Timestamp': new Date(r.timestamp).toLocaleString()
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    
    XLSX.writeFile(wb, `poll-responses-${Date.now()}.xlsx`);
    console.log('[Admin] Exported to Excel');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.text(config.pollTitle || 'Poll Responses', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 22);
    
    const tableData = allResponses.map(r => [
        r.name,
        r.attendance,
        r.position,
        calculateIndividualAmount(r),
        r.paymentStatus ? 'Paid' : 'Unpaid'
    ]);
    
    doc.autoTable({
        startY: 28,
        head: [['Name', 'Attendance', 'Position', 'Amount', 'Payment']],
        body: tableData
    });
    
    doc.save(`poll-responses-${Date.now()}.pdf`);
    console.log('[Admin] Exported to PDF');
}

function exportToCSV() {
    const headers = ['Name', 'Attendance', 'Position', 'Selected Dates', 'Amount', 'Payment Status', 'Timestamp'];
    const rows = allResponses.map(r => [
        r.name,
        r.attendance,
        r.position,
        r.selectedDates || '-',
        calculateIndividualAmount(r),
        r.paymentStatus ? 'Paid' : 'Unpaid',
        new Date(r.timestamp).toLocaleString()
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poll-responses-${Date.now()}.csv`;
    a.click();
    
    console.log('[Admin] Exported to CSV');
}

// ============================================
// EVENT HANDLERS SETUP
// ============================================

function setupEventHandlers() {
    // Filters
    document.getElementById('positionFilter').addEventListener('change', renderResponsesTable);
    document.getElementById('paymentFilter').addEventListener('change', renderResponsesTable);
    
    // Pricing sliders
    document.getElementById('bachelorPercent').addEventListener('input', updatePercentageDisplays);
    document.getElementById('masterPercent').addEventListener('input', updatePercentageDisplays);
    document.getElementById('phdPercent').addEventListener('input', updatePercentageDisplays);
    document.getElementById('facultyPercent').addEventListener('input', updatePercentageDisplays);
}

// ============================================
// CLEANUP ON PAGE UNLOAD
// ============================================

window.addEventListener('beforeunload', function() {
    api.offResponsesChange();
    api.offConfigChange();
});

console.log('[Admin] Script loaded');
