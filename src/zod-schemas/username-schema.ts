import {z} from "zod"

export const userSchema = z
    .string()
    .min(6)
    .regex(/^[a-z](?:[a-z]+\d*|\d{2,})$/i)