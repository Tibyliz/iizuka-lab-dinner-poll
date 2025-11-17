// Admin Dashboard JavaScript

let chartInstance = null;
let currentFilter = 'all';

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuth();
    
    // Initialize admin settings
    initializeAdminSettings();
    
    // Load and display data
    loadCurrentPollName();
    loadResponses();
    loadStatistics();
    renderChart();
    
    // Setup real-time percentage calculation
    setupPercentageCalculation();
});

// Check if user is authenticated
function checkAuth() {
    const session = localStorage.getItem('admin_session');
    if (!session) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    const sessionData = JSON.parse(session);
    const now = Date.now();
    
    // Check if session is still valid (24 hours)
    if (now - sessionData.timestamp >= 24 * 60 * 60 * 1000) {
        localStorage.removeItem('admin_session');
        window.location.href = 'admin-login.html';
    }
}

// Initialize admin settings
function initializeAdminSettings() {
    if (!localStorage.getItem('admin_settings')) {
        const defaultSettings = {
            password: 'iizukalab',
            totalCost: 0,
            masterPercent: 20,
            doctoralPercent: 30,
            staffPercent: 50,
            currentPollName: 'Default Poll'
        };
        localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
    }
}

// Load current poll name
function loadCurrentPollName() {
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    document.getElementById('currentPollBadge').textContent = `Current Poll: ${settings.currentPollName}`;
}

// Logout
function logout() {
    localStorage.removeItem('admin_session');
    window.location.href = 'admin-login.html';
}

