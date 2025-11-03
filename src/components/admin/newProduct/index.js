"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const NewEvent = ({ mode, initialEvent }) => {
  console.log(initialEvent, "kooo");

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
    const [deletephoto, setDeletePhoto] = useState([]);

  // Basic info
  const [title, setTitle] = useState(initialEvent?.title || "");
  const [description, setDescription] = useState(
    initialEvent?.description || ""
  );

  // Event date/time
  const [eventDateTime, setEventDateTime] = useState({
    date: initialEvent?.eventDateTime?.date || "",
    startTime: initialEvent?.eventDateTime?.startTime || "",
    endTime: initialEvent?.eventDateTime?.endTime || "",
    timeZone: initialEvent?.eventDateTime?.timeZone || "IST",
    registrationLastdate:
      initialEvent?.eventDateTime?.registrationLastdate || "",
    registrationTime: initialEvent?.eventDateTime?.registrationTime || "",
  });
  const [prizes, setPrizes] = useState(
    initialEvent?.prize?.length
      ? initialEvent.prize.map((p) => ({
          money: p.money || "",
          prize: p.prize || "",
          place: p.place || "",
        }))
      : [
          {
            money: "",
            prize: "",
            place: "",
          },
        ]
  );

  const normalizePrizeArray = (arr = []) =>
    arr.map((p) => ({
      money: p.money || "",
      prize: p.prize || "",
      place: p.place || "",
    }));

