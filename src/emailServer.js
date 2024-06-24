// emailServer.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text }) => {
    try {
        // Configure your SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // e.g., 'Gmail'
            auth: {
                user: 'gearwise24@gmail.com',
                pass: ' lgvy xbef mafn nbwv' // Use the app password you generated
            }
        });

        // Set email options
        const mailOptions = {
            from: 'gearwise24@gmail.com',
            to,
            subject,
            text
        };

        // Send email
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = sendEmail;
