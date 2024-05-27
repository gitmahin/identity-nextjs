import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";
import ratelimit from "@/utils/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    try {                                               
        const ip = request.ip ?? "127.0.0.1" // `??` (Nullish Coalescing Operator): This operator returns the right-hand side operand when the left-hand side operand is `null` or `undefined`. It is similar to the logical OR operator (`||`)
        const result = await ratelimit.limit(ip)
        if (!result.success) {
          return NextResponse.json({error:"Too many requests"}, {status: 429})
        }else{
            await connDb()
            try {
                const {username, code} = await request.json()
                const user = await userModel.findOne({username})
                if(!user){
                    return NextResponse.json({error:"User is not registered", success: false}, {status: 401})
                }else{
                    const isValidCode = user.verifyCode === code
                    const verifyDateNotExpired = new Date(user.verifyCodeExpiry) > new Date()
    
                    if(!verifyDateNotExpired){
                        return NextResponse.json({error: "Verification code expired"}, {status: 410})
                    }  
                    else{
                        if(!isValidCode){
                            return NextResponse.json({error: "Invalid code"}, {status: 400})
                        }else{
                            user.isVerified = true
                            user.verifyCode = "blank"
                            await user.save()
                            return NextResponse.json({message:"User verified successfully"}, {status: 200})
    
                        }
                    }
                }
    
            } catch (error) {
                return NextResponse.json({error: "Server is under maintenance"}, {status: 500})
            }
        }
    } catch (error) {
        return NextResponse.json({error: "Something went wrong"})
    }
}