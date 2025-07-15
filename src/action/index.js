"use server";

import ConnectDB from "@/database";
import { Product } from "@/model/product";
import { Review } from "@/model/review";
import { Wish } from "@/model/wish";

import { NextResponse } from "next/server";
import { connect } from "react-redux";

export const addReview = async (data) => {
  try {
    console.log("hiiiiiiiiiiiiiiiiii");

    await ConnectDB();
    const { comment, rating, user, product } = data;

    const getProductById = await Product.findById(product);
    console.log("fiiiiiiiiii", getProductById);

    if (!getProductById) return { success: false, message: "Product not find" };

    if (!comment || !rating || !user) {
      throw new Error("Please fill all the fields");
    } else {
      console.log("data", data);

      const alreadyReviewed = await Review.findOne({ user, product });
      console.log("already", alreadyReviewed);

      if (alreadyReviewed !== null) {
        console.log("pooooooooooo");

        alreadyReviewed.comment = comment;
        alreadyReviewed.rating = rating;
        await alreadyReviewed.save();
        return { success: true, message: "Review Updated" };
      } else {
        console.log("koooooooooooo", data);
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

export const getAllProduct = async () => {
  try {
    await ConnectDB();
    const products = await Product.find({});
    console.log("ProductsAction", products);

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
    console.log("bbbb", id);

    const product = await Product.findById(id); // ✅ Use .lean() to return a plain JS object

    console.log("sddjjk", product);

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
  console.log("wish", productId, userId);

  const existingWish = await Wish.findOne({ Product: productId, user: userId });

  if (existingWish) {
    await existingWish.deleteOne();
    return {
      success: true,
      message: "Remove from wish List",
    };
  }

  // If no existing wish, create a new one
  const newWish = await Wish.create({
    wish: true,
    user: userId,
    Product: productId,
  });

  return { success: true, message: "Review Added" };
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
    await Wish.findOneAndDelete({Product:id});
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

    const {
      search,
      sort,
      category,
      minPrice,
      maxPrice,
      page = 1,
    } = req;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 1;
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

export const getCategory=async()=>{
  try {
    await ConnectDB();
    const categories=await Product.distinct("category");
    return{success:true,categories}
  } catch (error) {
    return{success:false,message:error.message}
  }

}
export const getOccasion=async()=>{
  try {
    await ConnectDB();
    const occasions=await Product.distinct("occasion");
    return{success:true,occasions}
  } catch (error) {
    return{success:false,message:error.message}
  }

}