"use client"
import { deleteOrganizer } from "@/action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export function OrganizerTable({ organizer }) {
   const [loading,setLoading]=useState(false)
  const handleDelete = async (Id) => {
       setLoading(true)
    try {
      const res = await deleteOrganizer(Id)
    
      if (res.success) {
        toast.success(res.message || "Organizer deleted");
          window.location.reload();
      } else {
        toast.error(res.message || "Failed to delete Organizer");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }finally{
      setLoading(false)
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organizer List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Delete</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizer.Organizer.map((i,idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">
                  {i.name}
                </TableCell>
                <TableCell>
                  <Image
                    src={i.photo.url}
                    alt="Profile picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>
                  {i.role}
                </TableCell>

                <TableCell>
                  <button onClick={() => handleDelete(i._id)}>
                   {loading?<span>Processing...</span>: <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />}
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
