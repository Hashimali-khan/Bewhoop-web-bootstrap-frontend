// create-event-step2.js - Enhanced functionality for create event step 2

document.addEventListener('DOMContentLoaded', function() {
    // Initialize ticket management
    initializeTicketManagement();
    
    // Initialize event description functionality
    initializeEventDescription();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Load saved data from step 1
    loadStep1Data();
});

// Ticket management functionality
function initializeTicketManagement() {
    const addTicketBtn = document.querySelector('.btn-add-ticket');
    const ticketForm = document.querySelector('.event-tickets-card form');
    
    if (addTicketBtn) {
        addTicketBtn.addEventListener('click', function() {
            addTicket();
        });
    }
    
    // Initialize existing ticket edit/delete functionality
    initializeExistingTickets();
}

// Add new ticket
function addTicket() {
    const ticketForm = document.querySelector('.event-tickets-card form');
    const tierInput = ticketForm.querySelector('input[placeholder*="VIP"]');
    const quantityInput = ticketForm.querySelector('input[placeholder="0"]');
    const priceInput = ticketForm.querySelector('input[placeholder="$0"]');
    const addBtn = ticketForm.querySelector('.btn-add-ticket');
    
    // Clear previous validation errors
    clearValidationErrors();
    
    const tier = tierInput.value.trim();
    const quantity = quantityInput.value.trim();
    const price = priceInput.value.trim();
    
    let hasErrors = false;
    
    // Validate inputs
    if (!tier) {
        showFieldError(tierInput, 'Ticket tier is required');
        hasErrors = true;
    }
    
    if (!quantity) {
        showFieldError(quantityInput, 'Quantity is required');
        hasErrors = true;
    } else if (isNaN(quantity) || parseInt(quantity) <= 0) {
        showFieldError(quantityInput, 'Please enter a valid quantity (greater than 0)');
        hasErrors = true;
    }
    
    if (!price) {
        showFieldError(priceInput, 'Price is required');
        hasErrors = true;
    } else if (isNaN(price) || parseFloat(price) < 0) {
        showFieldError(priceInput, 'Please enter a valid price');
        hasErrors = true;
    }
    
    if (hasErrors) {
        return;
    }
    
    // Check if we're editing an existing ticket
    const editingTicketTier = addBtn.getAttribute('data-editing-ticket');
    
    if (editingTicketTier) {
        // Update existing ticket
        const existingTicket = document.querySelector(`[data-tier="${editingTicketTier}"]`);
        if (existingTicket) {
            // Update the ticket data
            existingTicket.setAttribute('data-tier', tier);
            existingTicket.querySelector('.fw-semibold').textContent = tier;
            existingTicket.querySelector('.text-muted.small').textContent = `x${quantity}`;
            existingTicket.querySelector('.fw-bold').textContent = `$${price}`;
            
            // Reset button state
            addBtn.textContent = 'Add';
            addBtn.classList.remove('btn-warning');
            addBtn.classList.add('btn-danger');
            addBtn.removeAttribute('data-editing-ticket');
        }
    } else {
        // Create new ticket item
        const ticketItem = createTicketItem(tier, quantity, price);
        const ticketList = document.querySelector('.ticket-list');
        ticketList.appendChild(ticketItem);
    }
    
    // Clear form
    tierInput.value = '';
    quantityInput.value = '';
    priceInput.value = '';
    
    // Store tickets in session storage
    saveTicketsToStorage();
    
    console.log(editingTicketTier ? 'Ticket updated:' : 'Ticket added:', { tier, quantity, price });
}

