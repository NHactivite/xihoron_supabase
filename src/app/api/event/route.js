import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import ConnectDB from "@/database";
import { Event } from "@/model/event";
import { Redis } from "@upstash/redis";

// Validate Upstash env early
if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set");
}

// Init Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Cloudinary config
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Cloudinary environment variables are not set");
}
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Helper: upload a File object to Cloudinary
async function uploadFileToCloudinary(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const tempPath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
  await writeFile(tempPath, buffer);
  const result = await cloudinary.v2.uploader.upload(tempPath, { folder: "xihoron" });
  return { public_id: result.public_id, url: result.secure_url };
}


// ==================== POST handler (create event) ====================
export async function POST(req) {
  try {
    // Auth + admin
    const auth = await authenticateAndEnsureAdmin(req);
    if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

    await ConnectDB();

    const formData = await req.formData();

    const title = formData.get("title");
    const details = formData.get("details");
    const description = formData.get("description");
    const eventDateTimeString = formData.get("eventDateTime");
    const teamSizeString = formData.get("teamSize");
    const prize = formData.get("prize") || formData.getAll("prize");
    const participationFeeString = formData.get("participationFee");
    const posterFile = formData.get("poster"); // single File

    if (!title || !details || !eventDateTimeString || !teamSizeString || !participationFeeString || !description) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    // parse fields
    let parsedDetails;
    try { parsedDetails = JSON.parse(details); } catch(e) { parsedDetails = typeof details === "string" ? { raw: details } : details; }

    let prizes;
    try { prizes = typeof prize === "string" ? JSON.parse(prize) : prize; } catch (e) { prizes = prize; }

    let eventDateTime, teamSize, participationFee;
    try {
      eventDateTime = JSON.parse(eventDateTimeString);
      teamSize = JSON.parse(teamSizeString);
      participationFee = JSON.parse(participationFeeString);
    } catch (e) {
      return NextResponse.json({ success: false, message: "Invalid JSON fields" }, { status: 400 });
    }

    // upload poster if provided
    let uploadedPoster = null;
    if (posterFile && posterFile.size > 0 && posterFile.name) {
      uploadedPoster = await uploadFileToCloudinary(posterFile);
    }

    const newEvent = await Event.create({
      title,
      description,
      eventDateTime,
      teamSize,
      participationFee,
      poster: uploadedPoster ? [uploadedPoster] : [],
      details: parsedDetails,
      prize: prizes,
    });

    // resilient cache invalidation
    const keys = ["all_events", "candidate_event_summary"];
    try {
      const results = await Promise.allSettled(keys.map(k => redis.del(k)));
      results.forEach((r, i) => { if (r.status === "rejected") console.warn(`Redis delete failed for ${keys[i]}:`, r.reason); });
    } catch (e) {
      console.warn("Redis invalidation unexpected error:", e);
    }

    return NextResponse.json({ success: true, message: "Event created successfully", event: newEvent }, { status: 201 });
  } catch (error) {
    console.error("POST /events error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message || error }, { status: 500 });
  }
}

// ==================== PUT handler (update event) ====================
export async function PUT(req) {
  try {
    // Auth + admin
    const auth = await authenticateAndEnsureAdmin(req);
    if (!auth.ok) return NextResponse.json(auth.body, { status: auth.status });

    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, message: "Event ID missing in query" }, { status: 400 });

    const formData = await req.formData();

    const title = formData.get("title");
    const details = formData.get("details");
    const description = formData.get("description");
    const eventDateTimeString = formData.get("eventDateTime");
    const teamSizeString = formData.get("teamSize");
    const prize = formData.get("prize");
    const participationFeeString = formData.get("participationFee");
    const posterFiles = formData.getAll("poster");
    const removedPhotos = JSON.parse(formData.get("removedPhotos") || "[]");

    const event = await Event.findById(id);
    if (!event) return NextResponse.json({ success: false, message: "Event not found" }, { status: 404 });

    // Update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (prize) {
      try { event.prize = typeof prize === "string" ? JSON.parse(prize) : prize; } catch(e) { event.prize = prize; }
    }
    if (eventDateTimeString) {
      try { event.eventDateTime = JSON.parse(eventDateTimeString); } catch(e) {}
    }
    if (teamSizeString) {
      try { event.teamSize = JSON.parse(teamSizeString); } catch(e) {}
    }
    if (participationFeeString) {
      try { event.participationFee = JSON.parse(participationFeeString); } catch(e) {}
    }
    if (details) {
      try { event.details = JSON.parse(details); } catch(e) { event.details = typeof details === "string" ? { raw: details } : details; }
    }

    // Remove selected old photos from Cloudinary
    if (Array.isArray(removedPhotos) && removedPhotos.length > 0) {
      for (const url of removedPhotos) {
        const match = url.match(/xihoron\/([^/.]+)/);
        if (!match) { console.warn("Skipping invalid Cloudinary URL:", url); continue; }
        const publicId = `xihoron/${match[1]}`;
        try {
          const delRes = await cloudinary.v2.uploader.destroy(publicId);
          if (delRes?.result === "ok") {
            if (Array.isArray(event.poster)) event.poster = event.poster.filter((p) => p.url !== url);
            console.log("Deleted from Cloudinary:", publicId);
          } else {
            console.warn("Cloudinary deletion result:", delRes);
          }
        } catch (err) {
          console.error("Cloudinary deletion error for", publicId, err);
        }
      }
    }

    // Upload new poster files
    if (posterFiles && posterFiles.length > 0) {
      for (const file of posterFiles) {
        if (!file || file.name === "undefined") continue;
        try {
          const upload = await uploadFileToCloudinary(file);
          if (!Array.isArray(event.poster)) event.poster = [];
          event.poster.push(upload);
          console.log("Uploaded new poster:", upload.public_id);
        } catch (err) {
          console.error("Failed to upload poster:", err);
        }
      }
    }

    await event.save();

    // resilient cache invalidation for PUT
    const keys = ["all_events", "candidate_event_summary", `event:${id}`];
    try {
      const results = await Promise.allSettled(keys.map(k => redis.del(k)));
      results.forEach((r, i) => { if (r.status === "rejected") console.warn(`Redis delete failed for ${keys[i]}:`, r.reason); });
    } catch (e) {
      console.warn("Redis invalidation unexpected error:", e);
    }
    
    return NextResponse.json({ success: true, message: "Event updated successfully", event }, { status: 200 });
  } catch (error) {
    console.log("PUT /events error:", error);
    return NextResponse.json({ success: false, message: "Server Error", error: error.message || error }, { status: 500 });
  }
}
