# Social-Media : Backend

## Setup

1. cd backend
2. npm install
3. Copy .env.sample to .env and set values (MONGO_URI, JWT_SECRET)
4. npm run dev   (requires nodemon) or npm start

API endpoints:
- POST /api/auth/register -> { name, email, password }
- POST /api/auth/login -> { email, password }
- GET  /api/posts -> public feed
- POST /api/posts -> create post (Authorization: Bearer <token>)
- PUT  /api/posts/:id -> edit post (owner only)
- DELETE /api/posts/:id -> delete post (owner only)
- POST /api/posts/:id/like -> toggle like
