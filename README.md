# CyberQuest
PROJECT: CyberQuest – An Interactive Cybersecurity Learning and Threat Awareness Platform

### STEP 1: Extract and open the project

1. Extract the ZIP file.
2. Open the extracted cyberquest folder in VS Code.
3. Make sure it contains two folders:
   - client
   - server

### STEP 2: Install dependencies

Open VS Code terminal.

For the backend:
bash
cd server
npm install


For the frontend, open another terminal:
bash
cd client
npm install


### STEP 3: Configure the backend

Inside the server folder, create a file named .env.

Add these variables:

env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_JWT_SECRET
ADMIN_EMAIL=YOUR_ADMIN_EMAIL
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
GEMINI_MODEL=YOUR_GEMINI_MODEL




### STEP 4: Run the project locally

Open two terminals.

Backend:
bash
cd server
node server.js


Frontend:
bash
cd client
npm run dev


Open the frontend URL displayed in the terminal (usually http://localhost:5173).
### STEP 5: Create the GitHub repository

1. Log in to GitHub.
2. Create a new repository named CyberQuest.
3. Upload the complete project, including both client and server folders.
4. Ensure .env and node_modules are excluded.
5. Add a .gitignore file to prevent accidental uploads.

### STEP 6: Check frontend API URLs

Before deployment, search the frontend code for any hardcoded localhost:5000 URLs.

These must be configured to use:
js
import.meta.env.VITE_API_URL


All frontend API requests must point to the deployed backend URL after deployment.

### STEP 7: Deploy the backend using Render

1. Create a Render account.
2. Connect the GitHub repository.
3. Create a new Web Service.
4. Root Directory: server
5. Build Command: npm install
6. Start Command: node server.js
7. Add the environment variables in Render's Environment settings.
8. Deploy the backend and copy its URL.

### STEP 8: Deploy the frontend using Vercel

1. Create a Vercel account.
2. Import the same GitHub repository.
3. Root Directory: client
4. Build Command: npm run build
5. Output Directory: dist
6. Add this environment variable:

env
VITE_API_URL=https://YOUR-RENDER-BACKEND-URL


7. Deploy the frontend.

### STEP 9: Final testing

After deployment, check:

- User registration and login
- Learning modules
- Quiz submission
- Dashboard and progress tracking
- AI assistant
- Admin page