// Load responses
function loadResponses() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const tbody = document.getElementById('responsesTableBody');
    
    if (responses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                    No responses yet
                </td>
            </tr>
        `;
        return;
    }
    
    // Clear existing rows
    tbody.innerHTML = '';
    
    // Get price settings
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    const prices = calculatePrices(responses, settings);
    
    // Filter responses
    let filteredResponses = responses;
    if (currentFilter === 'attending') {
        filteredResponses = responses.filter(r => r.willAttend === 'yes');
    } else if (currentFilter === 'not-attending') {
        filteredResponses = responses.filter(r => r.willAttend === 'no');
    } else if (currentFilter === 'paid') {
        filteredResponses = responses.filter(r => r.paymentStatus === true);
    } else if (currentFilter === 'unpaid') {
        filteredResponses = responses.filter(r => r.paymentStatus === false);
    }
    
    // Render filtered responses
    filteredResponses.forEach(response => {
        const row = tbody.insertRow();
        
        // Name
        row.insertCell().textContent = response.name;
        
        // Attendance
        const attendanceCell = row.insertCell();
        const attendanceBadge = response.willAttend === 'yes' ? 
            '<span class="badge green">Yes</span>' : 
            '<span class="badge red">No</span>';
        attendanceCell.innerHTML = attendanceBadge;
        
        // Title
        row.insertCell().textContent = response.title;
        
        // Available Dates
        const datesCell = row.insertCell();
        if (response.availableDates && response.availableDates.length > 0) {
            datesCell.textContent = response.availableDates.join(', ');
        } else {
            datesCell.textContent = 'No preference';
            datesCell.style.color = '#999';
            datesCell.style.fontStyle = 'italic';
        }
        
        // Price
        const priceCell = row.insertCell();
        const price = prices[response.title];
        priceCell.textContent = price ? `¥${price.toFixed(2)}` : '-';
        
        // Payment Status
        const paymentCell = row.insertCell();
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'payment-checkbox';
        checkbox.checked = response.paymentStatus || false;
        checkbox.addEventListener('change', () => togglePaymentStatus(response.id, checkbox.checked));
        paymentCell.appendChild(checkbox);
        
        // Submitted At
        const submittedCell = row.insertCell();
        const date = new Date(response.submittedAt);
        submittedCell.textContent = date.toLocaleString();
    });
}

// Toggle payment status
function togglePaymentStatus(responseId, paid) {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const response = responses.find(r => r.id === responseId);
    if (response) {
        response.paymentStatus = paid;
        localStorage.setItem('poll_responses', JSON.stringify(responses));
        loadStatistics();
    }
}

// Load statistics
function loadStatistics() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    const totalResponses = responses.length;
    const attendingCount = responses.filter(r => r.willAttend === 'yes').length;
    const notAttendingCount = responses.filter(r => r.willAttend === 'no').length;
    const paidCount = responses.filter(r => r.paymentStatus === true).length;
    
    document.getElementById('totalResponses').textContent = totalResponses;
    document.getElementById('attendingCount').textContent = attendingCount;
    document.getElementById('notAttendingCount').textContent = notAttendingCount;
    document.getElementById('paidCount').textContent = `${paidCount} / ${totalResponses}`;
}

// Render chart
function renderChart() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    
    // Count dates
    const dateCounts = {};
    responses.forEach(response => {
        if (response.availableDates && response.availableDates.length > 0) {
            response.availableDates.forEach(date => {
                dateCounts[date] = (dateCounts[date] || 0) + 1;
            });
        }
    });
    
    // Sort by count
    const sortedDates = Object.entries(dateCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    
    const labels = sortedDates.map(([date]) => date);
    const data = sortedDates.map(([, count]) => count);
    
    const ctx = document.getElementById('dateChart');
    
    // Destroy previous chart if exists
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    // Create new chart
    chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of People',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
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

// Calculate prices based on percentages
function calculatePrices(responses, settings) {
    const totalCost = parseFloat(settings.totalCost) || 0;
    const masterPercent = parseFloat(settings.masterPercent) || 0;
    const doctoralPercent = parseFloat(settings.doctoralPercent) || 0;
    const staffPercent = parseFloat(settings.staffPercent) || 0;
    
    // Count attending people by title
    const attending = responses.filter(r => r.willAttend === 'yes');
    const masterCount = attending.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attending.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attending.filter(r => r.title === 'Teachers and Staff').length;
    
    // Calculate prices
    const prices = {};
    
    if (masterCount > 0) {
        prices['Master Student'] = (totalCost * masterPercent / 100) / masterCount;
    }
    if (doctoralCount > 0) {
        prices['Doctoral Student'] = (totalCost * doctoralPercent / 100) / doctoralCount;
    }
    if (staffCount > 0) {
        prices['Teachers and Staff'] = (totalCost * staffPercent / 100) / staffCount;
    }
    
    return prices;
}

// Filter responses
function filterResponses(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    loadResponses();
}

// Search responses
function searchResponses() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#responsesTableBody tr');
    
    rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase() || '';
        if (name.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Price Settings
function openPriceSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    document.getElementById('totalCost').value = settings.totalCost || '';
    document.getElementById('masterPercent').value = settings.masterPercent || '';
    document.getElementById('doctoralPercent').value = settings.doctoralPercent || '';
    document.getElementById('staffPercent').value = settings.staffPercent || '';
    
    updatePercentageTotal();
    openModal('priceModal');
}

function setupPercentageCalculation() {
    ['masterPercent', 'doctoralPercent', 'staffPercent'].forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', updatePercentageTotal);
        }
    });
    
    document.getElementById('totalCost')?.addEventListener('input', updatePricePreview);
}

function updatePercentageTotal() {
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    
    const total = master + doctoral + staff;
    document.getElementById('totalPercentage').textContent = total;
    
    const statusElem = document.getElementById('percentageStatus');
    if (total === 100) {
        statusElem.textContent = '✓';
        statusElem.style.color = '#22c55e';
    } else {
        statusElem.textContent = '⚠ Must equal 100%';
        statusElem.style.color = '#e53e3e';
    }
    
    updatePricePreview();
}

function updatePricePreview() {
    const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    
    if (totalCost > 0 && master + doctoral + staff === 100) {
        const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
        const attending = responses.filter(r => r.willAttend === 'yes');
        
        const masterCount = attending.filter(r => r.title === 'Master Student').length;
        const doctoralCount = attending.filter(r => r.title === 'Doctoral Student').length;
        const staffCount = attending.filter(r => r.title === 'Teachers and Staff').length;
        
        let preview = '<div style="display: grid; gap: 10px;">';
        
        if (masterCount > 0) {
            const price = (totalCost * master / 100) / masterCount;
            preview += `<div>Master Student: ¥${price.toFixed(2)} per person (${masterCount} people)</div>`;
        }
        if (doctoralCount > 0) {
            const price = (totalCost * doctoral / 100) / doctoralCount;
            preview += `<div>Doctoral Student: ¥${price.toFixed(2)} per person (${doctoralCount} people)</div>`;
        }
        if (staffCount > 0) {
            const price = (totalCost * staff / 100) / staffCount;
            preview += `<div>Teachers and Staff: ¥${price.toFixed(2)} per person (${staffCount} people)</div>`;
        }
        
        preview += '</div>';
        
        document.getElementById('pricePreview').style.display = 'block';
        document.getElementById('pricePreviewContent').innerHTML = preview;
    } else {
        document.getElementById('pricePreview').style.display = 'none';
    }
}

function savePriceSettings() {
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    
    if (master + doctoral + staff !== 100) {
        alert('Percentages must total 100%');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    settings.totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    settings.masterPercent = master;
    settings.doctoralPercent = doctoral;
    settings.staffPercent = staff;
    
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    closeModal('priceModal');
    loadResponses();
}

// Poll Title Settings
function openPollTitleSettings() {
    const title = localStorage.getItem('poll_title') || getDefaultTitle();
    document.getElementById('pollTitle').value = title;
    openModal('titleModal');
}

function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

function resetTitleToDefault() {
    document.getElementById('pollTitle').value = getDefaultTitle();
}

function savePollTitle() {
    const title = document.getElementById('pollTitle').value.trim();
    if (title) {
        localStorage.setItem('poll_title', title);
        closeModal('titleModal');
        alert('Poll title updated successfully!');
    }
}

// Poll Management
function openPollManagement() {
    loadArchivedPolls();
    openModal('pollManagementModal');
}

function saveCurrentPoll() {
    const pollName = prompt('Enter a name for this poll archive:');
    if (!pollName) return;
    
    // Get current data
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    
    // Create archive
    const archive = {
        id: Date.now().toString(),
        name: pollName,
        date: new Date().toISOString(),
        responses: responses,
        settings: settings,
        statistics: {
            total: responses.length,
            attending: responses.filter(r => r.willAttend === 'yes').length,
            paid: responses.filter(r => r.paymentStatus === true).length
        }
    };
    
    // Save to archives
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    archives.push(archive);
    localStorage.setItem('poll_archives', JSON.stringify(archives));
    
    alert('Poll saved to archive successfully!');
    loadArchivedPolls();
}

function startNewPoll() {
    if (!confirm('Are you sure you want to start a new poll? All current responses will be cleared.')) {
        return;
    }
    
    // Clear responses
    localStorage.setItem('poll_responses', '[]');
    
    // Update poll name
    const pollName = prompt('Enter a name for the new poll:', 'New Poll');
    if (pollName) {
        const settings = JSON.parse(localStorage.getItem('admin_settings'));
        settings.currentPollName = pollName;
        localStorage.setItem('admin_settings', JSON.stringify(settings));
    }
    
    alert('New poll started successfully!');
    closeModal('pollManagementModal');
    
    // Reload page
    location.reload();
}

function loadArchivedPolls() {
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    const container = document.getElementById('archivedPollsList');
    
    if (archives.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999;">No archived polls yet</p>';
        return;
    }
    
    container.innerHTML = '';
    
    archives.reverse().forEach(archive => {
        const card = document.createElement('div');
        card.className = 'archived-poll-card';
        
        const date = new Date(archive.date).toLocaleDateString();
        
        card.innerHTML = `
            <div class="archived-poll-header">
                <div>
                    <div class="archived-poll-title">${archive.name}</div>
                    <div class="archived-poll-date">Archived on ${date}</div>
                </div>
            </div>
            <div class="archived-poll-stats">
                <span class="archived-stat"><i class="fas fa-users"></i> ${archive.statistics.total} responses</span>
                <span class="archived-stat"><i class="fas fa-check"></i> ${archive.statistics.attending} attending</span>
                <span class="archived-stat"><i class="fas fa-dollar-sign"></i> ${archive.statistics.paid} paid</span>
            </div>
            <div class="archived-poll-actions">
                <button class="btn btn-primary" onclick="restoreArchive('${archive.id}')">
                    <i class="fas fa-undo"></i> Restore
                </button>
                <button class="btn btn-success" onclick="exportArchive('${archive.id}')">
                    <i class="fas fa-download"></i> Export
                </button>
                <button class="btn btn-danger" onclick="deleteArchive('${archive.id}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        `;
        
        container.appendChild(card);
    });
}

