// Admin Login JavaScript
console.log('Login.js loaded');

// Initialize default password
if (!localStorage.getItem('admin_password')) {
    localStorage.setItem('admin_password', 'iizukalab');
    console.log('Default password initialized: iizukalab');
}

// Toggle password visibility
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');

if (togglePassword && passwordInput) {
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = this.querySelector('i');
        if (icon) {
            icon.className = type === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash';
        }
    });
}

// Handle login form submission
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Login form submitted');

        const password = passwordInput ? passwordInput.value : '';
        const storedPassword = localStorage.getItem('admin_password') || 'iizukalab';
        const errorMessage = document.getElementById('errorMessage');
        const successMessage = document.getElementById('successMessage');

        console.log('Password entered:', password);
        console.log('Stored password:', storedPassword);

        // Hide previous messages
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';

        if (password === storedPassword) {
            console.log('Password correct! Creating session...');
            
            // Create session
            const session = {
                authenticated: true,
                timestamp: Date.now(),
                expiresIn: 24 * 60 * 60 * 1000 // 24 hours
            };
            
            localStorage.setItem('admin_session', JSON.stringify(session));
            console.log('Session created:', session);

            // Show success message
            if (successMessage) {
                successMessage.style.display = 'block';
            }

            // Redirect to admin page
            setTimeout(() => {
                console.log('Redirecting to admin.html...');
                window.location.href = 'admin.html';
            }, 500);
        } else {
            console.log('Password incorrect!');
            if (errorMessage) {
                errorMessage.textContent = 'Incorrect password. Please try again.';
                errorMessage.style.display = 'block';
            }
        }
    });
}

// Check if already logged in
const sessionData = localStorage.getItem('admin_session');
if (sessionData) {
    try {
        const session = JSON.parse(sessionData);
        const now = Date.now();
        
        if (session.authenticated && now < session.timestamp + session.expiresIn) {
            console.log('Already logged in, redirecting...');
            window.location.href = 'admin.html';
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
}

console.log('Login page ready');
