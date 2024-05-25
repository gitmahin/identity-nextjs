import {z} from "zod"

export const verifyEmailSchema = z.object({
    verifyCode: z.string()
})