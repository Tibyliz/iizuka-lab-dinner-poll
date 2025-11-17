// Global variables
let allResponses = [];
let currentSettings = null;
let currentFilter = 'all';
let currentPaymentFilter = 'all';
let chart = null;

// Check authentication
function checkAuth() {
    const authToken = localStorage.getItem('admin_auth');
    const authTime = localStorage.getItem('admin_auth_time');
    
    if (!authToken || !authTime) {
        window.location.href = 'admin-login.html';
        return false;
    }
    
    const now = Date.now();
    const authAge = now - parseInt(authTime);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (authAge >= maxAge) {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_auth_time');
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

// Get default title with current month and year
function getDefaultTitle() {
    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Load admin settings
async function loadSettings() {
    try {
        const response = await fetch('tables/admin_settings?limit=1');
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
            currentSettings = data.data[0];
            
            // Ensure poll_title exists
            if (!currentSettings.poll_title) {
                currentSettings.poll_title = getDefaultTitle();
                await updateSettings({ poll_title: currentSettings.poll_title });
            }
        } else {
            // Create default settings
            currentSettings = {
                password: 'iizukalab',
                total_cost: 0,
                master_percent: 20,
                doctoral_percent: 30,
                staff_percent: 50,
                current_poll_id: 'poll_' + Date.now(),
                poll_title: getDefaultTitle()
            };
            
            await fetch('tables/admin_settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentSettings)
            });
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

// Update settings
async function updateSettings(updates) {
    try {
        if (!currentSettings || !currentSettings.id) {
            await loadSettings();
        }
        
        const response = await fetch(`tables/admin_settings/${currentSettings.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });
        
        if (response.ok) {
            const updated = await response.json();
            currentSettings = updated;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating settings:', error);
        return false;
    }
}

// Load responses
async function loadResponses() {
    try {
        if (!currentSettings) {
            await loadSettings();
        }
        
        const response = await fetch(`tables/poll_responses?limit=1000&search=${currentSettings.current_poll_id}`);
        const data = await response.json();
        
        allResponses = data.data || [];
        updateStatistics();
        displayResponses();
        updateChart();
    } catch (error) {
        console.error('Error loading responses:', error);
    }
}

// Update statistics
function updateStatistics() {
    const total = allResponses.length;
    const attending = allResponses.filter(r => r.will_attend === 'yes').length;
    const notAttending = total - attending;
    const paid = allResponses.filter(r => r.payment_status === true).length;
    
    document.getElementById('totalResponses').textContent = total;
    document.getElementById('totalAttending').textContent = attending;
    document.getElementById('totalNotAttending').textContent = notAttending;
    document.getElementById('paymentStats').textContent = `${paid} / ${attending}`;
}

// Calculate prices
function calculatePrices() {
    if (!currentSettings || !currentSettings.total_cost || currentSettings.total_cost === 0) {
        return { master: 0, doctoral: 0, staff: 0 };
    }
    
    const masterCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Master Student').length;
    const doctoralCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Doctoral Student').length;
    const staffCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Teachers and Staff').length;
    
    const totalCost = currentSettings.total_cost;
    const masterPercent = currentSettings.master_percent || 0;
    const doctoralPercent = currentSettings.doctoral_percent || 0;
    const staffPercent = currentSettings.staff_percent || 0;
    
    const masterTotal = (totalCost * masterPercent) / 100;
    const doctoralTotal = (totalCost * doctoralPercent) / 100;
    const staffTotal = (totalCost * staffPercent) / 100;
    
    return {
        master: masterCount > 0 ? masterTotal / masterCount : 0,
        doctoral: doctoralCount > 0 ? doctoralTotal / doctoralCount : 0,
        staff: staffCount > 0 ? staffTotal / staffCount : 0
    };
}

// Get price for person
function getPriceForPerson(response) {
    if (response.will_attend !== 'yes') return 0;
    
    const prices = calculatePrices();
    
    switch (response.title) {
        case 'Master Student':
            return prices.master;
        case 'Doctoral Student':
            return prices.doctoral;
        case 'Teachers and Staff':
            return prices.staff;
        default:
            return 0;
    }
}

// Display responses
function displayResponses() {
    const tbody = document.getElementById('responsesBody');
    tbody.innerHTML = '';
    
    let filtered = allResponses;
    
    // Apply attendance filter
    if (currentFilter !== 'all') {
        filtered = filtered.filter(r => r.will_attend === currentFilter);
    }
    
    // Apply payment filter
    if (currentPaymentFilter === 'paid') {
        filtered = filtered.filter(r => r.payment_status === true);
    } else if (currentPaymentFilter === 'unpaid') {
        filtered = filtered.filter(r => r.payment_status === false || !r.payment_status);
    }
    
    // Apply search filter
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (searchTerm) {
        filtered = filtered.filter(r => r.name.toLowerCase().includes(searchTerm));
    }
    
    filtered.forEach(response => {
        const row = document.createElement('tr');
        
        const dates = response.will_attend === 'yes' 
            ? (Array.isArray(response.available_dates) ? response.available_dates : []).join(', ')
            : 'N/A';
        
        const price = getPriceForPerson(response);
        const priceDisplay = response.will_attend === 'yes' 
            ? `¥${price.toFixed(2)}`
            : '-';
        
        const paymentStatus = response.payment_status 
            ? '<span class="payment-status payment-paid"><i class="fas fa-check-circle"></i> Paid</span>'
            : '<span class="payment-status payment-unpaid"><i class="fas fa-times-circle"></i> Unpaid</span>';
        
        const paymentCheckbox = response.will_attend === 'yes'
            ? `<label class="payment-checkbox">
                 <input type="checkbox" ${response.payment_status ? 'checked' : ''} 
                        onchange="updatePaymentStatus('${response.id}', this.checked)">
                 ${paymentStatus}
               </label>`
            : '-';
        
        row.innerHTML = `
            <td>${response.name}</td>
            <td><span class="attendance-badge badge-${response.will_attend}">${response.will_attend.toUpperCase()}</span></td>
            <td>${response.title}</td>
            <td>${dates}</td>
            <td>${priceDisplay}</td>
            <td>${paymentCheckbox}</td>
        `;
        
        tbody.appendChild(row);
    });
}

// Update payment status
async function updatePaymentStatus(id, status) {
    try {
        const response = await fetch(`tables/poll_responses/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ payment_status: status })
        });
        
        if (response.ok) {
            await loadResponses();
        }
    } catch (error) {
        console.error('Error updating payment status:', error);
    }
}

// Update chart
function updateChart() {
    const attendingResponses = allResponses.filter(r => r.will_attend === 'yes');
    const dateCounts = {};
    
    attendingResponses.forEach(response => {
        if (Array.isArray(response.available_dates)) {
            response.available_dates.forEach(date => {
                dateCounts[date] = (dateCounts[date] || 0) + 1;
            });
        }
    });
    
    const sortedDates = Object.keys(dateCounts).sort();
    const counts = sortedDates.map(date => dateCounts[date]);
    
    const ctx = document.getElementById('dateChart');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedDates,
            datasets: [{
                label: 'Number of People Available',
                data: counts,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
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

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Title Settings Modal
document.getElementById('titleSettingsBtn').addEventListener('click', () => {
    document.getElementById('pollTitle').value = currentSettings?.poll_title || getDefaultTitle();
    openModal('titleModal');
});

// Reset title to default
document.getElementById('resetTitleBtn').addEventListener('click', () => {
    document.getElementById('pollTitle').value = getDefaultTitle();
});

// Save title
document.getElementById('saveTitleBtn').addEventListener('click', async () => {
    const title = document.getElementById('pollTitle').value.trim();
    
    if (!title) {
        alert('Please enter a title.');
        return;
    }
    
    const success = await updateSettings({ poll_title: title });
    
    if (success) {
        alert('Poll title updated successfully!');
        closeModal('titleModal');
    } else {
        alert('Error updating title. Please try again.');
    }
});

// Price Settings Modal
document.getElementById('priceSettingsBtn').addEventListener('click', () => {
    if (currentSettings) {
        document.getElementById('totalCost').value = currentSettings.total_cost || 0;
        document.getElementById('masterPercent').value = currentSettings.master_percent || 20;
        document.getElementById('doctoralPercent').value = currentSettings.doctoral_percent || 30;
        document.getElementById('staffPercent').value = currentSettings.staff_percent || 50;
        updatePercentageTotal();
        updatePricePreview();
    }
    openModal('priceModal');
});

// Update percentage total
function updatePercentageTotal() {
    const master = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoral = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staff = parseFloat(document.getElementById('staffPercent').value) || 0;
    const total = master + doctoral + staff;
    
    document.getElementById('percentTotal').textContent = total.toFixed(1);
    
    const validation = document.getElementById('percentValidation');
    if (Math.abs(total - 100) < 0.01) {
        validation.textContent = '✓ Valid';
        validation.className = 'validation-msg valid';
    } else {
        validation.textContent = '⚠ Must equal 100%';
        validation.className = 'validation-msg invalid';
    }
}

// Update price preview
function updatePricePreview() {
    const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    const masterPercent = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoralPercent = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staffPercent = parseFloat(document.getElementById('staffPercent').value) || 0;
    
    if (totalCost > 0) {
        const masterCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Master Student').length;
        const doctoralCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Doctoral Student').length;
        const staffCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Teachers and Staff').length;
        
        const masterPrice = masterCount > 0 ? ((totalCost * masterPercent) / 100) / masterCount : 0;
        const doctoralPrice = doctoralCount > 0 ? ((totalCost * doctoralPercent) / 100) / doctoralCount : 0;
        const staffPrice = staffCount > 0 ? ((totalCost * staffPercent) / 100) / staffCount : 0;
        
        document.getElementById('masterPrice').textContent = `¥${masterPrice.toFixed(2)} (${masterCount} people)`;
        document.getElementById('doctoralPrice').textContent = `¥${doctoralPrice.toFixed(2)} (${doctoralCount} people)`;
        document.getElementById('staffPrice').textContent = `¥${staffPrice.toFixed(2)} (${staffCount} people)`;
        
        document.getElementById('pricePreview').style.display = 'block';
    } else {
        document.getElementById('pricePreview').style.display = 'none';
    }
}

// Add event listeners for percentage inputs
['masterPercent', 'doctoralPercent', 'staffPercent', 'totalCost'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        updatePercentageTotal();
        updatePricePreview();
    });
});

// Save price settings
document.getElementById('savePriceBtn').addEventListener('click', async () => {
    const totalCost = parseFloat(document.getElementById('totalCost').value) || 0;
    const masterPercent = parseFloat(document.getElementById('masterPercent').value) || 0;
    const doctoralPercent = parseFloat(document.getElementById('doctoralPercent').value) || 0;
    const staffPercent = parseFloat(document.getElementById('staffPercent').value) || 0;
    
    const total = masterPercent + doctoralPercent + staffPercent;
    if (Math.abs(total - 100) >= 0.01) {
        alert('Percentages must total 100%');
        return;
    }
    
    const success = await updateSettings({
        total_cost: totalCost,
        master_percent: masterPercent,
        doctoral_percent: doctoralPercent,
        staff_percent: staffPercent
    });
    
    if (success) {
        alert('Price settings saved successfully!');
        closeModal('priceModal');
        await loadResponses();
    } else {
        alert('Error saving settings. Please try again.');
    }
});

// Settings Modal
document.getElementById('settingsBtn').addEventListener('click', () => {
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
    openModal('settingsModal');
});

// Change password
document.getElementById('changePasswordBtn').addEventListener('click', async () => {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (!currentPassword || !newPassword || !confirmPassword) {
        alert('Please fill in all fields.');
        return;
    }
    
    if (currentPassword !== currentSettings.password) {
        alert('Current password is incorrect.');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('New passwords do not match.');
        return;
    }
    
    if (newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
    }
    
    const success = await updateSettings({ password: newPassword });
    
    if (success) {
        alert('Password changed successfully!');
        closeModal('settingsModal');
    } else {
        alert('Error changing password. Please try again.');
    }
});

// Save current poll
document.getElementById('saveCurrentPollBtn').addEventListener('click', () => {
    const now = new Date();
    const defaultName = `Poll ${now.toLocaleDateString()}`;
    document.getElementById('pollName').value = defaultName;
    openModal('savePollModal');
});

document.getElementById('confirmSaveBtn').addEventListener('click', async () => {
    const pollName = document.getElementById('pollName').value.trim();
    
    if (!pollName) {
        alert('Please enter a poll name.');
        return;
    }
    
    try {
        const attending = allResponses.filter(r => r.will_attend === 'yes').length;
        
        await fetch('tables/archived_polls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                poll_id: currentSettings.current_poll_id,
                poll_name: pollName,
                archived_date: new Date().toISOString(),
                total_responses: allResponses.length,
                total_attendees: attending
            })
        });
        
        alert('Poll saved to archive successfully!');
        closeModal('savePollModal');
    } catch (error) {
        console.error('Error saving poll:', error);
        alert('Error saving poll. Please try again.');
    }
});

