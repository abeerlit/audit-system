import nodemailer from 'nodemailer';

export async function sendEmail(email, html) {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Port for secure SMTP
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Set up the email options
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `New message from AUDIT SYSTEM`,
        html: html,
    };

    try {
        await transporter.sendMail(mailOptions);
        return { error: false, message: 'Email sent successfully' };
    } catch (error) {
        console.log(error, "error");
        return { error: true, message: 'Error sending email' };
    }

}
