// Debug login - this will show us exactly what's happening
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    console.log('=== LOGIN ATTEMPT ===');
    console.log('Email:', email);
    console.log('Password:', password);
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Show loading
    const loginButton = document.querySelector('button[onclick="login()"]');
    if (loginButton) {
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;
    }

    // Try different URLs one at a time
    // Uncomment the one you want to test:
    
    // TEST 1: Using /login (relative path - use if HTML is served from server)
    // const loginUrl = '/login';
    
    // TEST 2: Using full URL with localhost
    const loginUrl = 'http://localhost:3001/login';
    
    // TEST 3: Using full URL with 127.0.0.1
    // const loginUrl = 'http://127.0.0.1:3001/login';
    
    console.log('Attempting to fetch:', loginUrl);
    
    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(async response => {
        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);
        
        // Get the response as text first
        const text = await response.text();
        console.log('Raw response (first 500 chars):', text.substring(0, 500));
        console.log('Response length:', text.length);
        console.log('Is HTML?', text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html'));
        
        // If it's HTML, show the error clearly
        if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
            throw new Error('Server returned HTML instead of JSON. This usually means:\n' +
                           '1. The server is not running\n' +
                           '2. The endpoint "/login" does not exist\n' +
                           '3. You are accessing the wrong URL');
        }
        
        // Try to parse as JSON
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Invalid JSON response: ' + text.substring(0, 100));
        }
    })
    .then(data => {
        console.log('Parsed data:', data);
        
        if (data.success) {
            localStorage.setItem('loggedUser', JSON.stringify(data.user));
            localStorage.setItem('authToken', data.token);
            alert('Login successful!');
            window.location.href = 'search.html';
        } else {
            alert('Login failed: ' + (data.error || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error details:', error);
        alert('Error: ' + error.message);
    })
    .finally(() => {
        if (loginButton) {
            loginButton.textContent = 'Login';
            loginButton.disabled = false;
        }
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