// Start new poll
document.getElementById('startNewPollBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to start a new poll? Current responses will be archived.')) {
        return;
    }
    
    try {
        const newPollId = 'poll_' + Date.now();
        await updateSettings({ current_poll_id: newPollId });
        
        alert('New poll started! Old responses are still accessible through archives.');
        await loadResponses();
    } catch (error) {
        console.error('Error starting new poll:', error);
        alert('Error starting new poll. Please try again.');
    }
});

// View archived polls
document.getElementById('viewArchivedBtn').addEventListener('click', async () => {
    try {
        const response = await fetch('tables/archived_polls?limit=100&sort=-archived_date');
        const data = await response.json();
        
        const archiveList = document.getElementById('archiveList');
        archiveList.innerHTML = '';
        
        if (!data.data || data.data.length === 0) {
            archiveList.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">No archived polls yet.</p>';
        } else {
            data.data.forEach(archive => {
                const date = new Date(archive.archived_date).toLocaleDateString();
                const item = document.createElement('div');
                item.className = 'archive-item';
                item.innerHTML = `
                    <h4>${archive.poll_name}</h4>
                    <div class="archive-info">
                        <span><i class="fas fa-calendar"></i> ${date}</span>
                        <span><i class="fas fa-users"></i> ${archive.total_responses} responses</span>
                        <span><i class="fas fa-user-check"></i> ${archive.total_attendees} attending</span>
                    </div>
                `;
                archiveList.appendChild(item);
            });
        }
        
        openModal('archiveModal');
    } catch (error) {
        console.error('Error loading archives:', error);
        alert('Error loading archived polls.');
    }
});