const prizesChanged =
    JSON.stringify(normalizePrizeArray(prizes)) !==
    JSON.stringify(normalizePrizeArray(initialEvent.prize || []));

  const [details, setDetails] = useState(() => {
    if (initialEvent?.details) {
      return Object.entries(initialEvent?.details).map(([key, value]) => ({
        key,
        value,
      }));
    }
    return [{ key: "", value: "" }];
  });

  const addDetailField = () => {
    setDetails([...details, { key: "", value: "" }]);
  };

  const removeDetailField = (index) => {
    const newDetails = details.filter((_, i) => i !== index);
    setDetails(newDetails.length > 0 ? newDetails : [{ key: "", value: "" }]);
  };
 const [poster, setPoster] = useState({
    file: [],
    preview: initialEvent.poster ? initialEvent.poster.map((p) => p.url) : [],
    error: "",
  });
 const removeImage = (index) => {
    const removedPhoto = poster.preview[index];

    // Append to the array instead of replacing
    setDeletePhoto((prev) => [...prev, removedPhoto]);

    const newFiles = poster.file.filter((_, i) => i !== index);
    const newPreviews = poster.preview.filter((_, i) => i !== index);

    setPoster({
      file: newFiles,
      preview: newPreviews,
      error: "",
    });
  };


  const updateDetailField = (index, field, value) => {
    const newDetails = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };

  const detailsObject = {};
  details.forEach((detail) => {
    if (detail.key.trim() && detail.value.trim()) {
      detailsObject[detail.key.trim()] = detail.value.trim();
    }
  });

  // Team size
  const [teamSize, setTeamSize] = useState({
    min: initialEvent?.teamSize?.min || 2,
    max: initialEvent?.teamSize?.max || 4,
    teamLeadRequired: initialEvent?.teamSize?.teamLeadRequired ?? true,
  });

  // Participation Fee
  const [participationFee, setParticipationFee] = useState({
    perTeam: initialEvent?.participationFee?.perTeam || "",
    currency: initialEvent?.participationFee?.currency || "INR",
    includes: initialEvent?.participationFee?.includes || [],
  });

  // Optional event poster
 

  const handlePosterChange = (e) => {
  const files = Array.from(e.target.files);

  if (files.length > 0) {
    setPoster((prev) => ({
      file: [...(prev.file || []), ...files],
      preview: [
        ...(Array.isArray(prev.preview) ? prev.preview : []),
        ...files.map((file) => URL.createObjectURL(file)),
      ],
      error: "",
    }));
  }
};

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.set("title", title);
      formData.set("description", description);
      formData.set("eventDateTime", JSON.stringify(eventDateTime));
      formData.set("teamSize", JSON.stringify(teamSize));
      formData.set("participationFee", JSON.stringify(participationFee));
      formData.set("prize", JSON.stringify(prizes));

     if (poster.file && poster.file.length > 0) {
  poster.file.forEach((file) => formData.append("poster", file));
}
      const initialDetails = initialEvent?.details || {};

      if (JSON.stringify(detailsObject) !== JSON.stringify(initialDetails)) {
        formData.set("details", JSON.stringify(detailsObject));
      }

      //  console.log([...formData.entries()],"picklesss");

      const res = await fetch("/api/event", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Event created!");
        setTitle("");
        setEventDateTime({});
        setPrizes([]);
        setDescription("");
        setDetails([]);
        setTeamSize({});
        setParticipationFee({});
        setPoster({ file: [], preview: [], error: "" });

        router.refresh();
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

  const updateHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      let hasChanges = false;

      // Compare and append changed fields
      if (title !== initialEvent.title) {
        formData.set("title", title);
        console.log("title");

        hasChanges = true;
      }

      if (description !== initialEvent.description) {
        formData.set("description", description);
        console.log("des");

        hasChanges = true;
      }

      if (
        JSON.stringify(eventDateTime) !==
        JSON.stringify(initialEvent.eventDateTime)
      ) {
        formData.set("eventDateTime", JSON.stringify(eventDateTime));
        console.log("enttime");

        hasChanges = true;
      }

      if (JSON.stringify(teamSize) !== JSON.stringify(initialEvent.teamSize)) {
        formData.set("teamSize", JSON.stringify(teamSize));
        console.log("team");

        hasChanges = true;
      }

      if (
        JSON.stringify(participationFee) !==
        JSON.stringify(initialEvent.participationFee)
      ) {
        formData.set("participationFee", JSON.stringify(participationFee));
        console.log("part");

        hasChanges = true;
      }

      if (prizesChanged) {
        formData.set("prize", JSON.stringify(prizes));
        console.log("prize");

        hasChanges = true;
      }

      // Poster
      if (poster.file && poster.file.length > 0) {
        poster.file.forEach((file) => {
          formData.append("poster", file);
        });
        console.log("phot");

        hasChanges = true;
      }

      // Details object
      const initialDetails = initialEvent?.details || {};
      if (JSON.stringify(detailsObject) !== JSON.stringify(initialDetails)) {
        formData.set("details", JSON.stringify(detailsObject));
        console.log("details");

        hasChanges = true;
      }

       if (deletephoto && deletephoto.length > 0) {
        formData.set("removedPhotos", JSON.stringify(deletephoto));
        hasChanges = true;
      }

      console.log(hasChanges, "joo");

      if (!hasChanges) {
        toast("No changes detected.");
        setIsLoading(false);
        return;
      }

      const res = await fetch(`/api/event?id=${initialEvent._id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Event updated successfully!");
        router.refresh();
      } else {
        toast.error(data.message || "Failed to update event");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Error updating event");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl  min-h-screen">
      <Card>
        <CardContent>
          <form
            onSubmit={mode === "edit" ? updateHandler : submitHandler}
            className="space-y-6"
          >
            {/* Title & Description */}
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Enter event title"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter event description"
                className="resize-none"
              />
            </div>

            {/* Event Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Date</Label>
                <Input
                  type="text"
                  placeholder="e.g., December 15, 2024"
                  value={eventDateTime.date}
                  onChange={(e) =>
                    setEventDateTime({ ...eventDateTime, date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-1">Registration Time</Label>
                <Input
                  type="text"
                  placeholder="8:30 AM"
                  value={eventDateTime.registrationTime}
                  onChange={(e) =>
                    setEventDateTime({
                      ...eventDateTime,
                      registrationTime: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1">Registration Last Date</Label>
                <Input
                  type="text"
                  placeholder="e.g., December 25, 2024"
                  value={eventDateTime.registrationLastdate}
                  onChange={(e) =>
                    setEventDateTime({
                      ...eventDateTime,
                      registrationLastdate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1">Start Time</Label>
                <Input
                  type="text"
                  placeholder="9:00 AM"
                  value={eventDateTime.startTime}
                  onChange={(e) =>
                    setEventDateTime({
                      ...eventDateTime,
                      startTime: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1">End Time</Label>
                <Input
                  type="text"
                  placeholder="6:00 PM"
                  value={eventDateTime.endTime}
                  onChange={(e) =>
                    setEventDateTime({
                      ...eventDateTime,
                      endTime: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Event Rules</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addDetailField}
                  className="text-xs bg-transparent"
                >
                  Add Rules
                </Button>
              </div>
              <div className="space-y-3">
                {details.map((detail, index) => (
                  <div key={index} className="flex gap-2 items-center">
                    <Input
                      placeholder="Detail name (e.g., Material)"
                      value={detail.key}
                      onChange={(e) =>
                        updateDetailField(index, "key", e.target.value)
                      }
                      className="flex-1"
                    />
                    <Input
                      placeholder="Detail value (e.g., Cotton)"
                      value={detail.value}
                      onChange={(e) =>
                        updateDetailField(index, "value", e.target.value)
                      }
                      className="flex-1"
                    />
                    {details.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeDetailField(index)}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Team Size */}
            {/* Prize Fields */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Prizes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPrizes([...prizes, { money: "", prize: "", place: "" }])
                  }
                  className="text-xs bg-transparent"
                >
                  Add Prize
                </Button>
              </div>

              <div className="space-y-3">
                {prizes.map((p, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center"
                  >
                    <Input
                      type="text"
                      placeholder="Place (e.g., 1st)"
                      value={p.place}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[index].place = e.target.value;
                        setPrizes(updated);
                      }}
                    />
                    <Input
                      type="text"
                      placeholder="Prize (e.g., Trophy)"
                      value={p.prize}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[index].prize = e.target.value;
                        setPrizes(updated);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Money (e.g., 5000)"
                      value={p.money===0?"":p.money}
                      onChange={(e) => {
                        const updated = [...prizes];
                        updated[index].money = Number(e.target.value);
                        setPrizes(updated);
                      }}
                    />
                    {prizes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const updated = prizes.filter((_, i) => i !== index);
                          setPrizes(
                            updated.length > 0
                              ? updated
                              : [{ money: "", prize: "", place: "" }]
                          );
                        }}
                        className="px-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="mb-1">Min Members</Label>
                <Input
                  type="number"
                  value={teamSize.min===0?"":teamSize.min}
                  onChange={(e) =>
                    setTeamSize({ ...teamSize, min: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label className="mb-1">Max Members</Label>
                <Input
                  type="number"
                  value={teamSize.max ===0?"":teamSize.max }
                  onChange={(e) =>
                    setTeamSize({ ...teamSize, max: Number(e.target.value) })
                  }
                />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  id="teamLeadRequired"
                  type="checkbox"
                  checked={teamSize.teamLeadRequired}
                  onChange={(e) =>
                    setTeamSize({
                      ...teamSize,
                      teamLeadRequired: e.target.checked,
                    })
                  }
                />
                <Label htmlFor="teamLeadRequired">Team Lead Required</Label>
              </div>
            </div>

            {/* Participation Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1">Participation Fee (per team)</Label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={participationFee.perTeam === 0 ? "" :participationFee.perTeam}
                  onChange={(e) =>
                    setParticipationFee({
                      ...participationFee,
                      perTeam: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <Label className="mb-1">Includes (comma separated)</Label>
                <Input
                  type="text"
                  placeholder="kit, materials"
                  value={(participationFee.includes || []).join(", ")}
                  onChange={(e) =>
                    setParticipationFee({
                      ...participationFee,
                      includes: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </div>
            </div>

            {/* Poster Upload */}
            <div className="space-y-4">
              <Label>Event Poster</Label>
              <div className="border-2 border-dashed border-gray-300 p-3 rounded-md text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePosterChange}
                  id="poster-upload"
                  className="hidden"
                />
                <label htmlFor="poster-upload" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p>Click to upload poster</p>
                </label>
              </div>
              {poster.preview.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {poster.preview.map((img, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`Product preview ${i + 1}`}
                        className="w-full h-32 object-cover rounded-lg border shadow-sm"
                        width={80}
                        height={80}
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1  transition-opacity hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
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
                    {mode === "edit"
                      ? "Updating Event..."
                      : "Creating Event..."}
                  </>
                ) : mode === "edit" ? (
                  "Update Event"
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

export default NewEvent;
