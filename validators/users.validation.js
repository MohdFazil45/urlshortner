import { email, z} from 'zod'

export const UserSignup = z.object({
    firstName: z.string().min(3),
    lastName: z.string().optional(),
    email:z.string().email(),
    password:z.string().min(6)
}) 

export const UserSignin = z.object({
    email:z.string().email(),
    password:z.string().min(6)
})