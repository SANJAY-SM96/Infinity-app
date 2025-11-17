const nodemailer = require('nodemailer');

// Track if we've already warned about SMTP configuration
let smtpWarningShown = false;

const sendEmail = async (options) => {
  // Check if SMTP configuration is available
  if (!process.env.SMTP_HOST || !process.env.SMTP_PORT || !process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    // Only show warning once per server restart
    if (!smtpWarningShown) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  SMTP configuration missing. Email functionality disabled.');
        console.warn('   Set SMTP_HOST, SMTP_PORT, SMTP_EMAIL, and SMTP_PASSWORD to enable email.');
      }
      smtpWarningShown = true;
    }
    throw new Error('Email service is not configured. Please contact the administrator.');
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const fromName = process.env.FROM_NAME || 'Infinity App';
    const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_EMAIL;

    const message = {
      from: `${fromName} <${fromEmail}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    await transporter.sendMail(message);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error sending email:', error.message);
    }
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

module.exports = sendEmail;
