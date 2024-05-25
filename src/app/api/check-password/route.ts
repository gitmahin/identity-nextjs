import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";
import bcrypt from "bcryptjs"


export async function POST(request:Request) {
    await connDb()
    try {
        const {email, password} = await request.json()
        const user = await userModel.findOne({email})

        if(!user){
            return Response.json({error:"Invalid credentials", success: false}, {status: 400})
        }else{
            const isMatchedPassword = await bcrypt.compare(password, user.password)
            if(!isMatchedPassword){
                return Response.json({error:"Invalid credentials", success: false}, {status: 400})     
            }else{
                return Response.json({message:"User is verified by password", success: true}, {status: 200})
            }
        }
    } catch (error) {
        return Response.json({error:"Server is under maintenance", success: false}, {status: 500})
    }
}