// Export functions
document.getElementById('exportXLSXBtn').addEventListener('click', exportToXLSX);
document.getElementById('exportPDFBtn').addEventListener('click', exportToPDF);
document.getElementById('exportCSVBtn').addEventListener('click', exportToCSV);

function exportToXLSX() {
    const wb = XLSX.utils.book_new();
    
    // Responses sheet
    const wsData = [['Name', 'Attendance', 'Title', 'Available Dates', 'Amount Due', 'Payment Status']];
    
    allResponses.forEach(r => {
        const dates = r.will_attend === 'yes' ? (Array.isArray(r.available_dates) ? r.available_dates.join(', ') : '') : 'N/A';
        const price = r.will_attend === 'yes' ? getPriceForPerson(r).toFixed(2) : '-';
        const payment = r.payment_status ? 'Paid' : 'Unpaid';
        
        wsData.push([r.name, r.will_attend, r.title, dates, price, payment]);
    });
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Responses');
    
    // Statistics sheet
    const prices = calculatePrices();
    const masterCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Master Student').length;
    const doctoralCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Doctoral Student').length;
    const staffCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Teachers and Staff').length;
    const paid = allResponses.filter(r => r.payment_status === true).length;
    const attending = allResponses.filter(r => r.will_attend === 'yes').length;
    
    const statsData = [
        ['Statistics Summary'],
        [''],
        ['Total Responses', allResponses.length],
        ['Will Attend', attending],
        ['Won\'t Attend', allResponses.length - attending],
        ['Payment Received', `${paid} / ${attending}`],
        [''],
        ['Price Breakdown'],
        [''],
        ['Master Students', masterCount, `¥${prices.master.toFixed(2)}`],
        ['Doctoral Students', doctoralCount, `¥${prices.doctoral.toFixed(2)}`],
        ['Teachers and Staff', staffCount, `¥${prices.staff.toFixed(2)}`],
        [''],
        ['Total Cost', `¥${currentSettings?.total_cost || 0}`]
    ];
    
    const statsWs = XLSX.utils.aoa_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, 'Statistics');
    
    XLSX.writeFile(wb, 'dinner_poll_responses.xlsx');
}

