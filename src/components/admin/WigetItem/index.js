"use client"
const WigetItem = ({ properties, value }) => {
  return (
    <div className="bg-gray-200 flex justify-center px-4 gap-6 items-center rounded-md  max-w-40 min-h-10 ">
      <p >{properties}</p>
      <strong className="text-green-400">{value}</strong>
    
    </div>
  );
};

export default WigetItem;
