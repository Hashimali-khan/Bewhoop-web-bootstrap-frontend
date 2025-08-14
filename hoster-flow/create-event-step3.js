// create-event-step3.js - Enhanced functionality for create event step 3

document.addEventListener('DOMContentLoaded', function() {
    // Initialize bank details form
    initializeBankDetailsForm();
    
    // Initialize event publishing
    initializeEventPublishing();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Load saved data from previous steps
    loadPreviousStepsData();
});

// Bank details form functionality
function initializeBankDetailsForm() {
    const bankForm = document.querySelector('form');
    const addAccountBtn = document.querySelector('.btn-add-account');
    const bankSelect = document.querySelector('select[aria-label="Select Bank Account"]');
    
    if (addAccountBtn) {
        addAccountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleAddAccount();
        });
    }
    
    // Bank selection change
    if (bankSelect) {
        bankSelect.addEventListener('change', function() {
            const selectedBank = this.value;
            if (selectedBank && selectedBank !== 'Select Bank Account') {
                // Store selected bank
                sessionStorage.setItem('selectedBank', selectedBank);
                console.log('Bank selected:', selectedBank);
            }
        });
    }
}

// Handle add account
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
    
    // Show success message
    showSuccessMessage('Bank account added successfully!');
    
    // Clear form
    form.reset();
    
    console.log('Bank account added:', bankDetails);
}

// Validate bank details
function validateBankDetails(accountNumber, accountName, selectedBank) {
    // Clear previous validation errors
    clearValidationErrors();
    
    let hasErrors = false;
    const form = document.querySelector('form');
    const bankSelect = form.querySelector('select');
    const accountNumberInput = form.querySelector('input[placeholder="Account number"]');
    const accountNameInput = form.querySelector('input[placeholder="Account name"]');
    
    if (selectedBank === 'Select Bank Account') {
        showFieldError(bankSelect, 'Please select a bank account.');
        hasErrors = true;
    }
    
    if (!accountNumber) {
        showFieldError(accountNumberInput, 'Please enter account number.');
        hasErrors = true;
    } else if (!/^\d{8,17}$/.test(accountNumber.replace(/\s/g, ''))) {
        showFieldError(accountNumberInput, 'Please enter a valid account number (8-17 digits).');
        hasErrors = true;
    }
    
    if (!accountName) {
        showFieldError(accountNameInput, 'Please enter account name.');
        hasErrors = true;
    }
    
    return !hasErrors;
}

// Event publishing functionality
function initializeEventPublishing() {
    const publishBtn = document.querySelector('.btn-publish-event');
    const reviewCheckbox = document.getElementById('reviewCheck');
    
    if (publishBtn) {
        publishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleEventPublishing();
        });
    }
    
    // Review checkbox change
    if (reviewCheckbox) {
        reviewCheckbox.addEventListener('change', function() {
            sessionStorage.setItem('reviewAccepted', this.checked);
        });
    }
}

// Handle event publishing
function handleEventPublishing() {
    // Clear previous validation errors
    clearValidationErrors();
    
    // Check if review checkbox is checked
    const reviewCheckbox = document.getElementById('reviewCheck');
    if (!reviewCheckbox.checked) {
        showFormError('Please accept the review terms before publishing.');
        return;
    }
    
    // Validate all required data
    if (!validateAllEventData()) {
        return;
    }
    
    // Collect all event data
    const eventData = collectEventData();
    
    // Show publishing confirmation
    showPublishConfirmation(eventData);
}

// Validate all event data
function validateAllEventData() {
    const requiredData = [
        { key: 'eventTitle', name: 'Event Title' },
        { key: 'eventDescription', name: 'Event Description' },
        { key: 'bankDetails', name: 'Bank Details' }
    ];
    
    for (const data of requiredData) {
        const value = sessionStorage.getItem(data.key);
        if (!value || (typeof value === 'string' && value.trim() === '')) {
            showFormError(`Please complete the ${data.name} before publishing.`);
            return false;
        }
    }
    
    // Check if ticketed event has tickets
    const isTicketed = sessionStorage.getItem('isTicketed') === 'true';
    if (isTicketed) {
        const tickets = sessionStorage.getItem('eventTickets');
        if (!tickets || JSON.parse(tickets).length === 0) {
            showFormError('Please add at least one ticket type for ticketed events.');
            return false;
        }
    }
    
    return true;
}

// Collect all event data
function collectEventData() {
    const eventData = {
        // Step 1 data
        title: sessionStorage.getItem('eventTitle'),
        tagline: sessionStorage.getItem('eventTagline'),
        isTicketed: sessionStorage.getItem('isTicketed') === 'true',
        photos: getUploadedPhotos(),
        
        // Step 2 data
        description: sessionStorage.getItem('eventDescription'),
        highlights: sessionStorage.getItem('eventHighlights'),
        expectations: sessionStorage.getItem('eventExpectations'),
        tickets: JSON.parse(sessionStorage.getItem('eventTickets') || '[]'),
        
        // Step 3 data
        bankDetails: JSON.parse(sessionStorage.getItem('bankDetails') || '{}'),
        reviewAccepted: sessionStorage.getItem('reviewAccepted') === 'true',
        
        // Metadata
        createdAt: new Date().toISOString(),
        status: 'pending_review'
    };
    
    return eventData;
}

