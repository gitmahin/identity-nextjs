import {z} from "zod"

export const passwordSchema = z.object({
    password: z.string().min(6, {message: "Password should be at least 6 characters"})
})