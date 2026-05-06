window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.sidebar = {
    initialize(app) {
        const menuButton = document.getElementById('menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');

        if (!menuButton || !sidebar || !overlay) {
            return;
        }

        menuButton.addEventListener('click', () => {
            sidebar.classList.toggle('is-open');
            overlay.style.display = sidebar.classList.contains('is-open') ? 'block' : 'none';
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('is-open');
            overlay.style.display = 'none';
        });
    },

    setActiveNavigation(app) {
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        if (!navLinks.length) {
            return;
        }

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === app.currentPage) {
                link.classList.add('active');
            }
        });
    }
};
