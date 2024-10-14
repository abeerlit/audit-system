import nodemailer from 'nodemailer';

export async function sendEmail(name, email, otpCode) {
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
        // text: `You have received a new message from ${name} (${email}):\n\n${otpCode}`,
        html: `  <div class="container">
        <h1>Verify Your Email</h1>
        <p>Hello, ${name}</p>
        <p>Thank you for signing up for <strong>Audit System</strong>. To complete your registration, please enter the OTP below in the app to verify your email address:</p>

        <div class="otp-box">
            ${otpCode}
        </div>

        <p>If you didn’t sign up for an account, you can safely ignore this email.</p>

        <p>Thank you,<br>The Audit System Team</p>

        <div class="footer">
            <p>This is an automated message, please do not reply.</p>
            <p>&copy; 2024 Audit System. All rights reserved.</p>
        </div>
    </div>`
    };

    try {
        let result = await transporter.sendMail(mailOptions);
        console.log(result, "result");
        return { error: false, message: 'Email sent successfully' };
    } catch (error) {
        console.log(error, "error");
        return { error: true, message: 'Error sending email' };
    }

}
