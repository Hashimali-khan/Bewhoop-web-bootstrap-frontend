# Bewhoop - Event Management Platform

## 📋 Table of Contents
- [Overview](#overview)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Core Architecture](#core-architecture)
- [JavaScript Architecture](#javascript-architecture)
- [CSS Architecture](#css-architecture)
- [Page-Specific Functionality](#page-specific-functionality)
- [Components](#components)
- [API Integration](#api-integration)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

Bewhoop is a comprehensive event management platform that allows users to create, manage, and publish events. The platform includes vendor marketplace functionality, dashboard analytics, and a multi-step event creation process.

### Key Features
- **Event Creation**: Multi-step wizard for creating events
- **Dashboard Analytics**: Real-time metrics and charts
- **Vendor Marketplace**: Browse and connect with vendors
- **Responsive Design**: Mobile-first approach
- **Multi-language Support**: Internationalization ready
- **File Upload**: Drag-and-drop image uploads
- **Form Validation**: Comprehensive client-side validation

## 📁 Project Structure

```
vendorpage/
├── assets/
│   └── img/                    # Images and icons
├── components/
│   ├── shared-header.html      # Reusable header component
│   └── shared-sidebar.html     # Reusable sidebar component
├── js/
│   ├── core.js                 # Main application core
│   └── dashboard.js            # Dashboard-specific features
├── pages/
│   ├── dashboard.html          # Main dashboard
│   ├── create-event-step1.html # Event creation step 1
│   ├── create-event-step2.html # Event creation step 2
│   ├── create-event-step3.html # Event creation step 3
│   ├── vendor-list.html        # Vendor marketplace
│   └── vendor-profile.html     # Individual vendor profile
├── style.css                   # Main stylesheet
├── create-event-step1.js       # Step 1 functionality
├── create-event-step2.js       # Step 2 functionality
├── create-event-step3.js       # Step 3 functionality
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Local web server (for development)

### Installation
1. Clone the repository
2. Open the project in your code editor
3. Start a local web server (e.g., Live Server in VS Code)
4. Navigate to `pages/dashboard.html` to begin

### Development Setup
```bash
# If using Node.js
npm install -g live-server
live-server

# If using Python
python -m http.server 8000

# If using PHP
php -S localhost:8000
```

## 🏗️ Core Architecture

### Main Application Class: `BewhoopApp`

The application is built around a central `BewhoopApp` class that manages all shared functionality.

#### Location: `js/core.js`

```javascript
class BewhoopApp {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }
}
```

#### Key Methods:

| Method | Purpose | Parameters | Returns |
|--------|---------|------------|---------|
| `init()` | Initializes all core functionality | None | void |
| `detectCurrentPage()` | Determines current page for navigation | None | string |
| `initializeSidebar()` | Sets up sidebar navigation | None | void |
| `initializeHeader()` | Sets up header interactions | None | void |
| `initializeSearch()` | Sets up search functionality | None | void |
| `initializeFormValidation()` | Sets up form validation | None | void |
| `initializePagination()` | Sets up pagination | None | void |
| `initializeDashboardFilters()` | Sets up dashboard filters | None | void |

## 🧠 JavaScript Architecture

### 1. Core Application (`js/core.js`)

#### Page Detection
```javascript
detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('dashboard')) return 'dashboard';
    if (path.includes('create-event')) return 'create-event';
    if (path.includes('vendor-list')) return 'vendor-marketplace';
    if (path.includes('vendor-profile')) return 'vendor-marketplace';
    return 'dashboard';
}
```

#### Sidebar Functionality
```javascript
initializeSidebar() {
    const menuButton = document.getElementById('menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (menuButton && sidebar && overlay) {
        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            overlay.style.display = sidebar.classList.contains('is-open') ? 'block' : 'none';
        });
    }
}
```

#### Header Interactions
```javascript
initializeHeader() {
    this.initializeNotifications();
    this.initializeLanguageSelector();
    this.initializeUserMenu();
}
```

**Notification System:**
- Tracks unread notifications count
- Marks notifications as read on click
- "Mark all as read" functionality
- Badge updates automatically

**Language Selector:**
- Supports multiple languages (EN, ES, FR, DE)
- Persists selection in localStorage
- Updates UI immediately

**User Menu:**
- Profile, Settings, Logout actions
- Handles user authentication state

#### Search Functionality
```javascript
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
```

**Search Types:**
- `events`: Filters event tables
- `vendors`: Filters vendor cards
- `general`: General search (console log for now)

#### Form Validation
```javascript
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
```

**Validation Types:**
- Required field validation
- Email format validation
- Phone number validation
- Number validation
- Real-time validation on blur
- Error clearing on input

### 2. Dashboard Manager (`js/dashboard.js`)

#### Chart Initialization
```javascript
initEventViewsChart() {
    const ctx = document.getElementById('eventViewsChart');
    if (ctx && typeof Chart !== 'undefined') {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Views',
                    data: [1200, 1900, 3000, 5000, 2300, 3400, 4200],
                    borderColor: '#FF5A1F',
                    backgroundColor: 'rgba(255,90,31,0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } }
            }
        });
    }
}
```

#### Date Picker Integration
```javascript
initializeDatePicker() {
    const datePicker = document.querySelector('#datePicker');
    if (datePicker && typeof flatpickr !== 'undefined') {
        flatpickr(datePicker, {
            defaultDate: "today",
            dateFormat: "d M Y",
            allowInput: true,
            onChange: (selectedDates, dateStr) => {
                if (window.bewhoopApp) {
                    window.bewhoopApp.filterDashboardData(null, dateStr);
                }
            }
        });
    }
}
```

### 3. Event Creation Steps

#### Step 1: Basic Event Information (`create-event-step1.js`)

**File Upload System:**
```javascript
function initializeFileUpload() {
    const uploadBtn = document.querySelector('.btn-upload-files');
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.multiple = true;
    fileInput.accept = 'image/*';
    
    const dropzone = document.querySelector('.dropzone');
    const fileList = document.querySelector('.file-list');
    
    // Upload button click
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // Drag and drop functionality
    if (dropzone) {
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }
}
```

**Features:**
- Drag-and-drop file upload
- Multiple file selection
- Image preview thumbnails
- File size formatting
- Delete individual files
- Progress indication

#### Step 2: Tickets and Description (`create-event-step2.js`)

**Ticket Management:**
```javascript
function addTicket() {
    const ticketForm = document.querySelector('.event-tickets-card form');
    const tierInput = ticketForm.querySelector('input[placeholder*="VIP"]');
    const quantityInput = ticketForm.querySelector('input[placeholder="0"]');
    const priceInput = ticketForm.querySelector('input[placeholder="$0"]');
    
    const tier = tierInput.value.trim();
    const quantity = quantityInput.value.trim();
    const price = priceInput.value.trim();
    
    // Validation
    if (!tier || !quantity || !price) {
        // Show validation errors
        return;
    }
    
    // Create ticket item
    const ticketItem = createTicketItem(tier, quantity, price);
    const ticketList = document.querySelector('.ticket-list');
    ticketList.appendChild(ticketItem);
}
```

**Features:**
- Add/Edit/Delete tickets
- Tier-based pricing
- Quantity management
- Real-time validation
- Session storage persistence

#### Step 3: Bank Details and Publishing (`create-event-step3.js`)

**Bank Account Management:**
```javascript
function handleAddAccount() {
    const form = document.querySelector('form');
    const accountNumberInput = form.querySelector('input[placeholder="Account number"]');
    const accountNameInput = form.querySelector('input[placeholder="Account name"]');
    const bankSelect = form.querySelector('select');
    
    const accountNumber = accountNumberInput.value.trim();
    const accountName = accountNameInput.value.trim();
    const selectedBank = bankSelect.value;
    
    // Validate form
    if (!validateBankDetails(accountNumber, accountName, selectedBank)) {
        return;
    }
    
    // Store bank details
    const bankDetails = {
        bank: selectedBank,
        accountNumber: accountNumber,
        accountName: accountName
    };
    
    sessionStorage.setItem('bankDetails', JSON.stringify(bankDetails));
}
```

**Event Publishing:**
```javascript
function handleEventPublishing() {
    const publishBtn = document.querySelector('.btn-publish-event');
    
    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Validate all event data
            if (!validateAllEventData()) {
                return;
            }
            
            // Collect all event data
            const eventData = collectEventData();
            
            // Show confirmation
            showPublishConfirmation(eventData);
        });
    }
}
```

## 🎨 CSS Architecture

### Main Stylesheet (`style.css`)

#### Layout Structure
```css
.page-wrapper {
    display: flex;
    min-height: 100vh;
}

