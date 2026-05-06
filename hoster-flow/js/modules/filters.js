window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.filters = {
    initialize(app) {
        const festivalDropdown = document.querySelector('#festivalDropdown');
        if (festivalDropdown) {
            const festivalOptions = festivalDropdown.nextElementSibling?.querySelectorAll('.dropdown-item') || [];
            festivalOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedFestival = option.textContent;
                    festivalDropdown.textContent = selectedFestival;
                    app.filterDashboardData(selectedFestival);
                });
            });
        }

        const dateDropdown = document.querySelector('#dateDropdown');
        if (dateDropdown) {
            const dateOptions = dateDropdown.nextElementSibling?.querySelectorAll('.dropdown-item') || [];
            dateOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    const selectedDate = option.textContent;
                    dateDropdown.textContent = selectedDate;
                    app.filterDashboardData(null, selectedDate);
                });
            });
        }

        const resetFilterBtn = document.querySelector('.btn-outline-secondary[aria-label="Reset Filter"]');
        if (resetFilterBtn) {
            resetFilterBtn.addEventListener('click', () => {
                app.resetDashboardFilters();
            });
        }
    }
};
