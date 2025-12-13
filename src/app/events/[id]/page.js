import { getEventsById } from '@/action'
import EventPage from '@/components/EventPage'
import React from 'react'

const page = async({params}) => {
   
  const { id } = await params
  const Event = await getEventsById(id)
  
  return (
    <div><EventPage Event={Event} /></div>
  )
}

export default page