"use client"

import { useEffect, useRef } from "react"


import type {  GroupedMessage, Message,User } from "../lib/types"

import { Check, CheckCheck } from "lucide-react"
import { formatMessageTime } from "../lib/utils"
import { ScrollArea } from "@radix-ui/react-scroll-area"

interface MessageListProps {
  messages: GroupedMessage[]
  currentUser: User
  ChatType:"channel"
}

export function MessageList({ messages, currentUser,ChatType }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  // Handle empty messages array
  if (!messages || messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        No messages yet. Start the conversation!
      </div>
    )
  }

  // Group messages by sender and date
  const groupedMessages: GroupedMessage[][] = []
  let currentGroup: GroupedMessage[] = []

  messages.forEach((message, index) => {
    // Skip invalid messages
    if (!message || !message.sender) {
      return
    }

    const prevMessage = messages[index - 1]

    // Start a new group if:
    // 1. This is the first message
    // 2. The sender changed
    // 3. More than 5 minutes passed since the last message
    if (
      !prevMessage ||
      !prevMessage.sender ||
      prevMessage.sender.id !== message.sender.id ||
      new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime() > 5 * 60 * 1000
    ) {
      if (currentGroup.length > 0) {
        groupedMessages.push(currentGroup)
      }
      currentGroup = [message]
    } else {
      currentGroup.push(message)
    }
  })

  // Add the last group
  if (currentGroup.length > 0) {
    groupedMessages.push(currentGroup)
  }

  return (
    <ScrollArea className="h-full p-4" ref={scrollRef}>
      <div className="flex flex-col gap-4">
        {groupedMessages.map((group, groupIndex) => {
          // Skip invalid groups
          if (!group || group.length === 0 || !group[0] || !group[0].sender) {
            return null
          }

          const isCurrentUser = currentUser && group[0].sender && group[0].sender.id === currentUser.id

          return (
            <div key={groupIndex} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              <div className={`flex max-w-[80%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                {!isCurrentUser && group[0].sender && (
                  <div className="mr-2 mt-1 flex-shrink-0">
                    <img
                      src={group[0].sender.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={group[0].sender.name || "User"}
                      className="h-8 w-8 rounded-full"
                    />
                  </div>
                )}

                <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                  {!isCurrentUser && group[0].sender && (
                    <div className="mb-1 text-sm font-medium">{group[0].sender.name || "Unknown User"}</div>
                  )}

                  <div className="flex flex-col gap-1">
                    {group.map((message, messageIndex) => (
                      <div
                        key={message.id || `msg-${groupIndex}-${messageIndex}`}
                        className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} items-end gap-1`}
                      >
                        <div
                          className={`rounded-lg px-3 py-2 ${
                            isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          {message.content || ""}
                        </div>

                        {isCurrentUser && messageIndex === group.length - 1 && (
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
                    ))}
                  </div>

                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatMessageTime(group[group.length - 1]?.createdAt || new Date().toISOString())}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}

