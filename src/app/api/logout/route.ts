import connDb from "@/lib/connDb";
import { NextRequest, NextResponse } from "next/server";
import userModel from "@/models/userModel";

export async function POST(request:NextRequest) {
    await connDb()
    try {
        const {useremail} = await request.json() 
        const response = NextResponse.json({
            message: "Log out successfully",
            success: true
        })

        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        })

        const user = await userModel.findOne({email: useremail})
        user!.isLogedIn = false
        await user!.save()

        return response

    } catch (error) {
        return NextResponse.json({error: "Error logging out"}, {status: 500})
    }
}