import transporter from "../../config/nodeMailer.config.js";

const sendVerifyEmailOtpAccount = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Account Verification OTP",
            html: `
                <h2>Email Verification</h2>
                <p>Your OTP for account verification is:</p>
                <h3>${otp}</h3>
                <p>This OTP will expire in 10 minutes.</p>
                <p>If you did not request this, please ignore this email.</p>
            `,
        });
    } catch (error) {
        console.error("Verification OTP email failed", error.message);
    }
};

export default sendVerifyEmailOtpAccount;
