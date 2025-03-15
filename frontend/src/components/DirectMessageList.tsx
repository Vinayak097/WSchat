import { useEffect, useState } from "react"
import { Message, User } from "../lib/types"
import { formatMessageTime } from "../lib/utils"
import { Check, CheckCheck } from "lucide-react"

interface DirectMessageListProps{
    selectedUser:User
    currentUser:User    | null
}
export const DirectMessageList=({selectedUser,currentUser}:DirectMessageListProps)=>{
    const [messages,setMessages]=useState<Message[]>([])
    useEffect(()=>{
        async function fetch(){
          const messages:Message[]=[
            {
              id:1,
              content:"hello",
              senderId:1,
             
              createdAt:"2023-08-10T10:00:00Z",                    
            } ,
            {
              id:2,
              content:"hello",
              senderId:2,
           
              createdAt:"2023-08-10T10:00:00Z",
            },
            {
              id:3,
              content:"hello",
              senderId:1,
            
              createdAt:"2023-08-10T10:00:00Z",
            }  ,     
            {
              id:4,
              content:"hello",
              senderId:2,
            
              createdAt:"2023-08-10T10:00:00Z",
            },
            {
              id:5,
              content:"hello",
              senderId:1,
              
              createdAt:"2023-08-10T10:00:00Z",
            },
            {
              id:6,
              content:"hello",
              senderId:2,
              
              createdAt:"2023-08-10T10:00:00Z",
            },
            {
              id:7,
              content:"hello",
              senderId:1,
            
              createdAt:"2023-08-10T10:00:00Z",
            }
          ]
          setMessages(messages)
        }
        fetch();
      },[])
     
    return (
        <div className="flex flex-col gap-2 m-4 overflow-y-auto min-w-3/6">
            {messages.map((message:Message,index)=>{
                const isCurrentUser=message.senderId===currentUser?.id
                return (
                    <div key={index} className={`flex ${message.senderId === selectedUser.id ? "justify-end" : "justify-start"}`}>
                    <div key={index} className={` ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                      <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                              <div
                                key={message.id || `msg-${index}-${index}`}
                                className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end gap-1`}
                              >
                                <div
                                  className={`rounded-lg px-3 ml-4 py-2 ${
                                    isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted "
                                  }`}
                                >
                                  {message.content || ""}
                                </div>
        
                                {isCurrentUser && index === messages.length - 1 && (
                                  <div className="text-xs text-muted-foreground">
                                    {message.status === "sending" ? (
                                      <span className="animate-pulse">•</span>
                                    ) : message.status === "sent" ? (
                                      <Check className="h-3 w-3" />
                                    ) : message.status === "delivered" ? (
                                      <CheckCheck className="h-3 w-3" />
                                    ) : (
                                      <CheckCheck className="h-3 w-3 text-blue-500" />
                                    )}
                                  </div>
                                )}
                              </div>
                          </div>
        
                          <div className={`mt-1 text-xs text-muted-foreground flex ${currentUser?.id==message.senderId ?"items-end" :"items-start"} border-b border-red-500 w-fit`}>
                            {formatMessageTime(messages[messages.length - 1]?.createdAt || new Date().toISOString())}
                          </div>
                        </div>
                      </div>
                    

            
              
            
           
      
)})}
     </div>
    )}
