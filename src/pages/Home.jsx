import React, { useState } from "react";
import workouts from "../components/workouts";
import { useNavigate } from "react-router-dom";

function Home() {
  const [selectedMuscle, setSelectedMuscle] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  

  const filteredWorkouts = workouts
    .filter((workout) =>
      selectedMuscle ? workout.muscleGroup === selectedMuscle : true
    )
    .filter((workout) =>
      workout.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="p-6 flex relative z-0">
        <div className="w-full lg:w-2/3 md:w-4/5">
          <div className="mt-4 ml-4 flex flex-col space-y-2">
            <span className="text-white text-lg">Search for a workout</span>
            <input
              className="input text-1xl md:text-2xl lg:text-3xl w-full lg:w-2/3 md:w-4/5 h-10 md:h-12 lg:h-14 p-2 rounded-md bg-gray-900 text-white border border-gray-700"
              placeholder="Search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout) => (
                <div
                  onClick={() => navigate(`/workout/${workout.id}`)}
                  key={workout.id}
                  className="bg-white/10 p-3 md:p-4 rounded-lg shadow-lg text-white border border-gray-700
                   transform transition-transform duration-200 hover:scale-105 cursor-pointer backdrop-blur-md"
                >
                  <h2 className="text-lg md:text-xl font-bold">{workout.title}</h2>
                  <p className="text-sm md:text-base text-gray-300 mt-2">{workout.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 mt-4">No workouts found</p>
            )}
          </div>
        </div>
  
        {/* Filter button - made responsive */}
        {!showFilter && (
          <div className="fixed right-2 md:right-4 top-20 md:top-24 z-40">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="btn btn-ghost text-white text-sm md:text-base lg:text-lg flex items-center space-x-1 md:space-x-2 hover:text-black transition-colors duration-100 p-1 md:p-2"
            >
              <span>Filter</span>
              <span
                className={`transform transition-transform duration-100 ${
                  showFilter ? "rotate-90" : ""
                }`}
              >
                →
              </span>
            </button>
          </div>
        )}
  
        {/* Filter sidebar - made responsive */}
        <div
          className={`fixed top-0 right-0 h-full w-48 md:w-56 lg:w-64 bg-gray-900 text-white shadow-lg transition-transform duration-300 z-50 ${
            showFilter ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="pt-16 md:pt-20 px-4 md:px-6 pb-6">
            <h3 className="text-lg md:text-xl font-bold mb-4">Filter by Muscle</h3>
            <div className="flex flex-col space-y-3">
              {["Chest", "Back", "Shoulders", "Arms", "Legs"].map((muscle) => (
                <label key={muscle} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="muscle-filter"
                    value={muscle}
                    checked={selectedMuscle === muscle}
                    onChange={() => setSelectedMuscle(muscle)}
                    className="form-radio text-red-500"
                  />
                  <span className="text-sm md:text-base">{muscle}</span>
                </label>
              ))}
              <button
                onClick={() => setSelectedMuscle("")}
                className="mt-4 btn btn-ghost text-xs md:text-sm text-red-400 hover:text-red-300"
              >
                Clear
              </button>
              <button
                className="btn btn-ghost mt-2 text-sm md:text-base"
                onClick={() => setShowFilter(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );  }

  export default Home