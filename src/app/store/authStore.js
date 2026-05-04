import { create } from 'zustand'

export const authStore = create((set) => ({
  showLogin: false,
  setShowLogin: () =>{
     set( (obj)=>({showLogin:!obj.showLogin})  )
  },
  
}))