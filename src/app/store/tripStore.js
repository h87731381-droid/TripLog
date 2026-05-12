import { create } from 'zustand'

export const tripStore = create((set) => ({
  isGuide : true,
  tripData: null,
  setTripData: (data) =>set( {tripData:data} ),
  setIsGuide: (s) =>set((prev)=> ({isGuide:s}) ),

  //지워야할일 있으면
  //clearTripData:()=>set({tripData:null}),
  
}))