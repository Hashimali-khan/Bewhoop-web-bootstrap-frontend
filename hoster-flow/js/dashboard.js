/**
 * DASHBOARD.JS - Dashboard-specific functionality
 * Extends core functionality for dashboard page
 * 
 * UPDATED: Removed duplicate functionality now handled by core.js
 * - Form validation (moved to core.js)
 * - Pagination (moved to core.js)
 * - Dashboard filters (moved to core.js)
 * - Search functionality (moved to core.js)
 */

class DashboardManager {
    constructor() {
        this.init();
    }

    init() {
        this.initializeCharts();
        this.initializeDatePicker();
        console.log('Dashboard Manager initialized');
    }

    // ========================================
    // CHART INITIALIZATION
    // ========================================
    initializeCharts() {
        this.initEventViewsChart();
    }

    initEventViewsChart() {
        const ctx = document.getElementById('eventViewsChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Views',
                        data: [1200, 1900, 3000, 5000, 2300, 3400, 4200],
                        borderColor: '#FF5A1F',
                        backgroundColor: 'rgba(255,90,31,0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: { beginAtZero: true }
                    }
                }
            });
        }
    }

    // ========================================
    // DATE PICKER FUNCTIONALITY
    // ========================================
    initializeDatePicker() {
        const datePicker = document.querySelector('#datePicker');
        if (datePicker && typeof flatpickr !== 'undefined') {
            flatpickr(datePicker, {
                defaultDate: "today",
                dateFormat: "d M Y",
                allowInput: true,
                onChange: (selectedDates, dateStr) => {
                    // Use core app's filter functionality
                    if (window.bewhoopApp) {
                        window.bewhoopApp.filterDashboardData(null, dateStr);
                    }
                }
            });
        }
    }

    // ========================================
    // ANALYTICS METHODS
    // ========================================
    updateMetrics(data) {
        // Update dashboard metrics with new data
        const metricElements = {
            'click-through-rate': document.querySelector('.dashboard-metric-value'),
            'conversion-rate': document.querySelectorAll('.dashboard-metric-value')[1],
            'attendees': document.querySelectorAll('.dashboard-metric-value')[2],
            'tickets-sold': document.querySelectorAll('.dashboard-metric-value')[3]
        };

        if (data.clickThroughRate) {
            metricElements['click-through-rate'].textContent = data.clickThroughRate + '%';
        }
        if (data.conversionRate) {
            metricElements['conversion-rate'].textContent = data.conversionRate + '%';
        }
        if (data.attendees) {
            metricElements['attendees'].textContent = data.attendees.toLocaleString();
        }
        if (data.ticketsSold) {
            metricElements['tickets-sold'].textContent = data.ticketsSold.toLocaleString();
        }
    }

    refreshDashboard() {
        // Refresh all dashboard data
        console.log('Refreshing dashboard data...');
        // This would typically make API calls to refresh all data
    }
}

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dashboard manager if on dashboard page
    if (document.querySelector('.dashboard-page')) {
        window.dashboardManager = new DashboardManager();
    }
}); 