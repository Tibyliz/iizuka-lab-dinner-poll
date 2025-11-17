// Admin.js - Admin Dashboard with localStorage (GitHub Pages Compatible)
// Complete rewrite to eliminate SQL.js dependency and work reliably on GitHub Pages

// Global state
let currentPollId = null;
let allResponses = [];
let adminSettings = {};

// ===== AUTHENTICATION =====

function checkAuthentication() {
    try {
        const sessionStr = sessionStorage.getItem('admin_session');
        
        if (!sessionStr) {
            redirectToLogin();
            return false;
        }
        
        const session = JSON.parse(sessionStr);
        const now = new Date();
        const expiresAt = new Date(session.expiresAt);
        
        if (!session.authenticated || now >= expiresAt) {
            sessionStorage.removeItem('admin_session');
            redirectToLogin();
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Authentication error:', error);
        redirectToLogin();
        return false;
    }
}

function redirectToLogin() {
    window.location.href = 'admin-login.html';
}

function handleLogout() {
    sessionStorage.removeItem('admin_session');
    redirectToLogin();
}

// ===== DATA MANAGEMENT =====

function loadAdminSettings() {
    try {
        const settingsStr = localStorage.getItem('admin_settings');
        if (settingsStr) {
            adminSettings = JSON.parse(settingsStr);
            currentPollId = adminSettings.current_poll_id;
            return adminSettings;
        } else {
            // Initialize if not exists
            adminSettings = {
                password: 'iizukalab',
                total_cost: 0,
                master_percentage: 20,
                doctoral_percentage: 30,
                staff_percentage: 50,
                poll_title: getDefaultPollTitle(),
                current_poll_id: generatePollId(),
                created_at: new Date().toISOString()
            };
            localStorage.setItem('admin_settings', JSON.stringify(adminSettings));
            currentPollId = adminSettings.current_poll_id;
            return adminSettings;
        }
    } catch (error) {
        console.error('Error loading admin settings:', error);
        return null;
    }
}

function saveAdminSettings(settings) {
    try {
        localStorage.setItem('admin_settings', JSON.stringify(settings));
        adminSettings = settings;
        return true;
    } catch (error) {
        console.error('Error saving admin settings:', error);
        return false;
    }
}

function loadPollResponses() {
    try {
        const responsesStr = localStorage.getItem('poll_responses');
        if (responsesStr) {
            const all = JSON.parse(responsesStr);
            // Filter by current poll ID
            allResponses = all.filter(r => r.poll_id === currentPollId);
            return allResponses;
        } else {
            allResponses = [];
            localStorage.setItem('poll_responses', JSON.stringify([]));
            return [];
        }
    } catch (error) {
        console.error('Error loading poll responses:', error);
        return [];
    }
}

function updateResponsePaymentStatus(responseId, paid) {
    try {
        const allStr = localStorage.getItem('poll_responses');
        if (!allStr) return false;
        
        const all = JSON.parse(allStr);
        const index = all.findIndex(r => r.id === responseId);
        
        if (index !== -1) {
            all[index].payment_status = paid;
            all[index].updated_at = new Date().toISOString();
            localStorage.setItem('poll_responses', JSON.stringify(all));
            
            // Update local array
            const localIndex = allResponses.findIndex(r => r.id === responseId);
            if (localIndex !== -1) {
                allResponses[localIndex].payment_status = paid;
            }
            
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error updating payment status:', error);
        return false;
    }
}

// ===== UTILITY FUNCTIONS =====

function getDefaultPollTitle() {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

function generatePollId() {
    return 'poll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// ===== DASHBOARD UI =====

function updateDashboard() {
    const responses = loadPollResponses();
    
    // Calculate statistics
    const totalResponses = responses.length;
    const attending = responses.filter(r => r.will_attend === 'yes').length;
    const notAttending = totalResponses - attending;
    
    // Count by title
    const masterCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'master').length;
    const doctoralCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'doctoral').length;
    const staffCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'staff').length;
    
    // Payment status
    const paid = responses.filter(r => r.payment_status === true).length;
    const unpaid = totalResponses - paid;
    
    // Update stats display
    document.getElementById('total-responses').textContent = totalResponses;
    document.getElementById('attending-count').textContent = attending;
    document.getElementById('not-attending-count').textContent = notAttending;
    document.getElementById('payment-status').textContent = `${paid} / ${totalResponses} paid`;
    
    // Update popular dates chart
    updatePopularDatesChart(responses);
    
    // Update responses table
    updateResponsesTable(responses);
}

function updatePopularDatesChart(responses) {
    const dateCount = {};
    
    responses.forEach(response => {
        if (response.will_attend === 'yes' && response.available_dates) {
            response.available_dates.forEach(date => {
                dateCount[date] = (dateCount[date] || 0) + 1;
            });
        }
    });
    
    // Sort by count
    const sortedDates = Object.entries(dateCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // Top 10 dates
    
    const chartContainer = document.getElementById('dates-chart');
    
    if (sortedDates.length === 0) {
        chartContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No date preferences yet</p>';
        return;
    }
    
    const maxCount = sortedDates[0][1];
    
    chartContainer.innerHTML = sortedDates.map(([date, count]) => {
        const percentage = (count / maxCount) * 100;
        return `
            <div class="date-bar">
                <div class="date-label">${date}</div>
                <div class="bar-container">
                    <div class="bar-fill" style="width: ${percentage}%"></div>
                    <div class="bar-count">${count}</div>
                </div>
            </div>
        `;
    }).join('');
}

function updateResponsesTable(responses) {
    const tbody = document.getElementById('responses-tbody');
    
    if (responses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 20px; color: #999;">No responses yet</td></tr>';
        return;
    }
    
    // Calculate prices
    const prices = calculatePrices(responses);
    
    tbody.innerHTML = responses.map(response => {
        const price = prices[response.id] || 0;
        const titleDisplay = {
            'master': '📚 Master Student',
            'doctoral': '🎓 Doctoral Student',
            'staff': '👨‍🏫 Teachers & Staff'
        }[response.title] || response.title;
        
        const paymentIcon = response.payment_status ? 
            '<span style="color: #10b981;">✓ Paid</span>' : 
            '<span style="color: #ef4444;">✗ Unpaid</span>';
        
        const paymentCheckbox = `
            <input type="checkbox" 
                   ${response.payment_status ? 'checked' : ''} 
                   onchange="togglePaymentStatus('${response.id}', this.checked)"
                   style="cursor: pointer; width: 18px; height: 18px;">
        `;
        
        return `
            <tr>
                <td>${response.name}</td>
                <td><span class="status-badge ${response.will_attend === 'yes' ? 'status-yes' : 'status-no'}">${response.will_attend === 'yes' ? 'Yes' : 'No'}</span></td>
                <td>${titleDisplay}</td>
                <td>${response.will_attend === 'yes' && response.available_dates ? response.available_dates.join(', ') : 'N/A'}</td>
                <td>¥${price.toFixed(2)}</td>
                <td>${paymentIcon}</td>
                <td>${paymentCheckbox}</td>
            </tr>
        `;
    }).join('');
}

function calculatePrices(responses) {
    const settings = adminSettings;
    const totalCost = parseFloat(settings.total_cost) || 0;
    
    if (totalCost === 0) {
        return {}; // No prices if total cost not set
    }
    
    // Count attending people by title
    const masterCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'master').length;
    const doctoralCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'doctoral').length;
    const staffCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'staff').length;
    
    const masterPercentage = parseFloat(settings.master_percentage) || 0;
    const doctoralPercentage = parseFloat(settings.doctoral_percentage) || 0;
    const staffPercentage = parseFloat(settings.staff_percentage) || 0;
    
    // Calculate per-person prices
    const masterPrice = masterCount > 0 ? (totalCost * masterPercentage / 100) / masterCount : 0;
    const doctoralPrice = doctoralCount > 0 ? (totalCost * doctoralPercentage / 100) / doctoralCount : 0;
    const staffPrice = staffCount > 0 ? (totalCost * staffPercentage / 100) / staffCount : 0;
    
    // Create price map
    const priceMap = {};
    responses.forEach(response => {
        if (response.will_attend === 'yes') {
            if (response.title === 'master') priceMap[response.id] = masterPrice;
            else if (response.title === 'doctoral') priceMap[response.id] = doctoralPrice;
            else if (response.title === 'staff') priceMap[response.id] = staffPrice;
        } else {
            priceMap[response.id] = 0;
        }
    });
    
    return priceMap;
}

