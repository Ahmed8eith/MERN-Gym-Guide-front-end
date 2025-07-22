import React, { useState } from "react";
import { useParams } from "react-router-dom";
import workouts from "../components/workouts";

function Workout() {
  const { id } = useParams();
  const workout = workouts.find((w) => w.id === Number(id));
  const [showModal, setShowModal] = useState(false);

  if (!workout) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p className="text-2xl">Workout not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row items-start justify-start p-6">
      <div 
        onClick={() => setShowModal(true)}
        className="w-[300px] h-[250px] ml-2 overflow-hidden rounded-[50px] border-4 border-gray-300 flex items-center justify-center bg-white cursor-pointer hover:opacity-90 transition-opacity"
      >
        <img
          src={workout.imageUrl}
          alt={workout.title}
          className="w-[90%] h-[90%] object-contain"
        />
      </div>

      <div className="text-left md:w-[50%] flex flex-col px-6">
        <h2 className="text-4xl font-bold text-white">{workout.title}</h2>
        <span className="mt-2 text-white px-2 py-1 text-xs bg-red-500 rounded w-fit">
          {workout.muscleGroup}
        </span>
        <p className="text-gray-300 mt-4 text-lg">{workout.description}</p>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div className="relative w-[90%] max-w-[600px] md:max-w-[700px]">
            <img
              src={workout.imageUrl}
              alt={workout.title}
              className="w-full h-full object-contain scale-110 hover:scale-125 transition-transform duration-200"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(false);
              }}
              className="absolute bottom-2 right-2 text-white hover:text-gray-300 bg-red-500 hover:bg-red-600 rounded-full p-2 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workout;