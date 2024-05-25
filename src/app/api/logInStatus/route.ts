import { NextResponse, NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value || ""
    if (!token) {
      const response = NextResponse.json({
        error: "Session expired",
        success: false
      }, {status: 400})
      response.cookies.set("token", "", {
        httpOnly: true,
        expires: new Date(0)
      })
  
      return response
    } else {
      return NextResponse.json({ message: "User logged in" }, { status: 200 })
    }
  } catch (error) {
    return NextResponse.json({ message: "Server is under maintenance" }, { status: 500 })
    
  }

}