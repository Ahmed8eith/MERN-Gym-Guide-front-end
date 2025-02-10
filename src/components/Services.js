import axios from "axios";

const API_URL ='https://mern-gym-guide-backend-production.up.railway.app/api/routines'

export const createRoutine= async(routineData)=>{
    try {
        const token=localStorage.getItem('token')
        const response= await axios.post(`${API_URL}/user-routine`, routineData,{
            headers:{
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        return response.data
    } catch (error) {
        throw error.response?.data || {message: 'Failed to create routine'}
    }
}

export const getUserRoutines= async()=>{
    try {
        const token=localStorage.getItem('token')
        const response = await axios.get(`${API_URL}/user-routine`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response?.data || {message: 'failed to fetch routines'}
    }
}

export const deleteRoutine=async(routineId)=>{
    try {
        const token = localStorage.getItem('token')
        const response=await axios.delete(`${API_URL}/user-routine/${routineId}`,{
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
        return response.data
    } catch (error) {
        throw error.response?.data || {message:'Failed to delete routine'}
    }
}

export const updateRoutine= async(routineId, routineData)=>{
    try {
        const token = localStorage.getItem('token')
        const response=await axios.put(`${API_URL}/user-routine/${routineId}`,routineData,{
            headers:{
                'Authorization': `Bearer ${token}`,
                "Content-Type" : 'application/json'
            }
        })
        return response.data
    } catch (error) {
        throw error.response?.data || {message:'Failed to update routine'}
    }
}