"use server";

import ConnectDB from "@/database";
import { Oganizer, Product } from "@/model/organizer";

import { Event } from "@/model/event";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { Candidate } from "@/model/candidate";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";

// ✅ Cloudinary configuration (if not set globally)
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Cashfree credentials are missing in environment variables");
}
// Initialize Cashfree with your credentials

let cashfree;

process.env.RUN_MODE == "deployment"
  ? (cashfree = new Cashfree(
      CFEnvironment.SANDBOX,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    ))
  : (cashfree = new Cashfree(
      CFEnvironment.PRODUCTION,
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET
    ));

// const cashfree = new Cashfree(
//   CFEnvironment.PRODUCTION,
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET
// );
// crete profile action

export const createPaymentAction = async (data) => {
 const { event, user, phnNo } = data;
 
  const id = event.Event._id; 

  const eventDoc = await Event.findById(id, "participationFee");

  if (!eventDoc) {
    throw new Error("Event not found");
  }

  const amounts = eventDoc.participationFee?.perTeam;


  const order_id = Date.now();
  const request = {
    order_id: `order_${order_id}`,
    order_amount:amounts,
    order_currency: "INR",
    customer_details: {
      customer_id: user.id,
      customer_phone: phnNo,
      customer_email: user.email,
      customer_name: `${user.firstName} ${user.lastName}`,
    },
    order_meta: {
      return_url: `http://localhost:3000/payment-verification?order_id=order_${order_id}`,
    },
    Event_details: {
        event_name: event.Event.name,
        event_id: id,
        Event_fee: amounts,
      
    },
  };
  try {
    const response = await cashfree.PGCreateOrder(request);

    return response.data;
  } catch (error) {
    console.error(
      "Error creating Cashfree order:",
      error?.response?.data || error
    );
    throw error;
  }
};

export const paymentVerify = async ({
  order_id,
  Details,
 Event_details,
  user,
}) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(order_id);

    if (response.data && response.data[0].payment_status === "SUCCESS") {
      const res = await createOrder({
        Details,
        Event_details,
        amount: response.data[0].payment_amount,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        candidate_Id: response.data[0].order_id,
      });

      if (res.success) {
        return { success: true, msg: "Payment successful!" };
      } else {
        return { success: false, msg: "Payment failed" };
      }
    }
    // Ensure data is returned
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error; // Re-throw the error to handle it upstream
  }
};

// payment end here-------------------------------------
export const createOrder = async (data) => {
  try {
    await ConnectDB();
  
    const { Details,Event_details,amount,userId,userName,candidate_Id } =data;

     await Candidate.create({
      details: {
        name: Details.name,
        emailId: Details.emailId,
        phoNo: Details.phnNo,
      },
      Event: {
        name: Event_details.name,
        id: Event_details.Event_id,
      },
      amount:amount,
      user_Id:userId,
      userName,
      candidate_Id
    });
    return { success: true };
  } catch (error) {
   
    return { success: false, error: error.message };
  }
};


export const getEvents= async () => {
  try {
    await ConnectDB();
    const data= await Event.find({}).lean();
    const plainData = JSON.parse(JSON.stringify(data));
    return { success: true, Event:plainData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getOrganizer= async () => {
  try {
    await ConnectDB();
    const data= await Oganizer.find({}).lean();
    const plainData = JSON.parse(JSON.stringify(data));
    return { success: true, Organizer:plainData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getEventsById= async (id) => {
 
  try {
    await ConnectDB();
    const data= await Event.findById(id).lean();
    const plainData = JSON.parse(JSON.stringify(data));
    return { success: true, Event:plainData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getCandidateById= async (id) => {
  
  try {
    await ConnectDB();
    const data= await Candidate.find({user_Id:id}).lean();
    const plainData = JSON.parse(JSON.stringify(data));
    return { success: true, Candidate:plainData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteOrganizer = async (Id) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "Unauthorized: Please login" };
  }

  const user = await clerkClient.users.getUser(userId);

  const role = user.publicMetadata?.role;

  if (role !== "admin") {
    return { success: false, message: "Forbidden: Admin access only" };
  }
  try {
   const organizer= await Oganizer.findById(Id);

    if (!organizer) {
      return { success: false, message: "Organizer not found" };
    }
    if (organizer.photo?.public_id) {
      try {
        const result = await cloudinary.uploader.destroy(organizer.photo.public_id);
        console.log(" Cloudy delete result:", result);
      } catch (err) {
        console.error("Cloudinary deletion failed:", err);
      }
    }
     await Oganizer.findByIdAndDelete(Id);
    return { success: true, message: "Oganizer delete Successfully" };
  } catch (error) {
    return { success: false, message: "Oganizer delete Successfully" };
  }
};
export const deleteEvent = async (Id) => {
  const { userId } = await auth();
  if (!userId) {
    return { success: false, message: "Unauthorized: Please login" };
  }

  const user = await clerkClient.users.getUser(userId);

  const role = user.publicMetadata?.role;

  if (role !== "admin") {
    return { success: false, message: "Forbidden: Admin access only" };
  }
  try {
   const event = await Event.findById(Id);

    if (!event) {
      return { success: false, message: "Organizer not found" };
    }
     if (Array.isArray(event.poster) && event.poster.length > 0) {
      for (const poster of event.poster) {
        if (poster.public_id) {
          try {
            const result = await cloudinary.uploader.destroy(poster.public_id);
            console.log(`🗑️ Deleted Cloudinary image: ${poster.public_id}`, result);
          } catch (err) {
            console.error(`❌ Failed to delete image ${poster.public_id}:`, err);
          }
        }
      }
    }
     await Event.findByIdAndDelete(Id);
    return { success: true, message: "Oganizer delete Successfully" };
  } catch (error) {
    return { success: false, message: "Oganizer delete Successfully" };
  }
};

