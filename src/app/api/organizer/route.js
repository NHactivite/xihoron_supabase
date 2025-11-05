import ConnectDB from "@/database";
import { Oganizer } from "@/model/organizer";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import { tmpdir } from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";

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
    const name = formData.get("name");
    const role = formData.get("role");
    
    const posterFile = formData.get("photo"); // This is a single File object

    // Basic validation
    if (!name ||  !role||!posterFile) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
     
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

    const newOrganizer = await Oganizer.create({
      name,
      role,
      photo:uploadedPoster
    });

    console.log("New event created successfully:", newOrganizer._id);

    return NextResponse.json(
      { success: true, message: "Event created successfully", Organizer: newOrganizer },
      { status: 201 } // 201 Created is more specific
    );

  } catch (error) {
   
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}


