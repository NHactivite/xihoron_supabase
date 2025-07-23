// "use client"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { useUser } from "@clerk/nextjs"
// import { Calendar, Edit2, Phone, Plane, Shield } from "lucide-react"
// import { useState } from "react"

// export default function AccountPage({planUser}) {
//   const [isEditing, setIsEditing] = useState(false)
//    const user=useUser()
//   const [userInfo, setUserInfo] = useState({
//     firstName: planUser.firstName,
//     lastName:planUser.lastName,
//     email: planUser.email,
//     phone: planUser.phone
//   })

//   const handleSave = async() => {
//     setIsEditing(false)
//     console.log(userInfo,"update");
//     await user.update({
//       firstName:userInfo.firstName,
//       lastName:userInfo.lastName,
//       phoneNumbers: [
//         {
//           phoneNumber: userInfo.phone,
//           id: planUser.phoneId, // use existing phone number ID if available
//         },
//       ],
//       emailAddress: user.primaryEmailAddress?.emailAddress !== userInfo.email
//         ? userInfo.email
//         : undefined,
//     });
//     // Here you would typically save to your backend
//     console.log("Saving user info:", userInfo)
//   }

//   const handleInputChange = (field, value) => {
//     setUserInfo((prev) => ({
//       ...prev,
//       [field]: value,
//     }))
//   }

 


//   return (
//     <div className="container mx-auto py-8 px-4 max-w-4xl">
//       <div className="space-y-8">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">Account Settings</h1>
//             <p className="text-muted-foreground">Manage your account information and preferences</p>
//           </div>
//           <Badge variant="secondary" className="flex items-center gap-2">
//             <Calendar className="h-4 w-4" />
//             Member since {userInfo.joinDate}
//           </Badge>
//         </div>

//         <div className="grid gap-8 md:grid-cols-3">
//           {/* Profile Section */}
//           <div className="md:col-span-1">
//             <Card>
//               <CardHeader className="text-center">
//                 <div className="relative mx-auto">
//                   <Avatar className="h-24 w-24">
//                     <AvatarImage src={"ll"} alt="Profile" />
//                     <AvatarFallback className="text-lg">{planUser.firstName}</AvatarFallback>
//                   </Avatar>
//                 </div>
//                 <div>
//                   <h3 className="text-xl font-semibold">{`${planUser.firstName} ${planUser.lastName} `}</h3>
//                   <p className="text-muted-foreground">{planUser.email}</p>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                   <Phone className="h-4 w-4" />
//                   {planUser.phone}
//                 </div>
                
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="md:col-span-2 space-y-6">
//             {/* Personal Information */}
//             <Card>
//               <CardHeader className="flex flex-row items-center justify-between">
//                 <div>
//                   <CardTitle>Personal Information</CardTitle>
//                   <CardDescription>Update your personal details here</CardDescription>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
//                   className="flex items-center gap-2"
//                 >
//                   <Edit2 className="h-4 w-4" />
//                   {isEditing ? "Save" : "Edit"}
//                 </Button>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label htmlFor="firstname">First Name</Label>
//                     <Input
//                       id="firstname"
//                       value={userInfo.firstName}
//                       onChange={(e) => handleInputChange("firstname", e.target.value)}
//                       disabled={!isEditing}
//                     />
//                     <Label htmlFor="lastname">Last Name</Label>
//                     <Input
//                       id="lastname"
//                       value={userInfo.lastName}
//                       onChange={(e) => handleInputChange("lastname", e.target.value)}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       type="email"
//                       value={userInfo.email}
//                       onChange={(e) => handleInputChange("email", e.target.value)}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>
//                 <div className="grid gap-4 md:grid-cols-2">
//                   <div className="space-y-2">
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input
//                       id="phone"
//                       value={userInfo.phone}
//                       onChange={(e) => handleInputChange("phone", e.target.value)}
//                       disabled={!isEditing}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//             {/* Security & Billing */}
//             <div className="grid gap-6 md:grid-cols-2">
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <Shield className="h-5 w-5" />
//                     Security
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-3">
//                   <Button variant="outline" className="w-full justify-start bg-transparent">
//                     Change Password
//                   </Button>
//                   <Button variant="destructive" className="w-full justify-start">
//                     Delete Account
//                   </Button>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import { Calendar, Edit2, Phone, Shield } from "lucide-react";
import { useState } from "react";

export default function AccountPage({ planUser }) {
  const { user } = useUser(); // ✅ Correct way to get current Clerk user
  const [isEditing, setIsEditing] = useState(false);

  const [userInfo, setUserInfo] = useState({
    firstName: planUser.firstName,
    lastName: planUser.lastName,
    email: planUser.email,
    phone: planUser.phone,
  });

  const handleInputChange = (field, value) => {
    setUserInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

 const handleSave = async () => {
  setIsEditing(false);
  try {
    const res = await fetch(`/api/update-user/${user.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        email: userInfo.email,
        phone: userInfo.phone,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    console.log("✅ User updated:", data.user);
  } catch (error) {
    console.error("❌ Failed to update user:", error);
  }
};

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Account Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Member since {planUser.joinDate}
          </Badge>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="relative mx-auto">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={planUser.img} alt="Profile" />
                    <AvatarFallback className="text-lg">
                      {planUser.firstName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {planUser.firstName} {planUser.lastName}
                  </h3>
                  <p className="text-muted-foreground">{planUser.email}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  {planUser.phone}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    isEditing ? handleSave() : setIsEditing(true)
                  }
                  className="flex items-center gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  {isEditing ? "Save" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userInfo.firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userInfo.lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userInfo.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userInfo.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
