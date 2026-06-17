const API_URL = 'http://localhost:3001'; 

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    // Show loading state
    const loginButton = document.querySelector('button[onclick="login()"]');
    if (loginButton) {
        loginButton.textContent = 'Logging in...';
        loginButton.disabled = true;
    }
    
    
    fetch(`${API_URL}/login`, {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        // Check if response is OK
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || `Server error: ${response.status}`);
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            // Store the JWT token and user data
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
        // Reset button
        if (loginButton) {
            loginButton.textContent = 'Login';
            loginButton.disabled = false;
        }
    });
}


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


if (localStorage.getItem('authToken')) {
    const user = JSON.parse(localStorage.getItem('loggedUser') || '{}');
    if (user.firstName) {
        console.log('Already logged in as:', user.firstName);
        
    }
}
