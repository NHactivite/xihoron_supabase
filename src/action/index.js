"use server";

import ConnectDB from "@/database";
import { Product } from "@/model/product";
import { Review } from "@/model/review";
import { Wish } from "@/model/wish";

import { Order } from "@/model/order";
import { clerkClient } from "@clerk/express";
import { auth } from "@clerk/nextjs/server";
import { Cashfree, CFEnvironment } from "cashfree-pg";
import { NextResponse } from "next/server";


if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error("Cashfree credentials are missing in environment variables");
}
// Initialize Cashfree with your credentials


// const cashfree = new Cashfree(
//   CFEnvironment.SANDBOX,
//   process.env.CLIENT_ID,
//   process.env.CLIENT_SECRET
// );
const cashfree = new Cashfree(
  CFEnvironment.PRODUCTION,
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET
);
// crete profile action

export const createPaymentAction = async (data) => {
  const { user, cartItems ,phnNo} = data;
 
  const products = cartItems.map((item) => ({
    id: item.productId,
    quantity: item.quantity,
  }));

  const amounts = await Promise.all(
    products.map(async (i) => {
      const product = await Product.findById(i.id, "price");
      if (!product) throw new Error(`Product with ID ${i.id} not found`);
      return product.price * i.quantity;
    })
  );

  let finalAmount = amounts.reduce((acc, curr) => acc + curr, 0);

  // Parse shipping charges from env since they are strings by default
  const shippingLimit =  Number( process.env.NEXT_PUBLIC_SHIPPING_CHARGE_LIMIT );
  const shippingCharge =Number(process.env.NEXT_PUBLIC_SHIPPING_CHARGE);


  finalAmount = finalAmount > shippingLimit ? finalAmount : finalAmount + shippingCharge;

  // const request = {
  //   order_id: `order_${Date.now()}`,
  //   order_amount: finalAmount,
  //   order_currency: "INR",
  //   customer_details: {
  //     customer_id: user.userId,
  //     customer_phone: phnNo,
  //     customer_email: user.email,
  //     customer_name: `${user.firstName} ${user.lastName}`,
  //   },
  // };
const request = {
  order_id: `order_${Date.now()}`,
  order_amount: finalAmount,
  order_currency: "INR",
  customer_details: {
    customer_id: user.userId,
    customer_phone: phnNo,
    customer_email: user.email,
    customer_name: `${user.firstName} ${user.lastName}`,
  },
  cart_details: {
    cart_items: cartItems.map(item => ({
      item_name: item.name,
      sku: item.productId,
      quantity: item.quantity,
      amount: item.price,
    })),
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

export const paymentVerify = async (order_id) => {
  try {
    const response = await cashfree.PGOrderFetchPayments(order_id);
    return response.data; // Ensure data is returned
  } catch (error) {
    console.error("Error fetching payment:", error);
    throw error; // Re-throw the error to handle it upstream
  }
};

// payment end here-------------------------------------

export const createOrder = async (data) => {
  try {
    await ConnectDB();

    const { Address, cartItems, total, subtotal, userId, userName, orderId } =data;


    const shippingCharges = Number(process.env.SHIPPING_CHARGE) || 0;

    const newOrder = await Order.create({
      shippingInfo: {
        address: Address.address,
        city: Address.city,
        state: Address.state,
        country: Address.country,
        pinCode: Address.pinCode,
        phnNo: Address.phnNo,
      },
      userId,
      userName,
      orderId,
      subtotal,
      shippingCharges,
      total,
      orderItems: cartItems.map((item) => ({
        name: item.name,
        photos: item.photos, // If this is an array, use item.photos[0] or update schema
        price: item.price,
        quantity: item.quantity,
        productId: item._id,
      })),
    });
    for (const item of cartItems) {
   
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    return { success: true};
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSingleOrder = async (userid) => {
  try {
    await ConnectDB();
    const data = await Order.find({ userId: userid });
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Server Error",
      error: error.message,
    };
  }
};

export const getAllOrders = async () => {
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
    await ConnectDB();
    const data = await Order.find();
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Server Error",
      error: error.message,
    };
  }
};
export const getSpacificOrders = async (option) => {
  try {
    await ConnectDB();

    const data = await Order.find({ status: option });
    return {
      success: true,
      data,
    };
  } catch (error) {
    return {
      success: false,
      message: "Server Error",
      error: error.message,
    };
  }
};

export const updateStatus = async (data) => {
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
    await ConnectDB();

    const { newStatus, orderId } = data;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return {
        success: false,
        message: "Order not found",
      };
    }

    return {
      success: true,
      message: "Order status updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Server Error",
      error: error.message,
    };
  }
};

export const deleteProduct = async (productId) => {
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
    await Product.findByIdAndDelete(productId);
    return { success: true, message: "Product delete Successfully" };
  } catch (error) {
    return { success: false, message: "Product delete Successfully" };
  }
};

//...........................order action end

