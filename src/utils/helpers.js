function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6; // Example: Password must be at least 6 characters
}

function showMessage(message, type) {
    const messageBox = document.createElement('div');
    messageBox.className = `message ${type}`;
    messageBox.textContent = message;
    document.body.appendChild(messageBox);
    
    setTimeout(() => {
        messageBox.remove();
    }, 3000);
}

function clearForm(form) {
    form.reset();
}