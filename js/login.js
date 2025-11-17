// Admin login JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('Login page loaded');
    
    // Initialize default password if not exists
    initializePassword();
    
    // Setup form submission
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
    
    // Toggle password visibility
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    }
});

// Initialize default password
function initializePassword() {
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    
    if (!settings.password) {
        settings.password = 'iizukalab';
        localStorage.setItem('admin_settings', JSON.stringify(settings));
        console.log('Default password initialized');
    }
}

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const passwordInput = document.getElementById('password');
    const password = passwordInput?.value;
    
    if (!password) {
        showError('Please enter a password');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('admin_settings') || '{}');
    const storedPassword = settings.password || 'iizukalab';
    
    console.log('Login attempt');
    
    if (password === storedPassword) {
        console.log('Password correct');
        
        // Create session
        const session = {
            authenticated: true,
            timestamp: Date.now(),
            expiresIn: 24 * 60 * 60 * 1000 // 24 hours
        };
        
        localStorage.setItem('admin_session', JSON.stringify(session));
        console.log('Session created');
        
        // Show success message
        showSuccess();
        
        // Redirect after short delay
        setTimeout(() => {
            console.log('Redirecting to admin.html');
            window.location.href = 'admin.html';
        }, 1000);
    } else {
        console.log('Password incorrect');
        showError('Incorrect password. Please try again.');
    }
}

// Show error message
function showError(message) {
    const errorMessage = document.getElementById('error-message');
    const errorText = document.getElementById('error-text');
    const successMessage = document.getElementById('success-message');
    
    if (errorText) errorText.textContent = message;
    if (errorMessage) {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        if (errorMessage) errorMessage.style.display = 'none';
    }, 3000);
}

// Show success message
function showSuccess() {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    if (errorMessage) errorMessage.style.display = 'none';
    if (successMessage) successMessage.style.display = 'block';
}
