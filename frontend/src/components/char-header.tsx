

import { Search, Phone, Video, Users, MoreHorizontal, Pin, Bell, User2 } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { User } from "../lib/types"

interface ChatHeaderProps {
  channel: string
  onlineCount: number
  chatType:"channel"|"direct"
  user:User
}

export function ChatHeader({ channel, onlineCount,chatType="direct" ,user  }: ChatHeaderProps) {
  return (
    
    <div className="flex h-14 items-center justify-between border-b px-4 ">
        {chatType=="channel" ?(
            <div className="flex items-center">
            <h2 className="text-lg font-semibold capitalize">#{channel}</h2>
            <div className="ml-2 flex items-center text-xs text-muted-foreground">
              <Users className="mr-1 h-3 w-3" />
              <span>{user.name} online</span>
            </div>
          </div>
        ):(
            <div className="flex items-center">
            
            <div className="ml-2 flex items-center text-xs text-muted-foreground mr-2">
              <User2 className="mr-1 h-3 w-3" />
              <span>user name</span>
            </div>
          </div>
        ) }
      

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search messages..." className="w-48 rounded-md bg-muted pl-8 md:w-64" />
        </div>

        <Button variant="ghost" size="icon">
          <Pin className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Phone className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Video className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
    
  )
}

