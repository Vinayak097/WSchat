import { useCallback, useEffect, useState } from 'react'
import { Sidebar } from '../components/Sidebar'
import { ChatHeader } from '../components/char-header'
import { MessageList } from '../components/message-List'
import { User, GroupedMessage } from '../lib/types'
import { DirectMessageList } from '../components/DirectMessageList'
import { MessageInput } from '../components/message-input'
import axios from 'axios'
import { backend_url, ws_url } from '../config'
import { useRecoilState, useRecoilValue } from 'recoil'
import { messagesAtom, selecteUseratom, userStateAtom, wsConnectiontokenAtom, wSocketAtom } from '../store/user'
import { error } from 'console'
import { Cookie } from 'lucide-react'

function ChatInterface() {
  const [socket ,setSocket]=useRecoilState(wSocketAtom);
  const [activeChannel, setActiveChannel] = useState<string>("general")
  const [channels, setChannels] = useState<string[]>([])
  const [chatType, setchatType] = useState<"channel" | "direct">("direct")
  const [messages,setMessages]=useRecoilState(messagesAtom)
  const [users, setUsers] = useState<User[]>([])
  const selectedUser=useRecoilValue(selecteUseratom)
  const currentUser= useRecoilValue(userStateAtom)
  const [groupedMessages, setGroupedMessages] = useState<GroupedMessage[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const wsConnectiontoken=useRecoilValue(wsConnectiontokenAtom)
  const token=wsConnectiontoken;
  const handleSendMessage = (text: string) => {
    if (text === "") {
      return;
    }
    console.log(text, " this is text")
    
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        receiverId: selectedUser?.id,
        message: text,
        type:"message"
      }))
    } else {
      console.error("Socket is not connected. Cannot send message.");
      // Optionally, queue the message to be sent when connection is restored
    }
  }
      useEffect(() => {
        let ws: WebSocket | null = null;
  
        const connectWebSocket = () => {
          // Connect without token in URL - just the base URL
          ws = new WebSocket(`${ws_url}`);
    
          ws.onopen = () => {
            console.log('WebSocket connected');
            setIsConnected(true);
            setSocket(ws);
         
            console.log(token, ' this is ws' )
            // Send authentication message after connection is established
            if (ws && token) {
              ws.send(JSON.stringify({
                type: 'authenticate',
                token: token
              }));
            }
          };
    
          ws.onmessage = (event) => {
            console.log(event.data, ' logging event message'); 
            const data = JSON.parse(event.data);

            if (data.type === "message") {
              setMessages(prevMessages => {
                // Use functional update to avoid stale state
                if (data.data.senderId === currentUser?.id || 
                    data.data.senderId === selectedUser?.id) {
                  return [...prevMessages, data.data];
                }
                return prevMessages;
              });
            }
          }
    
          ws.onerror = (error) => {
            console.log('WebSocket error:', error);
            setIsConnected(false);
          }
    
          ws.onclose = () => {
            console.log('WebSocket disconnected');
            setIsConnected(false);
      
            // Try to reconnect after a delay
            setTimeout(() => {
              if (ws?.readyState === WebSocket.CLOSED) {
                connectWebSocket();
              }
            }, 3000);
          }
        };
  
        connectWebSocket();
  
        // Cleanup function
        return () => {
          if (ws) {
            ws.close();
          }
        };
      }, [setSocket, token, currentUser, selectedUser]);
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${backend_url}/user/getall`, { withCredentials: true });
        if (response.status === 200) {
          setUsers(response.data.users);
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

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