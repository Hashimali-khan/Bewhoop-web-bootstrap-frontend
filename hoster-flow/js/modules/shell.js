window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.shell = {
    ready: (async () => {
        const sidebar = document.querySelector('.sidebar');
        const header = document.querySelector('.top-header');

        if (!sidebar && !header) {
            return;
        }

        const moduleUrl = document.currentScript ? new URL(document.currentScript.src) : null;
        if (!moduleUrl) {
            return;
        }

        const fetchFragment = async (relativePath) => {
            const response = await fetch(new URL(relativePath, moduleUrl).href);
            if (!response.ok) {
                throw new Error(`Failed to load ${relativePath}`);
            }

            return response.text();
        };

        const [sidebarHtml, headerHtml] = await Promise.all([
            fetchFragment('../../components/shared-sidebar.html'),
            fetchFragment('../../components/shared-header.html')
        ]);

        const existingOverlay = document.querySelector('.sidebar-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        if (sidebar) {
            sidebar.outerHTML = sidebarHtml;
        }

        if (header) {
            header.outerHTML = headerHtml;
        }
    })()
};
