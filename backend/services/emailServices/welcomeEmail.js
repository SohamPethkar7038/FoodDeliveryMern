import transporter from "../../config/nodeMailer.config.js";

const sendWelcomeEmail = async (email,name) => {
    try {
        await transporter.sendMail({
           from: process.env.EMAIL_USER,
           to: email,
           subject: "Welcome to FoodDelivery", 
           html: 
            `
                <h2>Welcome to FoodDelivery</h2>
                <p>Your account has been successfully created.</p>
                <p>Email: <strong>${email}</strong></p>
            `,
        });
    } catch (error) {
        console.error("Welcome email failed",error.message);
    }
};

export default sendWelcomeEmail;