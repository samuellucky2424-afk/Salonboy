# Email Functionality Test Guide

## Your EmailJS Credentials Status
✅ **Service ID**: service_pg6ivpd
✅ **Template ID**: template_g7dzjmb  
✅ **Public Key**: _fiHckDZoakwgHe-e

All credentials are loaded from `.env` file and ready to use.

## Step-by-Step Testing Instructions

### 1. Access Admin Dashboard
- Navigate to: `http://localhost:5000/#/admin/login`
- **Username**: `luckymmc`
- **Password**: `081648Al@`
- Click **Sign In to Dashboard**

### 2. Go to Job Applications Tab
- Click on **Job Applications** in the sidebar
- You should see any existing job applications (if none exist, they'll appear when applicants submit)

### 3. Create a Test Application (If Needed)
If no applications exist:
- Go to the **Careers** page (`http://localhost:5000/#/careers`)
- Fill out the job application form with test data:
  - Full Name: `Test Applicant`
  - Email: `samuellucky2424@gmail.com`
  - Phone: `+1234567890`
  - Position: Select any role
  - Years of Experience: `5`
  - Upload any passport photo (required)
  - Upload any PDF for CV (required)
- Click **Submit Application**
- Return to Admin Dashboard → Job Applications

### 4. Approve the Application & Send Email
- Find the application card
- Click the **Approve** button
- A modal will open with approval details
- Fill in the approval form:
  - **Approved Position**: `Senior Developer`
  - **Salary / Fees**: `$80,000 / Year`
  - **Start Date**: Pick a future date (e.g., 2024-02-01)
  - **Department**: `Engineering`
  - **Additional Notes**: `Welcome to the team! Looking forward to your start date.`
- Click **Confirm Approval & Send Email**

### 5. Check Email Status
- You should see a **success message** in the modal showing:
  - ✅ `Approval email sent to samuellucky2424@gmail.com`
  - OR ⚠️ Details if there's an issue
- Check the inbox at `samuellucky2424@gmail.com` for the approval email

## Expected Email Content
The applicant will receive an email with:
- Approved Position
- Department
- Start Date
- Salary/Compensation
- Any additional notes you added

## Troubleshooting

### Email Not Sent?
1. **Check browser console** (F12):
   - Look for any error messages starting with "EmailJS Error"
2. **Verify credentials**:
   - All three values in `.env` file should be filled
3. **Check spam folder**:
   - Email might go to spam initially
4. **Service verification**:
   - Go to https://www.emailjs.com/
   - Log in and verify your email service is enabled
5. **Template check**:
   - Verify the template ID exists and has the correct variables

### Common Issues
- **"Email service not configured"**: One or more credentials are missing or empty
- **Template variables show as undefined**: Check template variable names match exactly
- **"Service not verified"**: Go to EmailJS dashboard and verify your email service

## Success Indicators
✅ Application status changes to "Approved"
✅ Success message appears in the modal
✅ Email arrives in the inbox within 1-2 minutes
✅ Email contains all approval details (position, date, salary, department)

## Contact Support
If emails still don't work after checking everything:
- EmailJS Support: https://www.emailjs.com/
- Check credentials are 100% correct (copy-paste from EmailJS dashboard)
- Verify email service is "Active" in EmailJS dashboard
