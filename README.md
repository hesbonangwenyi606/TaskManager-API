# TaskManager API (Node.js + Express + MongoDB + JWT)
A full-featured RESTful API for task management, built with Node.js, Express, MongoDB, and JWT authentication.

### Clone the repository

git clone git@github.com:hesbonangwenyi606/TaskManager-API.git
cd TaskManager-API
2. Set up environment variables
Copy the example file and update values:

cp .env.example .env
Edit .env:

ini
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=yourSuperSecretKey
PORT=3000
 ## Install dependencies

npm install
## Start the server (development)

## npm run dev
API base URL: http://localhost:3000/v1

Swagger UI: http://localhost:3000/v1/docs

## Docker (optional)
Run API + MongoDB using Docker:

Build and start containers:

docker-compose up --build
API will be available at http://localhost:3000/v1

Swagger docs at http://localhost:3000/v1/docs

## Features Included
Authentication

Register

Login

JWT token authentication

Users

Get profile (/users/me)

List users (admin only)

Posts / Tasks

Create, Read, Update, Delete

Ownership checks

Database

MongoDB via Mongoose

## Security

JWT authentication

Rate limiting

Helmet & CORS

Documentation

Swagger UI (/v1/docs)

## API Endpoints Overview
Auth
Method	Endpoint	Description
POST	/v1/auth/register	Register a new user
POST	/v1/auth/login	Login and receive JWT

Users
Method	Endpoint	Description
GET	/v1/users	List all users (admin only)
GET	/v1/users/me	Get your own profile

Posts / Tasks
Method	Endpoint	Description
GET	/v1/posts	List all posts
POST	/v1/posts	Create a new post (auth required)
GET	/v1/posts/:id	Get a single post by ID
PUT	/v1/posts/:id	Update a post (auth required)
DELETE	/v1/posts/:id	Delete a post (auth required)

## Health Check
Method	Endpoint	Description
GET	/v1/health	Check API status

## Notes
All protected routes require the header:

## makefile
Authorization: Bearer <ACCESS_TOKEN>
Use Swagger UI (/v1/docs) to explore and test endpoints interactively.

Supports running locally or via Docker for easy deployment.

## License
MIT License