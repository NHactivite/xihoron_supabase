"use server";

import ConnectDB from "@/database";
import { Oganizer } from "@/model/organizer";

import { Event } from "@/model/event";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { Candidate } from "@/model/candidate";
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/express";
import { v2 as cloudinary } from "cloudinary";

import { Ratelimit } from "@upstash/ratelimit";
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
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Cashfree credentials are missing in environment variables");
}
// Initialize Cashfree with your credentials

// let cashfree;

// process.env.RUN_MODE == "devlopment"
//   ? (cashfree = new Cashfree(
//       CFEnvironment.SANDBOX,
//       process.env.CLIENT_ID,
//       process.env.CLIENT_SECRET
//     ))
//   : (cashfree = new Cashfree(
//       CFEnvironment.PRODUCTION,
//       process.env.CLIENT_ID,
//       process.env.CLIENT_SECRET
//     ));

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
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
    order_amount: amounts,
    order_currency: "INR",
    customer_details: {
      customer_id: user.id,
      customer_phone: phnNo,
      customer_email: user.email,
      customer_name: `${user.firstName} ${user.lastName}`,
    },
    order_meta: {
      return_url: `https://xihoron.vercel.app/payment-verification?order_id=order_${order_id}`,
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

export const createOrder = async (data) => {
  try {
    await ConnectDB();

    const { Details, Event_details, amount, userId, userName, candidate_Id } =
      data;

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
      amount: amount,
      user_Id: userId,
      userName,
      candidate_Id,
    });
    const cacheKey = "candidate_event_summary";
    await redis.del(cacheKey);
    console.log(`🧼 Deleted Redis cache key: ${cacheKey}`);

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getEvents = async () => {
  try {
    await ConnectDB();

    const cacheKey = "all_events";

    // 🧠 Try fetching from Redis first
    const cachedEvents = await redis.get(cacheKey);
    if (cachedEvents) {
      console.log("📦 Fetched events from Redis cache");
      return { success: true, Event: cachedEvents };
    }

    // 🚀 If not found in cache, fetch from MongoDB
    const data = await Event.find({}).lean();
    if (!data || data.length === 0) {
      return { success: false, message: "No events found" };
    }

    const plainData = JSON.parse(JSON.stringify(data));

    // 💾 Store in Redis for 1 hour
    await redis.set(cacheKey, plainData, { ex: 3600 });
    console.log("🗃️ Stored events in Redis cache");

    return { success: true, Event: plainData };
  } catch (error) {
    console.error("❌ Error fetching events:", error);
    return { success: false, message: error.message };
  }
};

export const getOrganizer = async () => {
  try {
    await ConnectDB();

    const cacheKey = "all_organizers";

    // 🧠 Try fetching from Redis first
    const cachedOrganizers = await redis.get(cacheKey);
    if (cachedOrganizers) {
      console.log("✅ Fetched organizers from Redis cache");
      return { success: true, Organizer:  JSON.parse(JSON.stringify(cachedOrganizers)) };
    }

    // 🗃️ Fetch from MongoDB if not cached
    const data = await Oganizer.find({}).lean();

    if (!data || data.length === 0) {
      return { success: false, message: "No organizers found" };
    }

    // 🧾 Convert to plain data
    const plainData = JSON.parse(JSON.stringify(data));

    // 💾 Cache the data in Redis for 1 hour (3600 seconds)
    await redis.set(cacheKey, plainData, { ex: 3600 });
    console.log("📝 Stored organizers in Redis cache");

    return { success: true, Organizer: plainData };
  } catch (error) {
    console.error("❌ Error fetching organizers:", error);
    return { success: false, message: error.message };
  }
};

export const getEventsById = async (id) => {
  try {
    await ConnectDB();

    const cacheKey = `event:${id}`; // unique key per event

    // 🧠 Try fetching from Redis first
    const cachedEvent = await redis.get(cacheKey);
    if (cachedEvent) {
      console.log(`✅ Fetched event from Redis cache (Key: ${cacheKey})`);
      return { success: true, Event: JSON.parse(JSON.stringify(cachedEvent)) };
    }

    // ⚙️ If not found in cache, fetch from MongoDB
    const data = await Event.findById(id).lean();

    if (!data) {
      return { success: false, message: "Event not found" };
    }

    const plainData = JSON.parse(JSON.stringify(data));

    // 💾 Cache the event data for 1 hour (3600 seconds)
    await redis.set(cacheKey, plainData, { ex: 3600 });
    console.log(`📝 Cached event in Redis (Key: ${cacheKey})`);

    return { success: true, Event: plainData };
  } catch (error) {
    console.error("❌ Error fetching event by ID:", error);
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
    const organizer = await Oganizer.findById(Id);

    if (!organizer) {
      return { success: false, message: "Organizer not found" };
    }
    if (organizer.photo?.public_id) {
      try {
        const result = await cloudinary.uploader.destroy(
          organizer.photo.public_id
        );
        console.log(" Cloudy delete result:", result);
      } catch (err) {
        console.error("Cloudinary deletion failed:", err);
      }
    }
    await Oganizer.findByIdAndDelete(Id);
    const cacheKey = "all_organizers";
    await redis.del(cacheKey);
    console.log(`🧼 Deleted Redis cache key: ${cacheKey}`);

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
            console.log(
              `🗑️ Deleted Cloudinary image: ${poster.public_id}`,
              result
            );
          } catch (err) {
            console.error(
              `❌ Failed to delete image ${poster.public_id}:`,
              err
            );
          }
        }
      }
    }
    await Event.findByIdAndDelete(Id);
     const eventCacheKey = "all_events";
    const candidateSummaryKey = "candidate_event_summary";
     const cacheKey = `event:${Id}`;

    await Promise.all([
      redis.del(eventCacheKey),
      redis.del(candidateSummaryKey),
      redis.del(cacheKey)
    ]);

    console.log(`🧼 Deleted Redis cache keys: ${eventCacheKey}, ${candidateSummaryKey}`);

    return { success: true, message: "Oganizer delete Successfully" };
  } catch (error) {
    return { success: false, message: "Oganizer delete Successfully" };
  }
};

