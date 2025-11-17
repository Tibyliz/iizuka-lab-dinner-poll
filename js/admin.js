// Admin Dashboard JavaScript - Complete with ALL features

let currentChart = null;
let allResponses = [];
let filteredResponses = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin dashboard loaded');
    
    // Check authentication
    if (!checkAuthentication()) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    // Load data and initialize
    loadAllData();
    setupEventListeners();
    updateDashboard();
});

// Check authentication
function checkAuthentication() {
    const session = JSON.parse(localStorage.getItem('admin_session') || '{}');
    
    if (!session.authenticated) {
        return false;
    }
    
    // Check if session expired (24 hours)
    const now = Date.now();
    const sessionAge = now - session.timestamp;
    
    if (sessionAge > session.expiresIn) {
        localStorage.removeItem('admin_session');
        return false;
    }
    
    return true;
}

// Load all data
function loadAllData() {
    allResponses = JSON.parse(localStorage.getItem('poll_responses') || '[]');
    filteredResponses = [...allResponses];
    console.log('Loaded responses:', allResponses.length);
}

// Setup event listeners
function setupEventListeners() {
    // Logout
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    
    // Modal buttons
    document.getElementById('titleSettingsBtn').addEventListener('click', () => openModal('titleModal'));
    document.getElementById('priceSettingsBtn').addEventListener('click', () => openModal('priceModal'));
    document.getElementById('pollManagementBtn').addEventListener('click', () => openModal('pollManagementModal'));
    document.getElementById('settingsBtn').addEventListener('click', () => openModal('settingsModal'));
    
    // Close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Click outside to close
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Title settings
    document.getElementById('resetTitleBtn').addEventListener('click', resetTitle);
    document.getElementById('saveTitleBtn').addEventListener('click', saveTitle);
    
    // Price settings
    document.getElementById('masterPercent').addEventListener('input', validatePercentages);
    document.getElementById('doctoralPercent').addEventListener('input', validatePercentages);
    document.getElementById('staffPercent').addEventListener('input', validatePercentages);
    document.getElementById('totalCost').addEventListener('input', updatePricePreview);
    document.getElementById('savePriceBtn').addEventListener('click', savePriceSettings);
    
    // Poll management
    document.getElementById('saveCurrentPoll').addEventListener('click', saveCurrentPoll);
    document.getElementById('startNewPoll').addEventListener('click', startNewPoll);
    
    // Settings
    document.getElementById('changePasswordBtn').addEventListener('click', changePassword);
    
    // Filters
    document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    document.querySelectorAll('.filter-btn[data-payment-filter]').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn[data-payment-filter]').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    document.getElementById('searchInput').addEventListener('input', applyFilters);
    
    // Export buttons
    document.getElementById('exportCSV').addEventListener('click', exportToCSV);
    document.getElementById('exportXLSX').addEventListener('click', exportToXLSX);
    document.getElementById('exportPDF').addEventListener('click', exportToPDF);
}

// Update dashboard
function updateDashboard() {
    updateStatistics();
    updateChart();
    updateTable();
    loadTitleSettings();
    loadPriceSettings();
    loadArchivedPolls();
}

// Update statistics
function updateStatistics() {
    const total = allResponses.length;
    const attending = allResponses.filter(r => r.will_attend === 'yes').length;
    const notAttending = total - attending;
    const paid = allResponses.filter(r => r.payment_status).length;
    
    document.getElementById('totalResponses').textContent = total;
    document.getElementById('attendingCount').textContent = attending;
    document.getElementById('notAttendingCount').textContent = notAttending;
    document.getElementById('paidCount').textContent = `${paid} / ${attending}`;
}

// Update chart
function updateChart() {
    const attendingResponses = allResponses.filter(r => r.will_attend === 'yes');
    const dateCounts = {};
    
    attendingResponses.forEach(response => {
        response.available_dates.forEach(date => {
            dateCounts[date] = (dateCounts[date] || 0) + 1;
        });
    });
    
    const sortedDates = Object.entries(dateCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);
    
    const labels = sortedDates.map(([date]) => formatDate(date));
    const data = sortedDates.map(([, count]) => count);
    
    const ctx = document.getElementById('dateChart').getContext('2d');
    
    if (currentChart) {
        currentChart.destroy();
    }
    
    currentChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of People Available',
                data: data,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
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
                        stepSize: 1
                    }
                }
            }
        }
    });
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr + 'T00:00:00');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
}

