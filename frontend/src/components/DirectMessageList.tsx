import { useEffect, useRef, useState } from "react";
import { Message, User } from "../lib/types";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { useRecoilValue } from "recoil";
import { selectedChannelAtom, selecteUseratom } from "../store/user";
import axios from "axios";
import { backend_url } from "../config";

interface DirectMessageListProps {
  currentUser: User | null;
}

export const DirectMessageList = ({ currentUser }: DirectMessageListProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const selectedUser: User | null = useRecoilValue(selecteUseratom);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  useEffect(() => {
    async function fetch() {
      if (!selectedUser) {
        return;
      }
      const response = await axios.get(
        `${backend_url}/message/getall/${selectedUser.id}`,
        { withCredentials: true }
      );
      if (response.status == 200) {
        console.log("message response", response.data);
        setMessages(response.data.messages);
      }
    }

    fetch();
  }, [selectedUser]);
  useEffect(()=>{ 
    if(messageContainerRef.current){
      messageContainerRef.current.scrollTop=messageContainerRef.current.scrollHeight;
    }
    

  },[messages,isInitialLoad])
  return (
    <>
      {selectedUser == null ? (
        <div className="flex h-full justify-center items-center">
          Select a user to show chats
        </div>
      ) : (
        <div  ref={messageContainerRef} className="flex flex-grow h-96 flex-col gap-6 m-4 overflow-y-auto min-w-3/6">
          {messages.length !== 0 &&
            messages.map((message: Message, index) => {
              const isCurrentUser = message.senderId === currentUser?.id;
              return (
                <div
               
                
                  key={index}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`flex flex-col items-${isCurrentUser ? "end" : "start"}`}>
                    {/* Timestamp for Current User (Above the message) */}
                    

                    <div
                      className={`rounded-lg px-3 py-2 ${
                        isCurrentUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.content || ""}
                    </div>
                    {isCurrentUser && (
                      <div className="text-xs text-muted-foreground mt">
                        {formatMessageTime(
                          message.createdAt || new Date().toISOString()
                        )}
                      </div>
                    )}
                    {/* Message Status for Current User */}
                    {isCurrentUser && index === messages.length - 1 && (
                      <div className="text-xs text-muted-foreground mt-1">
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

                    {/* Timestamp for Other User (Below the message) */}
                    {!isCurrentUser && (
                      <div className="text-xs text-muted-foreground mt">
                        {formatMessageTime(
                          message.createdAt || new Date().toISOString()
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {messages.length === 0 && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
      )}
    </>
  );
};
