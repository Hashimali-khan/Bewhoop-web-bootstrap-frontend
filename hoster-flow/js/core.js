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
// MODULE LOADER
// ========================================
const BEEWHOOP_CORE_SCRIPT_URL = document.currentScript ? new URL(document.currentScript.src) : new URL(window.location.href);
const BEEWHOOP_MODULE_PATHS = [
    './modules/shell.js',
    './modules/sidebar.js',
    './modules/header.js',
    './modules/search.js',
    './modules/validation.js',
    './modules/pagination.js',
    './modules/filters.js'
];

function loadBewhoopModule(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = new URL(src, BEEWHOOP_CORE_SCRIPT_URL).href;
        script.onload = () => resolve(script);
        script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
        document.head.appendChild(script);
    });
}

const BEEWHOOP_MODULES_READY = Promise.all(BEEWHOOP_MODULE_PATHS.map(loadBewhoopModule));

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
        window.BewhoopModules?.sidebar?.initialize(this);
    }

    // Set active navigation based on current page
    setActiveNavigation() {
        window.BewhoopModules?.sidebar?.setActiveNavigation(this);
    }

    // ========================================
    // HEADER FUNCTIONALITY
    // ========================================
    initializeHeader() {
        window.BewhoopModules?.header?.initialize(this);
    }

    initializeNotifications() {
        const notificationItems = document.querySelectorAll('.notification-item');
        const notificationBadge = document.querySelector('.notification-badge');
        if (!notificationItems.length || !notificationBadge) {
            return;
        }

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
        const viewAllLink = document.querySelector('.notification-dropdown .dropdown-item[href="#"]');
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

        if (!languageOptions.length || !languageToggle) {
            return;
        }
        
        languageOptions.forEach(option => {
            option.addEventListener('click', () => {
                const lang = option.getAttribute('data-lang');
                const langText = option.textContent.trim();
                const flagImg = option.querySelector('img')?.src;

                if (!flagImg) {
                    return;
                }
                
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
        if (!userMenuItems.length) {
            return;
        }

        userMenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const action = item.textContent.trim();
                console.log('User menu action:', action);
                
                switch(action) {
                    case 'Profile':
                        this.showNotification('Profile navigation is not wired yet.', 'info');
                        break;
                    case 'Settings':
                        this.showNotification('Settings navigation is not wired yet.', 'info');
                        break;
                    case 'Logout':
                        this.handleLogout();
                        break;
                }
            });
        });
    }

    handleLogout() {
        localStorage.removeItem('selectedLanguage');
        window.location.href = '/index.html';
    }

    // ========================================
    // SEARCH FUNCTIONALITY
    // ========================================
    initializeSearch() {
        window.BewhoopModules?.search?.initialize(this);
    }

    searchEvents(searchTerm) {
        const eventRows = document.querySelectorAll('tbody tr');
        if (!eventRows.length) {
            return;
        }

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
        if (!vendorCards.length) {
            return;
        }

        vendorCards.forEach(card => {
            const vendorName = card.querySelector('.vendor-name')?.textContent.toLowerCase() || '';
            const vendorRole = card.querySelector('.vendor-role')?.textContent.toLowerCase() || '';
            const vendorLocation = card.querySelector('.vendor-location')?.textContent.toLowerCase() || '';
            const vendorColumn = card.closest('.col-lg-4') || card.parentElement;
            
            if (vendorName.includes(searchTerm) || vendorRole.includes(searchTerm) || vendorLocation.includes(searchTerm)) {
                if (vendorColumn) {
                    vendorColumn.style.display = '';
                }
            } else {
                if (vendorColumn) {
                    vendorColumn.style.display = 'none';
                }
            }
        });
    }

    searchGeneral(searchTerm) {
        const hasEventRows = document.querySelectorAll('tbody tr').length > 0;
        const hasVendorCards = document.querySelectorAll('.vendor-card').length > 0;

        if (hasEventRows) {
            this.searchEvents(searchTerm);
        }

        if (hasVendorCards) {
            this.searchVendors(searchTerm);
        }
    }

    // ========================================
    // FORM VALIDATION
    // ========================================
    initializeFormValidation() {
        window.BewhoopModules?.validation?.initialize(this);
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
        const parent = field.parentNode;
        if (!parent) {
            return;
        }

        const existingError = parent.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback d-block';
        errorDiv.textContent = message;
        
        field.classList.add('is-invalid');
        parent.appendChild(errorDiv);
    }

    clearFieldError(field) {
        field.classList.remove('is-invalid');
        const parent = field.parentNode;
        if (!parent) {
            return;
        }

        const errorDivs = parent.querySelectorAll('.invalid-feedback');
        errorDivs.forEach(errorDiv => errorDiv.remove());
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
        window.BewhoopModules?.pagination?.initialize(this);
    }

    handlePagination(action) {
        this.showNotification(`Pagination is a demo placeholder for the ${action} action.`, 'info');
    }

    // ========================================
    // DASHBOARD FILTERS
    // ========================================
    initializeDashboardFilters() {
        window.BewhoopModules?.filters?.initialize(this);
    }

    filterDashboardData(festival = null, date = null) {
        const eventRows = document.querySelectorAll('tbody tr');
        if (!eventRows.length) {
            return;
        }

        let visibleCount = 0;
        eventRows.forEach(row => {
            const rowText = row.textContent.toLowerCase();
            const matchesFestival = festival ? rowText.includes(festival.toLowerCase()) : true;
            const matchesDate = date ? rowText.includes(date.toLowerCase()) : true;
            const shouldShow = matchesFestival && matchesDate;

            row.style.display = shouldShow ? '' : 'none';
            if (shouldShow) {
                visibleCount++;
            }
        });

        if (!this.dashboardFilterNoticeShown) {
            this.showNotification('Dashboard filters now apply local row filtering. Connect them to API data next.', 'info');
            this.dashboardFilterNoticeShown = true;
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
document.addEventListener('DOMContentLoaded', async function() {
    await BEEWHOOP_MODULES_READY;
    await window.BewhoopModules?.shell?.ready;
    window.bewhoopApp = new BewhoopApp();
});
