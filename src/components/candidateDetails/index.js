"use client"
import { useEffect } from 'react';
const CandidateDetails = ({candidate}) => {
 
  return (
    <div className='mt-5'>
        <div>
            <span className="ml-10 font-bold">Total Events: {Array.isArray(candidate?.eventsSummary) ? candidate?.eventsSummary?.length:"No Event Created"}</span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 px-6 mt-5">
            {Array.isArray(candidate?.eventsSummary) ? candidate?.eventsSummary.map((i, idx) => (
                <div
                  key={idx}
                  className="bg-amber-100 flex flex-col items-center p-4 rounded-xl shadow"

                >
                  <div className="text-center mt-1">
                    <h1 className="text-xl font-semibold text-gray-800">
                      {i.eventName}
                    </h1>
                    <span className="text-sm text-gray-600"><em>TotalCandidates: </em><span className='font-bold text-lg'>{i.totalCandidates}</span></span>
                  </div>
                </div>
              )):null
              }
        </div>
     
    </div>
  )
}

export default CandidateDetails