// Update table
function updateTable() {
    const tbody = document.getElementById('responsesBody');
    tbody.innerHTML = '';
    
    if (filteredResponses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 30px; color: #718096;">No responses found</td></tr>';
        return;
    }
    
    filteredResponses.forEach((response, index) => {
        const row = document.createElement('tr');
        
        const attendanceBadge = response.will_attend === 'yes' 
            ? '<span class="badge badge-yes">Yes</span>' 
            : '<span class="badge badge-no">No</span>';
        
        const dates = response.will_attend === 'yes' && response.available_dates.length > 0
            ? response.available_dates.map(d => formatDate(d)).join(', ')
            : '—';
        
        const price = calculateIndividualPrice(response);
        const priceDisplay = response.will_attend === 'yes' && price > 0 
            ? `¥${price.toFixed(2)}` 
            : '—';
        
        const paidCheckbox = response.will_attend === 'yes'
            ? `<input type="checkbox" class="payment-checkbox" data-id="${response.id}" ${response.payment_status ? 'checked' : ''}>`
            : '—';
        
        const submittedDate = new Date(response.submitted_at).toLocaleString();
        
        row.innerHTML = `
            <td>${response.name}</td>
            <td>${attendanceBadge}</td>
            <td>${response.title}</td>
            <td>${dates}</td>
            <td>${priceDisplay}</td>
            <td>${paidCheckbox}</td>
            <td>${submittedDate}</td>
        `;
        
        tbody.appendChild(row);
    });
    
    // Add event listeners to checkboxes
    document.querySelectorAll('.payment-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            updatePaymentStatus(this.dataset.id, this.checked);
        });
    });
}

// Calculate individual price
function calculateIndividualPrice(response) {
    if (response.will_attend !== 'yes') {
        return 0;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const totalCost = parseFloat(settings.total_cost) || 0;
    const masterPercent = parseFloat(settings.master_percent) || 0;
    const doctoralPercent = parseFloat(settings.doctoral_percent) || 0;
    const staffPercent = parseFloat(settings.staff_percent) || 0;
    
    if (totalCost === 0 || (masterPercent + doctoralPercent + staffPercent) !== 100) {
        return 0;
    }
    
    // Count people by title
    const attendingResponses = allResponses.filter(r => r.will_attend === 'yes');
    const masterCount = attendingResponses.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attendingResponses.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attendingResponses.filter(r => r.title === 'Teachers and Staff').length;
    
    // Calculate portion for each group
    const masterPortion = totalCost * (masterPercent / 100);
    const doctoralPortion = totalCost * (doctoralPercent / 100);
    const staffPortion = totalCost * (staffPercent / 100);
    
    // Calculate individual price
    if (response.title === 'Master Student' && masterCount > 0) {
        return masterPortion / masterCount;
    } else if (response.title === 'Doctoral Student' && doctoralCount > 0) {
        return doctoralPortion / doctoralCount;
    } else if (response.title === 'Teachers and Staff' && staffCount > 0) {
        return staffPortion / staffCount;
    }
    
    return 0;
}

// Update payment status
function updatePaymentStatus(id, paid) {
    const response = allResponses.find(r => r.id === id);
    if (response) {
        response.payment_status = paid;
        localStorage.setItem('poll_responses', JSON.stringify(allResponses));
        updateStatistics();
    }
}

// Apply filters
function applyFilters() {
    const attendanceFilter = document.querySelector('.filter-btn[data-filter].active').dataset.filter;
    const paymentFilter = document.querySelector('.filter-btn[data-payment-filter].active').dataset.paymentFilter;
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredResponses = allResponses.filter(response => {
        // Attendance filter
        if (attendanceFilter !== 'all' && response.will_attend !== attendanceFilter) {
            return false;
        }
        
        // Payment filter
        if (paymentFilter === 'paid' && !response.payment_status) {
            return false;
        }
        if (paymentFilter === 'unpaid' && (response.payment_status || response.will_attend !== 'yes')) {
            return false;
        }
        
        // Search filter
        if (searchTerm && !response.name.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        return true;
    });
    
    updateTable();
}

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

// Title settings
function loadTitleSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    document.getElementById('pollTitleInput').value = settings.poll_title || '';
}

function resetTitle() {
    const defaultTitle = getDefaultTitle();
    document.getElementById('pollTitleInput').value = defaultTitle;
}

function saveTitle() {
    const title = document.getElementById('pollTitleInput').value.trim() || getDefaultTitle();
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.poll_title = title;
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    alert('Title saved successfully!');
    document.getElementById('titleModal').style.display = 'none';
}

function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Price settings
function loadPriceSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    document.getElementById('totalCost').value = settings.total_cost || '';
    document.getElementById('masterPercent').value = settings.master_percent || 20;
    document.getElementById('doctoralPercent').value = settings.doctoral_percent || 30;
    document.getElementById('staffPercent').value = settings.staff_percent || 50;
    validatePercentages();
    updatePricePreview();
}

