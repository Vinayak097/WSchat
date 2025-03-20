import { useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { ChatHeader } from '../components/char-header'
import { MessageList } from '../components/message-List'
import { User, GroupedMessage } from '../lib/types'
import { DirectMessageList } from '../components/DirectMessageList'
import { MessageInput } from '../components/message-input'
import axios from 'axios'
import { backend_url } from '../config'
import { useRecoilState, useRecoilValue } from 'recoil'
import { messagesAtom, selecteUseratom, userStateAtom, wSocketAtom } from '../store/user'
import { error } from 'console'

function ChatInterface() {
  const [socket ,setsocket]=useRecoilState(wSocketAtom);
  const [activeChannel, setActiveChannel] = useState<string>("general")
  const [channels, setChannels] = useState<string[]>([])
  const [chatType, setchatType] = useState<"channel" | "direct">("direct")
  const [messages,setMessages]=useRecoilState(messagesAtom)
  const [users, setUsers] = useState<User[]>([])
  const selectedUser=useRecoilValue(selecteUseratom)
  const currentUser= useRecoilValue(userStateAtom)
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([])

  const handleSendMessage=(text:string)=>{
    if(text==""){
      return;
    }
    if(socket){
      socket.send(JSON.stringify({
        receiverId:selectedUser?.id,
        message:text,
      }))
    }
  }
  useEffect(()=>{
    const ws=new WebSocket(`${backend_url}`)    ;
    ws.onopen=()=>{
      console.log('connected')
   
    }
    ws.onmessage=(event)=>{
      console.log(event.data , ' loggin event message ') 
      const data =JSON.parse(event.data)

      if(data.type=="message"){
        if(data.message.senderId==currentUser?.id){
          setMessages([...messages,data.message])
        }else        if(data.message.senderId== selectedUser?.id){
          setMessages([...messages,data.message])
        }
              
      }
    }
      ws.onerror=(error)=>{
        console.log('WebSocket error:', error);
      }
      ws.onclose=()=>{
        console.log('disconnected')
      }
      setsocket(ws)
      return ()=>{
        ws.close()
      }
  },[])

  useEffect(()=>{
    async function fetch(){
      const response =await axios.get(`${backend_url}/user/getall` ,{ withCredentials:true});
      if(response.status==200)     {
        setUsers(response.data.users)
        console.log(response.data)
      }
    }
    fetch()
  },[])

  return (
    <div className=''>
      <div className='flex gap-2'>
        <Sidebar users={users} activeChannel={''} setActiveChannel={setActiveChannel}></Sidebar>

        <div className=" flex flex-col  flex-1 ">

          <ChatHeader channel={''} onlineCount={0} chatType={'direct'} ></ChatHeader>

          {
            chatType == "channel" ?
              <MessageList messages={groupedMessages} currentUser={currentUser} ChatType={'channel'}></MessageList> :

              <DirectMessageList  currentUser={currentUser}></DirectMessageList>


          }
          <MessageInput onSendMessage={handleSendMessage}></MessageInput>

        </div>






      </div>
    </div>


  )
}

export default ChatInterface