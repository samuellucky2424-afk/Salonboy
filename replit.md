# LuminaHealth Hospital Website

## Overview
A complete healthcare hospital website with a full Admin Content Management System. Built with React, TypeScript, and Vite, featuring dynamic content management, appointment booking, job applications, and a standalone admin dashboard.

## Project Structure
- `/components` - Reusable React components (Navbar, Footer, AI Health Assistant, Doctor Card)
- `/pages` - Page components:
  - Public: Home, About, Doctors, Doctor Profiles, Appointments, Careers, Contact
  - Admin: AdminLogin, AdminDashboard, AdminCMS
- `/services` - Service integrations (Firebase, EmailJS, Gemini AI)
- `App.tsx` - Main application with routing
- `index.tsx` - Application entry point
- `vite.config.ts` - Vite configuration (port 5000, allows all hosts)
- `constants.tsx` - Default data for doctors, services, job roles
- `types.ts` - TypeScript type definitions

## Key Features

### Public Features
- **Homepage**: Dynamic hero section, featured doctors, services, statistics
- **Doctors Listing**: Browse all doctors with specialty information
- **Doctor Profiles**: Detailed information about each doctor
- **Appointment Booking**: Schedule appointments with doctors
- **Careers Page**: Job application form with file uploads
- **Contact Page**: Send messages to the hospital
- **AI Health Assistant**: Chatbot for health information (if API configured)

### Admin Dashboard (Standalone)
**Access**: Navigate to `/#/admin/login`

**Credentials**:
- Username: `luckymmc`
- Password: `081648Al@`

**Admin Features**:

1. **Appointments Management Tab**
   - View all patient appointments
   - Manage appointment data

2. **Job Applications Tab**
   - Review career applications
   - Approve applications with job details (position, salary, start date, department)
   - Reject applications
   - Send approval emails to applicants
   - View application status

3. **Content Manager Tab (CMS)**
   - **Hero Section**: Edit homepage main heading and description
   - **Doctors Management**: 
     - Add new doctors (name, specialty, image URL)
     - Edit existing doctors
     - Delete doctors
     - Display immediately on homepage
   - **Services Management**:
     - Add new services (title, description)
     - Edit existing services
     - Delete services
     - Display immediately on homepage
   - **Career Benefits (Why Join Us)**:
     - Add new benefits (title, description)
     - Edit existing benefits
     - Delete benefits
     - Display on careers page

All CMS changes are saved automatically and displayed on the public pages in real-time.

## Technologies
- React 19 with TypeScript 5.8
- Vite 6.4 for bundling and dev server
- Tailwind CSS (via CDN) for styling
- React Router 7 for navigation
- Firebase (Firestore, Storage, Auth stub) for data persistence
- EmailJS for sending approval emails
- Google Gemini AI for health assistant (optional)
- Lucide React for icons

## Environment Variables (Optional)
- `GEMINI_API_KEY` or `API_KEY` - Google Gemini API key for AI Health Assistant
- `VITE_FIREBASE_*` - Firebase configuration (app has graceful fallbacks)

## Running the Application
```bash
npm install      # Install dependencies
npm run dev      # Start on http://localhost:5000
npm run build    # Build for production
npm run preview  # Preview production build
```

## Fixed Issues
1. ✓ Firebase authentication error - Replaced with hardcoded admin credentials
2. ✓ Career form submission hanging - Added graceful file upload fallback
3. ✓ Admin portal removed from homepage navigation
4. ✓ Admin dashboard is completely standalone and isolated
5. ✓ Full CMS implemented for managing all homepage content

## Admin CMS Capabilities
The admin can now manage:
- **Homepage Hero Section**: Main title and description
- **Featured Doctors**: Add, edit, or delete doctors displayed on homepage
- **Medical Services**: Add, edit, or delete services shown on homepage
- **Career Benefits**: Add, edit, or delete "Why Join Us" benefits on careers page

All changes are instantly saved to localStorage and displayed on the public pages without page refresh.

## Notes
- Admin dashboard uses localStorage for CMS data as a fallback solution
- File uploads (passport photos, CVs) have graceful fallback handling
- Gemini API is optional - app shows message if not configured
- Homepage dynamically loads admin-managed content if available, otherwise uses defaults
- Email notifications are sent when admin approves job applications
