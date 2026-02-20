// Admin Dashboard Management
// Handles charts, page navigation, and admin functionality

document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  initializeNavigation();
  initializeCharts();
  initializeUserManagement();
});

// Initialize Charts on Dashboard
function initializeCharts() {
  // Pie Chart - Users vs Sellers
  const pieCtx = document.getElementById('pieChart');
  if (pieCtx && typeof Chart !== 'undefined') {
    const pieChart = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Users', 'Sellers'],
        datasets: [{
          data: [65, 35],
          backgroundColor: [
            'rgba(46, 125, 50, 0.8)',
            'rgba(123, 191, 119, 0.8)',
          ],
          borderColor: [
            'rgba(46, 125, 50, 1)',
            'rgba(123, 191, 119, 1)',
          ],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: false,
          }
        }
      }
    });

    // Generate legend
    const legendContainer = document.getElementById('chartLegend');
    if (legendContainer) {
      legendContainer.innerHTML = `
        <div class="legend-item">
          <span class="swatch" style="background: rgba(46, 125, 50, 0.8);"></span>
          <span>Users (65%)</span>
        </div>
        <div class="legend-item">
          <span class="swatch" style="background: rgba(123, 191, 119, 0.8);"></span>
          <span>Sellers (35%)</span>
        </div>
      `;
    }
  }

  // Bar Chart - Sales & Activity Trend
  const barCtx = document.getElementById('barChart');
  if (barCtx && typeof Chart !== 'undefined') {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
        datasets: [
          {
            label: 'Sales ($)',
            data: [1200, 1900, 1600, 2100, 2400, 2800],
            backgroundColor: 'rgba(46, 125, 50, 0.7)',
            borderColor: 'rgba(46, 125, 50, 1)',
            borderWidth: 1.5,
            borderRadius: 8,
          },
          {
            label: 'Orders',
            data: [45, 67, 52, 71, 85, 92],
            backgroundColor: 'rgba(123, 191, 119, 0.7)',
            borderColor: 'rgba(123, 191, 119, 1)',
            borderWidth: 1.5,
            borderRadius: 8,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(46, 125, 50, 0.05)',
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        }
      }
    });
  }
}

// Initialize Dashboard Statistics
function initializeDashboard() {
  // Check if we need to show a specific page from external navigation
  const targetPage = sessionStorage.getItem('gg_targetPage');
  if(targetPage) {
    sessionStorage.removeItem('gg_targetPage');
    setTimeout(() => showPage(targetPage), 100);
  }
  
  // Sample data - in real application, fetch from backend
  const stats = {
    users: 245,
    sellers: 89,
    orders: 1340
  };

  // Update stat cards
  const usersStat = document.getElementById('stat-users');
  const sellersStat = document.getElementById('stat-sellers');
  const ordersStat = document.getElementById('stat-orders');
  
  if (usersStat) usersStat.textContent = stats.users;
  if (sellersStat) sellersStat.textContent = stats.sellers;
  if (ordersStat) ordersStat.textContent = stats.orders;

  // Load recent activity
  loadRecentActivity();
}

// Load recent activity
function loadRecentActivity() {
  const activities = [
    { type: 'order', text: 'New order #1045 from John Doe', time: '2 hours ago' },
    { type: 'seller', text: 'New seller registration from Jane Smith', time: '4 hours ago' },
    { type: 'listing', text: 'Plant listing approved: Rose Bush', time: '1 day ago' },
    { type: 'user', text: 'User account created by Mike Johnson', time: '1 day ago' },
    { type: 'order', text: 'Order #1042 marked as delivered', time: '2 days ago' },
  ];

  const recentList = document.getElementById('recentList');
  if (recentList) {
    recentList.innerHTML = activities.map((activity, index) => `
      <div class="item" style="margin-bottom: 8px;">
        <div>
          <span style="font-weight: 600; color: #2e7d32;">📌</span>
          <span style="margin-left: 8px;">${activity.text}</span>
        </div>
        <span style="color: #3b6b3b; font-size: 0.85rem;">${activity.time}</span>
      </div>
    `).join('');
  }
}

// Initialize Navigation between pages
function initializeNavigation() {
  const navLinks = document.querySelectorAll('.side-nav .nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      const page = this.getAttribute('data-page');
      
      // Allow normal navigation for external pages
      if (href === 'index.html' || href === 'profile.html' || href === 'password.html' || href.startsWith('http')) {
        return;
      }
      
      // If navigating to admin.html from external page with data-page, store it
      if (href === 'admin.html' && page) {
        sessionStorage.setItem('gg_targetPage', page);
      }
      
      e.preventDefault();
      
      if (page && window.location.pathname.includes('admin')) {
        // Already on admin.html, just show the page
        showPage(page);
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // Reinitialize page-specific functionality
        if(page === 'users'){
          initializeUserManagement();
        }
      } else if (href === 'admin.html') {
        // Navigate to admin.html if not already there
        window.location.href = 'admin.html';
      }
    });
  });
}