.sidebar {
    width: 240px;
    background-color: #FFFFFF;
    border-right: 1px solid #E5E7EB;
    position: fixed;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.main-content {
    flex-grow: 1;
    margin-left: 240px;
    padding: 24px 32px;
    overflow-y: auto;
}
```

#### Component Styles

**Sidebar Navigation:**
```css
.nav-link {
    display: flex;
    align-items: center;
    padding: 12px 0;
    color: #6B7280;
    text-decoration: none;
    font-size: 16px;
    font-weight: 500;
    position: relative;
    border-left: 3px solid transparent;
}

.nav-link.active {
    color: #B91C1C;
    font-weight: 700;
    border-left: none;
    padding-left: 0;
}
```

**Header Components:**
```css
.top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    width: 100%;
    margin-bottom: 24px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    padding: 0 24px;
    border: 1px solid #F3F4F6;
}
```

**Form Controls:**
```css
.form-control-custom {
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 12px 16px;
    font-size: 14px;
    transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control-custom:focus {
    border-color: #FF5A1F;
    box-shadow: 0 0 0 3px rgba(255, 90, 31, 0.1);
    outline: none;
}
```

#### Responsive Design
```css
@media (max-width: 992px) {
    .sidebar {
        transform: translateX(-100%);
        position: fixed;
        z-index: 1000;
        transition: transform 0.3s ease;
    }
    
    .sidebar.is-open {
        transform: translateX(0);
    }
    
    .main-content {
        margin-left: 0;
    }
}

@media (max-width: 768px) {
    .top-header {
        flex-direction: column;
        height: auto;
        gap: 16px;
        align-items: flex-start;
    }
}
```

## 📄 Page-Specific Functionality

### Dashboard (`pages/dashboard.html`)

**Features:**
- Real-time metrics display
- Interactive charts (Chart.js)
- Event filtering and search
- Pagination
- Responsive data tables

**Key Elements:**
- Metric cards (Click-through rate, Conversion rate, Attendees, Tickets sold)
- Event views chart
- Event management table
- Filter dropdowns (Festival, Date)
- Search functionality

### Vendor Marketplace (`pages/vendor-list.html`)

**Features:**
- Vendor card grid layout
- Search and filtering
- Vendor categories
- Pricing display
- Contact information

**Key Elements:**
- Vendor cards with images
- Search bar
- Category filters
- Pagination
- Responsive grid layout

### Vendor Profile (`pages/vendor-profile.html`)

**Features:**
- Detailed vendor information
- Photo gallery
- Contact forms
- Booking functionality
- Reviews and ratings

**Key Elements:**
- Vendor header with image
- Information sections
- Photo gallery
- Contact form
- Booking button

## 🔧 Components

### Shared Header (`components/shared-header.html`)

**Features:**
- Search functionality
- Notifications dropdown
- Language selector
- User menu
- Mobile responsive

### Shared Sidebar (`components/shared-sidebar.html`)

**Features:**
- Navigation links
- Active state management
- Mobile toggle
- Logo and branding
- Settings and logout

## 🔌 API Integration

### Current Implementation
The application currently uses localStorage and sessionStorage for data persistence. For production, you'll need to integrate with backend APIs.

### Data Storage
```javascript
// Session storage for temporary data
sessionStorage.setItem('eventData', JSON.stringify(eventData));
sessionStorage.setItem('bankDetails', JSON.stringify(bankDetails));

// Local storage for persistent data
localStorage.setItem('selectedLanguage', lang);
localStorage.setItem('userPreferences', JSON.stringify(preferences));
```

### API Endpoints (Future Implementation)
```javascript
// Example API integration
async function publishEvent(eventData) {
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showSuccessMessage('Event published successfully!');
            return result;
        } else {
            throw new Error('Failed to publish event');
        }
    } catch (error) {
        console.error('Error publishing event:', error);
        showFormError('Failed to publish event. Please try again.');
    }
}
```

## 📋 Development Guidelines

### Code Organization
1. **Core functionality** → `js/core.js`
2. **Page-specific features** → Individual step files
3. **Dashboard features** → `js/dashboard.js`
4. **Styling** → `style.css`

### Naming Conventions
- **Files**: kebab-case (`create-event-step1.js`)
- **Classes**: PascalCase (`BewhoopApp`)
- **Functions**: camelCase (`initializeSidebar`)
- **CSS Classes**: kebab-case (`.nav-link`)

### Event Handling
```javascript
// Use event delegation for dynamic content
document.addEventListener('click', function(e) {
    if (e.target.matches('.delete-ticket')) {
        handleDeleteTicket(e.target);
    }
});

