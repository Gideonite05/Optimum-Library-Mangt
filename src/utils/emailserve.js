import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

class emailWorkies {
    constructor() {
       if (process.env.NODE_ENV === 'development' && process.env.EMAIL_SERVICE ==='mailtrap') {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: process.env.EMAIL_SECURE === 'true', // true for 312, false for other ports
            auth: {
                user: process.env.EMAIL_AUTH_USER,
                pass: process.env.EMAIL_AUTH_PASS,
            },
        });
        console.warn(' Nodemailer is configured for Mailtrap. Emails will not be sent to real inboxes.');
       } else if (process.env.EMAIL_SERVICE === 'gmail') {
        this.transporter = nodemailer.createTransport({
            sevice: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD, // Use an App Password
            },
        });
       } else {
        // Default to a general SMTP setup if not gmail
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.example.com', //****** */
            port: process.env.EMAIL_PORT || 800,
            secure: process.env.EMAIL_SECURE === 'true' || false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
       }
    }

    async sendEmail(to, subject, htmlContent) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent,
        };

        try {
            if (this.transporter) {
                await this.transporter.sendMail(mailOptions);
                console.log('--- OFFLINE EMAIL LOG ---');
                console.log('To:', to);
                console.log('Subject:', subject);
                console.log('Content:', htmlContent);
                console.log('---------------');
            }
        } catch (error) {
            console.error(`Failed to send email to ${to}:`, error);
            // Depending onthe strictness of "offline", storing failed attempts
            // or simply log them for manual reveiw is possible.
        }
    }

    async sendBookBorrowedEmail(userEmail, userName, bookTitle, dueDate) {
       const subject =  'Let Out Book Notification';
       const htmlContent =  `
       <p> Dear ${userName},</p>
       <p> You have successfully borrowed the book: <strong>${bookTitle}</strong>.</p>
       <p> Please return iut by: <strong>${dueDate.toDateString()}</strong>.</p>
       <p> Thank you!</p>
       `;
       await this.sendEmail(userEmail, subject, htmlContent);   
    }

    async sendBookReturnedEmail(userEmail, userName, bookTitle,returnDate) {
        const subject = 'Book Returned Notification';
        const htmlContent = `
        <p>Dear ${userName},</p>
        <p>You have successfully returned the book: <strong>${bookTitle}</strong> on
        ${returnDate.toDateString()}.</p>
        <p> Thank you for using our library services!</p>
        <p> Your Library Team </p>
        `;
        await this.sendEmail(userEmail, subject, htmlContent);
    }
}

const emailWorkies = new emailWorkies();
export default emailWorkies;