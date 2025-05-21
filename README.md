## MediBuddy: Patient Registry System (React + PGlite)

**MediBuddy** is a modern, browser-based patient management system built with React and PGlite. It runs entirely in the browser using PGlite compiled to WebAssembly, offering offline access, persistent storage via IndexedDB, and cross-tab synchronization — all without relying on a backend server.

## Key Capabilities

- Fully Local PostgreSQL — Leverages PGlite to run a real PostgreSQL database inside the browser.
- Offline-First Design — Data is saved to IndexedDB, so the app works even when you're offline.
- Multi-Tab Sync — Seamless database state sharing across open browser tabs. 
- Complete Patient Records — Capture patient demographics, contact info, insurance, and medical notes.
- Smart Search — Easily search, and explore patient data.
- Responsive Interface — Clean, professional UI with a layout optimized for usability.

## Demo
https://patient-registry-portal.vercel.app

## Installation

### Requirements

- Node.js (v16 or higher)
- npm (v7 or higher)

### Setup Steps

1. Clone the repository:

```bash
git clone https://github.com/Nishu205/Patient-Registry.git
cd Patient-Registry
```

2. Install  project dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
patient-registry/
├── public/
│   └── pglite-worker.js     # PGlite worker for multi-tab support
├── src/
│   ├── components/          # Reusable UI components           
│   │   
│   ├── pages/               # Application pages
│   │   ├── Dashboard.tsx
│   │   ├── PatientQuery.tsx 
│   │   ├── PatientRecord.tsx 
│   │   └── PatientRegistration.tsx
│   ├── services/            # Core Services
│   │   └── DatabaseService.tsx  
│   ├── state/               # React Context Providers 
│   │   └── DatabaseState.ts 
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Implementation Details

### PGlite Integration

This app uses PGlite to run a PostgreSQL-compatible database inside the browser using WebAssembly. It’s launched in a Web Worker to support persistence across browser tabs using IndexedDB.

```typescript
// public/pglite-worker.js
import { PGlite } from '@electric-sql/pglite';
import { worker } from '@electric-sql/pglite/worker';

worker({
  async init() {
    return new PGlite('idb://my-pgdata');
  },
});
```

### Database Schema

```sql
CREATE TABLE IF NOT EXISTS patients (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  gender TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at DATE DEFAULT CURRENT_DATE
);
```

## Available Scripts

In the project directory, you can run:

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm run preview` - Previews the production build locally

## Application Guide

### Adding a New Patient

1. Navigate to "Register Patient" via the sidebar or the shortcut on the dashboard screen
2. Fill out patient details
3. Submit the form to add them to the database

### Search Patient Records

1. Navigate to "Patient Records" from the sidebar 
2. Use search box to locate entries

### Run SQL Queries

1. Navigate to "Query Records" via the sidebar or the shortcut on the dashboard screen
2. Enter your SQL query in the editor
3. Click Execute to view results

##  Tech Stack

- React + TypeScript – Component-driven frontend
- PGlite – PostgreSQL in WebAssembly
- Vite – Lightning-fast development server
- React Router – Declarative routing
- Lucide – Icon set for a clean interface
- Tailwind CSS – Utility-first styling framework

## Challenges Faced

- Managing Local Storage and Data Integrity: Building a fully client-side database solution with pglite presented significant challenges. Properly setting up and initializing the database, managing data serialization, and guaranteeing persistence across reloads demanded careful design and thorough testing to avoid data loss or corruption.
- Tailwind responsiveness: Achieving consistent styling across screen sizes involved fine-tuning Tailwind’s responsive utility classes, especially when working with dynamic components like forms and modals.

## Acknowledgements

- [PGlite Docs](https://pglite.dev/docs) for providing in-browser PostgreSQL functionality

---

