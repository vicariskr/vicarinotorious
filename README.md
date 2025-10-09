# SAPUI5 Weather Application

A modern weather application built with SAPUI5 that consumes the OpenWeather API to display current weather and 5-day forecast.

## Features

- 🌤️ **Current Weather**: Real-time weather data for any city
- 📅 **5-Day Forecast**: Extended weather forecast with daily predictions
- 🎨 **Modern UI**: Beautiful gradient design with responsive layout
- 📱 **Responsive**: Works on desktop, tablet, and mobile devices
- 🌡️ **Detailed Metrics**: Temperature, humidity, wind speed, pressure, visibility, and cloud coverage

## Prerequisites

- A web browser (Chrome, Firefox, Safari, or Edge)
- An OpenWeather API key (free tier available)

## Getting Started

### 1. Get Your OpenWeather API Key

1. Visit [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate your API key from the dashboard
4. Wait a few minutes for the API key to activate

### 2. Run the Application

You can run this application in several ways:

#### Option A: Simple HTTP Server (Python)

```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open your browser to: `http://localhost:8080`

#### Option B: Node.js HTTP Server

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Run the server
http-server -p 8080
```

Then open your browser to: `http://localhost:8080`

#### Option C: Live Server (VS Code Extension)

If you're using VS Code:
1. Install the "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 3. Use the Application

1. Enter your OpenWeather API key in the "API Key" field
2. Enter a city name (e.g., "London", "São Paulo", "New York")
3. Click the "Search" button or press Enter
4. View the current weather and 5-day forecast

## Application Structure

```
weatherapp/
├── index.html                 # Entry point
├── manifest.json             # App configuration
├── Component.js              # Main component
├── view/
│   └── Main.view.xml        # Main view (UI definition)
├── controller/
│   └── Main.controller.js   # Controller (business logic)
├── model/
│   └── formatter.js         # Data formatters
└── css/
    └── style.css            # Custom styles
```

## API Integration

This application uses two OpenWeather API endpoints:

1. **Current Weather API**: `https://api.openweathermap.org/data/2.5/weather`
   - Returns current weather data for a specified city

2. **5-Day Forecast API**: `https://api.openweathermap.org/data/2.5/forecast`
   - Returns weather forecast with 3-hour intervals for 5 days
   - The app filters to show one forecast per day (at noon)

## Technologies Used

- **SAPUI5**: OpenUI5 framework (version 1.60+)
- **sap.m Library**: Mobile-optimized controls
- **sap.ui.layout**: Layout controls
- **JSON Model**: For data binding
- **OpenWeather API**: Weather data source

## Features Breakdown

### Current Weather Display
- City name and country
- Current temperature
- Weather description
- Feels like temperature
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Visibility distance
- Cloud coverage

### 5-Day Forecast
- Date and day name
- Weather description
- Average temperature
- High and low temperatures

## Customization

### Change Temperature Units

Edit `Component.js` and modify the `units` property:
- `metric` - Celsius (default)
- `imperial` - Fahrenheit
- `standard` - Kelvin

### Modify Default City

Edit `Component.js` and change the `city` property in the view model.

### Styling

Customize the appearance by editing `css/style.css`. The app uses a purple gradient theme by default.

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Troubleshooting

### "Invalid API key" Error
- Make sure your API key is activated (can take a few minutes)
- Verify you copied the entire API key correctly

### "City not found" Error
- Check the spelling of the city name
- Try using just the city name without country codes
- Some smaller cities might not be in the database

### CORS Issues
- Make sure you're running the app through a web server (not file:// protocol)
- OpenWeather API supports CORS, so this shouldn't be an issue normally

## License

This project is open source and available for educational purposes.

## Credits

- Weather data provided by [OpenWeather](https://openweathermap.org/)
- Built with [SAPUI5/OpenUI5](https://openui5.org/)

## Support

For issues with:
- **The application**: Check the browser console for errors
- **OpenWeather API**: Visit [OpenWeather Support](https://openweathermap.org/faq)
- **SAPUI5**: Visit [SAPUI5 Documentation](https://sapui5.hana.ondemand.com/)

---

**Enjoy your weather app! ☀️🌧️❄️**
