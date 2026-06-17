// Use the correct endpoint - your server uses /login, not /api/login
const API_URL = 'http://localhost:3001';

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Show loading
    const loginButton = document.querySelector('button');
    const originalText = loginButton.textContent;
    loginButton.textContent = 'Logging in...';
    loginButton.disabled = true;
    
    // CORRECTED: Use /login instead of /api/login
    fetch(`${API_URL}/login`, {  // <-- Changed from '/api/login' to '/login'
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        console.log('Response status:', response.status);
        
        // If response is not OK, get the error message
        if (!response.ok) {
            const text = await response.text();
            console.error('Error response:', text);
            throw new Error(`Server error: ${response.status} - ${response.statusText}`);
        }
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            console.error('Non-JSON response:', text.substring(0, 200));
            throw new Error('Server returned HTML. Make sure the server is running correctly.');
        }
        
        return response.json();
    })
    .then(data => {
        console.log('Login response:', data);
        
        if (data.success) {
            // Store token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('loggedUser', JSON.stringify(data.user));
            
            alert('Login successful! Welcome ' + data.user.firstName + '!');
            
            // Redirect to home page
            window.location.href = '../index.html';
        } else {
            alert(data.error || 'Login failed');
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        alert('Error: ' + error.message);
    })
    .finally(() => {
        loginButton.textContent = originalText;
        loginButton.disabled = false;
    });
}

// Enter key support
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                login();
            }
        });
    }
});
