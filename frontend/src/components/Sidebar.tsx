"use client"

import { useState } from "react"
import { User } from "../lib/types"

import { ScrollArea } from "./ui/scroll-area"


import { Hash, Users, Settings, Bell, Menu, X, MessageSquare, ChevronDown, User2 } from "lucide-react"
import { cn } from "../lib/utils"
import { useMobile } from "../hooks/mobile"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import { useRecoilState } from "recoil"
import { selecteUseratom } from "../store/user"

interface SidebarProps {
  users: User[]
  activeChannel: string
  setActiveChannel: (channel: string) => void
}

export function Sidebar({ users, activeChannel, setActiveChannel }: SidebarProps) {
  const [expanded, setExpanded] = useState(true)
  const isMobile = useMobile()
  const [showSidebar, setShowSidebar] = useState(!isMobile)
  const [selectedUser,setSelectedUser]=useRecoilState(selecteUseratom);
  const channels = [
    { id: "general", name: "General" },
    { id: "random", name: "Random" },
    { id: "announcements", name: "Announcements" },
    { id: "development", name: "Development" },
  ]

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }
  

  if (isMobile && !showSidebar) {
    return (
      <Button variant="ghost" size="icon" className="absolute left-2 top-2 z-50" onClick={toggleSidebar}>
        <Menu className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col bg-muted/40 transition-all duration-300",
        isMobile ? "absolute left-0 top-0 z-40 h-full w-64" : "w-64",
        expanded ? "w-64" : "w-20",
      )}
    >
      {isMobile && (
        <Button variant="ghost" size="icon" className="absolute right-2 top-2" onClick={toggleSidebar}>
          <X className="h-5 w-5" />
        </Button>
      )}

      <div className="flex h-14 items-center px-4">
        <MessageSquare className="mr-2 h-6 w-6 text-primary" />
        {expanded && <h1 className="text-xl font-bold">Chat App</h1>}
      </div>

      <Separator />

      <div className="flex flex-col gap-2 p-2">
        <div className="flex items-center px-2 py-1.5">
          {expanded ? (
            <h2 className="flex items-center text-sm font-semibold text-muted-foreground">
              <Hash className="mr-1 h-4 w-4" />
              CHANNELS
              <Button variant="ghost" size="icon" className="ml-auto h-5 w-5" onClick={() => setExpanded(false)}>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </h2>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpanded(true)}>
              <Hash className="h-5 w-5" />
            </Button>
          )}
        </div>

        <ScrollArea className="h-[30vh]">
          {channels.map((channel) => (
            <Button
              key={channel.id}
              variant={activeChannel === channel.id ? "secondary" : "ghost"}
              className={cn("mb-1 w-full justify-start", !expanded && "justify-center px-2")}
              onClick={() => setActiveChannel(channel.id)}
            >
              <Hash className={cn("h-4 w-4", expanded && "mr-2")} />
              {expanded && <span>{channel.name}</span>}
            </Button>
          ))}
        </ScrollArea>

        <div className="flex items-center px-2 py-1.5">
          {expanded ? (
            <h2 className="text-sm font-semibold text-muted-foreground">
              <Users className="mr-1 inline-block h-4 w-4" />
              ONLINE — {users.filter((u) => u.status === "online").length}
            </h2>
          ) : (
            <Users className="h-5 w-5 text-muted-foreground" />
          )}
        </div>

        <ScrollArea className="h-[30vh]">
          {users.map((user) => (
            <div
            onClick={()=>{setSelectedUser(user)}}
              key={user.id}
              className={cn(
                "flex items-center px-2 py-1.5 hover:bg-muted/50 rounded-md cursor-pointer",  
                !expanded && "justify-center",
              )}
            >
              <div className="relative">
                
                <User2 className="h-8 w-8 rounded-full"></User2>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                    user.status === "online"
                      ? "bg-green-500"
                      : user.status === "away"
                        ? "bg-yellow-500"
                        : "bg-gray-500",
                  )}
                />
              </div>
              {expanded && <span className="ml-2 text-sm">{user.username}</span>}
            </div>
          ))}
        </ScrollArea>
      </div>

      <div className="mt-auto">
        <Separator />
        <div className="flex p-4">
          {expanded ? (
            <>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="icon" className="w-full">
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

