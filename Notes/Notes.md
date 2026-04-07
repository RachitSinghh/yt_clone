# Backend Notes (YT Clone API)

This file explains what is already built, what each file is for, and the practical use cases this backend is meant to handle.

## 1) Project Goal

Build a YouTube-like backend with:
- user authentication (JWT access + refresh token)
- user profiles (avatar, cover image, watch history)
- video metadata and ownership
- scalable API structure (controllers, routes, middleware)

Current status: foundation layer is mostly ready (app bootstrapping, DB connection, schemas, utility classes), but request handling layer is not created yet (`controllers/`, `routes/`, `middleware/` are empty).

## 2) Tech Stack and Why

- Node.js + Express (`express`): API server
- MongoDB + Mongoose (`mongoose`): data modeling and persistence
- JWT (`jsonwebtoken`): stateless auth tokens
- Password hashing (`bcrypt`): secure password storage
- Cookies (`cookie-parser`): token transport/session style support
- CORS (`cors`): control cross-origin frontend access
- Env config (`dotenv`): secrets and config management
- Video listing helper (`mongoose-aggregate-paginate-v2`): pagination for aggregate pipelines

## 3) Current Folder Structure (Meaning)

### `src/index.js`
- Entry point.
- Loads env variables.
- Connects to MongoDB first, then starts Express server.
- Important behavior: server only starts after successful DB connection.

### `src/app.js`
- Express app configuration.
- Middlewares currently added:
	- CORS with credentials
	- JSON body parser (`16kb`)
	- URL-encoded parser (`16kb`)
	- static files from `public`
	- cookie parser

### `src/constants.js`
- Stores DB name constant (`backend_learning`).

### `src/db/db.js`
- Central MongoDB connection function (`connectDB`).
- Uses `MONGODB_URI + DB_NAME` pattern.
- Exits process on DB connection failure.

### `src/models/user.model.js`
- User schema and auth-related model methods.
- Includes password hashing pre-save hook.
- Includes token generation methods.

### `src/models/video.model.js`
- Video schema with owner relationship to User.
- Uses aggregate pagination plugin.

### `utils/ApiError.js`
- Standard error class for API responses.

### `utils/ApiResponse.js`
- Standard success response shape class.

### `utils/asyncHandler.js`
- Wrapper intended to catch async errors in controllers.

### Empty but important folders
- `src/controllers/`: business logic functions (register/login/upload/get videos)
- `src/routes/`: endpoint mapping (HTTP method + path to controller)
- `src/middleware/`: reusable checks (auth, validation, upload, error handler)

## 4) Data Models and Use Cases

## User Model (`User`)

Key fields:
- `username`: unique handle for profile URLs/search
- `email`: unique login identity
- `fullName`: display name
- `avatar`, `coverImage`: profile visuals
- `watchHistory`: array of `Video` references
- `password`: hashed password
- `refreshToken`: stored latest refresh token for rotation/invalidation

Main use cases:
- Register user
- Login user
- Verify password (`isPasswordCorrect`)
- Generate access token (`generateAccessToken`)
- Generate refresh token (`generateRefreshToken`)
- Maintain watch history
- Logout by clearing stored refresh token

## Video Model (`Video`)

Key fields:
- `videoFile`, `thumbnail`: cloud URLs
- `title`, `description`
- `duration`
- `views`
- `isPublished`
- `owner` (ref to `User`)

Main use cases:
- Upload/publish video metadata
- Fetch public videos
- Fetch user channel videos
- Increment view count on watch
- Toggle publish state
- Paginated listing/search with aggregate pipeline

## 5) Runtime and Config

Current `.env` keys:
- `PORT=8000`
- `MONGODB_URI=mongodb://localhost:27017/`
- `CORS_ORIGIN=*`
- `ACCESS_TOKEN_SECRET=...`
- `ACCESS_TOKEN_EXPIRY=1d`
- `REFRESH_TOKEN_SECRET=...`
- `REFRESH_TOKEN_EXPIRY=10d`

Use case of each:
- `PORT`: server listen port
- `MONGODB_URI`: Mongo base URI
- `CORS_ORIGIN`: allowed frontend origin
- access token secret/expiry: short-lived auth for API calls
- refresh token secret/expiry: longer-lived session renewal

## 6) Request Flow (Target Architecture)

Planned request path:
1. Route receives request.
2. Route calls controller.
3. Controller wrapped in `asyncHandler`.
4. Controller uses models/services.
5. Success returns `ApiResponse`.
6. Failures throw `ApiError`.
7. Central error middleware formats error JSON.

This pattern keeps all endpoints consistent and easier to debug.

## 7) What Is Complete vs Missing

Complete:
- app/server bootstrap
- DB connection utility
- user + video schemas
- base utility classes
- env-based token config

Missing:
- route definitions
- controller logic
- auth middleware (JWT verification)
- centralized error middleware
- validation layer
- file upload pipeline (Multer + Cloudinary or equivalent)
- test coverage

## 8) Important Code Notes (Current Bugs / Risks)

These are worth fixing before building many endpoints:

1. In `user.model.js`, password hashing hook does not `await bcrypt.hash(...)`.
2. In `user.model.js`, token payload uses `fullName: this.fullname` but schema field is `fullName`.
3. In `ApiError.js`, `this.messsage` has a typo (extra `s`).
4. `ApiResponse.js` defines class but does not export it.
5. `asyncHandler.js` currently returns nothing from wrapper (implementation bug), so it will not wrap controllers correctly.

## 9) Suggested API Modules To Build Next

## Auth module
- `POST /api/v1/users/register`
- `POST /api/v1/users/login`
- `POST /api/v1/users/refresh-token`
- `POST /api/v1/users/logout`

## User module
- `GET /api/v1/users/me`
- `PATCH /api/v1/users/me`
- `GET /api/v1/users/:username`
- `GET /api/v1/users/:id/history`

## Video module
- `POST /api/v1/videos`
- `GET /api/v1/videos`
- `GET /api/v1/videos/:id`
- `PATCH /api/v1/videos/:id`
- `DELETE /api/v1/videos/:id`

## 10) Practical Learning Checklist

1. Fix utility/model issues listed above.
2. Add global error middleware and `notFound` middleware.
3. Implement auth controller first (register/login/refresh/logout).
4. Implement JWT auth middleware.
5. Add protected user profile routes.
6. Add video CRUD + listing with pagination.
7. Add basic integration tests for auth + video list.

## 11) NPM Scripts

- `npm run dev`: run server with nodemon

---

This notes file should be updated as you add controllers, routes, and middleware so it stays the single source of truth for your backend structure.



- File upload is mainly handled by backend engineers.
- The upload approach depends on project size, processing needs, and file handling requirements.
- Multer is a commonly used middleware for handling multipart file uploads.
- Upload flow can include local temporary storage before moving files to Cloudinary.
- Cloudinary can be used to store files and serve them through hosted URLs.
- You can upload a local file, process it, and return a success response.
- Use `unlink` to remove temporary local files when upload fails.
- Multer supports both disk storage and memory storage.
- Use unique file naming to avoid collisions.
- Configure Multer carefully for storage, file limits, and accepted file types.