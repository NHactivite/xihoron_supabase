"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

const AddOrganizer = ({ initialData, onlyForEvent, openNewDialog }) => {
  const [isLoading, setIsLoading] = useState(false);

  // Basic info
  const [name, setname] = useState(initialData?.name || "");
  const [role, setrole] = useState(initialData?.role || "");

  // Optional event poster
  const [photo, setPhoto] = useState({
    file: null,
    preview: initialData?.photo || "",
  });

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.set("name", name);
      formData.set("role", role);
      if (photo.file) formData.append("photo", photo.file);

      const Supabase = await createClient();
      const {
        data: { session },
      } = await Supabase.auth.getSession();

      const res = await fetch(`/api/organizer`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        // Response wasn't JSON — preserve the raw text for logging
        data = { success: false, message: text };
      }

      if (data.success) {
        toast.success(
          `Event created successfully!`
        );
        setname("");
        setPhoto({});
        setrole("");
        await onlyForEvent();
        await openNewDialog();
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error submitting:", error);
      toast.error("Error creating event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl  min-h-screen">
      <Card>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
            {/* Title & Description */}
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setname(e.target.value)}
                required
                placeholder="Enter Name"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Textarea
                value={role}
                onChange={(e) => setrole(e.target.value)}
                placeholder="Enter Role"
                className="resize-none"
              />
            </div>

            {/* Poster Upload */}
            <div className="space-y-4">
              <Label>Add Profile</Label>
              <div className="border-2 border-dashed border-gray-300 p-3 rounded-md text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  id="poster-upload"
                  className="hidden"
                />
                <label htmlFor="poster-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p>Click to upload Profile</p>
                </label>
              </div>
              {photo.preview && (
                <div className="relative w-40">
                  <img
                    src={photo.preview}
                    alt="Event poster"
                    width={160}
                    height={160}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setPhoto({ file: null, preview: "" })}
                    className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-6">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-base font-medium"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Organizer...
                  </>
                ) : (
                  "Create Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddOrganizer;
