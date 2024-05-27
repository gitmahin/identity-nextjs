import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";
import ratelimit from "@/utils/ratelimit";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const ip = request.ip ?? "127.0.0.1" // `??` (Nullish Coalescing Operator): This operator returns the right-hand side operand when the left-hand side operand is `null` or `undefined`. It is similar to the logical OR operator (`||`)
        const result = await ratelimit.limit(ip)
        if (!result.success) {
            return NextResponse.json({ error: "Too many requests" }, { status: 429 })
        } else {
            await connDb()
            try {
                const { email, password } = await request.json()
                const user = await userModel.findOne({ email })
                if (!user) {
                    return NextResponse.json({ error: "Invalid credentials", success: false }, { status: 400 })
                } else {
                    const isMatchedPassword = await bcrypt.compare(password, user.password)
                    if (!isMatchedPassword) {
                        return NextResponse.json({ error: "Invalid credentials", success: false }, { status: 400 })
                    } else {
                        return NextResponse.json({ message: "User is verified by password", success: true }, { status: 200 })
                    }
                }
            } catch (error) {
                return NextResponse.json({ error: "Server is under maintenance", success: false }, { status: 500 })
            }
        }
    } catch (error) {
        return NextResponse.json({ error: "Something went wrong", success: false })

    }
}