// Get uploaded photos (simulated)
function getUploadedPhotos() {
    // In a real implementation, this would return the actual uploaded files
    // For now, we'll simulate with placeholder data
    return [
        { name: 'event_photo_1.jpg', size: '1.2 MB', url: 'placeholder_url_1' },
        { name: 'event_photo_2.jpg', size: '0.8 MB', url: 'placeholder_url_2' }
    ];
}

// Publish event
function publishEvent(eventData) {
    // Show loading state
    const publishBtn = document.querySelector('.btn-publish-event');
    const originalText = publishBtn.textContent;
    publishBtn.textContent = 'Publishing...';
    publishBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Success
        showSuccessMessage('Event published successfully! It will be reviewed within 1 month.');
        
        // Clear session storage
        clearEventSessionData();
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
        
        console.log('Event published:', eventData);
    }, 2000);
}

// Show success message
function showSuccessMessage(message) {
    // Create success alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show position-fixed';
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Clear event session data
function clearEventSessionData() {
    const keysToRemove = [
        'eventTitle', 'eventTagline', 'isTicketed', 'eventDescription',
        'eventHighlights', 'eventExpectations', 'eventTickets', 'bankDetails',
        'reviewAccepted', 'selectedBank'
    ];
    
    keysToRemove.forEach(key => {
        sessionStorage.removeItem(key);
    });
}

// Form validation
function initializeFormValidation() {
    const inputs = document.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    clearFieldError(field);
    
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (type === 'number' && value && isNaN(value)) {
        showFieldError(field, 'Please enter a valid number');
        return false;
    }
    
    return true;
}

// Show field error
function showFieldError(field, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    field.classList.add('is-invalid');
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    field.classList.remove('is-invalid');
    const errorDiv = field.parentNode.querySelector('.invalid-feedback');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Load data from previous steps
function loadPreviousStepsData() {
    const eventTitle = sessionStorage.getItem('eventTitle');
    const isTicketed = sessionStorage.getItem('isTicketed');
    
    // Update page title if available
    if (eventTitle) {
        document.title = `Bewhoop - Create Event: ${eventTitle} (Step 3)`;
    }
    
    // Load saved bank details if any
    const savedBankDetails = sessionStorage.getItem('bankDetails');
    if (savedBankDetails) {
        const bankDetails = JSON.parse(savedBankDetails);
        const bankSelect = document.querySelector('select[aria-label="Select Bank Account"]');
        const accountNumberInput = document.querySelector('input[placeholder="Account number"]');
        const accountNameInput = document.querySelector('input[placeholder="Account name"]');
        
        if (bankSelect) bankSelect.value = bankDetails.bank || 'Select Bank Account';
        if (accountNumberInput) accountNumberInput.value = bankDetails.accountNumber || '';
        if (accountNameInput) accountNameInput.value = bankDetails.accountName || '';
    }
    
    // Load review checkbox state
    const reviewAccepted = sessionStorage.getItem('reviewAccepted');
    const reviewCheckbox = document.getElementById('reviewCheck');
    if (reviewCheckbox && reviewAccepted === 'true') {
        reviewCheckbox.checked = true;
    }
}

// Field validation helper functions
function clearValidationErrors() {
    // Remove all field errors
    const fieldErrors = document.querySelectorAll('.field-error');
    fieldErrors.forEach(error => error.remove());
    
    // Remove invalid classes from fields
    const invalidFields = document.querySelectorAll('.is-invalid');
    invalidFields.forEach(field => field.classList.remove('is-invalid'));
    
    // Remove form errors
    const formErrors = document.querySelectorAll('.form-error');
    formErrors.forEach(error => error.remove());
}

function showFormError(message) {
    // Remove existing form errors
    const existingErrors = document.querySelectorAll('.form-error');
    existingErrors.forEach(error => error.remove());
    
    // Create form error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error alert alert-danger mt-3';
    errorDiv.textContent = message;
    
    // Insert at the top of the main card
    const mainCard = document.querySelector('.create-event-main-card');
    mainCard.insertBefore(errorDiv, mainCard.firstChild);
}

// Publish confirmation popup
function showPublishConfirmation(eventData) {
    // Remove existing confirmation modal
    const existingModal = document.querySelector('#publishConfirmationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'publishConfirmationModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title">Confirm Event Publication</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center py-4">
                    <i class="bi bi-check-circle text-success" style="font-size: 3rem;"></i>
                    <h6 class="mt-3">Are you sure you want to publish this event?</h6>
                    <p class="text-muted mb-0">"${eventData.title}" will be submitted for review and published within 1 month.</p>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success" id="confirmPublishBtn">Publish Event</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.appendChild(modal);
    
    // Show modal
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Handle confirm button click
    const confirmBtn = modal.querySelector('#confirmPublishBtn');
    confirmBtn.addEventListener('click', function() {
        bootstrapModal.hide();
        publishEvent(eventData);
    });
    
    // Clean up modal when hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
} 