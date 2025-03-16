import  { atom } from "recoil";
import { User } from "../lib/types";

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