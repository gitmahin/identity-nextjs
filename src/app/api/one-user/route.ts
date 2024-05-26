import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";


export async function GET(request: Request){
    await connDb()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            id: searchParams.get('id')
        }
        const fetchedId = queryParam.id

        const user = await userModel.findOne({_id: fetchedId}).select("-password -isVerifiedForgotPassword -verifyCodeExpiry -verifyCode")
        if(!user){
            return Response.json({error:"User not found"}, {status: 400})

        }
        return Response.json({message:"User found", user}, {status: 200})
    } catch (error) {
        return Response.json({error: "Server is under maintenance."}, {status: 500})
        
    }

}