import { getEvents, getOrganizer } from '@/action';
import Home from '@/components/home';
import React from 'react';

export default async function Page() {
   
  const Event = await getEvents();
  const Organizer = await getOrganizer();

  return (
    <Home
      Event={Event}
      Organizer={Organizer}
    />
  );
}
