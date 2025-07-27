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
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";

export function AdminTable({ admins }) {
  
  const handleDelete = async (userId) => {
    try {
      const res = await fetch(`/api/admin/${userId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "User deleted");
          window.location.reload();
        // Optionally: refresh the list
      } else {
        toast.error(data.error || "Failed to delete user");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Profile</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
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

                <TableCell>{admin.phone_numbers[0].phone_number}</TableCell>
                <TableCell>
                  <button onClick={() => handleDelete(admin.id)}>
                    <FaTrash className="text-red-500 hover:text-red-700 cursor-pointer" />
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