function validatePercentages() {
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    const total = master + doctoral + staff;
    
    const warning = document.getElementById('percentageWarning');
    const success = document.getElementById('percentageSuccess');
    
    if (Math.abs(total - 100) < 0.01) {
        warning.style.display = 'none';
        success.style.display = 'flex';
    } else {
        warning.style.display = 'flex';
        success.style.display = 'none';
    }
    
    updatePricePreview();
}

function updatePricePreview() {
    const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    const percentTotal = master + doctoral + staff;
    
    const previewDiv = document.getElementById('pricePreview');
    
    if (totalCost === 0 || Math.abs(percentTotal - 100) > 0.01) {
        previewDiv.innerHTML = '<p style="color: #718096; text-align: center;">Enter total cost and valid percentages to see preview</p>';
        return;
    }
    
    // Count people by title
    const attendingResponses = allResponses.filter(r => r.will_attend === 'yes');
    const masterCount = attendingResponses.filter(r => r.title === 'Master Student').length;
    const doctoralCount = attendingResponses.filter(r => r.title === 'Doctoral Student').length;
    const staffCount = attendingResponses.filter(r => r.title === 'Teachers and Staff').length;
    
    const masterPortion = totalCost * (master / 100);
    const doctoralPortion = totalCost * (doctoral / 100);
    const staffPortion = totalCost * (staff / 100);
    
    const masterPrice = masterCount > 0 ? masterPortion / masterCount : 0;
    const doctoralPrice = doctoralCount > 0 ? doctoralPortion / doctoralCount : 0;
    const staffPrice = staffCount > 0 ? staffPortion / staffCount : 0;
    
    previewDiv.innerHTML = `
        <h4>Price Preview</h4>
        <div class="price-item">
            <span>Master Students (${masterCount} people):</span>
            <span>¥${masterPrice.toFixed(2)} per person</span>
        </div>
        <div class="price-item">
            <span>Doctoral Students (${doctoralCount} people):</span>
            <span>¥${doctoralPrice.toFixed(2)} per person</span>
        </div>
        <div class="price-item">
            <span>Teachers/Staff (${staffCount} people):</span>
            <span>¥${staffPrice.toFixed(2)} per person</span>
        </div>
    `;
}

function savePriceSettings() {
    const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    
    if (Math.abs(master + doctoral + staff - 100) > 0.01) {
        alert('Percentages must add up to 100%!');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.total_cost = totalCost;
    settings.master_percent = master;
    settings.doctoral_percent = doctoral;
    settings.staff_percent = staff;
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    alert('Price settings saved successfully!');
    document.getElementById('priceModal').style.display = 'none';
    updateDashboard();
}

// Poll management
function loadArchivedPolls() {
    const archived = JSON.parse(localStorage.getItem('archived_polls') || '[]');
    const archiveList = document.getElementById('archiveList');
    
    if (archived.length === 0) {
        archiveList.innerHTML = '<p style="color: #718096; text-align: center;">No archived polls yet</p>';
        return;
    }
    
    archiveList.innerHTML = archived.map(poll => `
        <div class="archive-item">
            <div class="archive-info">
                <h4>${poll.name}</h4>
                <p>Archived: ${new Date(poll.archived_date).toLocaleDateString()} | Responses: ${poll.total_responses}</p>
            </div>
        </div>
    `).join('');
}

function saveCurrentPoll() {
    const pollName = prompt('Enter a name for this poll:', `Poll ${new Date().toLocaleDateString()}`);
    if (!pollName) return;
    
    const archived = JSON.parse(localStorage.getItem('archived_polls') || '[]');
    const attending = allResponses.filter(r => r.will_attend === 'yes').length;
    
    archived.push({
        id: 'archive_' + Date.now(),
        name: pollName,
        archived_date: new Date().toISOString(),
        total_responses: allResponses.length,
        total_attendees: attending,
        responses: [...allResponses]
    });
    
    localStorage.setItem('archived_polls', JSON.stringify(archived));
    alert('Poll archived successfully!');
    loadArchivedPolls();
}

function startNewPoll() {
    if (!confirm('This will clear all current responses and start a new poll. Continue?')) {
        return;
    }
    
    localStorage.setItem('poll_responses', '[]');
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    settings.current_poll_id = 'poll_' + Date.now();
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    
    alert('New poll started! All responses cleared.');
    document.getElementById('pollManagementModal').style.display = 'none';
    location.reload();
}

// Settings
function changePassword() {
    const newPassword = document.getElementById('newPassword').value;
    if (!newPassword) {
        alert('Please enter a new password');
        return;
    }
    
    localStorage.setItem('admin_password', newPassword);
    alert('Password changed successfully!');
    document.getElementById('settingsModal').style.display = 'none';
    document.getElementById('newPassword').value = '';
}

// Logout
function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_session');
        window.location.href = 'admin-login.html';
    }
}

