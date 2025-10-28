# Social-Media

A simple social media application featuring a post feed, user authentication, and profile viewing. It is built using the MERN stack (MongoDB, Express, React, Node.js).

## Features

  * **User Authentication**: Secure registration and login using JWT and `bcryptjs` for password hashing.
  * **Post Management**: Create new posts (max 100 words), edit, and delete your own posts.
  * **Interactive Feed**: Like and comment on posts.
  * **User Profiles**: View a list of all registered users and their posts.

## Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React** (with Vite) | User Interface library. |
| | **Tailwind CSS** | Styling utility-first CSS framework. |
| | **React Router DOM** | For handling application routing. |
| **Backend** | **Node.js** & **Express** | Server runtime and web framework. |
| | **MongoDB** & **Mongoose** | Database and Object Data Modeling library. |
| | **JWT** & **Bcrypt** | JSON Web Tokens for state management and hashing library. |

## Setup & Installation

### 1\. Backend Setup

The backend runs on Node.js/Express and serves the API.

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configuration**: Create a `.env` file in the `backend/` directory by copying the content from `.env.sample`:
    ```bash
    cp .env.sample .env
    ```
    Edit the `.env` file and set your MongoDB URI and a secret key:
    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/database
    JWT_SECRET=your_jwt_secret_here 
    ```
    > **Note**: The default port is `5000`.
4.  Run the server:
    ```bash
    npm run dev
    # or npm start
    ```
    The server should now be running on `http://localhost:5000`.

### 2\. Frontend Setup

The frontend is a React application created with Vite.

1.  Navigate to the frontend directory:
    ```bash
    cd ../frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configuration**: Create a `.env` file in the `frontend/` directory by copying the content from `.env.sample`:
    ```bash
    cp .env.sample .env
    ```
    Edit the `.env` file to ensure the API URL is correct:
    ```
    VITE_API_URL=http://localhost:5000/api
    ```
    > **Note**: The default frontend dev server runs on `http://localhost:5173`.
4.  Run the application:
    ```bash
    npm run dev
    ```
    The app will open in your browser.

## API Endpoints

The base API path is `/api`. All endpoints that require authentication must include an `Authorization: Bearer <token>` header.

| Method | Endpoint | Description | Authentication | Payload |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user | No | `{ name, email, password }` |
| `POST` | `/api/auth/login` | Log in a user | No | `{ email, password }` |
| `GET` | `/api/users` | Get a list of all users (name, email) | No | None |
| `GET` | `/api/posts` | Get the public feed of all posts | No | None |
| `POST`| `/api/posts` | Create a new post | Yes | `{ text }` |
| `PUT` | `/api/posts/:id` | Edit an existing post (owner only) | Yes | `{ text }` |
| `DELETE` | `/api/posts/:id` | Delete a post (owner only) | Yes | None |
| `POST` | `/api/posts/:id/like` | Toggle like status on a post | Yes | None |
| `POST` | `/api/posts/:id/comment` | Post a new comment on a post | Yes | `{ text }` |