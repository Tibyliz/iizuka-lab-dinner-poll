// Admin Login JavaScript

// Initialize default password on first load
window.addEventListener('DOMContentLoaded', () => {
    // Set default password if not exists
    if (!localStorage.getItem('admin_password')) {
        localStorage.setItem('admin_password', 'iizukalab');
    }
    
    // Check if already logged in
    checkSession();
});

// Check if user is already logged in
function checkSession() {
    const session = localStorage.getItem('admin_session');
    if (session) {
        const sessionData = JSON.parse(session);
        const now = Date.now();
        
        // Check if session is still valid (24 hours)
        if (now - sessionData.timestamp < 24 * 60 * 60 * 1000) {
            window.location.href = 'admin.html';
        } else {
            // Session expired
            localStorage.removeItem('admin_session');
        }
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const storedPassword = localStorage.getItem('admin_password');
    
    if (password === storedPassword) {
        // Create session
        const session = {
            authenticated: true,
            timestamp: Date.now()
        };
        
        localStorage.setItem('admin_session', JSON.stringify(session));
        
        // Redirect to admin page
        window.location.href = 'admin.html';
    } else {
        // Show error message
        const errorMessage = document.getElementById('errorMessage');
        errorMessage.textContent = 'Incorrect password. Please try again.';
        errorMessage.style.display = 'block';
        
        // Hide error after 3 seconds
        setTimeout(() => {
            errorMessage.style.display = 'none';
        }, 3000);
    }
});

// Toggle password visibility
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.toggle-password i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.classList.remove('fa-eye');
        toggleBtn.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleBtn.classList.remove('fa-eye-slash');
        toggleBtn.classList.add('fa-eye');
    }
}
