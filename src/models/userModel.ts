import mongoose, {Schema, Document} from "mongoose";


export interface User extends Document{
    firstName: string; 
    lastName: string;
    username: string,
    email: string;
    password: string;
    accountCreatedAt: string;
    isLogedIn: boolean;
    isVerified: boolean;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerifiedForgotPassword: boolean;
}

const userSchema: Schema<User> = new Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        match: [/^[a-zA-Z\-]+$/, "Invalid first name"]
    },
    username:{
        type: String, 
        unique: true,
        min: [6, "Username should be at least 6 characters"],
        match: [/^[a-z](?:[a-z]+\d*|\d{2,})$/i, "Choose right username"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"],
        min: [6, "Password should be at least 6 characters"],
    },
    accountCreatedAt: {
        type: String,
        required: [true, "Something went wrong"]
    },
    isLogedIn: {
        type: Boolean,
        default: false,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: [true, "Verification status is required"]
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"]
    },
    verifyCodeExpiry:{
        type: Date,
        required: [true, "Verify code expiry is required"]
    },
    isVerifiedForgotPassword: {
        type: Boolean,
        default: false,
        required: [true, "Forgot password by verified user is required."]
    }
})

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema)

export default userModel