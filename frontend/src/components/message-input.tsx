"use client"

import { useState, useRef, type KeyboardEvent } from "react"


import { Smile, Paperclip, Image, Mic, Send, Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useRecoilValue } from "recoil"
import { wSocketAtom } from "../store/user"
interface MessageInputProps {
  onSendMessage: (text: string) => void
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const socket=useRecoilValue(wSocketAtom);
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
     
        handleSendMessage()
      
      
    }
  }

  const handleSendMessage = () => {
    console.log("sending messsage " , message)
    if (message.trim() && message.length > 0) {
      onSendMessage(message)
      setMessage("")

      
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  return (
    <div className="border-t h-17.5 p-4">
      <div className="flex items-end gap-2">
        <Button variant="outline" size="icon" className="flex-shrink-0 rounded-full">
          <Plus className="h-5 w-5" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-10 max-h-32 resize-none pr-12"
            rows={1}
          />

          <div className="absolute bottom-1 right-1 flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Smile className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Image className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button variant="ghost" size="icon" className="rounded-full">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>

          <Button
            variant={"outline"}
            size="icon"
            className="rounded-full bg-primary"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

