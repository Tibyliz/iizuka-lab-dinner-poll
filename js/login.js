// Password visibility toggle
document.getElementById('togglePassword').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// Check if already logged in
function checkAuth() {
    const authToken = localStorage.getItem('admin_auth');
    const authTime = localStorage.getItem('admin_auth_time');
    
    if (authToken && authTime) {
        const now = Date.now();
        const authAge = now - parseInt(authTime);
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        
        if (authAge < maxAge) {
            window.location.href = 'admin.html';
            return true;
        } else {
            localStorage.removeItem('admin_auth');
            localStorage.removeItem('admin_auth_time');
        }
    }
    return false;
}

// Initialize default admin settings
async function initializeAdminSettings() {
    try {
        const response = await fetch('tables/admin_settings?limit=1');
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            // Create default settings
            await fetch('tables/admin_settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: 'iizukalab',
                    total_cost: 0,
                    master_percent: 20,
                    doctoral_percent: 30,
                    staff_percent: 50,
                    current_poll_id: 'poll_' + Date.now(),
                    poll_title: getDefaultTitle()
                })
            });
        }
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
}

// Get default title
function getDefaultTitle() {
    const now = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('errorMessage');
    
    try {
        const response = await fetch('tables/admin_settings?limit=1');
        const data = await response.json();
        
        if (!data.data || data.data.length === 0) {
            await initializeAdminSettings();
            const retryResponse = await fetch('tables/admin_settings?limit=1');
            const retryData = await retryResponse.json();
            
            if (retryData.data && retryData.data.length > 0) {
                if (password === retryData.data[0].password) {
                    localStorage.setItem('admin_auth', 'authenticated');
                    localStorage.setItem('admin_auth_time', Date.now().toString());
                    window.location.href = 'admin.html';
                    return;
                }
            }
        } else {
            if (password === data.data[0].password) {
                localStorage.setItem('admin_auth', 'authenticated');
                localStorage.setItem('admin_auth_time', Date.now().toString());
                window.location.href = 'admin.html';
                return;
            }
        }
        
        errorMsg.style.display = 'flex';
    } catch (error) {
        console.error('Error:', error);
        errorMsg.querySelector('#errorText').textContent = 'Error connecting to server. Please try again.';
        errorMsg.style.display = 'flex';
    }
});

// Check auth on page load
checkAuth();
initializeAdminSettings();
