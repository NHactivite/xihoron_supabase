import { getWish } from "@/action";
import WishCard from "@/components/wishCard";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const Wishlist = async () => {
  const user = await currentUser();
  const res = await getWish(user.id);
  const wishes = res?.wish || null;
  console.log(wishes, "kkkkkpppp");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 place-items-center sm:place-items-start md:place-items-stretch" >
      {wishes && wishes.length > 0 ? (
        wishes.map((i, idx) => <WishCard key={idx} productId={i.Product} />)
      ) : (
        <h1>No wishes</h1>
      )}
    </div>
  );
};

export default Wishlist;
