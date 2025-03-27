
import React, { use, useEffect } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from 'axios'
import { backend_url } from "../config";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userStateAtom, wsConnectiontokenAtom } from "../store/user";
export enum LoginType{
    EMAIL='email',
    USERNAME='username'
}

const AuthPage = () => {
    const [user,setUser]=useRecoilState(userStateAtom)
    console.log( user, ";use recoil value ")
    const navigate=useNavigate()
    const [signup, setSignup] = React.useState(false);
    const [username,setusername]=React.useState("")
    const [password,setpassword]=React.useState("")
    const [email,setemail]=React.useState("")
    const [error,setError]=React.useState("")
    const [wsConnectiontoken,setwsConnectiontoken]=useRecoilState(wsConnectiontokenAtom)
    const handleAuth=async()=>{
        if(signup){
            const data={
                username,
                email,
                password
            }
            const response=await axios.post(`${backend_url}/auth/signup`,data,{withCredentials:true})
            if(response.status===201){
                setUser(response.data.user)
                setwsConnectiontoken(response.data.wsConnectionToken)
                setSignup(false)
                navigate('/')
            }else{
                console.log(response)
            }
        }
        else{
            const data={
                username,
                password,
                type:LoginType.USERNAME

            }
            const response=await axios.post(`${backend_url}/auth/signin`,data,{withCredentials:true})
            if(response.status===200){
                setSignup(false)
                setUser(response.data.user)
                setwsConnectiontoken(response.data.wsConnectionToken)
                navigate('/')
            }
            console.log(response)
        }
    
    }
    useEffect(()=>{
        async function autologin(){
            const res=await axios.get(`${backend_url}/auth/autoLogin`,{withCredentials:true})
            if(res.status===200){

                
                setUser(res.data.user)
                setwsConnectiontoken(res.data.wsConnectiontoken)
                navigate('/')
            }
        }
        autologin();

    },[])
  return (
    <div className="grid grid-cols-2 h-screen">
        <div className=" grid cols-span-1 flex justify-center items-center ">
            <div className="flex flex-col gap-8">
                <h1 className=""><span className="text-black font-bold text-xl">WS</span> <span className="bg-black text-white rounded-lg p-1 ">Chat</span></h1>
                <div className="flex flex-col gap-2">
                    <Input onChange={(e)=>{
                        setusername(e.target.value)
                    }} placeholder="username" className="p-2 focus:border-4 hover:shadow-lg"></Input>
                    <Input onChange={(e)=>{setpassword(e.target.value)}} placeholder="password" className="p-2 focus:border-4 hover:shadow-lg"></Input>
                    {signup && <Input onChange={(e)=>{setemail(e.target.value)}} placeholder="email" className="p-2 focus:border-4 hover:shadow-lg"></Input>}
                    <div className="mt-6">
                    {signup==false ? <> <Button className="cursor-pointer" onClick={()=>{handleAuth()}}>login</Button>
                        <p className="text-gray-500">dont have an account ? <span className="text-gray-600" onClick={()=>{setSignup(true)}}>signup</span></p> </>:
                    <><Button className="cursor-pointer" onClick={()=>handleAuth()}>signup</Button>
                    <p className="text-gray-500">alerady account ? <span className="text-gray-600 underline-offset-4" onClick={()=>{setSignup(false)}}>login</span></p> 
                    </>
                    }

                    </div>
                    
                    
                    </div>
            </div>

        </div>
        <div className="grid cols-span-1 bg-slate-200">
            hello

        </div>
    </div>
 
  );
};

export default AuthPage;
