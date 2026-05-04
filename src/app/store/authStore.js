import { create } from 'zustand'

export const authStore = create((set) => ({
  session:null,
  showLogin: false,
  setShowLogin: () =>{
     set( (obj)=>({showLogin:!obj.showLogin})  )
  },
  saveSession:(session)=>{
    set({session:session});
  },
  deleteSession:()=>{
    set({session:{}});
  }
  
}))