export const getCandidates = async () => {
  try {
    await ConnectDB();

    const cacheKey = "candidate_event_summary";

    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log("Fetched summary from Redis cache");
      return { success: true, eventsSummary: cached };
    }

    const data = await Candidate.find().lean();
    if (!data || data.length === 0) {
      return { success: false, message: "No candidates found" };
    }

    const eventCountMap = {};

    data.forEach((item) => {
      const eventName = item.Event?.name || "Unknown Event";
      eventCountMap[eventName] = (eventCountMap[eventName] || 0) + 1;
    });

    const eventsSummary = Object.entries(eventCountMap).map(
      ([eventName, count]) => ({
        eventName,
        totalCandidates: count,
      })
    );

    await redis.set(cacheKey, eventsSummary, { ex: 3600 });
    console.log(" Stored summary in Redis cache");

    return { success: true, eventsSummary };
  } catch (error) {
    console.error(" Error fetching candidates summary:", error);
    return { success: false, message: error.message };
  }
};

export const getCandidateById = async (id) => {
  try {
    await ConnectDB();
    const data = await Candidate.find({ user_Id: id }).lean();
    const plainData = JSON.parse(JSON.stringify(data));
    return { success: true, Candidate: plainData };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const verifyCandidateById = async (id) => {
  try {
    await ConnectDB();

    const candidateId =
      typeof id === "object" && id.candidate_Id ? id.candidate_Id : String(id);

    const cacheKey = `candidate:${candidateId}`;

    const cachedCandidate = await redis.get(cacheKey);
    if (cachedCandidate) {
      console.log(` Candidate fetched from Redis cache (Key: ${cacheKey})`);
      return { success: true, verifyData: JSON.parse(JSON.stringify(cachedCandidate)) };
    }
    console.log(` Candidate not found in Redis (Key: ${cacheKey}), checking MongoDB...`);
    const candidateFromDB = await Candidate.findOne({
      candidate_Id: candidateId,
    }).lean();

    if (candidateFromDB) {
      const dataToCache = JSON.stringify(candidateFromDB);
      
      console.log(` Candidate found in MongoDB — Caching with key: [${cacheKey}]`);
      console.log(`CACHE DATA SIZE: ${dataToCache.length} bytes`);

      if (dataToCache.length > 1000000) {
        return { success: true, verifyData:JSON.parse(JSON.stringify(candidateFromDB))  };
      }

      try {
       
const setResult = await redis.set(cacheKey, dataToCache, { ex: 3600 });
        console.log(` SET command result (should be 'OK'): ${setResult}`);
      } catch (redisError) {
        console.error(" ERROR during Redis SET command:", redisError);
      }

      return {
        success: true,
        verifyData: JSON.parse(JSON.stringify(candidateFromDB)),
      };
    }
    console.log(" Candidate not found anywhere");
    return { success: false, message: "Candidate not found" };
  } catch (error) {
    console.error(" Error verifying candidate:", error);
    return { success: false, message: error.message };
  }
};