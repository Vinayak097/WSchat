import  { atom } from "recoil";
import { Message, User } from "../lib/types";

export const userStateAtom= atom<null|User>({
    key:'userState',
    default:null
})

export const selecteUseratom =atom<null|User>({
    key:'selectedUser',
    default:null 
})

export const selectedChannelAtom=atom({
    key:'selectedChannel',
    default:null
})
export const messagesAtom=atom<Message[]>({
    key:'messages',
    default:[]
})

export const wSocketAtom=atom<null|WebSocket>({
    key:'socket',
    default:null
})