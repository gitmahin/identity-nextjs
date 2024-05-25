import connDb from "@/lib/connDb";
import { getDataFromToken } from "@/utils/getDataFromToken";
import userModel from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    await connDb()
    try {
        const userId = await getDataFromToken(request)
        const user = await userModel.findOne({ _id: userId }).select("-password -isVerifiedForgotPassword -verifyCodeExpiry -verifyCode")

        if (!user) {
            const response = NextResponse.json({
                error: "Session expired",
                success: false
            }, { status: 400 })
            response.cookies.set("token", "", {
                httpOnly: true,
                expires: new Date(0)
            })

            return response
        } else {
            return NextResponse.json({
                message: "User found",
                data: user
            })
        }
    } catch (error) {
        return NextResponse.json({ error: "Session expired" }, { status: 400 })
    }
}