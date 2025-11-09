"use client";
import { Badge } from "@/components/ui/badge";
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

export function AdminTable({ admins }) {
  const [deletingId, setDeletingId] = useState(null); 

  const handleDelete = async (userId) => {
    setDeletingId(userId); // set that specific user's id
    try {
      const res = await fetch(`/api/admin/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "User deleted");
        window.location.reload();
      } else {
        toast.error(data.message || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setDeletingId(null); // reset after done
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell className="font-medium">
                  {admin.first_name} {admin.last_name}
                </TableCell>
                <TableCell>
                  <Image
                    src={admin.profile_image_url}
                    alt="Profile picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{admin.email_addresses[0].email_address}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      admin.public_metadata?.role === "admin"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {admin.public_metadata?.role ?? "N/A"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    disabled={deletingId === admin.id}
                  >
                    {deletingId === admin.id ? (
                      <span>Processing...</span>
                    ) : (
                      <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
                    )}
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
