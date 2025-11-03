import { getEventsById } from '@/action'
import EventPage from '@/components/EventPage'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

const page = async({params}) => {
   
   const EventId=  params.id
   const Event=await getEventsById(EventId)
     const user = await currentUser();
   console.log(EventId,"id");
   
  return (
    <div><EventPage Event={Event} /></div>
  )
}

export default page