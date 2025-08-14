// create-event-step1.js - Enhanced functionality for create event step 1

document.addEventListener('DOMContentLoaded', function() {
    // Initialize file upload functionality
    initializeFileUpload();
    
    // Initialize event title functionality
    initializeEventTitle();
    
    // Initialize ticketed toggle functionality
    initializeTicketedToggle();
    
    // Initialize form validation
    initializeFormValidation();
});

// File upload functionality
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
    
    // File input change
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // Drag and drop functionality
    if (dropzone) {
        dropzone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        dropzone.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
        });
        
        dropzone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });
    }
}

// Handle uploaded files
function handleFiles(files) {
    const fileList = document.querySelector('.file-list');
    const dropzone = document.querySelector('.dropzone');
    
    if (files.length > 0) {
        // Show file list
        fileList.style.display = 'block';
        
        // Hide dropzone
        dropzone.style.display = 'none';
        
        // Clear existing files
        fileList.innerHTML = '';
        
        // Add each file
        Array.from(files).forEach((file, index) => {
            const fileItem = createFileItem(file, index);
            fileList.appendChild(fileItem);
        });
    }
}

// Create file item element
function createFileItem(file, index) {
    const fileItem = document.createElement('div');
    fileItem.className = 'file-list-item d-flex align-items-center mb-2';
    fileItem.setAttribute('data-file-index', index);
    
    // Create thumbnail
    const thumbnail = document.createElement('img');
    thumbnail.className = 'file-thumb me-2';
    thumbnail.style.width = '40px';
    thumbnail.style.height = '40px';
    thumbnail.style.objectFit = 'cover';
    thumbnail.style.borderRadius = '4px';
    
    // Read file as data URL for thumbnail
    const reader = new FileReader();
    reader.onload = function(e) {
        thumbnail.src = e.target.result;
    };
    reader.readAsDataURL(file);
    
    // File info
    const fileInfo = document.createElement('div');
    fileInfo.className = 'flex-grow-1';
    fileInfo.innerHTML = `
        <div class="file-name">${file.name}</div>
        <div class="file-size text-muted small">${formatFileSize(file.size)}</div>
    `;
    
    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-link p-0 ms-2 text-danger';
    deleteBtn.setAttribute('aria-label', 'Delete');
    deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
    deleteBtn.addEventListener('click', function() {
        deleteFile(index);
    });
    
    fileItem.appendChild(thumbnail);
    fileItem.appendChild(fileInfo);
    fileItem.appendChild(deleteBtn);
    
    return fileItem;
}

// Delete file
function deleteFile(index) {
    const fileItem = document.querySelector(`[data-file-index="${index}"]`);
    if (fileItem) {
        fileItem.remove();
        
        // Check if no files left
        const remainingFiles = document.querySelectorAll('.file-list-item');
        if (remainingFiles.length === 0) {
            const fileList = document.querySelector('.file-list');
            const dropzone = document.querySelector('.dropzone');
            
            fileList.style.display = 'none';
            dropzone.style.display = 'flex';
        }
    }
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Event title functionality
function initializeEventTitle() {
    const eventTitleBtn = document.querySelector('.event-title-card .btn-add-circle');
    
    if (eventTitleBtn) {
        eventTitleBtn.addEventListener('click', function() {
            openEventTitleModal();
        });
    }
}

// Open event title modal
function openEventTitleModal() {
    const modal = createEventTitleModal();
    document.body.appendChild(modal);
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Create event title modal
function createEventTitleModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'eventTitleModal';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Event Title & Tagline</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="eventTitleForm">
                        <div class="mb-3">
                            <label class="form-label">Event Title *</label>
                            <input type="text" class="form-control" id="eventTitle" required placeholder="Enter event title">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Tagline</label>
                            <input type="text" class="form-control" id="eventTagline" placeholder="Enter event tagline">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-danger" onclick="saveEventTitle()">Save</button>
                </div>
            </div>
        </div>
    `;
    
    return modal;
}

// Save event title
window.saveEventTitle = function() {
    const form = document.getElementById('eventTitleForm');
    const titleInput = document.getElementById('eventTitle');
    const taglineInput = document.getElementById('eventTagline');
    
    if (validateForm(form)) {
        const title = titleInput.value.trim();
        const tagline = taglineInput.value.trim();
        
        // Update the event title card
        const eventTitleCard = document.querySelector('.event-title-card');
        const titleDiv = eventTitleCard.querySelector('.fw-bold.fs-5');
        const taglineDiv = eventTitleCard.querySelector('.text-muted.small');
        
        titleDiv.textContent = title || 'Event Title';
        taglineDiv.textContent = tagline || 'Add a Tagline';
        
        // Store in session storage for multi-step form
        sessionStorage.setItem('eventTitle', title);
        sessionStorage.setItem('eventTagline', tagline);
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('eventTitleModal'));
        modal.hide();
        
        console.log('Event title saved:', { title, tagline });
    }
};

// Ticketed toggle functionality
function initializeTicketedToggle() {
    const ticketedSwitch = document.getElementById('ticketedSwitch');
    
    if (ticketedSwitch) {
        ticketedSwitch.addEventListener('change', function() {
            const isTicketed = this.checked;
            
            // Store in session storage
            sessionStorage.setItem('isTicketed', isTicketed);
            
            console.log('Ticketed status:', isTicketed);
        });
    }
}

// Form validation
function initializeFormValidation() {
    const nextButton = document.querySelector('.btn-next-fixed');
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            if (!validateStep1Form()) {
                e.preventDefault();
                return false;
            }
            
            // Proceed to next step
            window.location.href = 'create-event-step2.html';
        });
    }
}

// Validate step 1 form
function validateStep1Form() {
    let isValid = true;
    
    // Clear previous validation errors
    clearValidationErrors();
    
    // Check if event title is set
    const eventTitle = sessionStorage.getItem('eventTitle');
    if (!eventTitle || eventTitle.trim() === '') {
        showFormError('Please set an event title before proceeding.');
        isValid = false;
    }
    
    // Check if at least one photo is uploaded
    const fileItems = document.querySelectorAll('.file-list-item');
    if (fileItems.length === 0) {
        showFormError('Please upload at least one photo before proceeding.');
        isValid = false;
    }
    
    return isValid;
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