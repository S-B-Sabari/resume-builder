# System Testing and Deployment Guide

This guide provides instructions on how to run test suites, set up local development, run using Docker, and deploy the application to cloud environments.

---

## 1. System Testing

The application features automated test coverage for both the client (React + Vitest) and server (Node Express + Jest + Supertest). All tests use mocked services (database & external APIs) to ensure they are fast, independent of external resources, and free to execute.

### Backend Testing (Server)

The backend test suite verifies authentication, resume CRUD operations, and AI helper integrations.

1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```
3. Run the test suite:
   ```bash
   npm run test
   ```

### Frontend Testing (Client)

The frontend test suite tests UI components under different application states.

1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vitest suite:
   ```bash
   npm run test
   ```

---

## 2. Docker Deployment (Local Orchestration)

Both components have Dockerfiles enabling simple setup. The root `docker-compose.yml` launches the entire environment in a single command.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Launching the Stack

1. From the root repository directory, start the services:
   ```bash
   docker compose up --build
   ```
2. Once the build finishes:
   - Access the **Frontend Client** at: `http://localhost:5173`
   - The **Backend Server** runs at: `http://localhost:5000`
3. Stop the services:
   ```bash
   docker compose down
   ```

---

## 3. Production Deployment Guidelines

When deploying to cloud platforms in production:

### Option A: Render (Backend) + Vercel (Frontend)

This is the recommended free-tier setup.

#### Backend (Render Web Service)
1. Link your GitHub repository.
2. Select **Web Service** and choose the `server` directory as the Root Directory.
3. Use the following build & start settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add the following Environment Variables in the Render dashboard:
   - `PORT` = `5000`
   - `JWT_SECRET` = `[your-jwt-secret]`
   - `MONGODB_URI` = `[your-mongodb-atlas-uri]`
   - `IMAGEKIT_PRIVATE_KEY` = `[your-imagekit-private-key]`
   - `OPENAI_API_KEY` = `[your-openai-api-key]`
   - `OPENAI_BASE_URL` = `https://generativelanguage.googleapis.com/v1beta/openai/`
   - `OPENAI_MODEL` = `models/gemini-flash-latest`

#### Frontend (Vercel)
1. Import your repository into Vercel.
2. Set `client` as the Root Directory.
3. Configure the environment variables:
   - `VITE_BASE_URL` = `[your-deployed-render-backend-url]` (e.g. `https://resume-builder-server.onrender.com`)
4. Click **Deploy**. Vercel will automatically build and serve the static assets.

### Option B: Unified VM (VPS like AWS EC2, DigitalOcean)

Using the built-in Docker support makes unified VM deployment trivial:

1. Clone the repository on your VPS.
2. Setup the `.env` file inside the `server` folder.
3. Run the Docker compose command in detached mode:
   ```bash
   docker compose up -d --build
   ```
4. Point a reverse proxy (like Nginx) on the host machine to route domain traffic to port `5173` (Frontend) and `/api` to port `5000` (Backend).
