# LuminaHealth Admin Login & Dashboard Guide

## ✅ Admin Credentials (as of Dec 31, 2025)

**Email**: `samuellucky242@hotmail.com`
**Password**: `081648Al@`

⚠️ **Important**: Enter these EXACTLY as shown - check for:
- No extra spaces before/after
- Correct capitalization (email is lowercase)
- Special character: `@` symbol is included in password
- Password is case-sensitive

---

## 🚀 Access Admin Dashboard

### Step 1: Go to Login Page
Navigate to: **`http://localhost:5000/#/admin/login`**

(Note: Use `/#/admin/login` - the hashtag is required for client-side routing)

### Step 2: Enter Credentials
- **Email field**: Enter `samuellucky242@hotmail.com`
- **Password field**: Enter `081648Al@`
- Click **Sign In to Dashboard**

### Step 3: You should see:
✅ Redirect to Admin Dashboard at `/#/admin`
✅ Sidebar with tabs: "Doctors", "Services", "Career Benefits", "Hero Section", "Job Applications"

---

## 📋 Admin Dashboard Features

### 1. **Doctors Tab**
- Add new doctors
- Edit existing doctors (name, specialty, bio, image)
- Delete doctors
- All changes save to browser's local storage

### 2. **Services Tab**
- Manage hospital services
- Add/Edit/Delete services
- Each service has: name, description, icon

### 3. **Career Benefits Tab**
- Manage job benefits displayed on Careers page
- Add: benefit title and description
- Edit and delete benefits

### 4. **Hero Section Tab**
- Customize homepage hero content
- Edit main heading, subheading, description
- Changes appear immediately on Home page

### 5. **Job Applications Tab**
- View all job applications from Careers page
- Status: "Pending" or "Approved"
- Click "Approve" to send approval email
- Fill approval details: position, salary, start date, department, notes

---

## 🧪 Test Email Functionality

### Prerequisites
- Job applicant submitted an application via Careers page
- Application shows in Job Applications tab with "Pending" status
- EmailJS credentials configured (.env file)

### Steps to Test
1. Go to **Job Applications** tab
2. Find the application you want to approve
3. Click **Approve** button
4. Fill in the approval form:
   - **Approved Position**: e.g., "Senior Developer"
   - **Salary/Fees**: e.g., "$80,000 / Year"
   - **Start Date**: Pick any future date
   - **Department**: e.g., "Engineering"
   - **Additional Notes**: Optional message to applicant
5. Click **Confirm Approval & Send Email**
6. You should see: ✅ "Approval email sent to [applicant email]"
7. Check applicant's email inbox for the approval message

---

## ⚠️ Troubleshooting

### Login Not Working?

**Error: "Invalid admin credentials"**
- ✅ Check credentials are EXACTLY: `samuellucky242@hotmail.com` / `081648Al@`
- ✅ Make sure there are no extra spaces
- ✅ Password is case-sensitive
- ✅ Try copying and pasting credentials to avoid typos

**URL issues:**
- ✅ Use `/#/admin/login` (with hashtag)
- ✅ NOT just `/admin/login`

**Page not loading:**
- ✅ Clear browser cache (Ctrl+Shift+Delete on Windows, Cmd+Shift+Delete on Mac)
- ✅ Try incognito/private window
- ✅ Check browser console (F12) for errors

### Email Not Sending?

Check the browser console (F12):
- Look for "EmailJS" related messages
- Check if credentials loaded from `.env` file
- Verify VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID are correct

---

## 🔐 Security Notes

- Admin credentials are stored in code (for development)
- In production, use proper Firebase authentication
- Clear browser cache if you suspect stale login state
- `isAdmin` flag stored in localStorage - only for current browser session

---

## 📞 Need Help?

If login still fails after checking credentials:
1. Open browser console (F12)
2. Check for error messages
3. Look for: "Login error:" in the console
4. Share any error messages for debugging

All CMS changes are saved to browser localStorage automatically - they persist when you logout and login again.
