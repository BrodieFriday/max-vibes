# Interactive Map Application (React Version)

This is an interactive map application built with **React** and **Vite**, using the **React-Leaflet** library for mapping and the **OpenStreetMap Nominatim API** for geocoding.

## Features

- **Interactive Map:** A draggable and zoomable map, rendered as a React component.
- **Search Functionality:** Search for addresses, places, or coordinates.
- **Markers & Info Windows:** Pins are dropped on searched locations with popups showing details.
- **Current Location:** A button to show the user's current position on the map.
- **Responsive Design:** The application is designed to work on both desktop and mobile devices.

## Tech Stack

- **Framework:** [React](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Map Library:** [React-Leaflet](https://react-leaflet.js.org/) (a wrapper for [Leaflet.js](https://leafletjs.com/))
- **Tile Provider:** [OpenStreetMap](https://www.openstreetmap.org/)
- **Geocoding Service:** [Nominatim](https://nominatim.openstreetmap.org/)

## Development

This interactive map application was developed with the assistance of Cascade, a powerful, agentic AI coding assistant created by the world-class AI engineering team at Windsurf. Cascade's capabilities in code generation, refactoring, and debugging were instrumental in building the features of this application.

## Setup and Usage

To run this project locally, you'll need to have [Node.js](https://nodejs.org/) installed.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    Use `npm` to install the required packages.
    ```bash
    npm install
    ```

3.  **Run the development server:**
    This command starts the Vite development server.
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## How to Use

- **Search for a location:** Type an address or place name into the search bar and click the "Search" button or press Enter.
- **Find your location:** Click the "My Location" button to have the map center on your current geographical position (you may be prompted to allow location access).
- **Interact with the map:**
    - Drag the map to pan.
    - Use the `+` and `-` buttons or your mouse scroll wheel to zoom in and out.
    - Click on a marker to see its information popup.
