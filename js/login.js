// Login.js - Admin Authentication with localStorage (GitHub Pages Compatible)
// Fixed version that works reliably on GitHub Pages without SQL.js dependency

// Initialize admin settings on first load
function initializeAdminSettings() {
    try {
        // Check if admin settings exist
        let settings = localStorage.getItem('admin_settings');
        
        if (!settings) {
            // Create default admin settings
            const defaultSettings = {
                password: 'iizukalab',
                total_cost: 0,
                master_percentage: 20,
                doctoral_percentage: 30,
                staff_percentage: 50,
                poll_title: getDefaultPollTitle(),
                current_poll_id: generatePollId(),
                created_at: new Date().toISOString()
            };
            
            localStorage.setItem('admin_settings', JSON.stringify(defaultSettings));
            console.log('✅ Admin settings initialized with default password: iizukalab');
        }
        
        // Ensure poll responses array exists
        if (!localStorage.getItem('poll_responses')) {
            localStorage.setItem('poll_responses', JSON.stringify([]));
            console.log('✅ Poll responses initialized');
        }
        
        // Ensure archived polls array exists
        if (!localStorage.getItem('archived_polls')) {
            localStorage.setItem('archived_polls', JSON.stringify([]));
            console.log('✅ Archived polls initialized');
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error initializing admin settings:', error);
        return false;
    }
}

// Generate default poll title with current month and year
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

// Generate unique poll ID
function generatePollId() {
    return 'poll_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Handle login form submission
function handleLogin(event) {
    event.preventDefault();
    
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');
    const submitButton = event.target.querySelector('button[type="submit"]');
    
    // Clear previous error
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    // Disable submit button
    submitButton.disabled = true;
    submitButton.textContent = 'Logging in...';
    
    try {
        // Initialize settings if needed
        const initialized = initializeAdminSettings();
        
        if (!initialized) {
            throw new Error('Failed to initialize admin settings');
        }
        
        // Get admin settings
        const settingsStr = localStorage.getItem('admin_settings');
        if (!settingsStr) {
            throw new Error('Admin settings not found');
        }
        
        const settings = JSON.parse(settingsStr);
        const inputPassword = passwordInput.value.trim();
        
        // Verify password
        if (inputPassword === settings.password) {
            // Set session
            const session = {
                authenticated: true,
                loginTime: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            };
            
            sessionStorage.setItem('admin_session', JSON.stringify(session));
            
            // Redirect to admin page
            window.location.href = 'admin.html';
        } else {
            // Wrong password
            errorMessage.textContent = 'Incorrect password. Please try again.';
            errorMessage.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('Login error:', error);
        errorMessage.textContent = 'Login failed: ' + error.message;
        errorMessage.style.display = 'block';
    } finally {
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = 'Login';
    }
}

// Toggle password visibility
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// Check if already logged in
function checkExistingSession() {
    try {
        const sessionStr = sessionStorage.getItem('admin_session');
        
        if (sessionStr) {
            const session = JSON.parse(sessionStr);
            const now = new Date();
            const expiresAt = new Date(session.expiresAt);
            
            // Check if session is still valid
            if (session.authenticated && now < expiresAt) {
                // Redirect to admin page
                window.location.href = 'admin.html';
                return true;
            } else {
                // Session expired, clear it
                sessionStorage.removeItem('admin_session');
            }
        }
    } catch (error) {
        console.error('Error checking session:', error);
        sessionStorage.removeItem('admin_session');
    }
    
    return false;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Admin Login Page Loaded');
    
    // Check for existing session
    if (checkExistingSession()) {
        return; // Will redirect if valid session exists
    }
    
    // Initialize admin settings (creates default if doesn't exist)
    const initialized = initializeAdminSettings();
    
    if (initialized) {
        console.log('✅ System ready for login');
    } else {
        console.error('⚠️ Warning: System initialization had issues');
    }
    
    // Attach form submit handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Attach password toggle handler
    const toggleButton = document.querySelector('.toggle-password');
    if (toggleButton) {
        toggleButton.addEventListener('click', togglePasswordVisibility);
    }
    
    // Focus on password input
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.focus();
    }
});
