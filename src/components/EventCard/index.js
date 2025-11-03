import React from "react";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";

const EventCard = ({ title, description, id, poster }) => {
  console.log(id, "card");

  return (
    <div
      className="relative transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] rounded-xl overflow-hidden bg-cover bg-center h-60"
      style={{
        backgroundImage: `url(${poster})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center text-white p-4">
        <h1 className="text-lg font-semibold">{title}</h1>
        <CardContent className="max-h-36 overflow-hidden text-sm text-gray-200 text-center mt-2">
          <p>{description}</p>
        </CardContent>
        <Link
          href={`/events/${id}`}
          className="bg-pink-600 hover:bg-pink-700 p-2 px-4 rounded-md mt-3"
        >
          Explore Now
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