// ===== EVENT HANDLERS =====

function togglePaymentStatus(responseId, paid) {
    const success = updateResponsePaymentStatus(responseId, paid);
    if (success) {
        updateDashboard();
    } else {
        alert('Failed to update payment status');
    }
}

function filterResponses(filter) {
    const allButtons = document.querySelectorAll('.filter-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    
    event.target.classList.add('active');
    
    const responses = loadPollResponses();
    let filtered = responses;
    
    if (filter === 'attending') {
        filtered = responses.filter(r => r.will_attend === 'yes');
    } else if (filter === 'not-attending') {
        filtered = responses.filter(r => r.will_attend === 'no');
    } else if (filter === 'paid') {
        filtered = responses.filter(r => r.payment_status === true);
    } else if (filter === 'unpaid') {
        filtered = responses.filter(r => r.payment_status === false);
    }
    
    updateResponsesTable(filtered);
}

function searchResponses() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const responses = loadPollResponses();
    
    const filtered = responses.filter(response => {
        return response.name.toLowerCase().includes(searchTerm) ||
               (response.available_dates && response.available_dates.some(d => d.toLowerCase().includes(searchTerm)));
    });
    
    updateResponsesTable(filtered);
}

// ===== MODAL FUNCTIONS =====

function openPriceSettings() {
    const settings = adminSettings;
    
    document.getElementById('total-cost').value = settings.total_cost || 0;
    document.getElementById('master-percentage').value = settings.master_percentage || 20;
    document.getElementById('doctoral-percentage').value = settings.doctoral_percentage || 30;
    document.getElementById('staff-percentage').value = settings.staff_percentage || 50;
    
    updatePricePreview();
    
    document.getElementById('price-modal').style.display = 'flex';
}

