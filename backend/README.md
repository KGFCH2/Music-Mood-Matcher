# Music Mood Matcher Backend

Minimal Express backend scaffold for the Music Mood Matcher frontend

Quick start

```bash
cd backend
npm install
cp .env.example .env
# configure MONGODB_URI and JWT_SECRET in .env
npm run dev
```

This scaffold provides basic routes under `/api/auth` and `/api/user` to mirror the frontend expectations. It uses MongoDB via Mongoose
