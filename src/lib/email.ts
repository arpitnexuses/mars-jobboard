import nodemailer from 'nodemailer';

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports like 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface JobApplicationEmailData {
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  experience: string;
  education: string;
  coverLetter: string;
  resumeUrl: string;
}

export async function sendJobApplicationEmail(data: JobApplicationEmailData) {
  const { jobTitle, firstName, lastName, email, phone, experience, education, coverLetter, resumeUrl } = data;

  const mailOptions = {
    from: `"Mars Job Board" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Job Application for ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Job Application</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f9fafb;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: #000000;
              padding: 30px 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .logo {
              width: 120px;
              height: 120px;
              margin: 0 auto 20px;
              display: block;
            }
            .content {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 0 0 8px 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .section {
              background-color: #f8f9fa;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 20px;
              border: 1px solid #e9ecef;
            }
            .section-title {
              color: #A9282B;
              font-size: 18px;
              font-weight: 600;
              margin-top: 0;
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 2px solid #A9282B;
            }
            .info-item {
              margin: 8px 0;
              display: flex;
              align-items: center;
            }
            .info-label {
              font-weight: 600;
              color: #4a5568;
              min-width: 120px;
            }
            .info-value {
              color: #2d3748;
            }
            .cover-letter {
              white-space: pre-wrap;
              background-color: #ffffff;
              padding: 15px;
              border-radius: 6px;
              border: 1px solid #e2e8f0;
            }
            .resume-link {
              display: inline-block;
              background-color: #A9282B;
              color: #ffffff;
              padding: 10px 20px;
              border-radius: 6px;
              text-decoration: none;
              font-weight: 500;
              margin-top: 10px;
            }
            .resume-link:hover {
              background-color: #8a1f22;
              color: #ffffff;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #e9ecef;
              color: #6c757d;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="https://22527425.fs1.hubspotusercontent-na1.net/hubfs/22527425/MARS-white-1.webp" alt="Mars Logo" class="logo">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">New Job Application Received</h1>
            </div>

            <div class="content">
              <div class="section">
                <h2 class="section-title">Job Details</h2>
                <div class="info-item">
                  <span class="info-label">Position:</span>
                  <span class="info-value">${jobTitle}</span>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">Applicant Information</h2>
                <div class="info-item">
                  <span class="info-label">Name:</span>
                  <span class="info-value">${firstName} ${lastName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${email}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${phone}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Experience:</span>
                  <span class="info-value">${experience}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Education:</span>
                  <span class="info-value">${education}</span>
                </div>
              </div>

              <div class="section">
                <h2 class="section-title">Cover Letter</h2>
                <div class="cover-letter">${coverLetter}</div>
              </div>

              <div class="section">
                <h2 class="section-title">Resume</h2>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}${resumeUrl}" class="resume-link">
                  View Resume
                </a>
              </div>
            </div>

            <div class="footer">
              <p>This is an automated message from Mars Job Board. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
} 