// Create ticket item element
function createTicketItem(tier, quantity, price) {
    const ticketItem = document.createElement('div');
    ticketItem.className = 'ticket-item d-flex align-items-center justify-content-between mb-2';
    ticketItem.setAttribute('data-tier', tier);
    
    ticketItem.innerHTML = `
        <div class="d-flex align-items-center gap-2">
            <i class="bi bi-ticket-perforated-fill ticket-icon"></i>
            <span class="fw-semibold">${tier}</span>
            <span class="text-muted small">x${quantity}</span>
            <span class="fw-bold ms-2">$${price}</span>
        </div>
        <div class="d-flex align-items-center gap-2">
            <button class="btn btn-link p-0 text-danger edit-ticket" aria-label="Edit Ticket">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-link p-0 text-danger delete-ticket" aria-label="Delete Ticket">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const editBtn = ticketItem.querySelector('.edit-ticket');
    const deleteBtn = ticketItem.querySelector('.delete-ticket');
    
    editBtn.addEventListener('click', function() {
        editTicket(ticketItem, tier, quantity, price);
    });
    
    deleteBtn.addEventListener('click', function() {
        deleteTicket(ticketItem);
    });
    
    return ticketItem;
}

// Edit ticket
function editTicket(ticketItem, tier, quantity, price) {
    const ticketForm = document.querySelector('.event-tickets-card form');
    const tierInput = ticketForm.querySelector('input[placeholder*="VIP"]');
    const quantityInput = ticketForm.querySelector('input[placeholder="0"]');
    const priceInput = ticketForm.querySelector('input[placeholder="$0"]');
    const addBtn = ticketForm.querySelector('.btn-add-ticket');
    
    // Fill form with current values
    tierInput.value = tier;
    quantityInput.value = quantity;
    priceInput.value = price;
    
    // Change button text
    addBtn.textContent = 'Update';
    addBtn.classList.add('btn-warning');
    addBtn.classList.remove('btn-danger');
    
    // Store reference to ticket being edited
    addBtn.setAttribute('data-editing-ticket', ticketItem.getAttribute('data-tier'));
    
    // Scroll to form
    ticketForm.scrollIntoView({ behavior: 'smooth' });
}

// Delete ticket
function deleteTicket(ticketItem) {
    const ticketTier = ticketItem.querySelector('.fw-semibold').textContent;
    showDeleteConfirmation(ticketTier, () => {
        ticketItem.remove();
        saveTicketsToStorage();
        console.log('Ticket deleted');
    });
}

// Initialize existing tickets functionality
function initializeExistingTickets() {
    const existingTickets = document.querySelectorAll('.ticket-item');
    
    existingTickets.forEach(ticket => {
        const editBtn = ticket.querySelector('.edit-ticket');
        const deleteBtn = ticket.querySelector('.delete-ticket');
        
        if (editBtn) {
            editBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const tier = ticket.querySelector('.fw-semibold').textContent;
                const quantity = ticket.querySelector('.text-muted.small').textContent.replace('x', '');
                const price = ticket.querySelector('.fw-bold').textContent.replace('$', '');
                editTicket(ticket, tier, quantity, price);
            });
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.preventDefault();
                deleteTicket(ticket);
            });
        }
    });
    
    console.log('Initialized', existingTickets.length, 'existing tickets');
}

// Save tickets to session storage
function saveTicketsToStorage() {
    const tickets = [];
    const ticketItems = document.querySelectorAll('.ticket-item');
    
    ticketItems.forEach(item => {
        const tier = item.querySelector('.fw-semibold').textContent;
        const quantity = item.querySelector('.text-muted.small').textContent.replace('x', '');
        const price = item.querySelector('.fw-bold').textContent.replace('$', '');
        
        tickets.push({ tier, quantity, price });
    });
    
    sessionStorage.setItem('eventTickets', JSON.stringify(tickets));
}

// Event description functionality
function initializeEventDescription() {
    const descriptionBtn = document.querySelector('.event-description-card .btn-add-circle');
    
    if (descriptionBtn) {
        descriptionBtn.addEventListener('click', function() {
            openEventDescriptionModal();
        });
    }
}

// Open event description modal
function openEventDescriptionModal() {
    const modal = createEventDescriptionModal();
    document.body.appendChild(modal);
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Create event description modal
function createEventDescriptionModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'eventDescriptionModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Event Description</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="eventDescriptionForm">
                        <div class="mb-3">
                            <label class="form-label">Event Description *</label>
                            <textarea class="form-control" id="eventDescription" rows="6" required 
                                placeholder="Describe your event in detail..."></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Event Highlights</label>
                            <textarea class="form-control" id="eventHighlights" rows="3" 
                                placeholder="Key highlights of your event..."></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">What to Expect</label>
                            <textarea class="form-control" id="eventExpectations" rows="3" 
                                placeholder="What attendees can expect..."></textarea>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" onclick="saveEventDescription()">Save</button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Save event description
window.saveEventDescription = function() {
    const form = document.getElementById('eventDescriptionForm');
    const descriptionInput = document.getElementById('eventDescription');
    const highlightsInput = document.getElementById('eventHighlights');
    const expectationsInput = document.getElementById('eventExpectations');
    
    if (validateForm(form)) {
        const description = descriptionInput.value.trim();
        const highlights = highlightsInput.value.trim();
        const expectations = expectationsInput.value.trim();
        
        // Store in session storage
        sessionStorage.setItem('eventDescription', description);
        sessionStorage.setItem('eventHighlights', highlights);
        sessionStorage.setItem('eventExpectations', expectations);
        
        // Update the description card
        const descriptionCard = document.querySelector('.event-description-card');
        const descriptionDiv = descriptionCard.querySelector('.fw-bold.fs-5');
        descriptionDiv.textContent = description ? 'Event Description ✓' : 'Event Description';
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventDescriptionModal'));
        modal.hide();
        
        console.log('Event description saved:', { description, highlights, expectations });
    }
};

// Form validation
function initializeFormValidation() {
    const nextButton = document.querySelector('.btn-next-fixed');
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            if (!validateStep2Form()) {
                e.preventDefault();
                return false;
            }
            
            // Proceed to next step
            window.location.href = 'create-event-step3.html';
        });
    }
}

// Validate step 2 form
function validateStep2Form() {
    let isValid = true;
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Check if at least one ticket is added (if ticketed)
    const isTicketed = sessionStorage.getItem('isTicketed') === 'true';
    if (isTicketed) {
        const ticketItems = document.querySelectorAll('.ticket-item');
        if (ticketItems.length === 0) {
            showFormError('Please add at least one ticket type before proceeding.');
            isValid = false;
        }
    }
    
    // Check if event description is set
    const eventDescription = sessionStorage.getItem('eventDescription');
    if (!eventDescription || eventDescription.trim() === '') {
        showFormError('Please add an event description before proceeding.');
        isValid = false;
    }
    
    return isValid;
}

// Load data from step 1
function loadStep1Data() {
    const eventTitle = sessionStorage.getItem('eventTitle');
    const isTicketed = sessionStorage.getItem('isTicketed');
    
    // Update page title if available
    if (eventTitle) {
        document.title = `Bewhoop - Create Event: ${eventTitle} (Step 2)`;
    }
    
    // Load saved tickets if any
    const savedTickets = sessionStorage.getItem('eventTickets');
    if (savedTickets) {
        const tickets = JSON.parse(savedTickets);
        const ticketList = document.querySelector('.ticket-list');
        
        // Clear existing tickets
        ticketList.innerHTML = '';
        
        // Add saved tickets
        tickets.forEach(ticket => {
            const ticketItem = createTicketItem(ticket.tier, ticket.quantity, ticket.price);
            ticketList.appendChild(ticketItem);
        });
    }
}

// Validate form helper
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
        }
    });
    
    return isValid;
}

// Field validation helper functions
function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class to field
    field.classList.add('is-invalid');
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-danger small mt-1';
    errorDiv.textContent = message;
    
    // Insert error message after the field
    field.parentNode.appendChild(errorDiv);
}

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

// Delete confirmation popup
function showDeleteConfirmation(itemName, onConfirm) {
    // Remove existing confirmation modal
    const existingModal = document.querySelector('#deleteConfirmationModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create confirmation modal
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'deleteConfirmationModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title">Confirm Delete</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center py-4">
                    <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                    <h6 class="mt-3">Are you sure you want to delete this ticket?</h6>
                    <p class="text-muted mb-0">"${itemName}" will be permanently removed.</p>
                </div>
                <div class="modal-footer border-0 pt-0">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
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
    const confirmBtn = modal.querySelector('#confirmDeleteBtn');
    confirmBtn.addEventListener('click', function() {
        bootstrapModal.hide();
        onConfirm();
    });
    
    // Clean up modal when hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
} 