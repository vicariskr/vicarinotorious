sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("weatherapp.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // Call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);

            // Create the weather model
            var oWeatherModel = new JSONModel();
            this.setModel(oWeatherModel, "weather");

            // Create the forecast model
            var oForecastModel = new JSONModel();
            this.setModel(oForecastModel, "forecast");

            // Create the views model for UI state
            var oViewModel = new JSONModel({
                busy: false,
                city: "London",
                apiKey: "", // Users should add their own OpenWeather API key here
                units: "metric",
                lastUpdate: null,
                error: null
            });
            this.setModel(oViewModel, "view");

            // Enable routing
            this.getRouter().initialize();
        }
    });
});
