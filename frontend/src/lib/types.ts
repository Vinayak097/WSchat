export interface User {
    id: number
    name: string
    username:string
    email:string
    status: "online" | "offline" | "away"
    avatar?: string
  }
  
  export interface Message {
    id: number
    content: string
    senderId: number
    createAt: string
    status?: "sending" | "delivered" | "read"|"sent"  
  }
  export interface GroupedMessage{
    id:number
    sender:User
    content:string
    createdAt:string
    status?:"sending" | "delivered" | "read"|"sent"
  }
