# SuureshIndia - Website, API, and Sanity CMS

This project has two main parts:

- `frontend/`: the public React site and admin UI
- `backend/`: the Express API used by the frontend, which includes `sanity-studio/` for CMS management

The current architecture is:

1. The frontend calls the backend REST API.
2. The backend reads and writes content in Sanity.
3. If Sanity credentials are missing, the backend falls back to mock in-memory data so local development can still start.

## Where the frontend is connected

The frontend API base URL is defined in `frontend/src/services/api.js`:

```js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
```

That means the frontend is not talking directly to Sanity yet. It still depends on the backend API for:

- articles
- updates
- team members
- compliance calendar
- downloads
- contact forms
- admin login and admin CRUD

## Local setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Set these values in `backend/.env`:

```env
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
ADMIN_EMAIL=admin@suureshindia.com
ADMIN_PASSWORD=Admin@1234
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_TOKEN=your_sanity_write_token
```

Notes:

- `SANITY_TOKEN` should be a token with write access if you want admin create/update/delete to work.
- If the Sanity variables are missing, the backend still starts in mock mode.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3. Sanity Studio

```bash
cd backend/sanity-studio
cp .env.example .env
npm install
npm run dev
```

Set these values in `backend/sanity-studio/.env`:

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_TITLE=SuureshIndia CMS Studio
```

The Studio config now reads these values from environment variables and will stop with a clear error if `SANITY_STUDIO_PROJECT_ID` is missing.

## Current status

Working now:

- frontend dev server
- backend dev server
- backend mock fallback without MongoDB
- backend routes using Sanity client or mock client

Not fully connected yet:

- Sanity Studio needs dependencies installed in `sanity-studio/`
- real Sanity project ID, dataset, and token still need to be added to env files

## Important clarification about MongoDB

MongoDB is not part of the active app flow anymore.
The backend uses `backend/utils/sanityClient.js` for real Sanity data and an
in-memory mock fallback when Sanity credentials are missing.

## Useful local URLs

- frontend: `http://localhost:5173`
- backend: `http://localhost:5000`
- Sanity Studio: usually `http://localhost:3333` (run from `backend/sanity-studio/`)

## Next cleanup options

If you want, the next step can be one of these:

1. Convert the frontend public pages to read Sanity directly instead of going through the backend.
2. Keep the backend in the middle and continue simplifying the Sanity-based backend.
3. Finish the Sanity Studio install and test a real create/read/update flow with your Sanity credentials.
