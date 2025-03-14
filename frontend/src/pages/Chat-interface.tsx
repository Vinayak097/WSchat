import { useEffect, useState } from 'react'


import { Sidebar } from '../components/Sidebar'
import { ChatHeader } from '../components/char-header'
import { MessageList } from '../components/message-List'
import { User, Message, GroupedMessage } from '../lib/types'
import { DirectMessageList } from '../components/DirectMessageList'
import { MessageInput } from '../components/message-input'

function ChatInterface() {
  const [activeChannel, setActiveChannel] = useState<string>("general")
  const [channels, setChannels] = useState<string[]>([])
  const [chatType,setchatType]=useState<"channel"|"direct">("direct")
  const [users, setUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User>({
    id: 2,
    name: "You",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  })
  const [selectedUser,setSelectedUser]=useState<User>({
    id: 1,
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  })
  
  const [groupedMessages,setGroupedMessages]=useState<GroupedMessage[]>([])
 
  return (
    <div className=''> 
  <div className='flex gap-2'>
      <Sidebar users={[]} activeChannel={''} setActiveChannel={function (channel: string): void {
          throw new Error('Function not implemented.')
      } }></Sidebar>
   
    <div className=" flex flex-col  flex-1 ">
     
      <ChatHeader channel={''} onlineCount={0} chatType={'channel'} user={selectedUser}></ChatHeader>
     
      {
        chatType=="channel"?
        <MessageList messages={groupedMessages} currentUser={currentUser} ChatType={'channel'}></MessageList>:
       
          <DirectMessageList selectedUser={selectedUser} currentUser={currentUser}></DirectMessageList>

        
      }
        <MessageInput onSendMessage={function (text: string): void {
              throw new Error('Function not implemented.')
            } }></MessageInput>

      </div>
        

      
      
      
      
    </div>
  </div>

   
  )
}

export default ChatInterface
