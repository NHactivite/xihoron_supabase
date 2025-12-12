import { getEventsById } from '@/action'
import EventPage from '@/components/EventPage'
import React from 'react'

const page = async({params}) => {
   
   const EventId=  params.id
   const Event=await getEventsById(EventId)
  
  return (
    <div><EventPage Event={Event} /></div>
  )
}

export default page