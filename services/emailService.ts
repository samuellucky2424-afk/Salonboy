import emailjs from '@emailjs/browser';

/**
 * EmailJS service for sending automated notifications.
 * Configure EmailJS: https://www.emailjs.com/
 */

const env = typeof process !== 'undefined' ? process.env : (import.meta as any).env;

const SERVICE_ID = env.VITE_EMAILJS_SERVICE_ID || '';
const TEMPLATE_ID = env.VITE_EMAILJS_TEMPLATE_ID || '';
const PUBLIC_KEY = env.VITE_EMAILJS_PUBLIC_KEY || '';

// Initialize EmailJS if credentials are available
if (PUBLIC_KEY) {
  emailjs.init(PUBLIC_KEY);
}

export const isEmailConfigured = (): boolean => {
  return !!(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);
};

export const getEmailConfigStatus = (): { configured: boolean; message: string } => {
  if (!SERVICE_ID) {
    return { configured: false, message: 'VITE_EMAILJS_SERVICE_ID is not configured' };
  }
  if (!TEMPLATE_ID) {
    return { configured: false, message: 'VITE_EMAILJS_TEMPLATE_ID is not configured' };
  }
  if (!PUBLIC_KEY) {
    return { configured: false, message: 'VITE_EMAILJS_PUBLIC_KEY is not configured' };
  }
  return { configured: true, message: 'Email service is ready' };
};

export const sendApprovalEmail = async (applicantData: any, approvalData: any): Promise<{ success: boolean; message: string }> => {
  const configStatus = getEmailConfigStatus();
  
  if (!configStatus.configured) {
    const message = `Email service not configured: ${configStatus.message}. Email will not be sent. Please set up EmailJS credentials in environment variables.`;
    console.warn(message);
    return { 
      success: false, 
      message 
    };
  }

  try {
    const toEmail = applicantData.email || applicantData.to_email;
    if (!toEmail) {
      console.error('Recipient email is missing in applicantData:', applicantData);
      return { success: false, message: 'Recipient email address is missing' };
    }

    const templateParams = {
      to_name: applicantData.fullName,
      to_email: toEmail,
      approved_position: approvalData.approvedPosition,
      amount: approvalData.amount,
      application_fee: approvalData.applicationFee,
      start_date: approvalData.startDate,
      department: approvalData.department,
      notes: approvalData.notes || 'No additional notes provided',
      applicant_photo: typeof applicantData.passportPhoto === 'string' ? applicantData.passportPhoto : ''
    };

    const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams);
    
    console.log('Email sent successfully:', response.status);
    return { 
      success: true, 
      message: `Approval email sent to ${applicantData.email}` 
    };
  } catch (error: any) {
    const errorMessage = error?.text || error?.message || 'Unknown error occurred';
    console.error('EmailJS Error:', error);
    return { 
      success: false, 
      message: `Failed to send email: ${errorMessage}` 
    };
  }
};