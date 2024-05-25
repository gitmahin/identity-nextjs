import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";
import { userSchema } from "@/zod-schemas/username-schema";
import {z} from "zod"

const userQuerySchema = z.object({
    username: userSchema
})

export async function GET(request: Request){
    await connDb()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        const queryUser = userQuerySchema.safeParse(queryParam)

        if(!queryUser.success){
            return Response.json({error: "Error getting user", success: false}, {status: 400})
        }else{
            const {username} = queryUser.data
            const existedVerifiedUser = await userModel.findOne({username})

            if(existedVerifiedUser){
                return Response.json({message: "Username already taken", success: false}, {status: 403})
            }else{
                return Response.json({message: "Username is available", success: true}, {status: 200})
            }
        }


    } catch (error) {
        return Response.json({error: "Server is under maintenance", success: false}, {status: 500})
    }
}