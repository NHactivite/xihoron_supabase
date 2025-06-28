import React from 'react'
import { HiTrendingDown, HiTrendingUp } from "react-icons/hi"
const WigetItem = ({properties,users}) => {
   
  return (
   <div className='grid grid-cols-4 gap-6'>
      {
              properties.map((i,idx)=>(
                <div key={idx} className='bg-gray-200 min-h-36 rounded-md p-6 grid '>
                 <p>{i}</p>
                 <strong>{users.length}</strong>
                 {/* {
                  percent>0?<span className="green"><HiTrendingUp/> +{percent}%{" "}</span>:<span className="red"><HiTrendingDown/> {percent}%{" "}</span>
                } */}
                 <div className='text-green-400'><HiTrendingUp/> +{20}%{" "}</div>
                </div>
              ))
       }
   </div>
  )
}

export default WigetItem