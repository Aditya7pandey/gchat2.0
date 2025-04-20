import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { io } from "socket.io-client"

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/"

export const useAuthStore = create((set,get)=>({
    authUser : null,
    isSigningUp:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,


    checkAuth:async ()=>{
        try{
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
            get().connectSocket();
        }
        catch(error){
            console.log("Error in checkAuth:",error)
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false});
        }
    },

    signup :async(data)=>{
        // const res = await axiosInstance.post("./auth/check");
        // console.log("signup sucess",res.data)

        set({isSigningUp:true});
        try{
            const res = await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data});
            toast.success("Account created Succesfully");
            get().connectSocket();
        }
        catch(error){
            const message = error.response?.data?.message || "Something went wrong!";
            toast.error(message);
        }
        finally{
            set({isSigningUp:false})
        }
    },

    login : async(data)=>{
        set({isLoggingIng:true})
        try{
            const res = await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Logged in Succesfully");

            get().connectSocket();
        }
        catch(error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isLoggingIng:false})
        }
    },

    logout : async()=>{
        try{
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logged out Succesfully");
            get().disconnectSocket();
        }
        catch(error){
            toast.error(error.response.data.message)
        }
    },

    updateProfile : async(data)=>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/updateProfile",data);
            set({authUser:res.data})
            toast.success("profile updated sucessfully")
        } 
        catch (error) {
            toast.error(error.response.data.message)
        }
        finally{
            set({isUpdatingProfile:false})
        }
    },

    connectSocket:()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return; 
        
        const socket = io(BASE_URL,{
            query:{
                userId:authUser._id,
            },
        })

        socket.connect();

        set({socket:socket})

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },

    disconnectSocket :()=>{
        if(get().socket?.connected) get().socket.disconnect();
    },

}))