// Export functions
function exportToCSV() {
    const headers = ['Name', 'Attendance', 'Title', 'Available Dates', 'Price', 'Paid', 'Submitted'];
    const rows = allResponses.map(r => [
        r.name,
        r.will_attend === 'yes' ? 'Yes' : 'No',
        r.title,
        r.available_dates.join('; '),
        calculateIndividualPrice(r).toFixed(2),
        r.payment_status ? 'Yes' : 'No',
        new Date(r.submitted_at).toLocaleString()
    ]);
    
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
        csv += row.map(cell => `"${cell}"`).join(',') + '\n';
    });
    
    downloadFile(csv, 'poll_responses.csv', 'text/csv');
}

function exportToXLSX() {
    const data = allResponses.map(r => ({
        'Name': r.name,
        'Attendance': r.will_attend === 'yes' ? 'Yes' : 'No',
        'Title': r.title,
        'Available Dates': r.available_dates.join(', '),
        'Price': calculateIndividualPrice(r).toFixed(2),
        'Paid': r.payment_status ? 'Yes' : 'No',
        'Submitted': new Date(r.submitted_at).toLocaleString()
    }));
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    
    // Add statistics sheet
    const stats = [
        ['Statistic', 'Value'],
        ['Total Responses', allResponses.length],
        ['Attending', allResponses.filter(r => r.will_attend === 'yes').length],
        ['Not Attending', allResponses.filter(r => r.will_attend === 'no').length],
        ['Paid', allResponses.filter(r => r.payment_status).length]
    ];
    const ws2 = XLSX.utils.aoa_to_sheet(stats);
    XLSX.utils.book_append_sheet(wb, ws2, 'Statistics');
    
    XLSX.writeFile(wb, 'poll_responses.xlsx');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Poll Responses Report', 14, 20);
    
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Statistics
    doc.setFontSize(14);
    doc.text('Statistics', 14, 45);
    doc.setFontSize(11);
    doc.text(`Total Responses: ${allResponses.length}`, 14, 53);
    doc.text(`Attending: ${allResponses.filter(r => r.will_attend === 'yes').length}`, 14, 60);
    doc.text(`Not Attending: ${allResponses.filter(r => r.will_attend === 'no').length}`, 14, 67);
    
    // Responses
    doc.setFontSize(14);
    doc.text('Responses', 14, 82);
    
    let y = 90;
    allResponses.forEach((r, i) => {
        if (y > 270) {
            doc.addPage();
            y = 20;
        }
        
        doc.setFontSize(10);
        doc.text(`${i + 1}. ${r.name} - ${r.title}`, 14, y);
        y += 6;
        doc.text(`   Attendance: ${r.will_attend === 'yes' ? 'Yes' : 'No'}`, 14, y);
        y += 6;
        const price = calculateIndividualPrice(r);
        if (price > 0) {
            doc.text(`   Price: ¥${price.toFixed(2)} | Paid: ${r.payment_status ? 'Yes' : 'No'}`, 14, y);
            y += 8;
        } else {
            y += 5;
        }
    });
    
    doc.save('poll_responses.pdf');
}

function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
