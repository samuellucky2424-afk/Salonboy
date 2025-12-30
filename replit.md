# LuminaHealth Hospital Website

## Overview
A modern healthcare hospital website built with React, TypeScript, and Vite. The website features a clean design with Tailwind CSS and includes pages for services, doctors, appointments, careers, and an admin dashboard for managing applications and content.

## Project Structure
- `/components` - Reusable React components (Navbar, Footer, AI Health Assistant, Doctor Card)
- `/pages` - Page components (Home, About, Doctors, Appointments, Careers, Contact, Admin Login, Admin Dashboard, Admin CMS)
- `/services` - External service integrations (Firebase Firestore, Storage, Auth stub; EmailJS for email notifications; Gemini AI)
- `App.tsx` - Main application with routing
- `index.tsx` - Application entry point
- `vite.config.ts` - Vite configuration (port 5000, allows all hosts)
- `constants.tsx` - Constant data for doctors, services, and job roles
- `types.ts` - TypeScript type definitions

## Key Features
- **Public Pages**: Home, About, Doctors Listing, Doctor Profiles, Appointment Booking, Careers, Contact
- **Admin Dashboard**: 
  - Accessible at `/#/admin/login` (not linked from homepage)
  - Credentials: Username: `luckymmc` | Password: `081648Al@`
  - Tabs: Appointments Management, Job Applications Review, Content Manager
  - Job Application Approval System with email notifications
- **Content Management**: Admin can edit hero section heading and description
- **Job Application Submission**: Career form with file uploads (passport photo, CV)
- **AI Health Assistant**: Chatbot component (requires GEMINI_API_KEY environment variable)

## Technologies
- React 19 with TypeScript 5.8
- Vite 6.4 for bundling and dev server
- Tailwind CSS (via CDN) for styling
- React Router 7 for navigation and routing
- Firebase (Firestore, Storage) for data persistence and file uploads
- EmailJS for sending approval notifications
- Google Gemini AI for health assistant chatbot (optional)
- Lucide React for icons

## Environment Variables
Optional:
- `GEMINI_API_KEY` or `API_KEY` - Google Gemini API key for AI Health Assistant feature (app works without it)
- `VITE_FIREBASE_*` - Firebase configuration variables (optional, app has graceful fallbacks)

## Admin Features
1. **Appointments Management**: View and manage patient appointments
2. **Job Applications**: Review, approve, or reject career applications with email notifications
3. **Content Manager**: Edit homepage hero section text (hero title and description)

## Running the Application
```bash
npm install  # Install dependencies
npm run dev  # Start development server on http://localhost:5000
npm run build  # Build for production
```

## Fixed Issues
1. ✓ Firebase auth component error - replaced with simple hardcoded credentials
2. ✓ Career form submission hanging - added graceful fallback for file uploads
3. ✓ Admin login portal removed from homepage navigation (accessible via /#/admin/login)
4. ✓ Admin dashboard is now standalone with its own login and complete isolation from homepage
5. ✓ Added Content Manager feature for admins to customize homepage hero section

## Notes
- The admin dashboard uses localStorage for CMS content storage as a fallback
- File uploads (passport photos, CVs) gracefully handle Firebase configuration errors
- Gemini API is optional - app shows a message if API key is not configured
