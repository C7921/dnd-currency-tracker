# D&D 5e Currency Tracker

A simple web application for tracking D&D 5e character currency. This app allows you to:
- Create characters with initial currency
- Track copper, silver, electrum, gold, and platinum coins
- Add or remove coins with a single click
- Delete characters you no longer need

## Technologies Used

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

## Docker Development Environment

This project supports development using Docker containers for both the application and MongoDB.

### Docker Setup

1. **Prerequisites**:
   - Docker and Docker Compose installed on your system
   - VS Code with Remote-Containers extension (recommended)

2. **Starting the Development Environment**:
   ```bash
   # Start the containers
   docker-compose up -d
   
   # To see logs
   docker-compose logs -f
   ```

3. **Connecting to the Application Container**:
   - Using VS Code:
     * Click the Remote Explorer icon in the sidebar
     * Select "Containers" if not already selected
     * Find your application container and click "Attach to Container"
     * VS Code will open a new window connected to the container
   
   - Using Terminal:
     ```bash
     docker exec -it dnd-currency-app /bin/bash
     ```

4. **Working with the MongoDB Container**:
   - Connect to MongoDB from your application using:
     ```
     mongodb://mongodb:27017/dnd-currency
     ```
   
   - Access MongoDB shell:
     ```bash
     docker exec -it mongodb mongo
     ```
   
   - Common MongoDB commands:
     ```javascript
     // List all databases
     show dbs
     
     // Use the dnd-currency database
     use dnd-currency
     
     // List all collections
     show collections
     
     // Find all characters
     db.characters.find()
     ```

5. **Running the Application in Development Mode**:
   ```bash
   # Inside the container
   cd /projects/app/dnd-currency-tracker
   npm run dev
   ```

### Updating the Development Environment

1. **Installing New Dependencies**:
   ```bash
   # Inside the container
   npm install --save package-name
   ```

2. **Updating Docker Configuration**:
   - Edit `docker-compose.yml` to change container settings
   - Changes to Dockerfile or docker-compose.yml require rebuilding:
     ```bash
     docker-compose down
     docker-compose up -d --build
     ```

3. **Linking Files Between Host and Container**:
   - Files are synchronized between your host machine and container
   - Edit files using VS Code when connected to the container
   - Changes are preserved even when containers are removed

4. **Data Persistence**:
   - MongoDB data is stored in a Docker volume
   - Data persists across container restarts
   - To reset data:
     ```bash
     docker-compose down -v
     docker-compose up -d
     ```

5. **Environment Variables**:
   - Set environment variables in docker-compose.yml:
     ```yaml
     environment:
       - NODE_ENV=development
       - PORT=8080
       - MONGODB_URI=mongodb://mongodb:27017/dnd-currency
     ```

## Deployment to DigitalOcean

This repository is configured for easy deployment to DigitalOcean App Platform.

### Comprehensive Deployment Steps

1. **Prepare Your GitHub Repository**
   - Push your code to a GitHub repository
   - Ensure the repository is public or DigitalOcean has access to it

2. **Create a DigitalOcean Account**
   - Sign up at [DigitalOcean](https://www.digitalocean.com/)
   - Add a payment method

3. **Set Up MongoDB Database**
   - Go to the "Databases" section in DigitalOcean
   - Click "Create Database Cluster"
   - Select "MongoDB" as the database type
   - Choose a plan (Development database is fine for testing)
   - Select a region close to where your users will be
   - Name your database (e.g., "dnd-currency-db")
   - Click "Create Database Cluster"
   - Once created, go to "Connection Details" to get the connection string

4. **Configure App Platform**
   - Navigate to the App Platform in DigitalOcean
   - Click "Create App"
   - Select GitHub as your source
   - Choose your dnd-currency-tracker repository
   - Configure the app settings:
     * **Environment**: Node.js
     * **Source Directory**: `/` (root)
     * **Build Command**: `npm install`
     * **Run Command**: `npm start`
     * **HTTP Port**: `8080`

5. **Add Environment Variables**
   - In the app configuration, add environment variables:
     * `MONGODB_URI`: Paste your MongoDB connection string from step 3
     * `NODE_ENV`: Set to `production`

6. **Configure HTTP Health Check**
   - Set Health Check to HTTP
   - Path: `/health`
   - Port: `8080`

7. **Review and Launch**
   - Choose a plan (Basic is sufficient)
   - Review all settings
   - Click "Launch App"

8. **After Deployment**
   - Wait for the build and deployment to complete
   - Click the app URL to access your application
   - Verify all features are working correctly

## Troubleshooting Deployment

If you encounter issues during deployment:

1. **Body Parser Issues**
   - Check the app logs in DigitalOcean
   - Ensure Express middleware is correctly configured
   - Verify frontend requests are sending data in the correct format

2. **Database Connection Problems**
   - Confirm the `MONGODB_URI` environment variable is set correctly
   - Check that the MongoDB instance is running
   - Verify network access settings allow connections from your app

3. **Port Configuration**
   - Make sure your app is listening on the port specified in DigitalOcean (8080)
   - DigitalOcean's health checks use this port to verify your app is running

## Usage

- **Adding a Character**: Fill in the character name and initial currency amounts, then click "Add Character"
- **Updating Currency**: Use the + and - buttons next to each currency type to add or remove coins
- **Deleting a Character**: Click the trash icon on a character card

## Future Improvements

### User Authentication
- **Checkpoint**: Add user accounts to allow multiple users to track their own characters
- **Implementation**:
  * Add user model with email and password fields
  * Implement JWT or session-based authentication
  * Update character model to include user references
  * Create signup/login pages with form validation
  * Modify API routes to filter characters by user

### Character Customization
- **Checkpoint**: Allow users to customize character appearance and details
- **Implementation**:
  * Add character attributes like class, level, and image
  * Create a character detail page
  * Add image upload functionality
  * Update database schema and API endpoints
  * Implement a character editing interface
  * Import from dndbeyond, pdf or other character creator?

### Currency Conversion
- **Checkpoint**: Add automatic conversion between coin types
- **Implementation**:
  * Create conversion functions (e.g., 100 copper = 1 gold)
  * Add a conversion UI component
  * Implement an "optimize" button to convert to higher denominations
  * Update the currency display to show equivalent values
  * Add the option to customise currency and/or change conversion rates

### Campaign Management
- **Checkpoint**: Group characters into campaigns
- **Implementation**:
  * Create a campaign model
  * Add UI for creating/managing campaigns
  * Implement campaign-level currency tracking
  * Allow sharing campaigns with other users
  * Add campaign notes and session tracking

### Mobile Responsiveness
- **Checkpoint**: Optimize for mobile devices
- **Implementation**:
  * Improve responsive design with media queries
  * Test on various device sizes
  * Implement touch-friendly controls
  * Add PWA features for offline access

### Character Icons and Themes
- **Checkpoint**: Add customizable icons and themes
- **Implementation**:
  * Create a library of character icons
  * Add theme options (light/dark mode, fantasy themes)
  * Store user preferences in the database
  * Implement theme switching functionality

### Transaction History
- **Checkpoint**: Track currency changes over time
- **Implementation**:
  * Create a transaction model
  * Record all currency additions/subtractions
  * Add a transaction history view
  * Implement transaction categorization
  * Add reporting and statistics features

### Inventory Management
- **Checkpoint**: Track character items alongside currency
- **Implementation**:
  * Create an item model
  * Add item management UI
  * Implement item weight and value tracking
  * Add sorting and filtering options
  * Link items to currency for purchases

## License

MIT