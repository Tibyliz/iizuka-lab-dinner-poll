/**
 * Login Authentication Handler
 * Handles admin authentication with session management
 * Default password: iizukalab
 */

// Configuration
const DEFAULT_PASSWORD = 'iizukalab';
const SESSION_KEY = 'iizuka_admin_authenticated';
const SESSION_TIMESTAMP = 'iizuka_admin_timestamp';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

console.log('[Login] Login system initialized');

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('[Login] DOM loaded, setting up login form');
    
    // Check if already logged in
    if (isAuthenticated()) {
        console.log('[Login] Already authenticated, redirecting to admin page');
        window.location.href = 'admin.html';
        return;
    }
    
    // Setup login form
    const loginForm = document.getElementById('loginForm');
    const passwordInput = document.getElementById('passwordInput');
    const loginButton = document.getElementById('loginButton');
    const errorMessage = document.getElementById('errorMessage');
    
    if (!loginForm || !passwordInput) {
        console.error('[Login] ERROR: Login form elements not found!');
        console.error('[Login] loginForm:', loginForm);
        console.error('[Login] passwordInput:', passwordInput);
        return;
    }
    
    console.log('[Login] Form elements found successfully');
    
    // Focus on password input
    passwordInput.focus();
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('[Login] Form submitted');
        
        const password = passwordInput.value.trim();
        console.log('[Login] Password entered (length):', password.length);
        
        // Validate password
        if (!password) {
            console.warn('[Login] Empty password');
            showError('Please enter a password');
            return;
        }
        
        // Check password
        if (password === DEFAULT_PASSWORD) {
            console.log('[Login] ✅ Password correct!');
            
            // Set session
            try {
                sessionStorage.setItem(SESSION_KEY, 'true');
                sessionStorage.setItem(SESSION_TIMESTAMP, Date.now().toString());
                console.log('[Login] Session set successfully');
                console.log('[Login] Session value:', sessionStorage.getItem(SESSION_KEY));
            } catch (err) {
                console.error('[Login] ERROR setting session:', err);
                showError('Error saving session. Please try again.');
                return;
            }
            
            // Show success message
            showSuccess('Login successful! Redirecting...');
            
            // Redirect to admin page
            console.log('[Login] Redirecting to admin.html');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 500);
            
        } else {
            console.warn('[Login] ❌ Incorrect password');
            showError('Incorrect password. Please try again.');
            passwordInput.value = '';
            passwordInput.focus();
        }
    });
    
    // Handle Enter key in password field
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
    
    console.log('[Login] Event listeners attached successfully');
});

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    try {
        const authenticated = sessionStorage.getItem(SESSION_KEY);
        const timestamp = sessionStorage.getItem(SESSION_TIMESTAMP);
        
        console.log('[Login] Checking authentication...');
        console.log('[Login] authenticated:', authenticated);
        console.log('[Login] timestamp:', timestamp);
        
        if (!authenticated || authenticated !== 'true') {
            console.log('[Login] Not authenticated');
            return false;
        }
        
        if (!timestamp) {
            console.log('[Login] No timestamp found');
            return false;
        }
        
        // Check if session has expired
        const now = Date.now();
        const sessionAge = now - parseInt(timestamp);
        
        console.log('[Login] Session age (ms):', sessionAge);
        console.log('[Login] Session duration (ms):', SESSION_DURATION);
        
        if (sessionAge > SESSION_DURATION) {
            console.log('[Login] Session expired');
            logout();
            return false;
        }
        
        console.log('[Login] ✅ Authenticated and session valid');
        return true;
        
    } catch (err) {
        console.error('[Login] Error checking authentication:', err);
        return false;
    }
}

/**
 * Logout user
 */
function logout() {
    console.log('[Login] Logging out...');
    try {
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem(SESSION_TIMESTAMP);
        console.log('[Login] Session cleared');
        window.location.href = 'admin-login.html';
    } catch (err) {
        console.error('[Login] Error during logout:', err);
    }
}

/**
 * Show error message
 */
function showError(message) {
    console.log('[Login] Showing error:', message);
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.className = 'message error-message show';
        errorDiv.style.display = 'block';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            errorDiv.classList.remove('show');
            setTimeout(() => {
                errorDiv.style.display = 'none';
            }, 300);
        }, 3000);
    }
}

/**
 * Show success message
 */
function showSuccess(message) {
    console.log('[Login] Showing success:', message);
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.className = 'message success-message show';
        errorDiv.style.display = 'block';
    }
}

// Export for use in other files
window.isAuthenticated = isAuthenticated;
window.logout = logout;

console.log('[Login] Login.js loaded successfully');
