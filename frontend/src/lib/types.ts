export interface User {
    id: number
    name: string    
    status: "online" | "offline" | "away"
    avatar?: string
  }
  
  export interface Message {
    id: number
    
    content: string
    senderId: number
    
    createdAt: string
    status?: "sending" | "delivered" | "read"|"sent"
  }
  export interface GroupedMessage{
    id:number
    sender:User
    content:string
    createdAt:string
    status?:"sending" | "delivered" | "read"|"sent"
  }
