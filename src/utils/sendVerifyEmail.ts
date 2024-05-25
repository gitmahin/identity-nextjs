import { resend } from "@/lib/resend";
import { ApiResponse } from "@/response/apiResponse";
import verificationEmail from "../../emails/verifyEmailTemplate";

export async function sendVerificationEmail(username:string, email:string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verify your account | Identity.com',
            react: verificationEmail({username, email, verifyCode}),
          });
        return {message: "Email has been sent successfully", success: true}
    } catch (error) {
        return {error: "Error sending verification code", success: false}
    }
}