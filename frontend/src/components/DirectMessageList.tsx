import { useEffect, useRef, useState } from "react";
import { Message, User } from "../lib/types";
import { formatMessageTime } from "../lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { useRecoilState, useRecoilValue } from "recoil";
import { messagesAtom, selectedChannelAtom, selecteUseratom } from "../store/user";
import axios from "axios";
import { backend_url } from "../config";

interface DirectMessageListProps {
  currentUser: User | null;
}

export const DirectMessageList = ({ currentUser }: DirectMessageListProps) => {
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const selectedUser: User | null = useRecoilValue(selecteUseratom);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isLoadingNewer, setIsLoadingNewer] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [hasMoreNewer, setHasMoreNewer] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  // Function to fetch initial messages
  const fetchInitialMessages = async () => {
    if (!selectedUser) return;
    
    setIsInitialLoad(true);
    try {
      const response = await axios.get(
        `${backend_url}/message/getall/${selectedUser.id}`,
        { withCredentials: true }
      );
      console.log('responsenses ' , response)
      if (response.status === 200) {
        setMessages(response.data.messages || []);
        setHasMoreOlder(response.data.hasMore);
        setHasMoreNewer(false); // No newer messages on initial load
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setIsInitialLoad(false);
    }
  };

  // Function to fetch older messages
  const fetchOlderMessages = async () => {
    if (!selectedUser || !messages.length || isLoadingOlder || !hasMoreOlder) return;
    
    setIsLoadingOlder(true);
    try {
      const oldestMessageId = messages[0]?.id;
      if (!oldestMessageId) return;
      
      const response = await axios.get(
        `${backend_url}/message/getall/${selectedUser.id}?cursor=${oldestMessageId}&direction=older`,
        { withCredentials: true }
      );
      
      if (response.status === 200) {
        const olderMessages = response.data.messages || [];
        if (olderMessages.length > 0) {
          // Save current scroll height before adding new messages
          if (messageContainerRef.current) {
            setPrevScrollHeight(messageContainerRef.current.scrollHeight);
          }
          
          setMessages(prev => [...olderMessages, ...prev]);
          setHasMoreOlder(response.data.hasMore);
        } else {
          setHasMoreOlder(false);
        }
      }
    } catch (error) {
      console.error("Error fetching older messages:", error);
    } finally {
      setIsLoadingOlder(false);
    }
  };

  // Initial fetch when selected user changes
  useEffect(() => {
    if (selectedUser) {
      setHasMoreOlder(true);
      setHasMoreNewer(false);
      fetchInitialMessages();
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  // Maintain scroll position when loading older messages
  useEffect(() => {
    if (!isInitialLoad && isLoadingOlder === false && messageContainerRef.current && prevScrollHeight > 0) {
      const newScrollHeight = messageContainerRef.current.scrollHeight;
      const heightDifference = newScrollHeight - prevScrollHeight;
      messageContainerRef.current.scrollTop = heightDifference;
      setPrevScrollHeight(0);
    }
  }, [isLoadingOlder, prevScrollHeight]);

  // Scroll to bottom on initial load or when new messages arrive
  useEffect(() => {
    if (messageContainerRef.current && (isInitialLoad || !isLoadingOlder)) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isInitialLoad]);

  // Handle scroll to load more messages
  const handleScroll = () => {
    if (!messageContainerRef.current || isLoadingOlder) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messageContainerRef.current;
    
    // If scrolled near the top, load older messages
    if (scrollTop < 50 && hasMoreOlder) {
      fetchOlderMessages();
    }
    
    // Save scroll position for restoration
    setScrollPosition(scrollTop);
  };

  return (
    <>
      {selectedUser == null ? (
        <div className="flex h-full justify-center items-center">
          Select a user to show chats
        </div>
      ) : (
        <div 
          ref={messageContainerRef} 
          className="flex flex-grow h-[400px] flex-col gap-6 m-4 overflow-y-auto min-w-3/6"
          onScroll={handleScroll}
        >
          {isLoadingOlder && (
            <div className="text-center py-2">
              <span className="animate-pulse">Loading older messages...</span>
            </div>
          )}
          
          {!isLoadingOlder && hasMoreOlder && messages.length > 0 && (
            <div 
              className="text-center py-2 cursor-pointer hover:text-primary"
              onClick={fetchOlderMessages}
            >
              Load older messages
            </div>
          )}
          
          {messages.length !== 0 &&
            messages.map((message: Message, index) => {
              const isCurrentUser = message.senderId === currentUser?.id;
              return (
                <div
                  key={message.id || index}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className={`flex flex-col items-${isCurrentUser ? "end" : "start"}`}>
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
                          message.createdAt 
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
                          message.createdAt 
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

          {messages.length === 0 && !isLoadingOlder && (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No messages yet. Start the conversation!
            </div>
          )}
        </div>
      )}
    </>
  );
};