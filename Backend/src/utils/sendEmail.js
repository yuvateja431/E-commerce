import nodemailer from "nodemailer";
export const sendEmail = async (options) => {
    const isDummySmtp = !process.env.SMTP_USER ||
        process.env.SMTP_USER.includes("your-email") ||
        !process.env.SMTP_PASS ||
        process.env.SMTP_PASS.includes("your-new-gmail");
    if (isDummySmtp) {
        console.log("⚠️ SMTP credentials not configured. Logging email content to console:");
        console.log("-----------------------------------------");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log("Message:");
        console.log(options.message);
        console.log("-----------------------------------------");
        return;
    }
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    const mailOptions = {
        from: `${process.env.FROM_NAME || "E-Commerce Store"} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email sent to ${options.email}`);
    }
    catch (error) {
        console.error("❌ Email sending failed. Outputting reset details to console:");
        console.log("-----------------------------------------");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log("Message:");
        console.log(options.message);
        console.log("-----------------------------------------");
        console.error("SMTP Error Details:", error?.message || error);
        return;
    }
};
