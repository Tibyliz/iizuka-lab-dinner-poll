// Admin Dashboard Logic with Editable Pricing
console.log('[Admin] Script loaded');

// Check authentication
if (sessionStorage.getItem('adminLoggedIn') !== 'true') {
    console.log('[Admin] Not logged in, redirecting...');
    window.location.href = 'admin-login.html';
}

// Global variables
let responses = [];
let config = null;
let charts = {};

// DOM Elements
const loadingMessage = document.getElementById('loading-message');
const dashboardContent = document.getElementById('dashboard-content');

// Initialize dashboard
async function initializeDashboard() {
    try {
        console.log('[Admin] Initializing dashboard...');
        
        await firebaseAPI.initializeConfig();
        await loadAllData();
        setupEventListeners();
        setupPricingControls();
        
        loadingMessage.style.display = 'none';
        dashboardContent.style.display = 'block';
        
        console.log('[Admin] Dashboard ready');
        
    } catch (error) {
        console.error('[Admin] Initialization error:', error);
        alert('Failed to load dashboard. Please check your Firebase configuration.');
    }
}

// Load all data
async function loadAllData() {
    config = await firebaseAPI.getConfig();
    responses = await firebaseAPI.getAllResponses();
    
    console.log('[Admin] Loaded', responses.length, 'responses');
    
    updateStatistics();
    renderCharts();
    renderResponsesTable();
    loadConfigToForm();
    loadArchives();
}

// Update statistics cards
function updateStatistics() {
    const totalResponses = responses.length;
    const attending = responses.filter(r => r.attendance === 'Yes, I\'ll attend').length;
    const totalCost = calculateTotalCost();
    
    document.getElementById('total-responses').textContent = totalResponses;
    document.getElementById('attending-count').textContent = attending;
    document.getElementById('total-cost').textContent = `¥${totalCost.toLocaleString()}`;
}

// Calculate total cost
function calculateTotalCost() {
    const basePrice = parseInt(config.basePrice) || 10000;
    const pricing = config.pricing || {};
    
    let total = 0;
    
    responses.filter(r => r.attendance === 'Yes, I\'ll attend').forEach(response => {
        if (response.customAmount) {
            total += response.customAmount;
        } else {
            const percentage = getPositionPercentage(response.position, pricing);
            total += basePrice * (percentage / 100);
        }
    });
    
    return Math.round(total);
}

// Get percentage for position
function getPositionPercentage(position, pricing) {
    const map = {
        'Bachelor Student': pricing.bachelor || 15,
        'Master\'s Student': pricing.master || 20,
        'PhD Student': pricing.phd || 30,
        'Faculty/Staff': pricing.faculty || 35
    };
    return map[position] || 0;
}

// Render charts
function renderCharts() {
    renderAttendanceChart();
    renderDatePopularityChart();
}

// Render attendance breakdown chart
function renderAttendanceChart() {
    const positions = {};
    responses.filter(r => r.attendance === 'Yes, I\'ll attend').forEach(r => {
        positions[r.position] = (positions[r.position] || 0) + 1;
    });
    
    const ctx = document.getElementById('attendance-chart');
    if (charts.attendance) charts.attendance.destroy();
    
    charts.attendance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(positions),
            datasets: [{
                data: Object.values(positions),
                backgroundColor: ['#667eea', '#764ba2', '#48bb78', '#ed8936']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true
        }
    });
}

// Render date popularity chart
function renderDatePopularityChart() {
    const dateCounts = {};
    
    responses.filter(r => r.attendance === 'Yes, I\'ll attend').forEach(response => {
        if (response.selectedDates) {
            response.selectedDates.split(',').forEach(date => {
                const trimmed = date.trim();
                if (trimmed) {
                    dateCounts[trimmed] = (dateCounts[trimmed] || 0) + 1;
                }
            });
        }
    });
    
    const sortedDates = Object.keys(dateCounts).sort();
    const counts = sortedDates.map(date => dateCounts[date]);
    
    const ctx = document.getElementById('date-popularity-chart');
    if (charts.datePopularity) charts.datePopularity.destroy();
    
    charts.datePopularity = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedDates.map(d => formatDate(d)),
            datasets: [{
                label: 'Number of People',
                data: counts,
                backgroundColor: '#667eea'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1 }
                }
            }
        }
    });
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Render responses table
function renderResponsesTable() {
    const tbody = document.getElementById('responses-tbody');
    tbody.innerHTML = '';
    
    const basePrice = parseInt(config.basePrice) || 10000;
    const pricing = config.pricing || {};
    
    responses.forEach(response => {
        const row = tbody.insertRow();
        
        row.insertCell().textContent = response.name;
        row.insertCell().textContent = response.attendance;
        row.insertCell().textContent = response.position;
        row.insertCell().textContent = response.selectedDates || '-';
        
        // Amount cell (editable)
        const amountCell = row.insertCell();
        if (response.attendance === 'Yes, I\'ll attend') {
            const amount = response.customAmount || 
                Math.round(basePrice * (getPositionPercentage(response.position, pricing) / 100));
            amountCell.textContent = `¥${amount.toLocaleString()}`;
            amountCell.className = response.isEdited ? 'amount-cell custom' : 'amount-cell';
            amountCell.onclick = () => editAmount(response);
            if (response.isEdited) {
                amountCell.title = 'Custom amount (edited)';
                amountCell.innerHTML += ' <i class="fas fa-edit"></i>';
            }
        } else {
            amountCell.textContent = '-';
        }
        
        // Payment checkbox
        const paymentCell = row.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'payment-checkbox';
        checkbox.checked = response.paymentStatus;
        checkbox.onchange = () => togglePayment(response.id, checkbox.checked);
        paymentCell.appendChild(checkbox);
        
        // Timestamp
        const date = new Date(response.timestamp);
        row.insertCell().textContent = date.toLocaleString();
    });
}

