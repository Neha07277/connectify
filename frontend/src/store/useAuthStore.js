import { create } from "zustand";


export const useAuthStore = create((set) => ({
  authUser: { name: "Neha", _id: 123, age:23 },
//   isCheckingAuth: true,
//   isSigningUp: false,
  isLoggingIn: false,
 
//   socket: null,
//   onlineUsers: [],

login: () => {

    console.log("We just logged in");
    set({  isLoggingIn: true });
    
  },
}));
