import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import workouts from "../components/workouts";
import { createRoutine, deleteRoutine, getUserRoutines, updateRoutine } from "../components/Services";
import { toast } from 'sonner';

function Profile() {
  const [userRoutines, setUserRoutines] = useState([]);
  const [username, setUsername] = useState("");
  const [form, setForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableWorkouts, setAvailableWorkouts] = useState(workouts);
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [routineTitle, setRoutineTitle] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Create routine
  const handleCreateroutine = async () => {
    if (!routineTitle || selectedWorkouts.length === 0) {
      toast.error('Please add a title and select at least 1 workout', {
        style: { background: "#222", color: "#fff" },
      });
      return;
    }
    try {
      const routineData = {
        title: routineTitle,
        workouts: selectedWorkouts.map(workout => ({
          workoutId: workout.id
        }))
      };

      await createRoutine(routineData);
      toast.success('Routine created successfully!', {
        style: { background: "#222", color: "#fff" },
      });
      resetForm();
      fetchRoutines();
    } catch (error) {
      console.error("Failed to create routine: ", error);
      toast.error(error.message || "Failed to create routine", {
        style: { background: "#222", color: "#fff" },
      });
    }
  };

  // Edit routine
  const handleEditRoutine = (routine) => {
    setEditMode(true);
    setEditingRoutine(routine);
    setRoutineTitle(routine.title);
    const selectedWorkoutObjects = routine.workouts.map(w => {
      const workoutDetails = workouts.find(workout => workout.id === Number(w.workoutId));
      return workoutDetails;
    }).filter(w => w);
    
    setSelectedWorkouts(selectedWorkoutObjects);
    const remainingWorkouts = workouts.filter(w => 
      !selectedWorkoutObjects.some(sw => sw.id === w.id)
    );
    setAvailableWorkouts(remainingWorkouts);
    setForm(true);
  };

  // Update routine
  const handleUpdateRoutine = async () => {
    if (!routineTitle || selectedWorkouts.length === 0) {
      toast.error('Please add a title and select at least 1 workout', {
        style: { background: "#222", color: "#fff" },
      });
      return;
    }

    try {
      const routineData = {
        title: routineTitle,
        workouts: selectedWorkouts.map(workout => ({
          workoutId: workout.id
        }))
      };

      await updateRoutine(editingRoutine._id, routineData);
      toast.success('Routine updated successfully!', {
        style: { background: "#222", color: "#fff" },
      });
      resetForm();
      fetchRoutines();
    } catch (error) {
      console.error("Failed to update routine: ", error);
      toast.error(error.message || "Failed to update routine", {
        style: { background: "#222", color: "#fff" },
      });
    }
  }; 
  // Get routines
  const fetchRoutines = async () => {
    try {
      const routines = await getUserRoutines();
      setUserRoutines(routines);
    } catch (error) {
      console.error("Error fetching routines:", error);
      toast.error("Failed to fetch routines", {
        style: { background: "#222", color: "#fff" },
      });
    }
  };

  // Delete routine
  const handleDeleteRoutine = async (routineId) => {
    try {
      await deleteRoutine(routineId);
      toast.success('Routine deleted successfully!', {
        style: { background: "#222", color: "#fff" },
      });
      fetchRoutines();
    } catch (error) {
      console.error("Failed to delete routine:", error);
      toast.error(error.message || "Failed to delete routine", {
        style: { background: "#222", color: "#fff" },
      });
    }
  };

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`https://mern-gym-guide-backend-production.up.railway.app/api/routines/username/${userId}`);
        setUsername(response.data.username);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    fetchUsername();
    fetchRoutines();
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const selectWorkout = (workout) => {
    setAvailableWorkouts(availableWorkouts.filter((w) => w.id !== workout.id));
    setSelectedWorkouts([...selectedWorkouts, workout]);
  };

  const removeWorkout = (workout) => {
    setSelectedWorkouts(selectedWorkouts.filter((w) => w.id !== workout.id));
    setAvailableWorkouts([...availableWorkouts, workout]);
  };

  const resetForm = () => {
    setForm(false);
    setSearchQuery("");
    setRoutineTitle("");
    setSelectedWorkouts([]);
    setAvailableWorkouts(workouts);
    setEditMode(false);
    setEditingRoutine(null);
  };

  const filteredWorkouts = availableWorkouts.filter(workout =>
    workout.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative max-w-4xl w-2/3 md:w-4/6 lg:2/3 px-2 sm:px-3 lg:px-8">
      <div className="space-y-4 text-center">
        <h1 className="text-white text-3xl sm:text-4xl font-bold">Welcome, {username || "User"}!</h1>
        <h1 className="text-white text-2xl sm:text-3xl">Your Routines</h1>
        {userRoutines.length === 0 ? (
          <p className="text-gray-400 text-base sm:text-lg mt-4 sm:mt-8">You haven't created any routines yet, create now!</p>
        ) : (
          <div className="mt-8 grid max-w-3xl grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
            {userRoutines.map((routine) => (
              <div
                key={routine._id}
                className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-white">{routine.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditRoutine(routine)}
                      className="text-blue-400 hover:text-blue-300 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 cursor-pointer w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteRoutine(routine._id)}
                      className="text-red-400 cursor-pointer hover:text-red-300 p-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {routine.workouts.map((workout, index) => {
                    const workoutDetails = workouts.find(w => w.id === Number(workout.workoutId));
                    return (
                      <div
                        key={index}
                        className="bg-gray-700 p-2 sm:p-3 rounded-md flex items-center justify-between"
                      >
                        <span className="text-white text-sm">
                          {workoutDetails ? workoutDetails.title : 'Workout not found'}
                        </span>
                        {workoutDetails && (
                          <button
                            onClick={() => navigate(`/workout/${workoutDetails.id}`)}
                            className="btn btn-ghost btn-sm text-xs sm:text-sm hover:text-black text-white px-2 py-1 rounded-full transition"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={() => setForm(true)}
          className="mt-6 px-4 sm:px-6 py-2 sm:py-3 bg-gray-800 text-white font-semibold rounded-lg transition hover:bg-gray-700"
        >
          Create Routine
        </button>
      </div>

      {/* Modal for Creating/Editing a Routine */}
      {form && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm p-1 sm:p-4">
          <div className="w-[98%] sm:w-[85%] md:w-[75%] max-w-2xl h-[90vh] sm:h-[85vh] md:h-[36rem] bg-gray-900 text-white rounded-lg sm:rounded-xl shadow-lg">
            <div className="h-full flex flex-col">
              <div className="p-2 sm:p-6 md:p-8 pb-1 sm:pb-4">
                <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-center mb-2 sm:mb-4 md:mb-6">
                  {editMode ? 'Edit Routine' : 'Create Routine'}
                </h2>
                <div className="mb-2 sm:mb-4">
                  <label className="block text-gray-400 text-xs sm:text-sm mb-1 sm:mb-2">Title</label>
                  <input
                    type="text"
                    value={routineTitle}
                    onChange={(e) => setRoutineTitle(e.target.value)}
                    className="w-full p-1.5 sm:p-3 text-xs sm:text-base bg-gray-800 text-white border border-gray-600 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto px-2 sm:px-6 md:px-8">
                {selectedWorkouts.length > 0 && (
                  <div className="mb-3 sm:mb-6">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-300 mb-1.5 sm:mb-3">Selected Workouts:</h3>
                    <div className="bg-gray-800 p-1.5 sm:p-3 rounded-md sm:rounded-lg">
                      {selectedWorkouts.map((workout) => (
                        <div
                          key={workout.id}
                          className="flex justify-between items-center bg-gray-700 p-1.5 sm:p-3 rounded-md sm:rounded-lg mb-1.5 sm:mb-2"
                        >
                          <span className="text-white text-xs sm:text-base font-medium">{workout.title}</span>
                          <div className="flex gap-2 items-center">
                            <button
                              type="button"
                              onClick={() => navigate(`/workout/${workout.id}`)}
                              className="btn btn-ghost hover:text-black text-white px-1.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full transition"
                            >
                              Details
                            </button>
                            <button
                              type="button"
                              onClick={() => removeWorkout(workout)}
                              className="btn btn-ghost hover:text-black text-white px-1.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full transition"
                            >
                              remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mb-3 sm:mb-6">
                  <div className="bg-gray-900 pt-1.5 sm:pt-2 pb-2 sm:pb-3 sticky top-0">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-300 mb-1.5 sm:mb-3">Available Workouts:</h3>
                    <input
                      type="text"
                      placeholder="Search workouts..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full p-1.5 sm:p-3 text-xs sm:text-base bg-gray-800 text-white border border-gray-600 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-1.5 sm:mb-3"
                    />
                  </div>
                  <div className="bg-gray-800 p-1.5 sm:p-3 rounded-md sm:rounded-lg">
                    {filteredWorkouts.map((workout) => (
                      <div
                        key={workout.id}
                        className="flex justify-between items-center bg-gray-700 p-1.5 sm:p-3 rounded-md sm:rounded-lg mb-1.5 sm:mb-2"
                      >
                        <span className="text-white text-xs sm:text-base font-medium">{workout.title}</span>
                        <div className="flex gap-2 items-center">
                          <button
                            type="button"
                            onClick={() => navigate(`/workout/${workout.id}`)}
                            className="btn btn-ghost hover:text-black text-white px-1.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full transition"
                          >
                            Details
                          </button>
                          <button
                            type="button"
                            onClick={() => selectWorkout(workout)}
                            className="btn btn-ghost hover:text-black text-white px-1.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm rounded-full transition"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-2 sm:p-6 md:p-8 pt-1.5 sm:pt-4 border-t border-gray-700 bg-gray-900">
                <div className="flex justify-between pb-12 sm:pb-0">
                  <button
                    onClick={editMode ? handleUpdateRoutine : handleCreateroutine}
                    type="button"
                    className="px-2 sm:px-4 md:px-6 py-1 sm:py-2 md:py-3 text-xs sm:text-base bg-blue-600 text-white font-semibold rounded-md sm:rounded-lg hover:bg-blue-500 transition"
                  >
                    {editMode ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-error h-6 sm:h-10 md:h-12 w-12 sm:w-16 md:w-20 text-xs sm:text-base rounded-md sm:rounded-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={handleLogout}
        className="btn btn-error fixed bottom-4 right-4 z-10"
      >
        Logout
      </button>
    </div>
  );
}

export default Profile;