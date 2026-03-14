# SpotlightX

SpotlightX is a two-sided live talent marketplace built for hackathons and demo presentations.

It connects:
- `Artists` such as singers, stand-up comedians, dancers, live painters, magicians, and other performers
- `Organizers` such as bars, college fest teams, wedding venues, clubs, expos, and event hosts

The platform is designed to help both sides discover each other, verify authenticity, manage applications, and communicate through a shared booking workflow.

## Problem

Finding reliable live performers or trustworthy event opportunities is still messy and fragmented.

- Artists struggle to discover relevant gigs with clear budgets, verified organizers, and useful booking details.
- Organizers struggle to browse credible artists, compare profiles, and manage applications in one place.
- Sponsorship and authenticity checks usually happen outside the platform, which reduces trust.

## Solution

SpotlightX creates one marketplace for:

- role-based onboarding for `artist` and `organiser`
- event discovery and artist discovery
- manual verification flows for trust
- booking applications and application status updates
- inbox-style communication between both sides
- sponsorship opportunities and sponsor notifications

## Demo Features

### Artist side
- Register and log in as an artist
- Browse event listings with filters
- Open detailed event pages with images and event information
- Apply to events
- View application history
- Receive notifications and organizer messages in the inbox
- View current verification status

### Organizer side
- Register and log in as an organizer
- Browse artists with filters
- Open detailed artist profiles with portfolio-style information
- Create and manage event listings
- Review incoming applications
- Send sponsorship opportunities
- View inbox notifications and application chats
- View current verification status

## Built With

### Frontend
- React
- Vite
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express
- Firebase Admin SDK
- Firestore

## Project Structure

```text
/
├── src/                  # React frontend
├── public/               # Static assets
├── backend/              # Express + Firestore backend
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   └── server.js
├── tailwind.config.js
└── README.md
```

## Getting Started

### 1. Install dependencies

Frontend:

```powershell
cd c:\Users\shubh\OneDrive\Desktop\hackthom
npm install
```

Backend:

```powershell
cd c:\Users\shubh\OneDrive\Desktop\hackthom\backend
npm install
```

### 2. Configure Firebase

Create:

- `backend/.env`
- `backend/serviceAccountKey.json`

Use this env format:

```env
PORT=5000
JWT_SECRET=your-super-secret
FIREBASE_PROJECT_ID=your-firebase-project-id
FIRESTORE_EMULATOR_HOST=
FIREBASE_SERVICE_ACCOUNT_PATH=serviceAccountKey.json
```

### 3. Seed demo data

```powershell
cd c:\Users\shubh\OneDrive\Desktop\hackthom\backend
npm run seed
```

### 4. Run backend

```powershell
cd c:\Users\shubh\OneDrive\Desktop\hackthom\backend
npm run dev
```

### 5. Run frontend

```powershell
cd c:\Users\shubh\OneDrive\Desktop\hackthom
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

## Demo Accounts

### Main artist demo
- `mira@spotlightx.demo`
- `password123`

### Main organizer demo
- `organiser@spotlightx.demo`
- `password123`

### Extra artist demo
- `laughledger.mumbai@spotlightx.demo`
- `password123`

## Suggested Demo Flow

1. Open the auth page
2. Log in as an `Artist`
3. Show filtered event browsing and event detail pages
4. Show applications and inbox notifications
5. Log in as an `Organizer`
6. Show filtered artist browsing and artist detail pages
7. Show event management and application chat
8. Show sponsorship notification flow
9. Open verification page to show role-based verification details

## Hackathon Highlights

- Two-role marketplace with separate portals
- Firestore-backed demo data
- Verification-first marketplace concept
- Clickable detail pages for artists and events
- Inbox and notification system
- Sponsor opportunity notifications
- Light, demo-friendly UI

## Team

Fill this in before submission:

- `Team Name:` __________________
- `Members:` __________________
- `Hackathon:` __________________
- `Track / Theme:` __________________

## Future Improvements

- Real-time chat using Firestore listeners or sockets
- Document uploads for verification proofs
- Advanced search and recommendation matching
- Organizer invitation flow for artists
- Payment and contract workflow
- Admin review dashboard

## License

Hackathon prototype for team/demo use.