// Edit amount modal
function editAmount(response) {
    const modal = document.getElementById('edit-amount-modal');
    const input = document.getElementById('edit-amount-input');
    const nameDisplay = document.getElementById('edit-amount-name');
    
    const basePrice = parseInt(config.basePrice) || 10000;
    const pricing = config.pricing || {};
    const defaultAmount = Math.round(basePrice * (getPositionPercentage(response.position, pricing) / 100));
    
    nameDisplay.textContent = `Editing amount for: ${response.name}`;
    input.value = response.customAmount || defaultAmount;
    modal.style.display = 'flex';
    
    document.getElementById('save-amount-btn').onclick = async () => {
        const newAmount = parseInt(input.value);
        await firebaseAPI.updateResponse(response.id, {
            customAmount: newAmount,
            isEdited: true
        });
        modal.style.display = 'none';
        await loadAllData();
    };
    
    document.getElementById('reset-amount-btn').onclick = async () => {
        await firebaseAPI.updateResponse(response.id, {
            customAmount: null,
            isEdited: false
        });
        modal.style.display = 'none';
        await loadAllData();
    };
    
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.onclick = () => modal.style.display = 'none';
    });
}

// Toggle payment status
async function togglePayment(responseId, status) {
    await firebaseAPI.updateResponse(responseId, { paymentStatus: status });
    await loadAllData();
}

// Setup pricing controls (sliders + inputs)
function setupPricingControls() {
    const positions = ['bachelor', 'master', 'phd', 'faculty'];
    
    positions.forEach(position => {
        const slider = document.getElementById(`${position}-percentage`);
        const input = document.getElementById(`${position}-percentage-input`);
        
        // Set initial values
        const value = config.pricing?.[position] || 0;
        slider.value = value;
        input.value = value;
        
        // Two-way binding: slider → input
        slider.addEventListener('input', () => {
            input.value = slider.value;
            updateAmountDisplay(position);
            updateTotalPercentage();
        });
        
        // Two-way binding: input → slider
        input.addEventListener('input', () => {
            const value = parseFloat(input.value);
            if (value >= 0 && value <= 100) {
                slider.value = value;
                updateAmountDisplay(position);
                updateTotalPercentage();
            }
        });
    });
    
    // Base price changes
    document.getElementById('base-price').addEventListener('input', () => {
        positions.forEach(pos => updateAmountDisplay(pos));
    });
    
    updateAllAmountDisplays();
    updateTotalPercentage();
}

// Update amount display for a position
function updateAmountDisplay(position) {
    const basePrice = parseInt(document.getElementById('base-price').value) || 10000;
    const percentage = parseFloat(document.getElementById(`${position}-percentage-input`).value);
    const amount = Math.round(basePrice * (percentage / 100));
    document.getElementById(`${position}-amount`).textContent = `¥${amount.toLocaleString()}`;
}

// Update all amount displays
function updateAllAmountDisplays() {
    ['bachelor', 'master', 'phd', 'faculty'].forEach(pos => updateAmountDisplay(pos));
}

// Update total percentage validation
function updateTotalPercentage() {
    const total = ['bachelor', 'master', 'phd', 'faculty']
        .reduce((sum, pos) => {
            return sum + parseFloat(document.getElementById(`${pos}-percentage-input`).value || 0);
        }, 0);
    
    const totalDisplay = document.getElementById('total-percentage');
    const validationIcon = document.getElementById('total-validation');
    
    totalDisplay.textContent = total.toFixed(1);
    
    if (Math.abs(total - 100) < 0.01) {
        validationIcon.className = 'validation-icon valid';
        validationIcon.title = 'Valid: Total is 100%';
    } else {
        validationIcon.className = 'validation-icon invalid';
        validationIcon.title = `Invalid: Total is ${total.toFixed(1)}%, should be 100%`;
    }
}

// Load config to form
function loadConfigToForm() {
    document.getElementById('poll-title').value = config.pollTitle || '';
    document.getElementById('start-date').value = config.startDate || '';
    document.getElementById('end-date').value = config.endDate || '';
    document.getElementById('base-price').value = config.basePrice || 10000;
    
    if (config.startDate && config.endDate) {
        updateDatesPreview();
    }
}

