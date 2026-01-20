# CafeQuest

Your personal coffee shop companion - A full-stack mobile application for tracking cafe visits and discovering new coffee spots.

## Problem Statement

Coffee lovers visit many cafes but often struggle to:
- Remember which cafes they've visited and what they liked
- Keep track of cafes they want to visit
- Find recommendations from others

CafeQuest solves these problems by providing a personal cafe journal and discovery platform.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React Native + Expo |
| Navigation | React Navigation |
| State Management | Context API |
| Image Upload | Cloudinary |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Authentication | JWT + bcrypt |
| Hosting | Render + MongoDB Atlas |

## Features Implemented

### Core Features
- **User Authentication**: Email/password signup and login with JWT-based authentication
- **Add Cafe Entry**: Cafe name, location, photo upload, rating (1-5 scale), tags, notes, and status
- **Cafe Collection**: Grid view with photos, filter by visited/wishlist, filter by tags, search by name
- **Cafe Details**: Full photo view with edit and delete functionality
- **Discover Feed**: Browse public cafe entries from other users and save to wishlist
- **Profile**: View total cafes visited, most used tags, account settings, and logout

### Tags Available
- WiFi
- Quiet
- Aesthetic
- Good Coffee
- Pet Friendly

## Project Structure

```
CafeQuest/
├── mobile-app/                 # React Native Expo app
│   ├── App.js                  # App entry point
│   ├── app.json                # Expo configuration
│   ├── package.json            # Dependencies
│   └── src/
│       ├── api/                # API service layer
│       │   └── index.js        # Axios configuration and API calls
│       ├── components/         # Reusable UI components
│       │   ├── CafeCard.js     # Cafe card component
│       │   ├── FilterBar.js    # Filter bar component
│       │   ├── RatingInput.js  # Star rating input
│       │   └── TagSelector.js  # Tag selection component
│       ├── constants/          # App constants
│       │   ├── tags.js         # Cafe tags definition
│       │   └── theme.js        # Color theme and sizes
│       ├── context/            # React Context
│       │   └── AuthContext.js  # Authentication state management
│       ├── navigation/         # Navigation configuration
│       │   └── index.js        # Stack and Tab navigators
│       └── screens/            # App screens
│           ├── AddCafeScreen.js
│           ├── CafeDetailScreen.js
│           ├── DiscoverScreen.js
│           ├── HomeScreen.js
│           ├── LoginScreen.js
│           ├── ProfileScreen.js
│           ├── SignupScreen.js
│           └── SplashScreen.js
│
├── backend/                    # Express.js API server
│   ├── server.js               # Server entry point
│   ├── package.json            # Dependencies
│   ├── .env.example            # Environment variables template
│   └── src/
│       ├── config/             # Configuration files
│       │   ├── cloudinary.js   # Cloudinary setup
│       │   └── db.js           # MongoDB connection
│       ├── middleware/         # Express middleware
│       │   └── auth.js         # JWT authentication middleware
│       ├── models/             # Mongoose models
│       │   ├── Cafe.js         # Cafe schema
│       │   └── User.js         # User schema with password hashing
│       └── routes/             # API routes
│           ├── auth.js         # Authentication routes
│           ├── cafes.js        # Cafe CRUD routes
│           ├── discover.js     # Public discovery routes
│           └── upload.js       # Image upload routes
│
└── README.md                   # This file
```

## How to Run the Project Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (free tier)
- Cloudinary account (free tier)
- Expo Go app on your phone (for testing)

### Step 1: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free account and cluster
3. Create a database user with password
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/cafequest`)
5. Whitelist your IP address (or use 0.0.0.0/0 for development)

### Step 2: Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com)
2. Create a free account
3. From the dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret

### Step 3: Configure Backend

```bash
# Navigate to backend folder
cd CafeQuest/backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your credentials
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_random_secret_key
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
# PORT=5000

