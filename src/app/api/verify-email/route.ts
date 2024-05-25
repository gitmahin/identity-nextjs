import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";

export async function POST(request: Request){
    await connDb()
    try {
        const {username, code} = await request.json()
        const user = await userModel.findOne({username})
        if(!user){
            return Response.json({error:"User is not registered", success: false}, {status: 401})
        }else{

            const isValidCode = user.verifyCode === code
            const verifyDateNotExpired = new Date(user.verifyCodeExpiry) > new Date()

            if(!verifyDateNotExpired){
                return Response.json({error: "Verification code expired"}, {status: 410})
            }  
            else{
                if(!isValidCode){
                    return Response.json({error: "Invalid code"}, {status: 400})
                }else{
                    user.isVerified = true
                    user.verifyCode = "blank"
                    await user.save()
                    return Response.json({message:"User verified successfully"}, {status: 200})

                }
            }
        }

    } catch (error) {
        return Response.json({error: "Server is under maintenance"}, {status: 500})
    }
}