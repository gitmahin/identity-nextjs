import userModel from "@/models/userModel";
import connDb from "@/lib/connDb";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/utils/sendVerifyEmail";


export async function POST(request: Request) {
    await connDb()
    try {
        const { firstName, lastName, username, email, password } = await request.json()

        const existingUsername = await userModel.findOne({ username })
        const existingEmail = await userModel.findOne({ email })

        const date = new Date()
        const accountCreatedAt= date.toLocaleDateString()
        
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        const expiryVerifyDate = new Date()
        expiryVerifyDate.setMinutes(expiryVerifyDate.getMinutes() + 5)
        
        const hassedPassword = await bcrypt.hash(password, 10)

        if (existingUsername) {
            return Response.json({ error: "User already existed", success: false }, { status: 400 })

        } else {
            if (existingEmail) {
                return Response.json({ error: "User already existed", success: false }, { status: 400 })
            } else {

                try {
                    const newUser = new userModel({
                        firstName,
                        lastName,
                        username,
                        email,
                        password: hassedPassword,
                        accountCreatedAt,
                        verifyCode,
                        verifyCodeExpiry: expiryVerifyDate
                    })

                    await newUser.save()

                    const sendEmail = await sendVerificationEmail(username, email, verifyCode)
                    if (!sendEmail.success) {
                        return Response.json({ error: "Error sending verification email during sign up", success: true }, { status: 500 })
                    }

                    return Response.json({ message: "User registered successfully", success: true }, { status: 200 })

                } catch (error) {
                    console.log("Error saving user", error)
                }
            }

        }

    } catch (error) {
        return Response.json({ error: "Server is under maintenance", success: false }, { status: 500 })
    }
}


