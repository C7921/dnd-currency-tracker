## Set Up the Local Development Environment

### Step-by-Step Instructions

Clone the repository (if you haven't already):

`git clone https://github.com/c7921/dnd-currency-tracker.git`

`cd dnd-currency-tracker`

Switch to the develop branch:
`bashCopy`git checkout develop`

Start the Docker containers:
`docker-compose up -d`

Connect to the container using VS Code:

Open VS Code
Install the Remote - Containers extension if not already installed
Click on the Remote Explorer icon in the sidebar
Find the dnd-currency-app container
Click "Attach to Container"


Verify the application:

Open a browser and navigate to http://localhost:8080
You should see the D&D Currency Tracker application



5. Development Workflow
Making Changes

Create a feature branch:
bashCopygit checkout -b feature/new-feature develop

Make your changes in VS Code connected to the container
Test your changes locally:

The app should automatically reload due to nodemon
Access at http://localhost:8080


Commit your changes:

`git add .`

`git commit -m "Add feature: detailed description"`

Push to GitHub:

`git push -u origin feature/new-feature`

Create a pull request to merge into the develop branch
After review and approval, merge the pull request

Syncing with Remote
To keep your local develop branch in sync:

`git checkout develop`

`git pull origin develop`

6. Database Management

Working with MongoDB

Connect to MongoDB shell:
`docker exec -it mongodb mongo`

Common MongoDB operations:
```javascript
Switch to the app database
use dnd-currency

// List collections
show collections

// Find all characters
db.characters.find()

// Clear the characters collection
db.characters.remove({})
```

MongoDB data persistence:

Data is stored in a Docker volume `named mongodb_data`
To reset the database:
`docker-compose down -v`
`docker-compose up -d`


7. Deploying to Production
When you're ready to deploy to DigitalOcean:

Merge develop to main:
```bash
git checkout develop
git pull origin develop  # ensure you have latest changes
git checkout main
git pull origin main  # ensure main is up to date
git merge develop
git push origin main
```

This will trigger your DigitalOcean deployment if you have automatic deploys enabled

Additional Tips
VS Code Configuration
Create a .vscode/settings.json file for consistent editor settings:
```json
{
  "editor.formatOnSave": true,
  "editor.tabSize": 2,
  "javascript.format.enable": true,
  "javascript.validate.enable": true
}
```
Debugging
To debug your Node.js application:

Add a `.vscode/launch.json` file:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach to Docker",
      "port": 9229,
      "remoteRoot": "/projects/app/dnd-currency-tracker",
      "localRoot": "${workspaceFolder}"
    }
  ]
}
```

Update your `package.json` dev script to enable debugging:
```json
"scripts": {
  "dev": "nodemon --inspect=0.0.0.0:9229 app.js"
}
```

Update your docker-compose.yml to expose the debug port:
```yaml
ports:
  - "8080:8080"
  - "9229:9229"
```

This comprehensive setup will allow you to maintain a clean development workflow with Docker while keeping your GitHub repository organized with separate main and development branches.