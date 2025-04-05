# D&D 5e Currency Tracker

A simple web application for tracking D&D 5e character currency. This app allows you to:

- Create characters with initial currency
- Track copper, silver, electrum, gold, and platinum coins
- Add or remove coins with a single click
- Delete characters you no longer need

## Technologies Used

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Local Development Setup

### Prerequisites

- Node.js (v14 or later)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/dnd-currency-tracker.git
   cd dnd-currency-tracker
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start MongoDB (if using local MongoDB):
   ```
   # For Windows
   "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe" --dbpath="C:\data\db"

   # For macOS/Linux
   mongod --dbpath /data/db
   ```

4. Run the application in development mode:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment to DigitalOcean

This repository is configured for easy deployment to DigitalOcean App Platform.

### Deployment Steps

1. Push your code to a GitHub repository
2. Sign up for DigitalOcean and navigate to the App Platform
3. Click "Create App" and select your GitHub repository
4. Follow the configuration steps in the DigitalOcean deployment guide below

## Usage

- **Adding a Character**: Fill in the character name and initial currency amounts, then click "Add Character"
- **Updating Currency**: Use the + and - buttons next to each currency type to add or remove coins
- **Deleting a Character**: Click the trash icon on a character card

## License

MIT
