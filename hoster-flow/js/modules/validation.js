window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.validation = {
    initialize(app) {
        const forms = document.querySelectorAll('form');
        if (!forms.length) {
            return;
        }

        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!app.validateForm(form)) {
                    e.preventDefault();
                    return false;
                }
            });
        });

        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                app.validateField(input);
            });

            input.addEventListener('input', () => {
                app.clearFieldError(input);
            });
        });
    }
};
