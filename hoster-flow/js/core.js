/**
 * CORE.JS - Main application core functionality
 * Handles shared functionality across all pages
 * 
 * CONSOLIDATED FROM:
 * - header-functionality.js (header interactions)
 * - common-functionality.js (shared utilities)
 * - script.js (sidebar functionality)
 * - core.js (original core functionality)
 */

// ========================================
// CORE APPLICATION CLASS
// ========================================
class BewhoopApp {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    init() {
        this.initializeSidebar();
        this.initializeHeader();
        this.initializeSearch();
        this.initializeFormValidation();
        this.initializePagination();
        this.initializeDashboardFilters();
        this.setActiveNavigation();
        console.log('Bewhoop App initialized on:', this.currentPage);
    }

    // Detect current page for navigation highlighting
    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('dashboard')) return 'dashboard';
        if (path.includes('create-event')) return 'create-event';
        if (path.includes('vendor-list')) return 'vendor-marketplace';
        if (path.includes('vendor-profile')) return 'vendor-marketplace';
        return 'dashboard';
    }

    // ========================================
    // SIDEBAR FUNCTIONALITY
    // ========================================
    initializeSidebar() {
        const menuButton = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (menuButton && sidebar && overlay) {
            menuButton.addEventListener('click', () => {
                sidebar.classList.toggle('is-open');
                overlay.style.display = sidebar.classList.contains('is-open') ? 'block' : 'none';
            });

            overlay.addEventListener('click', () => {
                sidebar.classList.remove('is-open');
                overlay.style.display = 'none';
            });
        }
    }

    // Set active navigation based on current page
    setActiveNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === this.currentPage) {
                link.classList.add('active');
            }
        });
    }

    // ========================================
    // HEADER FUNCTIONALITY
    // ========================================
    initializeHeader() {
        this.initializeNotifications();
        this.initializeLanguageSelector();
        this.initializeUserMenu();
    }

    initializeNotifications() {
        const notificationItems = document.querySelectorAll('.notification-item');
        const notificationBadge = document.querySelector('.notification-badge');
        let unreadCount = 6;

        notificationItems.forEach(item => {
            item.addEventListener('click', () => {
                item.style.opacity = '0.6';
                item.style.backgroundColor = '#F9FAFB';
                unreadCount--;
                
                if (unreadCount <= 0) {
                    notificationBadge.style.display = 'none';
                } else {
                    notificationBadge.textContent = unreadCount;
                }
            });
        });

        // Mark all as read
        const viewAllLink = document.querySelector('.dropdown-item[href="#"]');
        if (viewAllLink) {
            viewAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                notificationItems.forEach(item => {
                    item.style.opacity = '0.6';
                    item.style.backgroundColor = '#F9FAFB';
                });
                notificationBadge.style.display = 'none';
                unreadCount = 0;
            });
        }
    }

    initializeLanguageSelector() {
        const languageOptions = document.querySelectorAll('.language-option');
        const languageToggle = document.querySelector('.language-selector .dropdown-toggle');
        
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                const langText = option.textContent.trim();
                const flagImg = option.querySelector('img').src;
                
                languageToggle.innerHTML = `<img src="${flagImg}" alt="Flag" class="flag-icon"> ${langText}`;
                localStorage.setItem('selectedLanguage', lang);
            });
        });

        // Load saved language preference
        const savedLanguage = localStorage.getItem('selectedLanguage');
        if (savedLanguage && languageToggle) {
            const savedOption = document.querySelector(`[data-lang="${savedLanguage}"]`);
            if (savedOption) {
                const langText = savedOption.textContent.trim();
                const flagImg = savedOption.querySelector('img').src;
                languageToggle.innerHTML = `<img src="${flagImg}" alt="Flag" class="flag-icon"> ${langText}`;
            }
        }
    }

    initializeUserMenu() {
        const userMenuItems = document.querySelectorAll('.user-menu .dropdown-item');
        userMenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.textContent.trim();
                console.log('User menu action:', action);
                
                switch(action) {
                    case 'Profile':
                        // Navigate to profile page
                        break;
                    case 'Settings':
                        // Navigate to settings page
                        break;
                    case 'Logout':
                        // Handle logout
                        this.handleLogout();
                        break;
                }
            });
        });
    }

    handleLogout() {
        // Add logout logic here
        console.log('User logout initiated');
        // Example: redirect to login page
        // window.location.href = '/login.html';
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    initializeSearch() {
        const searchInputs = document.querySelectorAll('input[data-search-type], input[placeholder*="Search"]');
        
        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const searchType = e.target.getAttribute('data-search-type') || 'general';
                
                switch(searchType) {
                    case 'events':
                        this.searchEvents(searchTerm);
                        break;
                    case 'vendors':
                        this.searchVendors(searchTerm);
                        break;
                    default:
                        this.searchGeneral(searchTerm);
                }
            });
        });
    }

    searchEvents(searchTerm) {
        const eventRows = document.querySelectorAll('tbody tr');
        eventRows.forEach(row => {
            const eventName = row.querySelector('td:first-child')?.textContent.toLowerCase() || '';
            const eventLocation = row.querySelector('td:nth-child(2)')?.textContent.toLowerCase() || '';
            
            if (eventName.includes(searchTerm) || eventLocation.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }

    searchVendors(searchTerm) {
        const vendorCards = document.querySelectorAll('.vendor-card');
        vendorCards.forEach(card => {
            const vendorName = card.querySelector('.vendor-name')?.textContent.toLowerCase() || '';
            const vendorRole = card.querySelector('.vendor-role')?.textContent.toLowerCase() || '';
            const vendorLocation = card.querySelector('.vendor-location')?.textContent.toLowerCase() || '';
            
            if (vendorName.includes(searchTerm) || vendorRole.includes(searchTerm) || vendorLocation.includes(searchTerm)) {
                card.closest('.col-lg-4').style.display = '';
            } else {
                card.closest('.col-lg-4').style.display = 'none';
            }
        });
    }

    searchGeneral(searchTerm) {
        // General search functionality
        console.log('General search for:', searchTerm);
    }

    // ========================================
    // FORM VALIDATION
    // ========================================
    initializeFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                    return false;
                }
            });
        });
        
        // Real-time validation for inputs
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(field) {
        const value = field.value.trim();
        const type = field.type;
        const required = field.hasAttribute('required');
        
        this.clearFieldError(field);
        
        if (required && !value) {
            this.showFieldError(field, 'This field is required');
            return false;
        }
        
        switch(type) {
            case 'email':
                if (value && !this.isValidEmail(value)) {
                    this.showFieldError(field, 'Please enter a valid email address');
                    return false;
                }
                break;
            case 'number':
                if (value && isNaN(value)) {
                    this.showFieldError(field, 'Please enter a valid number');
                    return false;
                }
                break;
            case 'tel':
                if (value && !this.isValidPhone(value)) {
                    this.showFieldError(field, 'Please enter a valid phone number');
                    return false;
                }
                break;
        }
        
        return true;
    }

    showFieldError(field, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback d-block';
        errorDiv.textContent = message;
        
        field.classList.add('is-invalid');
        field.parentNode.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const errorDiv = field.parentNode.querySelector('.invalid-feedback');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // ========================================
    // PAGINATION FUNCTIONALITY
    // ========================================
    initializePagination() {
        const paginationButtons = document.querySelectorAll('.btn[aria-label*="Page"]');
        
        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.textContent.includes('Prev') ? 'prev' : 'next';
                this.handlePagination(action);
            });
        });
    }

    handlePagination(action) {
        console.log('Pagination action:', action);
        // This would typically make an API call to get next/prev page
        // For demo purposes, we'll just log the action
    }

    // ========================================
    // DASHBOARD FILTERS
    // ========================================
    initializeDashboardFilters() {
        // Festival dropdown
        const festivalDropdown = document.querySelector('#festivalDropdown');
        if (festivalDropdown) {
            const festivalOptions = festivalDropdown.nextElementSibling.querySelectorAll('.dropdown-item');
            festivalOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedFestival = option.textContent;
                    festivalDropdown.textContent = selectedFestival;
                    this.filterDashboardData(selectedFestival);
                });
            });
        }
        
        // Date dropdown
        const dateDropdown = document.querySelector('#dateDropdown');
        if (dateDropdown) {
            const dateOptions = dateDropdown.nextElementSibling.querySelectorAll('.dropdown-item');
            dateOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedDate = option.textContent;
                    dateDropdown.textContent = selectedDate;
                    this.filterDashboardData(null, selectedDate);
                });
            });
        }
        
        // Reset filter button
        const resetFilterBtn = document.querySelector('.btn-outline-secondary[aria-label="Reset Filter"]');
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', () => {
                this.resetDashboardFilters();
            });
        }
    }

    filterDashboardData(festival = null, date = null) {
        console.log('Filtering dashboard data:', { festival, date });
        
        // Here you would typically make an API call to filter data
        // For demo purposes, we'll just log the filter
        if (festival) {
            console.log('Filtering by festival:', festival);
        }
        if (date) {
            console.log('Filtering by date:', date);
        }
    }

    resetDashboardFilters() {
        const festivalDropdown = document.querySelector('#festivalDropdown');
        const dateDropdown = document.querySelector('#dateDropdown');
        
        if (festivalDropdown) festivalDropdown.textContent = 'Carnival Festival';
        if (dateDropdown) dateDropdown.textContent = 'Today';
        
        // Show all event rows
        const eventRows = document.querySelectorAll('tbody tr');
        eventRows.forEach(row => {
            row.style.display = '';
        });
        
        console.log('Dashboard filters reset');
    }

    // ========================================
    // UTILITY METHODS
    // ========================================
    showNotification(message, type = 'info') {
        // Create and show notification
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the main application
    window.bewhoopApp = new BewhoopApp();
}); 