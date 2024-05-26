"use client"
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ApiResponse } from '@/response/apiResponse';
import toast from 'react-hot-toast';
import Loader from '@/app/components/Loader';

interface User {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  accountCreatedAt: string;
  isVerified: boolean;
  _id: string;
}

export default function displayOneUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const getData = async () => {
    setLoading(true) 
    try {
      const response = await axios.get(`/api/one-user?id=${params.id}`)
      setUser(response.data.user)
    } catch (error) {
      const axiosError =error as AxiosError<ApiResponse>
      if(axiosError.response){
        const status = axiosError.response.status
        switch(status){
          case 400:
            toast.error("User not found")
            break
          case 500:
            toast.error("ERR_CONNECTION_TIMED_OUT")
        }
      }
    } finally{
      setLoading(false)
    }
  }
  console.log(user)

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className='wrapper'>
      <div className="user-container">
        <div className="user-box">
          <div className="user-header">
            <h2>{user?.firstName} {user?.lastName}</h2>
            <p>@{user?.username}</p>
            <p className="user-email"><span>Contact:</span> {user?.email}</p>
            <span className={`user-verify-capsule ${user?.isVerified == true? "verified": "unverified"}`}>{user?.isVerified == true? "Verified": "Unverified"}</span>   
          </div>
        </div>
      </div>
      {loading == true? <Loader/>:""}
    </div>
  )
}


