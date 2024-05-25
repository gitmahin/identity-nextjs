import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"

interface TokenPayload {
    id: string;
}

export const getDataFromToken = (request: NextRequest) => {
    try {
        const token = request.cookies.get("token")?.value || ""
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as TokenPayload
        return decodedToken.id
    } catch (error) {
        return NextResponse.json({error:"Error in getDataFromToken"}, {status: 500})
    }
}