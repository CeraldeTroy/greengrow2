document.addEventListener('DOMContentLoaded', function() {
    // Smooth background animation
    const body = document.body;
    let backgroundIndex = 0;
    const backgrounds = [
        'url("path/to/nature1.jpg")',
        'url("path/to/nature2.jpg")',
        'url("path/to/nature3.jpg")'
    ];

    function changeBackground() {
        backgroundIndex = (backgroundIndex + 1) % backgrounds.length;
        body.style.backgroundImage = backgrounds[backgroundIndex];
    }

    setInterval(changeBackground, 5000); // Change background every 5 seconds

    // Navigation handling
    const loginButton = document.getElementById('loginButton');
    const registerButton = document.getElementById('registerButton');

    if (loginButton) {
        loginButton.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }

    if (registerButton) {
        registerButton.addEventListener('click', function() {
            window.location.href = 'register.html';
        });
    }

    // Popup message handling
    function showMessage(message) {
        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerText = message;
        body.appendChild(messageBox);

        setTimeout(() => {
            messageBox.remove();
        }, 3000);
    }

    // Example usage of showMessage
    // showMessage('Welcome to GreenGrow!');
});