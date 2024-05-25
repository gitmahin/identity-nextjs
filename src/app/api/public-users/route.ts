import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";


export async function GET(request: Request) {
    await connDb()
    try {
        const publicUsers = await userModel.find().select("-password -isVerifiedForgotPassword -verifyCodeExpiry -verifyCode")
        return Response.json({message: "public users found", success: true, data: publicUsers}, {status: 200})
    } catch (error) {
        return Response.json({error: "Server is under maintenance", success: false}, {status: 500})
    }
    
}