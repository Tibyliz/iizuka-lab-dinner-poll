// Admin Login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // Initialize default password if not set
    initializeDefaultPassword();
    
    // Initialize default settings
    initializeDefaultSettings();
    
    // Set up event listeners
    setupLoginEventListeners();
});

// Initialize default password
function initializeDefaultPassword() {
    if (!localStorage.getItem('admin_password')) {
        localStorage.setItem('admin_password', 'iizukalab');
        console.log('Default password initialized: iizukalab');
    }
}

// Initialize default settings
function initializeDefaultSettings() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    if (!settings.current_poll_id) {
        settings.current_poll_id = 'poll_1';
    }
    
    if (!settings.poll_title) {
        settings.poll_title = getDefaultTitle();
    }
    
    if (!settings.total_cost) {
        settings.total_cost = 0;
    }
    
    if (!settings.master_percent) {
        settings.master_percent = 20;
    }
    
    if (!settings.doctoral_percent) {
        settings.doctoral_percent = 30;
    }
    
    if (!settings.staff_percent) {
        settings.staff_percent = 50;
    }
    
    localStorage.setItem('admin_settings', JSON.stringify(settings));
    console.log('Settings initialized:', settings);
}

// Get default title
function getDefaultTitle() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();
    return `Iizuka Lab ${month} ${year} Group Dinner Poll`;
}

// Set up event listeners
function setupLoginEventListeners() {
    // Toggle password visibility
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
    
    // Form submission
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', handleLogin);
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    console.log('Login form submitted');
    
    const passwordInput = document.getElementById('password');
    const password = passwordInput.value;
    const storedPassword = localStorage.getItem('admin_password');
    
    const errorMessage = document.getElementById('errorMessage');
    const loadingMessage = document.getElementById('loadingMessage');
    
    // Hide error, show loading
    errorMessage.style.display = 'none';
    loadingMessage.style.display = 'flex';
    
    // Simulate authentication delay
    setTimeout(() => {
        if (password === storedPassword) {
            console.log('Login successful!');
            
            // Create session
            const session = {
                authenticated: true,
                timestamp: Date.now(),
                expiresIn: 24 * 60 * 60 * 1000 // 24 hours
            };
            
            localStorage.setItem('admin_session', JSON.stringify(session));
            console.log('Session created:', session);
            
            // Redirect to admin page
            loadingMessage.style.display = 'none';
            window.location.href = 'admin.html';
        } else {
            console.log('Invalid password');
            loadingMessage.style.display = 'none';
            errorMessage.style.display = 'flex';
            passwordInput.value = '';
            passwordInput.focus();
        }
    }, 500);
}