// Initialize user management page
function initializeUserManagement() {
  renderUsersTable();
  attachUserEventListeners();
}

// Render users table
function renderUsersTable() {
  const usersTable = document.getElementById('usersTable');
  if(!usersTable) return;
  
  // Get users from localStorage
  const users = JSON.parse(localStorage.getItem('gg_users') || '[]');
  
  usersTable.innerHTML = users.map((user, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${user.email}</td>
      <td>${user.name || 'N/A'}</td>
      <td><span class="badge-${user.active !== false ? 'active' : 'inactive'}">${user.active !== false ? 'Active' : 'Inactive'}</span></td>
      <td><button class="btn-sm deactivate-btn" data-email="${user.email}" data-active="${user.active !== false}">${user.active !== false ? 'Deactivate' : 'Activate'}</button></td>
    </tr>
  `).join('');
}

// Attach event listeners for user actions
function attachUserEventListeners() {
  const deactivateBtns = document.querySelectorAll('.deactivate-btn');
  deactivateBtns.forEach(btn => {
    btn.removeEventListener('click', handleUserDeactivate);
    btn.addEventListener('click', handleUserDeactivate);
  });
  
  const searchBtn = document.querySelector('.search-users-btn');
  if(searchBtn) {
    searchBtn.removeEventListener('click', handleUserSearch);
    searchBtn.addEventListener('click', handleUserSearch);
  }
}

// Handle user deactivation/activation
function handleUserDeactivate(e) {
  const email = this.dataset.email;
  const isActive = this.dataset.active === 'true';
  
  const users = JSON.parse(localStorage.getItem('gg_users') || '[]');
  const userIdx = users.findIndex(u => u.email === email);
  
  if(userIdx >= 0) {
    users[userIdx].active = !isActive;
    localStorage.setItem('gg_users', JSON.stringify(users));
    
    const action = isActive ? 'Deactivated' : 'Activated';
    showToast('User ' + action + ' successfully');
    renderUsersTable();
    attachUserEventListeners();
  }
}

// Handle user search
function handleUserSearch(e) {
  const searchInput = document.getElementById('userSearch');
  if(!searchInput) return;
  
  const searchTerm = searchInput.value.trim().toLowerCase();
  const usersTable = document.getElementById('usersTable');
  if(!usersTable) return;
  
  const users = JSON.parse(localStorage.getItem('gg_users') || '[]');
  const filtered = users.filter(u => 
    u.email.toLowerCase().includes(searchTerm) || 
    (u.name && u.name.toLowerCase().includes(searchTerm))
  );
  
  usersTable.innerHTML = filtered.map((user, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${user.email}</td>
      <td>${user.name || 'N/A'}</td>
      <td><span class="badge-${user.active !== false ? 'active' : 'inactive'}">${user.active !== false ? 'Active' : 'Inactive'}</span></td>
      <td><button class="btn-sm deactivate-btn" data-email="${user.email}" data-active="${user.active !== false}">${user.active !== false ? 'Deactivate' : 'Activate'}</button></td>
    </tr>
  `).join('');
  
  attachUserEventListeners();
}

// Show specific page
function showPage(pageName) {
  // Hide all pages
  const pages = document.querySelectorAll('.dashboard-page');
  pages.forEach(page => page.classList.remove('active'));
  
  // Show selected page
  const selectedPage = document.getElementById(pageName + '-page');
  if (selectedPage) {
    selectedPage.classList.add('active');
  }
}

// Simulated data management functions
function approveUser(userId) {
  console.log('User ' + userId + ' approved');
  showToast('User approved successfully');
}

function deactivateUser(userId) {
  console.log('User ' + userId + ' deactivated');
  showToast('User deactivated successfully');
}

function approveListing(listingId) {
  console.log('Listing ' + listingId + ' approved');
  showToast('Listing approved');
}

function rejectListing(listingId) {
  console.log('Listing ' + listingId + ' rejected');
  showToast('Listing rejected');
}

function removeListing(listingId) {
  console.log('Listing ' + listingId + ' removed');
  showToast('Listing removed');
}

// Toast notification helper
function showToast(message) {
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(46, 125, 50, 0.9);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    z-index: 9999;
    animation: slideIn 0.3s ease;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}