
function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Store the JWT token and user data
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('loggedUser', JSON.stringify(data.user));
            
            // Redirect to home page
            window.location.href = '../index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}
