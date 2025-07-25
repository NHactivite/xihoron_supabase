import { NextResponse } from "next/server";
import cloudinary from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import { tmpdir } from "os";
import { v4 as uuidv4 } from "uuid";
import ConnectDB from "@/database";
import { Product } from "@/model/product";
import { auth } from "@clerk/nextjs/server";

import { clerkClient } from "@clerk/clerk-sdk-node";
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

if (!process.env.CLOUD_NAME|| !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  throw new Error("Cloudinary environment variables are not set");
}


export async function POST(req) {
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
    const id = searchParams.get("id"); // Get the ID from query like /api/product?id=123

    if (!id) {
      return NextResponse.json({ success: false, message: "Product ID missing in query" }, { status: 400 });
    }

    const formData = await req.formData();
  
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const category = formData.get("category");
    const occasion = formData.get("occasion");
    const details = formData.get("details");
    const files = formData.getAll("photos");
    const removedPhotos = JSON.parse(formData.get("removedPhotos") || "[]"); // array of public_id

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
    }

    // Conditionally update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;
    if (occasion) product.occasion = occasion;
    if (details) product.details = JSON.parse(details);

    // Remove any selected old photos from Cloudinary
    if (removedPhotos.length > 0) {
  for (const url of removedPhotos) {
    const rePhoto = product.photos.filter((p) => p.url === url);
    const savePhoto = product.photos.filter((p) => p.url !== url);

    for (const i of rePhoto) {
      const result = await cloudinary.v2.uploader.destroy(i.public_id);
      if (result.result === "ok") {
        product.photos = savePhoto;
      } else {
        console.log("Cloudinary deletion failed:", result);
      }
    }
  }
}

    // Upload new photos if provided
    if (files && files.length > 0 && files[0].name !== "undefined") {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = path.join(tmpdir(), `${uuidv4()}-${file.name}`);
        await writeFile(tempPath, buffer);

        const result = await cloudinary.v2.uploader.upload(tempPath, {
          folder: "bouquets",
        });

        product.photos.push({
          public_id: result.public_id,
          url: result.secure_url,
        });
      }
    }

    await product.save();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}