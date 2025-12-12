"use client";

import { deleteEvent, getEvents } from "@/action";
import NewEvent from "@/components/admin/newProduct";
import { Loader } from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

const Page = () => {
  const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [mode, setMode] = useState("create");
  const [initialEvent, setInitialEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itmId,setItemId] = useState("");

  const openNewDialog = () => {
    setMode("create");
    setInitialEvent(null);
    setIsNewDialogOpen(true);
  };

  const openEditDialog = (event) => {
    setMode("edit");
    setInitialEvent(event);
    setIsNewDialogOpen(true);
  };

  const closeDialog = () => setIsNewDialogOpen(false);

  // make fetchEvents reusable so child can call it
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const eventData = await getEvents();
      if (eventData?.Event && Array.isArray(eventData.Event)) {
        setEvents(eventData.Event);
      } else {
        setEvents([]);
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const deleteHandler = async (Id) => {
    setItemId(Id)
    try {
      const res = await deleteEvent(Id);
      
      if (res.success) {
        toast.success("Event deleted");
        // remove from UI instantly
        setEvents((prev) => prev.filter((event) => event._id !== Id));
      } else {
        toast.error("Event not deleted");
      }
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Something went wrong");
    }finally{
      setItemId("")
    }
  };

  return (
    <div className="relative">
      <div className="gap-2 absolute right-1 top-0">
        <Button onClick={openNewDialog}>Add Event</Button>
      </div>

      <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>
              {mode === "edit" ? "Update Event" : "Create Event"}
            </DialogTitle>
          </DialogHeader>

          <NewEvent
            mode={mode}
            initialEvent={initialEvent}
            refreshEvents={fetchEvents}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 mt-6">
        {loading ? (
          <div className="m-20">
            <Loader />
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-400 text-center col-span-3">No events found</p>
        ) : (
          events.map((i, idx) => (
            <div
              className="lg:mt-0 mt-12 relative transition-all duration-300 hover:-translate-y-2 shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-xl overflow-hidden bg-cover bg-center h-60"
              style={{ backgroundImage: `url(${i.poster?.[0]?.url || "/placeholder.svg"})` }}
              key={i._id || idx}
            >
              <div className="absolute inset-0 bg-black/70 flex flex-col justify-center items-center text-white p-4">
                <Button onClick={() => deleteHandler(i._id)} className=" absolute top-1 right-1 bg-red-600">{itmId==i._id?"Processing...":"Delete"}</Button>
                <h1 className="text-lg font-semibold">{i.title}</h1>
                <div className="max-h-36 overflow-hidden text-sm text-gray-200 text-center mt-2">
                  <p>{i.description}</p>
                </div>
                <div className="flex justify-center items-center mt-3 gap-10">
                  <Link href={`/events/${i._id}`} className="bg-pink-600 hover:bg-pink-700 p-2 px-4 rounded-md">
                    Explore Now
                  </Link>
                  <Button
                    onClick={() => openEditDialog(i)}
                    className="bg-blue-500"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
