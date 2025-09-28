"use client"

import { useState } from "react";

const weightOptions = ['100g', '200g', '500g', '1kg'];

const WeightSelector = () => {
 
  const [selectedWeights, setSelectedWeights] = useState([]);

  const handleCheckboxChange = (weight) => {
    if (selectedWeights.includes(weight)) {
      setSelectedWeights(selectedWeights.filter(item => item !== weight));
    } else {
      setSelectedWeights([...selectedWeights, weight]);
    }
  }

  return (
    <div className="bg-green-300 p-6 rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-green-900 mb-4">Select Weight</h3>
      
      <div className="flex flex-wrap gap-4">
        {weightOptions.map((weight) => (
          <div key={weight} className="flex items-center">
            <input
              type="checkbox"
              id={`weight-${weight}`} 
              value={weight}
              
              checked={selectedWeights.includes(weight)}
             
              onChange={() => handleCheckboxChange(weight)}
              className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label
              htmlFor={`weight-${weight}`}
              className="ml-2 text-md font-medium text-green-800"
            >
              {weight}
            </label>
          </div>
        ))}
      </div>

      {/* This part is just for demonstration, so you can see the state updating in real-time */}
      <div className="mt-6 p-3 bg-green-100 rounded">
        <p className="text-sm font-medium text-green-800">Current State:</p>
        <p className="text-md font-mono text-green-900">
          {JSON.stringify(selectedWeights)}
        </p>
      </div>
    </div>
  )
}

export default WeightSelector