function restoreArchive(archiveId) {
    if (!confirm('Are you sure you want to restore this archive? Current data will be replaced.')) {
        return;
    }
    
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    const archive = archives.find(a => a.id === archiveId);
    
    if (archive) {
        localStorage.setItem('poll_responses', JSON.stringify(archive.responses));
        
        const settings = JSON.parse(localStorage.getItem('admin_settings'));
        settings.currentPollName = archive.name;
        localStorage.setItem('admin_settings', JSON.stringify(settings));
        
        alert('Archive restored successfully!');
        closeModal('pollManagementModal');
        location.reload();
    }
}

function exportArchive(archiveId) {
    const archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    const archive = archives.find(a => a.id === archiveId);
    
    if (archive) {
        // Temporarily set responses
        const currentResponses = localStorage.getItem('poll_responses');
        localStorage.setItem('poll_responses', JSON.stringify(archive.responses));
        
        // Export
        exportXLSX();
        
        // Restore current responses
        localStorage.setItem('poll_responses', currentResponses);
    }
}

function deleteArchive(archiveId) {
    if (!confirm('Are you sure you want to delete this archive? This action cannot be undone.')) {
        return;
    }
    
    let archives = JSON.parse(localStorage.getItem('poll_archives') || '[]');
    archives = archives.filter(a => a.id !== archiveId);
    localStorage.setItem('poll_archives', JSON.stringify(archives));
    
    alert('Archive deleted successfully!');
    loadArchivedPolls();
}

