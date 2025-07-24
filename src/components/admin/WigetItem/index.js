"use client"
import React from "react";
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi";
const WigetItem = ({ properties, value }) => {
  return (
    <div className="bg-gray-200 min-h-36 rounded-md p-6 grid ">
      <p >{properties}</p>
      <strong className="text-green-400">{value}</strong>
      {/* {
                  percent>0?<span className="green"><HiTrendingUp/> +{percent}%{" "}</span>:<span className="red"><HiTrendingDown/> {percent}%{" "}</span>
                } */}
    
    </div>
  );
};

export default WigetItem;