function closePriceSettings() {
    document.getElementById('price-modal').style.display = 'none';
}

function updatePricePreview() {
    const totalCost = parseFloat(document.getElementById('total-cost').value) || 0;
    const masterPerc = parseFloat(document.getElementById('master-percentage').value) || 0;
    const doctoralPerc = parseFloat(document.getElementById('doctoral-percentage').value) || 0;
    const staffPerc = parseFloat(document.getElementById('staff-percentage').value) || 0;
    
    const total = masterPerc + doctoralPerc + staffPerc;
    const totalDisplay = document.getElementById('percentage-total');
    totalDisplay.textContent = `Total: ${total.toFixed(1)}%`;
    
    if (Math.abs(total - 100) < 0.1) {
        totalDisplay.style.color = '#10b981';
        totalDisplay.innerHTML = `Total: ${total.toFixed(1)}% ✓`;
    } else {
        totalDisplay.style.color = '#ef4444';
        totalDisplay.innerHTML = `Total: ${total.toFixed(1)}% ⚠ (Must equal 100%)`;
    }
    
    // Count people by title
    const responses = loadPollResponses();
    const masterCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'master').length;
    const doctoralCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'doctoral').length;
    const staffCount = responses.filter(r => r.will_attend === 'yes' && r.title === 'staff').length;
    
    // Calculate prices
    const masterPrice = masterCount > 0 ? (totalCost * masterPerc / 100) / masterCount : 0;
    const doctoralPrice = doctoralCount > 0 ? (totalCost * doctoralPerc / 100) / doctoralCount : 0;
    const staffPrice = staffCount > 0 ? (totalCost * staffPerc / 100) / staffCount : 0;
    
    document.getElementById('preview-master').textContent = `Master: ¥${masterPrice.toFixed(2)} × ${masterCount} = ¥${(masterPrice * masterCount).toFixed(2)}`;
    document.getElementById('preview-doctoral').textContent = `Doctoral: ¥${doctoralPrice.toFixed(2)} × ${doctoralCount} = ¥${(doctoralPrice * doctoralCount).toFixed(2)}`;
    document.getElementById('preview-staff').textContent = `Staff: ¥${staffPrice.toFixed(2)} × ${staffCount} = ¥${(staffPrice * staffCount).toFixed(2)}`;
}

function savePriceSettings() {
    const totalCost = parseFloat(document.getElementById('total-cost').value) || 0;
    const masterPerc = parseFloat(document.getElementById('master-percentage').value) || 0;
    const doctoralPerc = parseFloat(document.getElementById('doctoral-percentage').value) || 0;
    const staffPerc = parseFloat(document.getElementById('staff-percentage').value) || 0;
    
    const total = masterPerc + doctoralPerc + staffPerc;
    
    if (Math.abs(total - 100) > 0.1) {
        alert('Error: Percentages must total 100%');
        return;
    }
    
    adminSettings.total_cost = totalCost;
    adminSettings.master_percentage = masterPerc;
    adminSettings.doctoral_percentage = doctoralPerc;
    adminSettings.staff_percentage = staffPerc;
    
    if (saveAdminSettings(adminSettings)) {
        alert('Price settings saved successfully!');
        closePriceSettings();
        updateDashboard();
    } else {
        alert('Failed to save price settings');
    }
}

