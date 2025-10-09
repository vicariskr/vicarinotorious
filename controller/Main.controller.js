sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "weatherapp/model/formatter"
], function (Controller, JSONModel, MessageToast, formatter) {
    "use strict";

    return Controller.extend("weatherapp.controller.Main", {

        formatter: formatter,

        onInit: function () {
            // Load initial weather data for default city
            this._loadWeatherData();
        },

        onSearchWeather: function () {
            this._loadWeatherData();
        },

        _loadWeatherData: function () {
            var oViewModel = this.getView().getModel("view");
            var sCity = oViewModel.getProperty("/city");
            var sApiKey = oViewModel.getProperty("/apiKey");

            // Validate inputs
            if (!sCity || sCity.trim() === "") {
                oViewModel.setProperty("/error", "Please enter a city name");
                return;
            }

            if (!sApiKey || sApiKey.trim() === "") {
                oViewModel.setProperty("/error", "Please enter your OpenWeather API key. Get one free at https://openweathermap.org/api");
                return;
            }

            // Clear previous error
            oViewModel.setProperty("/error", null);
            oViewModel.setProperty("/busy", true);

            // Load current weather and forecast in parallel
            Promise.all([
                this._loadCurrentWeather(sCity, sApiKey),
                this._loadForecast(sCity, sApiKey)
            ]).then(function () {
                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/lastUpdate", new Date());
                MessageToast.show("Weather data updated successfully");
            }).catch(function (error) {
                oViewModel.setProperty("/busy", false);
                oViewModel.setProperty("/error", error.message || "Failed to load weather data");
            });
        },

        _loadCurrentWeather: function (sCity, sApiKey) {
            var that = this;
            var oWeatherModel = this.getView().getModel("weather");
            var sUnits = this.getView().getModel("view").getProperty("/units");

            var sUrl = "https://api.openweathermap.org/data/2.5/weather" +
                "?q=" + encodeURIComponent(sCity) +
                "&appid=" + sApiKey +
                "&units=" + sUnits;

            return new Promise(function (resolve, reject) {
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function (data) {
                        oWeatherModel.setData(data);
                        resolve(data);
                    },
                    error: function (xhr) {
                        var errorMessage = "Failed to load current weather";
                        try {
                            var errorData = JSON.parse(xhr.responseText);
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            // Use default error message
                        }
                        reject(new Error(errorMessage));
                    }
                });
            });
        },

        _loadForecast: function (sCity, sApiKey) {
            var that = this;
            var oForecastModel = this.getView().getModel("forecast");
            var sUnits = this.getView().getModel("view").getProperty("/units");

            var sUrl = "https://api.openweathermap.org/data/2.5/forecast" +
                "?q=" + encodeURIComponent(sCity) +
                "&appid=" + sApiKey +
                "&units=" + sUnits;

            return new Promise(function (resolve, reject) {
                jQuery.ajax({
                    url: sUrl,
                    method: "GET",
                    success: function (data) {
                        oForecastModel.setData(data);
                        resolve(data);
                    },
                    error: function (xhr) {
                        var errorMessage = "Failed to load forecast data";
                        try {
                            var errorData = JSON.parse(xhr.responseText);
                            errorMessage = errorData.message || errorMessage;
                        } catch (e) {
                            // Use default error message
                        }
                        reject(new Error(errorMessage));
                    }
                });
            });
        },

        /**
         * Filter function to show only one forecast per day (at noon)
         */
        filterNoonForecasts: function (value) {
            if (!value) {
                return false;
            }
            // Show forecasts at 12:00:00 (noon)
            return value.indexOf("12:00:00") > -1;
        }
    });
});
