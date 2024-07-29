# Earthquake Data Fetcher

This project is an Express.js application that periodically fetches earthquake data from a specified source and provides an API to access this data. The data is also saved to a JSON file for backup purposes.

## Features

- Periodic fetching of earthquake data.
- JSON API to access the latest earthquake data.
- Backup of the latest fetched data to a file.
- CORS enabled to allow cross-origin requests from specified domains.

## Installation

1. Clone the repository:

    ```bash
    git clone <repository_url>
    cd <repository_directory>
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file in the root of the project and add the following environment variables:

    ```bash
    PORT=3500
    NODE_ENV=development
    ```

4. Start the server:

    ```bash
    npm start
    ```

## Endpoints

- `GET /today` - Fetch the latest earthquake data.
- `GET /todaybackup` - Fetch the backup of the latest earthquake data from the `today.json` file.
- `GET /updateToday` - Manually trigger an update of the earthquake data and update the `today.json` file.

## CORS Configuration

The application is configured to allow cross-origin requests from the following origins:

- `http://localhost:5173`
- `https://depremler-app.onrender.com/`

## How It Works

1. The application fetches earthquake data from `http://www.koeri.boun.edu.tr/scripts/lst6.asp` every 10 minutes.
2. The fetched data is parsed and saved to a JSON file (`today.json`).
3. The API provides endpoints to access the latest data and the backup data.

## Dependencies

- `express` - Fast, unopinionated, minimalist web framework for Node.js.
- `dotenv` - Loads environment variables from a `.env` file into `process.env`.
- `axios` - Promise-based HTTP client for the browser and Node.js.
- `cheerio` - Fast, flexible, and lean implementation of core jQuery designed specifically for the server.
- `toad-scheduler` - A lightweight, flexible, and efficient job scheduler for Node.js.
- `fs` - Node.js file system module.
- `cors` - Middleware for enabling CORS.
