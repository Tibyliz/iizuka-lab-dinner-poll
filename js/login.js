// Admin Login Logic
console.log('[Login] Script loaded');

// Default admin password (can be changed)
const ADMIN_PASSWORD = 'iizukalab';

// DOM Elements
const loginForm = document.getElementById('login-form');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('error-message');

// Check if already logged in
if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    console.log('[Login] Already logged in, redirecting...');
    window.location.href = 'admin.html';
}

// Handle login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('[Login] Form submitted');
    
    const password = passwordInput.value;
    
    // Validate password
    if (password === ADMIN_PASSWORD) {
        console.log('[Login] Password correct');
        
        // Set session
        sessionStorage.setItem('adminLoggedIn', 'true');
        
        // Show success message briefly
        showSuccess('Login successful! Redirecting...');
        
        // Redirect to admin page
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 500);
        
    } else {
        console.log('[Login] Password incorrect');
        showError('Incorrect password. Please try again.');
        passwordInput.value = '';
        passwordInput.focus();
    }
});

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.color = '#c33';
    errorMessage.style.background = '#fee';
    errorMessage.style.border = '1px solid #fcc';
    errorMessage.style.padding = '10px';
    errorMessage.style.borderRadius = '8px';
    errorMessage.style.marginTop = '10px';
}

// Show success message
function showSuccess(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    errorMessage.style.color = '#3c3';
    errorMessage.style.background = '#efe';
    errorMessage.style.border = '1px solid #cfc';
    errorMessage.style.padding = '10px';
    errorMessage.style.borderRadius = '8px';
    errorMessage.style.marginTop = '10px';
}

console.log('[Login] Ready');
