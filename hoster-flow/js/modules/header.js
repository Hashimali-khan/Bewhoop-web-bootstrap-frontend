window.BewhoopModules = window.BewhoopModules || {};

window.BewhoopModules.header = {
    initialize(app) {
        app.initializeNotifications();
        app.initializeLanguageSelector();
        app.initializeUserMenu();
    }
};
