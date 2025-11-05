import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import ConnectDB from "@/database";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/express";
import { Event } from "@/model/event";
import { Redis } from "@upstash/redis";

// Check if the required environment variables are set
if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are not set"
  );
}

// Create a new Redis client from your environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
   token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

if (!process.env.CLOUD_NAME|| !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Cloudinary environment variables are not set");
}


export async function POST(req) {
  try {
    await ConnectDB();
    console.log("Database connected.");
    
    const formData = await req.formData();
    console.log(formData,"lppp");
    
    // --- 1. Get all data from FormData ---
    const title = formData.get("title");
     const details = formData.get("details");
    const description = formData.get("description");
    const eventDateTimeString = formData.get("eventDateTime");
    const teamSizeString = formData.get("teamSize");
    const prize = formData.getAll("prize");
    const participationFeeString = formData.get("participationFee");
    const posterFile = formData.get("poster"); // This is a single File object

    // Basic validation
    if (!title ||  !details|| !eventDateTimeString || !teamSizeString || !participationFeeString||!posterFile||!description) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
     
    const parse = JSON.parse(details);
    const parsedDetails = { ...parse };
    const prizes = JSON.parse(prize);
    // --- 2. Handle the Poster Upload (if it exists) ---
    let uploadedPoster = null; // Default value if no poster is uploaded
    
    // Check if posterFile is a valid file
    if (posterFile && posterFile.size > 0) {
      console.log("Processing poster upload...");
      
      // Convert file to buffer
      const buffer = Buffer.from(await posterFile.arrayBuffer());
      
      // Create a temporary path
      const tempPath = path.join(tmpdir(), `${uuidv4()}-${posterFile.name}`);
      
      // Write file to temp path
      await writeFile(tempPath, buffer);
      
      // Upload to Cloudinary
      const result = await cloudinary.v2.uploader.upload(tempPath, {
        folder: "xihoron", // A specific folder for event posters
      });

  
      // Store the Cloudinary response
      uploadedPoster = {
        public_id: result.public_id,
        url: result.secure_url,
      };
      
      console.log("Poster uploaded to Cloudinary:", uploadedPoster.url);
    }

    // --- 3. Parse JSON strings back into objects ---
    const eventDateTime = JSON.parse(eventDateTimeString);
    const teamSize = JSON.parse(teamSizeString);
    const participationFee = JSON.parse(participationFeeString);

    const newEvent = await Event.create({
      title,
      description,
      eventDateTime,    // Pass the parsed object
      teamSize,         // Pass the parsed object
      participationFee,  // Pass the parsed object
      poster: uploadedPoster, // Pass the Cloudinary object (or null)
      details:parsedDetails,
      prize:prizes
      
    });
    const eventCacheKey = "all_events";
    const candidateSummaryKey = "candidate_event_summary";

    await Promise.all([
      redis.del(eventCacheKey),
      redis.del(candidateSummaryKey),
    ]);

    console.log(`🧼 Deleted Redis cache keys: ${eventCacheKey}, ${candidateSummaryKey}`);

    console.log("New event created successfully:", newEvent._id);

    return NextResponse.json(
      { success: true, message: "Event created successfully", event: newEvent },
      { status: 201 } // 201 Created is more specific
    );

  } catch (error) {
   
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}



export async function PUT(req) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized: Please login" },
      { status: 401 }
    );
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata?.role;

  if (role !== "admin") {
    return NextResponse.json(
      { success: false, message: "Forbidden: Admin access only" },
      { status: 403 }
    );
  }

  try {
    await ConnectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Event ID missing in query" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const title = formData.get("title");
    const details = formData.get("details");
    const description = formData.get("description");
    const eventDateTimeString = formData.get("eventDateTime");
    const teamSizeString = formData.get("teamSize");
    const prize = formData.get("prize");
    const participationFeeString = formData.get("participationFee");
    const posterFile = formData.getAll("poster");
    const removedPhotos = JSON.parse(formData.get("removedPhotos") || "[]");

    console.log("📤 Received poster files:", posterFile);
    console.log("🗑️ To remove poster URLs:", removedPhotos);

    const event = await Event.findById(id);
    if (!event) {
      return NextResponse.json(
        { success: false, message: "Event not found" },
        { status: 404 }
      );
    }

    // ✅ Conditionally update fields
    if (title) event.title = title;
    if (description) event.description = description;
    if (prize) event.prize = prize;
    if (eventDateTimeString) event.eventDateTime = JSON.parse(eventDateTimeString);
    if (teamSizeString) event.teamSize = JSON.parse(teamSizeString);
    if (participationFeeString) event.participationFee = JSON.parse(participationFeeString);
    if (details) event.details = JSON.parse(details);

    // ✅ Remove any selected old photos from Cloudinary
    if (removedPhotos.length > 0) {
      for (const url of removedPhotos) {
        // Extract the public_id from the Cloudinary URL
        const match = url.match(/xihoron\/([^/.]+)/);
        if (!match) {
          console.log("⚠️ Skipping invalid Cloudinary URL:", url);
          continue;
        }

        const publicId = `xihoron/${match[1]}`;
        console.log("🧩 Extracted public_id:", publicId);

        // Delete from Cloudinary
        const result = await cloudinary.v2.uploader.destroy(publicId);
        if (result.result === "ok") {
          event.poster = event.poster.filter((p) => p.url !== url);
          console.log("✅ Deleted from Cloudinary:", publicId);
        } else {
          console.log("❌ Cloudinary deletion failed:", result);
        }
      }
    }

    // ✅ Upload new photos if provided
    if (posterFile && posterFile.length > 0 && posterFile[0].name !== "undefined") {
      for (const file of posterFile) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
        await writeFile(tempPath, buffer);

        const uploadResult = await cloudinary.v2.uploader.upload(tempPath, {
          folder: "xihoron",
        });

        event.poster.push({
          public_id: uploadResult.public_id,
          url: uploadResult.secure_url,
        });

        console.log("📸 Uploaded new poster:", uploadResult.public_id);
      }
    }

    await event.save();
   const eventCacheKey = "all_events";
    const candidateSummaryKey = "candidate_event_summary";
     const cacheKey = `event:${id}`;

    await Promise.all([
      redis.del(eventCacheKey),
      redis.del(candidateSummaryKey),
      redis.del(cacheKey),
    ]);

    console.log(`🧼 Deleted Redis cache keys: ${eventCacheKey}, ${candidateSummaryKey}`);

    return NextResponse.json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("🔥 Server Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
