window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.search = {
    initialize(app) {
        const searchInputs = document.querySelectorAll('input[data-search-type], input[placeholder*="Search"]');
        if (!searchInputs.length) {
            return;
        }

        searchInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const searchType = e.target.getAttribute('data-search-type') || 'general';

                switch (searchType) {
                    case 'events':
                        app.searchEvents(searchTerm);
                        break;
                    case 'vendors':
                        app.searchVendors(searchTerm);
                        break;
                    default:
                        app.searchGeneral(searchTerm);
                }
            });
        });
    }
};