// Update dates preview
function updateDatesPreview() {
    const start = document.getElementById('start-date').value;
    const end = document.getElementById('end-date').value;
    
    if (start && end) {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
        
        document.getElementById('dates-preview').textContent = 
            `${days} dates from ${formatDate(start)} to ${formatDate(end)}`;
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('adminLoggedIn');
        window.location.href = 'admin-login.html';
    });
    
    document.getElementById('refresh-btn').addEventListener('click', loadAllData);
    
    document.getElementById('save-pricing-btn').addEventListener('click', async () => {
        const pricing = {
            bachelor: parseFloat(document.getElementById('bachelor-percentage-input').value),
            master: parseFloat(document.getElementById('master-percentage-input').value),
            phd: parseFloat(document.getElementById('phd-percentage-input').value),
            faculty: parseFloat(document.getElementById('faculty-percentage-input').value)
        };
        
        const basePrice = parseInt(document.getElementById('base-price').value);
        
        await firebaseAPI.updateConfig({ pricing, basePrice });
        alert('Pricing saved successfully!');
        await loadAllData();
    });
    
    document.getElementById('save-config-btn').addEventListener('click', async () => {
        const pollTitle = document.getElementById('poll-title').value;
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        
        let availableDates = config.availableDates || '';
        
        await firebaseAPI.updateConfig({ pollTitle, startDate, endDate, availableDates });
        alert('Configuration saved!');
        await loadAllData();
    });
    
    document.getElementById('generate-dates-btn').addEventListener('click', async () => {
        const start = document.getElementById('start-date').value;
        const end = document.getElementById('end-date').value;
        
        if (!start || !end) {
            alert('Please select both start and end dates');
            return;
        }
        
        const dates = generateDateRange(start, end);
        await firebaseAPI.updateConfig({ availableDates: dates.join(',') });
        alert(`Generated ${dates.length} dates!`);
        updateDatesPreview();
    });
    
    document.getElementById('start-date').addEventListener('change', updateDatesPreview);
    document.getElementById('end-date').addEventListener('change', updateDatesPreview);
    
    document.getElementById('start-new-vote-btn').addEventListener('click', startNewVote);
    document.getElementById('save-archive-btn').addEventListener('click', saveArchive);
    
    document.getElementById('export-xlsx-btn').addEventListener('click', exportXLSX);
    document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
    document.getElementById('export-csv-btn').addEventListener('click', exportCSV);
}

// Generate date range
function generateDateRange(start, end) {
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
    }
    
    return dates;
}

// Start new vote
async function startNewVote() {
    if (!confirm('This will archive current poll and clear all responses. Continue?')) return;
    
    const archiveName = prompt('Archive name:', `${config.pollTitle} - ${new Date().toLocaleDateString()}`);
    if (!archiveName) return;
    
    await firebaseAPI.saveArchive(archiveName, { responses, config });
    await firebaseAPI.clearAllResponses();
    alert('New vote started! Previous data archived.');
    await loadAllData();
}

// Save archive
async function saveArchive() {
    const archiveName = prompt('Archive name:', `${config.pollTitle} - ${new Date().toLocaleDateString()}`);
    if (!archiveName) return;
    
    await firebaseAPI.saveArchive(archiveName, { responses, config });
    alert('Archive saved successfully!');
    await loadArchives();
}

// Load archives
async function loadArchives() {
    const archives = await firebaseAPI.getAllArchives();
    const container = document.getElementById('archives-list');
    container.innerHTML = '';
    
    archives.forEach(archive => {
        const div = document.createElement('div');
        div.className = 'archive-item';
        div.innerHTML = `
            <div class="archive-info">
                <h3>${archive.archiveName}</h3>
                <p>${new Date(archive.createdDate).toLocaleString()} | 
                   ${archive.archiveData.responses?.length || 0} responses</p>
            </div>
            <div class="archive-actions">
                <button class="btn btn-secondary" onclick="viewArchive('${archive.id}')">
                    <i class="fas fa-eye"></i> View
                </button>
                <button class="btn btn-primary" onclick="exportArchive('${archive.id}')">
                    <i class="fas fa-download"></i> Export
                </button>
                <button class="btn btn-secondary" onclick="deleteArchive('${archive.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// Export functions
function exportXLSX() {
    const data = responses.map(r => ({
        Name: r.name,
        Attendance: r.attendance,
        Position: r.position,
        'Selected Dates': r.selectedDates || '-',
        'Payment Status': r.paymentStatus ? 'Paid' : 'Not Paid',
        Timestamp: new Date(r.timestamp).toLocaleString()
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    XLSX.writeFile(wb, `poll-responses-${Date.now()}.xlsx`);
}

function exportPDF() {
    alert('PDF export functionality - Use browser print to PDF for now');
    window.print();
}

function exportCSV() {
    const headers = ['Name', 'Attendance', 'Position', 'Selected Dates', 'Payment Status', 'Timestamp'];
    const rows = responses.map(r => [
        r.name,
        r.attendance,
        r.position,
        r.selectedDates || '-',
        r.paymentStatus ? 'Paid' : 'Not Paid',
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
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}
