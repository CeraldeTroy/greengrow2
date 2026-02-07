// This file handles the login and registration logic, including validation and simulating user registration status.

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            // Simulate login validation
            if (validateEmail(email) && password) {
                alert('Login successful!');
                // Redirect to admin dashboard or another page
                window.location.href = 'admin.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const confirmPassword = registerForm.confirmPassword.value;

            // Simulate registration validation
            if (validateEmail(email) && password && password === confirmPassword) {
                alert('Registration successful! You can now log in.');
                // Optionally redirect to login page
                window.location.href = 'login.html';
            } else {
                alert('Please ensure all fields are filled correctly and passwords match.');
            }
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
});