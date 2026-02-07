// This file manages the admin dashboard functionalities, including user monitoring and seller verification processes.

document.addEventListener('DOMContentLoaded', function() {
    const userList = document.getElementById('user-list');
    const sellerRequests = document.getElementById('seller-requests');

    // Simulated data for users and seller requests
    const users = [
        { id: 1, email: 'user1@example.com', status: 'active' },
        { id: 2, email: 'user2@example.com', status: 'inactive' },
    ];

    const sellers = [
        { id: 1, email: 'seller1@example.com', status: 'pending' },
        { id: 2, email: 'seller2@example.com', status: 'pending' },
    ];

    // Function to render user list
    function renderUserList() {
        userList.innerHTML = '';
        users.forEach(user => {
            const li = document.createElement('li');
            li.textContent = `${user.email} - ${user.status}`;
            userList.appendChild(li);
        });
    }

    // Function to render seller requests
    function renderSellerRequests() {
        sellerRequests.innerHTML = '';
        sellers.forEach(seller => {
            const li = document.createElement('li');
            li.textContent = `${seller.email} - ${seller.status}`;
            const approveButton = document.createElement('button');
            approveButton.textContent = 'Approve';
            approveButton.onclick = () => approveSeller(seller.id);
            const rejectButton = document.createElement('button');
            rejectButton.textContent = 'Reject';
            rejectButton.onclick = () => rejectSeller(seller.id);
            li.appendChild(approveButton);
            li.appendChild(rejectButton);
            sellerRequests.appendChild(li);
        });
    }

    // Function to approve a seller
    function approveSeller(id) {
        const seller = sellers.find(s => s.id === id);
        if (seller) {
            seller.status = 'approved';
            renderSellerRequests();
        }
    }

    // Function to reject a seller
    function rejectSeller(id) {
        const sellerIndex = sellers.findIndex(s => s.id === id);
        if (sellerIndex > -1) {
            sellers.splice(sellerIndex, 1);
            renderSellerRequests();
        }
    }

    // Initial render
    renderUserList();
    renderSellerRequests();
});