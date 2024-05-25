import { z } from "zod"
import { userSchema } from "./username-schema"

export const signUpSchema = z.object({
    firstName: z.string(),
    lastName: z.string().regex(/^[a-zA-Z\-]+$/, "Invalid name"),
    username: userSchema,
    email: z.string().email({ message: "Invalid email" }),
    password: z.string().min(6, { message: "Password should be at least 6 characters" }),
    cpass: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.cpass, {
    message: "Passwords don't match",
    path: ["cpass"],
})