export const addReview = async (data) => {
  try {
    await ConnectDB();
    const { comment, rating, user, product } = data;

    const getProductById = await Product.findById(product);
   
    if (!getProductById) return { success: false, message: "Product not find" };

    if (!comment || !rating || !user) {
      throw new Error("Please fill all the fields");
    } else {
      const alreadyReviewed = await Review.findOne({ user, product });
     
      if (alreadyReviewed !== null) {
       
        alreadyReviewed.comment = comment;
        alreadyReviewed.rating = rating;
        await alreadyReviewed.save();
        return { success: true, message: "Review Updated" };
      } else {
        await Review.create(data);
      }

      let totalRating = 0;

      const reviews = await Review.find({ product });

      reviews.forEach((review) => {
        totalRating += review.rating;
      });

      const averageRating = Math.floor(totalRating / reviews.length) || 0;
      getProductById.rating = averageRating;
      getProductById.numOfReviews = reviews.length;
      await getProductById.save();

      return { success: true, message: "Review Added" };
    }
  } catch (error) {
    return {
      success: false,
      message: "Server Error",
      error: error.message,
    };
  }
};

export const getReview = async (productId) => {
  try {
    await ConnectDB();
    const reviews = await Review.find({ product: productId }).lean();
    const plainReviews = JSON.parse(JSON.stringify(reviews));
    return plainReviews;
  } catch (error) {
    console.error("Review fetch error", error);
    return [];
  }
};

export const deleteReview=async(id)=>{
  try {
     await ConnectDB();
 
    await Review.findByIdAndDelete(id)
 
     return {
      success: true,
      message: "Review remove successfully",
    };

  } catch (error) {
    return {
      success: true,
      message: "review not found",
    };
  }
}

export const getAllProduct = async () => {
  try {
    await ConnectDB();
    const products = await Product.find({});

    return NextResponse.json({ success: true, products });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
};

export const getProductCount = async () => {
  try {
    await ConnectDB();
    const count = await Product.countDocuments();
    return { success: true, count };
  } catch (error) {
    return { success: false, message: "Server Error", error: error.message };
  }
};

export const getProductById = async (id) => {
  try {
    await ConnectDB();
  
    const product = await Product.findById(id); // ✅ Use .lean() to return a plain JS object

    if (!product) {
      return { success: false, message: "Product not found" }; // ✅ return one object only
    }

    return { success: true, product };
  } catch (error) {
    return { success: false, message: "Server Error", error: error.message };
  }
};

export const wishHandle = async (productId, userId) => {
  await ConnectDB();
  
  const existingWish = await Wish.findOne({ Product: productId, user: userId });

  if (existingWish) {
    await existingWish.deleteOne();
    return {
      success: true,
      message: "Wish Remove",
    };
  }

  // If no existing wish, create a new one
   await Wish.create({
    wish: true,
    user: userId,
    Product: productId,
  });

  return { success: true, message: "Wish Added" };
};

export const getWish = async (userId) => {
  try {
    await ConnectDB();
    const wish = await Wish.find({ user: userId });

    return { success: true, wish: JSON.parse(JSON.stringify(wish)) };
  } catch (error) {
    return { success: false, message: "server error" };
  }
};

export const deleteWish = async (id) => {
  try {
    await ConnectDB();
    await Wish.findOneAndDelete({ Product: id });
    return {
      success: true,
      message: "Remove from wish List",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getSearchProducts = async (req) => {
  try {
    await ConnectDB();

    const { search, sort, category, minPrice, maxPrice, page = 1 ,occasion} = req;
  
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 10;
    const skip = (page - 1) * limit;

    let baseQuery = {};

    if (search) {
      baseQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { occasion: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      baseQuery.category = category;
    }
    if (occasion) {
      baseQuery.occasion = occasion;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      baseQuery.price = {};
      if (minPrice !== undefined) baseQuery.price.$gte = minPrice;
      if (maxPrice !== undefined) baseQuery.price.$lte = maxPrice;
    }

    const [productFetched, filterProduct] = await Promise.all([
      Product.find(baseQuery)
        .sort(sort ? { price: sort === "asc" ? 1 : -1 } : {})
        .limit(limit)
        .skip(skip)
        .lean(), // ✅ ADD THIS
      Product.find(baseQuery).lean(), // ✅ ADD THIS TOO
    ]);

    const totalPage = Math.ceil(filterProduct.length / limit);
    const products = productFetched.map((product) => ({
      ...product,
      _id: product._id.toString(), // ✅ serialize ObjectId
      userId: product.userId?.toString?.(), // ✅ if this is also an ObjectId
    }));

    return {
      success: true,
      products,
      totalPage,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getCategory = async () => {
  try {
    await ConnectDB();
    const categories = await Product.distinct("category");
    return { success: true, categories };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getOccasion = async () => {
  try {
    await ConnectDB();
    const occasions = await Product.distinct("occasion");
    return { success: true, occasions };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

// cashfreeee
