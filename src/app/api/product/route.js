import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import ConnectDB from "@/database";
import { Product } from "@/model/product";

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

if (!process.env.CLOUD_NAME|| !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Cloudinary environment variables are not set");
}


export async function POST(req) {
    try{
  await ConnectDB();
  
  const formData = await req.formData();
  console.log("formData:", formData);
  
  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const stock = formData.get("stock");
  const category = formData.get("category");
  const occasion = formData.get("occasion");
  const files = formData.getAll("photos");
  const details=formData.get("details")
   console.log("oojjjjjjo",details);
   
  if (!name || !description || !price || !stock || !category || !occasion ||!details) {
    return NextResponse.json({ success: false, message: "All fields required" }, { status: 400 });
  }

  if (!files || files.length === 0) {
    return NextResponse.json({ success: false, message: "No files uploaded" }, { status: 400 });
  }

  const uploadedPhotos = [];

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
    await writeFile(tempPath, buffer);

    const result = await cloudinary.v2.uploader.upload(tempPath, {
      folder: "bouquets",
    });

    uploadedPhotos.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  const parse = JSON.parse(details);
  const parsedDetails={...parse}
console.log("Final Insert Payload:", {
  name,
  details: parsedDetails,
  type: typeof parsedDetails,
});

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    occasion,
    details:parsedDetails,
    photos: uploadedPhotos,
  });

    return NextResponse.json({ success: true, message: "Product created", product });
} catch (error) {
    console.error("Server Error:", error);

    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