// Use specific selectors for better performance
const elements = document.querySelectorAll('.specific-class');
```

### Error Handling
```javascript
function safeExecute(fn, fallback = null) {
    try {
        return fn();
    } catch (error) {
        console.error('Error executing function:', error);
        return fallback;
    }
}
```

### Performance Optimization
- Use event delegation for dynamic content
- Debounce search inputs
- Lazy load images
- Minimize DOM queries
- Use CSS transforms for animations

## 🐛 Troubleshooting

### Common Issues

**1. Sidebar not working on mobile**
```javascript
// Check if elements exist
const menuButton = document.getElementById('menu-toggle');
const sidebar = document.querySelector('.sidebar');
const overlay = document.querySelector('.sidebar-overlay');

if (!menuButton || !sidebar || !overlay) {
    console.error('Sidebar elements not found');
    return;
}
```

**2. Form validation not working**
```javascript
// Ensure form validation is initialized
if (window.bewhoopApp) {
    window.bewhoopApp.initializeFormValidation();
} else {
    console.error('BewhoopApp not initialized');
}
```

**3. Charts not displaying**
```javascript
// Check if Chart.js is loaded
if (typeof Chart === 'undefined') {
    console.error('Chart.js not loaded');
    return;
}

// Check if canvas element exists
const ctx = document.getElementById('eventViewsChart');
if (!ctx) {
    console.error('Chart canvas not found');
    return;
}
```

**4. File upload not working**
```javascript
// Check file input configuration
const fileInput = document.querySelector('input[type="file"]');
if (!fileInput) {
    console.error('File input not found');
    return;
}