function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Dinner Poll Report', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);
    
    // Statistics
    doc.setFontSize(14);
    doc.text('Statistics', 14, 40);
    
    doc.setFontSize(10);
    const attending = allResponses.filter(r => r.will_attend === 'yes').length;
    const paid = allResponses.filter(r => r.payment_status === true).length;
    
    doc.text(`Total Responses: ${allResponses.length}`, 14, 48);
    doc.text(`Will Attend: ${attending}`, 14, 55);
    doc.text(`Won't Attend: ${allResponses.length - attending}`, 14, 62);
    doc.text(`Payment Received: ${paid} / ${attending}`, 14, 69);
    
    // Price breakdown
    const prices = calculatePrices();
    const masterCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Master Student').length;
    const doctoralCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Doctoral Student').length;
    const staffCount = allResponses.filter(r => r.will_attend === 'yes' && r.title === 'Teachers and Staff').length;
    
    doc.setFontSize(14);
    doc.text('Price Breakdown', 14, 82);
    
    doc.setFontSize(10);
    doc.text(`Master Students (${masterCount}): ¥${prices.master.toFixed(2)}`, 14, 90);
    doc.text(`Doctoral Students (${doctoralCount}): ¥${prices.doctoral.toFixed(2)}`, 14, 97);
    doc.text(`Teachers and Staff (${staffCount}): ¥${prices.staff.toFixed(2)}`, 14, 104);
    doc.text(`Total Cost: ¥${currentSettings?.total_cost || 0}`, 14, 111);
    
    // Responses table
    doc.setFontSize(14);
    doc.text('Responses', 14, 124);
    
    let yPos = 132;
    doc.setFontSize(9);
    
    allResponses.forEach((r, index) => {
        if (yPos > 270) {
            doc.addPage();
            yPos = 20;
        }
        
        const price = r.will_attend === 'yes' ? getPriceForPerson(r).toFixed(2) : '-';
        const payment = r.payment_status ? 'Paid' : 'Unpaid';
        
        doc.text(`${r.name} | ${r.will_attend} | ${r.title} | ¥${price} | ${payment}`, 14, yPos);
        yPos += 7;
    });
    
    doc.save('dinner_poll_report.pdf');
}

