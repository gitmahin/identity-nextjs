import userModel from "@/models/userModel";
import connDb from "@/lib/connDb";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await connDb()
    try {
        const {email, password} = await request.json()
        const user = await userModel.findOne({email})
        const verifiedUser = await userModel.findOne({email, isVerified: true})
        if(!user){
            return NextResponse.json({error: "Invalid credentials", success: false}, {status: 400})
        }else{
            if(!verifiedUser){
                return NextResponse.json({error: "User is not verified", success: false}, {status: 401})
            }else{
                const passwordMatched = await bcrypt.compare(password, verifiedUser.password)
                if(!passwordMatched){
                    return NextResponse.json({error: "Invalid credentials", success: false}, {status: 400})
                }else{
                    verifiedUser.isLogedIn = true
                    await verifiedUser.save()
                    
                    const tokenData = {
                        id: verifiedUser._id,
                    }

                    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1h"})

                    const res = NextResponse.json({message: "Loged in successfully", success: true}, {status: 200})
                    
                    res.cookies.set("token", token, {
                        httpOnly: true
                    })

                    return res
                }
            }

        }
    } catch (error) {
        return NextResponse.json({error: "Server is under maintenance", success: false}, {status: 500})
    }
}