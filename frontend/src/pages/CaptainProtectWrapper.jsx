import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CaptainDataContext } from '../context/CaptainContext'
import axios from 'axios';

const CaptainProtectWrapper = ({children}) => {

    const token=localStorage.getItem('token');
    const navigate=useNavigate();
    const {captain,setCaptain}=useContext(CaptainDataContext);
    const [isLoading,setIsLoading]=useState(true);

    useEffect(()=>{
        if(!token){
            navigate("/captain-login");
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }).then(response=>{
            setCaptain(response.data.captain);
            setIsLoading(false);    

        }).catch(error=>{
            console.error("Error fetching captain profile:", error);
            console.error("Status:", error.response?.status);
            console.error("Message:", error.response?.data?.message);
            setIsLoading(false);
            localStorage.removeItem('token');
            navigate('/captain-login');
        });
    },[token]);
 

    if(isLoading){
        return <div>Loading...</div>
    }
  return (
    <>
    {children}
    </>
  )
}

export default CaptainProtectWrapper