function openPollTitleSettings() {
    const settings = adminSettings;
    document.getElementById('poll-title-input').value = settings.poll_title || getDefaultPollTitle();
    document.getElementById('title-modal').style.display = 'flex';
}

function closePollTitleSettings() {
    document.getElementById('title-modal').style.display = 'none';
}

function resetToDefaultTitle() {
    document.getElementById('poll-title-input').value = getDefaultPollTitle();
}

function savePollTitle() {
    const newTitle = document.getElementById('poll-title-input').value.trim();
    
    if (!newTitle) {
        alert('Title cannot be empty');
        return;
    }
    
    adminSettings.poll_title = newTitle;
    
    if (saveAdminSettings(adminSettings)) {
        alert('Poll title saved successfully!');
        closePollTitleSettings();
    } else {
        alert('Failed to save poll title');
    }
}

function openChangePassword() {
    document.getElementById('password-modal').style.display = 'flex';
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
}

function closeChangePassword() {
    document.getElementById('password-modal').style.display = 'none';
}

function saveNewPassword() {
    const currentPwd = document.getElementById('current-password').value;
    const newPwd = document.getElementById('new-password').value;
    const confirmPwd = document.getElementById('confirm-password').value;
    
    if (!currentPwd || !newPwd || !confirmPwd) {
        alert('Please fill in all fields');
        return;
    }
    
    if (currentPwd !== adminSettings.password) {
        alert('Current password is incorrect');
        return;
    }
    
    if (newPwd !== confirmPwd) {
        alert('New passwords do not match');
        return;
    }
    
    if (newPwd.length < 6) {
        alert('New password must be at least 6 characters');
        return;
    }
    
    adminSettings.password = newPwd;
    
    if (saveAdminSettings(adminSettings)) {
        alert('Password changed successfully!');
        closeChangePassword();
    } else {
        alert('Failed to change password');
    }
}

// ===== EXPORT FUNCTIONS =====

function exportToCSV() {
    const responses = loadPollResponses();
    if (responses.length === 0) {
        alert('No data to export');
        return;
    }
    
    const prices = calculatePrices(responses);
    
    let csv = 'Name,Attending,Title,Available Dates,Price,Payment Status\n';
    
    responses.forEach(response => {
        const price = prices[response.id] || 0;
        const titleDisplay = {
            'master': 'Master Student',
            'doctoral': 'Doctoral Student',
            'staff': 'Teachers & Staff'
        }[response.title] || response.title;
        const dates = response.available_dates ? response.available_dates.join('; ') : 'N/A';
        const paymentStatus = response.payment_status ? 'Paid' : 'Unpaid';
        
        csv += `"${response.name}","${response.will_attend}","${titleDisplay}","${dates}",¥${price.toFixed(2)},"${paymentStatus}"\n`;
    });
    
    downloadFile(csv, 'poll_responses.csv', 'text/csv');
}

function exportToXLSX() {
    alert('XLSX export requires additional library. Using CSV format instead.');
    exportToCSV();
}

function exportToPDF() {
    alert('PDF export requires additional library. Please use Print function or CSV export.');
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// ===== INITIALIZATION =====

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎛️ Admin Dashboard Loading...');
    
    // Check authentication
    if (!checkAuthentication()) {
        return;
    }
    
    // Load data
    loadAdminSettings();
    loadPollResponses();
    
    // Update dashboard
    updateDashboard();
    
    // Attach event listeners
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    document.getElementById('price-settings-btn').addEventListener('click', openPriceSettings);
    document.getElementById('title-settings-btn').addEventListener('click', openPollTitleSettings);
    document.getElementById('change-password-btn').addEventListener('click', openChangePassword);
    document.getElementById('export-csv-btn').addEventListener('click', exportToCSV);
    document.getElementById('export-xlsx-btn').addEventListener('click', exportToXLSX);
    document.getElementById('export-pdf-btn').addEventListener('click', exportToPDF);
    document.getElementById('search-input').addEventListener('input', searchResponses);
    
    // Input listeners for price preview
    ['total-cost', 'master-percentage', 'doctoral-percentage', 'staff-percentage'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updatePricePreview);
        }
    });
    
    console.log('✅ Admin Dashboard Ready');
});
