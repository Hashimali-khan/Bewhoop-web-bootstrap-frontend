window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.pagination = {
    initialize(app) {
        const paginationButtons = document.querySelectorAll('.btn[aria-label*="Page"]');
        if (!paginationButtons.length) {
            return;
        }

        paginationButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.textContent.includes('Prev') ? 'prev' : 'next';
                app.handlePagination(action);
            });
        });
    }
};
