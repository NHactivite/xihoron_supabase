"use client";

import { getOrganizer } from "@/action";
import AddOrganizer from "@/components/addOrganizer";
import WigetItem from "@/components/admin/WigetItem";
import { AdminTable } from "@/components/admin/adminTable";
import { OrganizerTable } from "@/components/admin/organizerTable";
import { Loader } from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

const Page = () => {
    const [isNewDialogOpen, setIsNewDialogOpen] = useState(false);
    const openNewDialog = () => {
    setIsNewDialogOpen(true);
  };

  const [loading, setLoading] = useState(true);
  const [admin, setAdmins] = useState([]);
  const [organizer, setOrganizer] = useState([]);
  const [users, setUsers] = useState(0);

 useEffect(() => {
  const getAllData = async () => {
    setLoading(true);
    try {
      const [listRes, organizerRes] = await Promise.all([
        fetch("/api/list"),
        getOrganizer(),
      ]);

      const listData = await listRes.json();
      setUsers(listData.users);
      setAdmins(listData.admins);
      setOrganizer(organizerRes);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  getAllData();
}, []);

 
  

  return (
    <div className="relative">
      <section className='flex  justify-center mt-2 gap-20'>

      <WigetItem properties={"Users"} value={users} />
      <Button onClick={openNewDialog} >Add organizer</Button>
      </section>
      
     
     <Dialog open={isNewDialogOpen} onOpenChange={setIsNewDialogOpen}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Create New Organizer</DialogTitle>
          </DialogHeader>
       <AddOrganizer mode="create" initialProduct={""}/>
        
        </DialogContent>
      </Dialog>

      <section className="mt-6">
        {loading ? (
          <div className="m-20"><Loader /></div>
        ) : admin.length > 0 ? (
          <AdminTable admins={admin} />
        ) : (
          <p>No Admin Sign</p>
        )}
      </section>
      <section className="mt-2">
       
        {loading ? (
          <div className="m-20"><Loader /></div>
        ) : organizer.Organizer.length > 0 ? (
           <OrganizerTable organizer={organizer} />
        ) : (
          <p>No Organizer</p>
        )}
      </section>
    </div>
  );
};

export default Page;

