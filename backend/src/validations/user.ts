import z, { date, number, optional, string } from 'zod'
 export  const  createSchema=z.object({
    username:z.string(),
    email:z.string().email(),
    password: z.string(),    
})
export enum LoginType{
    EMAIL='email',
    USERNAME='username'
}

export const usernameLoginSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    password: z.string().min(3, 'Password must be at least 6 characters')
})

// Login Schema (Email Based)
export const emailLoginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(3, 'Password must be at least 6 characters')
})
export const messageSchema=z.object({
    senderId:number(),
    content:string(),
    createdAt:date()    
})