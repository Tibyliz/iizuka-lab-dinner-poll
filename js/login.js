/**
 * Admin Login Logic
 * Simple password-based authentication
 */

const ADMIN_PASSWORD = 'iizukalab';
const SESSION_KEY = 'adminLoggedIn';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// ============================================
// CHECK EXISTING SESSION
// ============================================

// If already logged in, redirect to admin
if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    const loginTime = sessionStorage.getItem('loginTime');
    const now = Date.now();
    
    if (loginTime && (now - parseInt(loginTime)) < SESSION_DURATION) {
        console.log('[Login] Active session found, redirecting...');
        window.location.href = 'admin.html';
    } else {
        // Session expired
        sessionStorage.removeItem(SESSION_KEY);
        sessionStorage.removeItem('loginTime');
    }
}

// ============================================
// FORM SUBMISSION
// ============================================

document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const statusEl = document.getElementById('loginStatus');
    
    console.log('[Login] Login attempt');
    
    // Disable button
    loginBtn.disabled = true;
    loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
    
    // Simulate slight delay for UX
    setTimeout(() => {
        if (password === ADMIN_PASSWORD) {
            console.log('[Login] ✅ Password correct');
            
            // Set session
            sessionStorage.setItem(SESSION_KEY, 'true');
            sessionStorage.setItem('loginTime', Date.now().toString());
            
            // Show success
            statusEl.textContent = '✅ Login successful! Redirecting...';
            statusEl.className = 'status-message success';
            statusEl.style.display = 'block';
            
            // Redirect after short delay
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 800);
            
        } else {
            console.log('[Login] ❌ Password incorrect');
            
            // Show error
            statusEl.textContent = '❌ Incorrect password. Please try again.';
            statusEl.className = 'status-message error';
            statusEl.style.display = 'block';
            
            // Re-enable button
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
            
            // Clear password field
            document.getElementById('password').value = '';
            document.getElementById('password').focus();
            
            // Hide error after 3 seconds
            setTimeout(() => {
                statusEl.style.display = 'none';
            }, 3000);
        }
    }, 500);
});

console.log('[Login] Script loaded');