# Start the server
npm run dev
```

### Step 4: Configure Mobile App

```bash
# Navigate to mobile app folder
cd CafeQuest/mobile-app

# Install dependencies
npm install

# Update API URL in src/api/index.js
# Change 'http://localhost:5000/api' to your backend URL
# For local development on iOS simulator: 'http://localhost:5000/api'
# For local development on Android emulator: 'http://10.0.2.2:5000/api'
# For Expo Go on physical device: 'http://YOUR_COMPUTER_IP:5000/api'

# Start Expo
npx expo start
```

### Step 5: Run the App

1. With Expo running, scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app
2. The app will bundle and load on your device

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | `{ email, password, username }` |
| POST | `/api/auth/login` | Login user | `{ email, password }` |
| GET | `/api/auth/me` | Get current user | - |
| PUT | `/api/auth/profile` | Update profile | `{ username, avatar }` |

### Cafe Endpoints (Requires Auth)

| Method | Endpoint | Description | Body/Params |
|--------|----------|-------------|-------------|
| GET | `/api/cafes` | Get user's cafes | Query: `?status=visited&tags=wifi,quiet&search=name` |
| GET | `/api/cafes/:id` | Get single cafe | - |
| POST | `/api/cafes` | Create new cafe | `{ name, location, photo, rating, tags, notes, status, isPublic }` |
| PUT | `/api/cafes/:id` | Update cafe | Same as POST |
| DELETE | `/api/cafes/:id` | Delete cafe | - |

### Discover Endpoints (Requires Auth)

| Method | Endpoint | Description | Body/Params |
|--------|----------|-------------|-------------|
| GET | `/api/discover` | Get public cafes | Query: `?tags=wifi&search=name&page=1&limit=20` |
| POST | `/api/discover/:id/save` | Save cafe to wishlist | - |

### Upload Endpoints (Requires Auth)

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/upload` | Upload image (multipart) | `image: File` |
| POST | `/api/upload/base64` | Upload base64 image | `{ image: base64String }` |

### Response Format

Success:
```json
{
  "_id": "...",
  "name": "Cafe Name",
  "location": "Address",
  "photo": "cloudinary_url",
  "rating": 4,
  "tags": ["wifi", "quiet"],
  "notes": "Great coffee!",
  "status": "visited",
  "isPublic": true,
  "createdAt": "2024-01-21T..."
}
```

Error:
```json
{
  "message": "Error description"
}
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  username: String (required),
  avatar: String,
  createdAt: Date
}
```

### Cafes Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  name: String (required),
  location: String (required),
  photo: String,
  rating: Number (1-5),
  tags: [String], // wifi, quiet, aesthetic, good-coffee, pet-friendly
  notes: String,
  status: String (visited | wishlist),
  isPublic: Boolean,
  visitedAt: Date,
  createdAt: Date
}
```

## App Screens

1. **Splash Screen**: App logo with loading indicator
2. **Login Screen**: Email/password form with navigation to signup
3. **Signup Screen**: Registration form with email, password, username
4. **Home Screen**: Grid view of user's cafes with search and filters
5. **Add Cafe Screen**: Form with image picker, rating stars, tag selection
6. **Cafe Details Screen**: Full cafe view with edit/delete options
7. **Discover Screen**: Public feed with save-to-wishlist functionality
8. **Profile Screen**: User stats, top tags, and logout option

## Deployment

### Backend (Render)

1. Push your code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect to your GitHub repo
5. Set build command: `npm install`
6. Set start command: `npm start`
7. Add environment variables from `.env`

### Mobile App

For development, use Expo Go. For production:
```bash
# Build for iOS
npx expo build:ios

# Build for Android
npx expo build:android
```

## Future Features (Optional)

- Map view with cafe locations
- Social features (follow users, comments)
- Cafe recommendations based on preferences
- Offline mode with data sync
- Push notifications for new discoveries

## License

MIT License - Feel free to use this project for educational purposes.

---

Built with React Native & Node.js for Mobile Application Development Final Project.
