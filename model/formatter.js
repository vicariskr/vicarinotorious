sap.ui.define([], function () {
    "use strict";

    return {
        /**
         * Formats temperature value
         * @param {number} value - Temperature value
         * @returns {string} Formatted temperature
         */
        formatTemperature: function (value) {
            if (value === null || value === undefined) {
                return "";
            }
            return Math.round(value) + "°C";
        },

        /**
         * Formats percentage value
         * @param {number} value - Percentage value
         * @returns {string} Formatted percentage
         */
        formatPercentage: function (value) {
            if (value === null || value === undefined) {
                return "";
            }
            return value + "%";
        },

        /**
         * Formats wind speed
         * @param {number} value - Wind speed in m/s
         * @returns {string} Formatted wind speed
         */
        formatWindSpeed: function (value) {
            if (value === null || value === undefined) {
                return "";
            }
            return value.toFixed(1) + " m/s";
        },

        /**
         * Formats pressure
         * @param {number} value - Pressure in hPa
         * @returns {string} Formatted pressure
         */
        formatPressure: function (value) {
            if (value === null || value === undefined) {
                return "";
            }
            return value + " hPa";
        },

        /**
         * Formats visibility
         * @param {number} value - Visibility in meters
         * @returns {string} Formatted visibility
         */
        formatVisibility: function (value) {
            if (value === null || value === undefined) {
                return "";
            }
            return (value / 1000).toFixed(1) + " km";
        },

        /**
         * Formats date from Unix timestamp
         * @param {number} timestamp - Unix timestamp
         * @returns {string} Formatted date
         */
        formatDate: function (timestamp) {
            if (!timestamp) {
                return "";
            }
            var date = new Date(timestamp * 1000);
            var options = { month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        },

        /**
         * Formats day name from Unix timestamp
         * @param {number} timestamp - Unix timestamp
         * @returns {string} Day name
         */
        formatDay: function (timestamp) {
            if (!timestamp) {
                return "";
            }
            var date = new Date(timestamp * 1000);
            var options = { weekday: 'long' };
            return date.toLocaleDateString('en-US', options);
        },

        /**
         * Formats date and time
         * @param {Date} date - Date object
         * @returns {string} Formatted date and time
         */
        formatDateTime: function (date) {
            if (!date) {
                return "";
            }
            var options = { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            return date.toLocaleDateString('en-US', options);
        }
    };
});
