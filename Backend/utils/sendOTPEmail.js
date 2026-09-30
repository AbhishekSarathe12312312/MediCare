import { Resend } from "resend";
import dotenv from "dotenv";
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "MediCare <onboarding@resend.dev>",
      to: email,
      subject: "MediCare - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
          <h2 style="color: #06b6d4;">MediCare</h2>

          <p>Hello,</p>

          <p>
            Thank you for registering with MediCare.
            Please use the OTP below to verify your email address.
          </p>

          <div style="
            background: #f1f5f9;
            padding: 20px;
            text-align: center;
            margin: 20px 0;
            border-radius: 10px;
          ">
            <h1 style="letter-spacing: 8px; margin: 0;">
              ${otp}
            </h1>
          </div>

          <p>
            This OTP is valid for <strong>5 minutes</strong>.
          </p>

          <p>
            If you did not create a MediCare account, you can safely ignore
            this email.
          </p>

          <p>Regards,<br />MediCare Team</p>
        </div>
      `,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("SEND OTP EMAIL ERROR:", error.message);
    throw error;
  }
};
