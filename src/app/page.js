import { getEvents, getOrganizer } from '@/action';
import Home from '@/components/home'
import { currentUser } from '@clerk/nextjs/server';
import React from 'react'

 export default async function Page(){

  const user = await currentUser();
  console.log(user,"uoo");
  
  const Event=await getEvents()
  const Organizer=await getOrganizer()
 
  return (
   <Home Event={Event} Organizer={Organizer}  user={JSON.parse(JSON.stringify(user))}/>
  )
}