// Settings
function openSettings() {
    openModal('settingsModal');
}

function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    if (!newPassword) {
        alert('Please enter a new password');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    settings.password = newPassword;
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    localStorage.setItem('admin_password', newPassword);
    
    alert('Password changed successfully!');
    closeModal('settingsModal');
    document.getElementById('newPassword').value = '';
}

// Export functions
function exportCSV() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    if (responses.length === 0) {
        alert('No data to export');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    const prices = calculatePrices(responses, settings);
    
    let csv = 'Name,Attendance,Title,Available Dates,Price,Paid,Submitted\n';
    
    responses.forEach(response => {
        const dates = response.availableDates?.join('; ') || 'No preference';
        const price = prices[response.title] ? prices[response.title].toFixed(2) : '';
        const paid = response.paymentStatus ? 'Yes' : 'No';
        const submitted = new Date(response.submittedAt).toLocaleString();
        
        csv += `"${response.name}","${response.willAttend}","${response.title}","${dates}","${price}","${paid}","${submitted}"\n`;
    });
    
    downloadFile(csv, 'dinner-poll.csv', 'text/csv');
}

function exportXLSX() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    if (responses.length === 0) {
        alert('No data to export');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    const prices = calculatePrices(responses, settings);
    
    // Prepare data
    const data = responses.map(response => ({
        'Name': response.name,
        'Attendance': response.willAttend,
        'Title': response.title,
        'Available Dates': response.availableDates?.join(', ') || 'No preference',
        'Price': prices[response.title] ? `¥${prices[response.title].toFixed(2)}` : '',
        'Paid': response.paymentStatus ? 'Yes' : 'No',
        'Submitted': new Date(response.submittedAt).toLocaleString()
    }));
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    
    // Add statistics sheet
    const attending = responses.filter(r => r.willAttend === 'yes');
    const masterCount = attending.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attending.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attending.filter(r => r.title === 'Teachers and Staff').length;
    
    const statsData = [
        ['Statistics', ''],
        ['Total Responses', responses.length],
        ['Attending', attending.length],
        ['Not Attending', responses.filter(r => r.willAttend === 'no').length],
        ['Paid', responses.filter(r => r.paymentStatus === true).length],
        [''],
        ['Price Breakdown', ''],
        ['Total Cost', `¥${settings.totalCost}`],
        ['Master Students', `${masterCount} people @ ¥${prices['Master Student']?.toFixed(2) || 0} each`],
        ['Doctoral Students', `${doctoralCount} people @ ¥${prices['Doctoral Student']?.toFixed(2) || 0} each`],
        ['Teachers and Staff', `${staffCount} people @ ¥${prices['Teachers and Staff']?.toFixed(2) || 0} each`]
    ];
    
    const statsWs = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, 'Statistics');
    
    // Download
    XLSX.writeFile(wb, 'dinner-poll.xlsx');
}

