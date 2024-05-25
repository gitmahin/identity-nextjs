import connDb from "@/lib/connDb";
import userModel from "@/models/userModel";

export async function DELETE(request: Request){
    await connDb()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            email: searchParams.get('email')
        }
        const {email} = queryParam
        await userModel.deleteOne({email})
        return Response.json({message:"User has been deleted", success: true}, {status: 200})
    } catch (error) {
        return Response.json({message:"Server is under maintenance", success: false}, {status: 500})
    }
}