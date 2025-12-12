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

export function AdminTable({ admins }) {
  console.log(admins,"from adimtab");
  
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
                  {admin.username}
                </TableCell>
                <TableCell>
                  <Image
                    src={admin.avatar_url}
                    alt="Profile picture"
                    width={50}
                    height={50}
                    className="rounded-full"
                  />
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>
                  <Badge>
                    {admin.role ?? "N/A"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
