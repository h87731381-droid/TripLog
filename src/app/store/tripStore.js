import { create } from 'zustand'

export const tripStore = create((set) => ({
  tripData: null,
  setTripData: (data) =>set( {tripData:data} ),

  //지워야할일 있으면
  //clearTripData:()=>set({tripData:null}),
  
}))