// Check accept attribute
console.log('Accepted file types:', fileInput.accept);
```

### Debug Mode
```javascript
// Enable debug mode
window.DEBUG = true;

// Debug logging
function debugLog(message, data = null) {
    if (window.DEBUG) {
        console.log(`[DEBUG] ${message}`, data);
    }
}
```

### Browser Compatibility
- **Chrome**: 80+
- **Firefox**: 75+
- **Safari**: 13+
- **Edge**: 80+

## 📚 Additional Resources

### External Libraries Used
- **Bootstrap 5.3.2**: UI framework
- **Bootstrap Icons 1.11.3**: Icon library
- **Chart.js 4.4.0**: Charting library
- **Flatpickr**: Date picker

### Fonts
- **Bricolage Grotesque**: Main font family


### Color Scheme
- **Primary**: #FF5A1F (Orange)
- **Secondary**: #B91C1C (Red)
- **Background**: #F9FAFB (Light Gray)
- **Text**: #333333 (Dark Gray)
- **Borders**: #E5E7EB (Light Gray)

---

## 🚀 Getting Help

If you encounter issues or need help:

1. Check the browser console for errors
2. Verify all required files are loaded
3. Ensure proper file paths
4. Check browser compatibility
5. Review the troubleshooting section above

For additional support, refer to the `REFACTOR_DOCUMENTATION.md` file for detailed technical information about the refactored codebase.

---

**Happy Coding! 🎉** 