function exportToCSV() {
    let csv = 'Name,Attendance,Title,Available Dates,Amount Due,Payment Status\n';
    
    allResponses.forEach(r => {
        const dates = r.will_attend === 'yes' ? (Array.isArray(r.available_dates) ? r.available_dates.join('; ') : '') : 'N/A';
        const price = r.will_attend === 'yes' ? getPriceForPerson(r).toFixed(2) : '-';
        const payment = r.payment_status ? 'Paid' : 'Unpaid';
        
        csv += `"${r.name}","${r.will_attend}","${r.title}","${dates}","${price}","${payment}"\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dinner_poll_responses.csv';
    a.click();
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        displayResponses();
    });
});

document.querySelectorAll('.payment-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.payment-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentPaymentFilter = btn.dataset.payment;
        displayResponses();
    });
});

// Search
document.getElementById('searchInput').addEventListener('input', displayResponses);

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_auth');
        localStorage.removeItem('admin_auth_time');
        window.location.href = 'admin-login.html';
    }
});

// Modal close buttons
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', (e) => {
        const modalId = e.target.dataset.modal;
        closeModal(modalId);
    });
});

document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const modalId = e.target.dataset.close;
        closeModal(modalId);
    });
});

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Initialize
if (checkAuth()) {
    loadSettings().then(() => {
        loadResponses();
    });
}