function exportPDF() {
    const responses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    if (responses.length === 0) {
        alert('No data to export');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const settings = JSON.parse(localStorage.getItem('admin_settings'));
    const prices = calculatePrices(responses, settings);
    
    // Title
    doc.setFontSize(20);
    doc.text('Dinner Poll Report', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 30);
    
    // Statistics
    doc.setFontSize(16);
    doc.text('Statistics', 20, 45);
    doc.setFontSize(12);
    
    let y = 55;
    doc.text(`Total Responses: ${responses.length}`, 20, y);
    y += 7;
    doc.text(`Attending: ${responses.filter(r => r.willAttend === 'yes').length}`, 20, y);
    y += 7;
    doc.text(`Not Attending: ${responses.filter(r => r.willAttend === 'no').length}`, 20, y);
    y += 7;
    doc.text(`Paid: ${responses.filter(r => r.paymentStatus === true).length}`, 20, y);
    
    // Price Breakdown
    y += 15;
    doc.setFontSize(16);
    doc.text('Price Breakdown', 20, y);
    doc.setFontSize(12);
    y += 10;
    
    doc.text(`Total Cost: ¥${settings.totalCost}`, 20, y);
    y += 7;
    
    const attending = responses.filter(r => r.willAttend === 'yes');
    const masterCount = attending.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attending.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attending.filter(r => r.title === 'Teachers and Staff').length;
    
    if (masterCount > 0) {
        doc.text(`Master Students: ${masterCount} @ ¥${prices['Master Student'].toFixed(2)}`, 20, y);
        y += 7;
    }
    if (doctoralCount > 0) {
        doc.text(`Doctoral Students: ${doctoralCount} @ ¥${prices['Doctoral Student'].toFixed(2)}`, 20, y);
        y += 7;
    }
    if (staffCount > 0) {
        doc.text(`Teachers and Staff: ${staffCount} @ ¥${prices['Teachers and Staff'].toFixed(2)}`, 20, y);
    }
    
    // Responses table (simplified)
    y += 15;
    doc.setFontSize(16);
    doc.text('Responses', 20, y);
    
    // Add page break if needed
    if (y > 250) {
        doc.addPage();
        y = 20;
    }
    
    // Save PDF
    doc.save('dinner-poll.pdf');
}

function downloadFile(content, filename, contentType) {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
