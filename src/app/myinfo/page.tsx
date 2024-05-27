"use client"
import React, { cache, useEffect, useRef, useState } from 'react'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import Loader from '../components/Loader'
import { ApiResponse } from '@/response/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { passwordSchema } from '@/zod-schemas/password-schema'

interface User {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  accountCreatedAt: string;
  _id: string
}

export default function myInfo() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null);
  const [isFetchingData, setIsFetchingData] = useState(false)
  const [popup, setPopup] = useState(false)
  const [deletePopUp, setDeletePopup] = useState(false)
  const [error, setError] = useState(false)
  const [verifyPassPop, setVerifyPassPop] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: ""
    }
  })

  const adminData = async () => {
    try {
      setIsFetchingData(true)
      const response = await axios.get('/api/my-info')
      setUser(response.data.data)
      setError(false)
    } catch (error) {
      setError(true)
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response) {
        toast.error("Session expired")
        router.push("/login")
      }
    } finally {
      setIsFetchingData(false)
    }
  }
  useEffect(() => {
    adminData()
  }, [])

  const logOut = async () => {
    setIsFetchingData(true)
    try {
      await axios.post("/api/logout", {
        useremail: user?.email
      })
      router.push("/login")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsFetchingData(false)
    }
  }

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    try {
      setIsFetchingData(true)
      await axios.post("/api/check-password", {
        email: user?.email,
        password: data.password,
        cache: "no-cache"
      })
      setDeletePopup(true)
      setVerifyPassPop(false)
    } catch (error) {
      setDeletePopup(false)
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response) {
        const status = axiosError.response.status
        switch (status) {
          case 400:
            toast.error("Invalid credentials")
            break
          case 500:
            toast.error("Server is under maintainance. Please try again later")
            break
          case 429:
            toast.error("Too many requests. Please try again after 1 minute")
            break
          default:
            toast.error(axiosError.response.data.message ?? "Something went wrong");
        }
      } else {
        toast.error("ERR_CONNECTION_TIMED_OUT")
      }
    } finally {
      setIsFetchingData(false)
    }
  }

  const deleteUser = async () => {
    setIsFetchingData(true)
    try {
      await axios.delete(`/api/delete-user`, {
        params: {
          email: user?.email,
        },
      })
      adminData()
      toast.success("Account has been successfully DELETED")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsFetchingData(false)
    }
  }

  useEffect(() => {
    if (verifyPassPop == false) {
      setValue("password", "")
    }
  }, [verifyPassPop])

  return (
    <div className='wrapper'>
      <div className="myinfo-container-wrapper">
        <div className="mi-container">
          <div className="mi-header mb-8">
            <div className="mi-header-box">
              <div className="name-user-box">
                <h2>{error == true ? "Session expired" : ""}{user?.firstName} {user?.lastName}</h2>
                <p>{user?.username}</p>
              </div>
              <p>{user?.email}</p>
            </div>
          </div>
          <div className="more-info-container">
            <ul>
              <li>ID: <span>{user?._id}</span></li>
              <li>Account created at: <span>{user?.accountCreatedAt}</span></li>
              <li onClick={() => setPopup(true)} id='log-out'>Log out</li>
              <li onClick={() => setVerifyPassPop(true)} id='del-ac'>Delete My Account</li>
            </ul>
          </div>
        </div>
      </div>

      {popup == true ? <div className='popup-wrapper'><div className="logout-popup">
        <p>Are your sure?</p>
        <div className="user-selection-btns">
          <button onClick={() => setPopup(false)}>
            Cancel
          </button>
          <button onClick={logOut}>
            Log out
          </button>
        </div>
      </div>
      </div> : ""}

      {verifyPassPop == true ? <div className="verify-pass-pop-wrapper">
        <form className='v-p-del-form' onSubmit={handleSubmit(onSubmit)}>
          <h2>Verify it's you!</h2>
          <input className='text-center' required type="text" placeholder='Enter your password' {...register("password")} />
          {errors.password && <p className="error-status v-pass-error">{errors.password.message}</p>}
          <div className="verify-pass-del-btn">
            <button id='verify-pass-del-btn' onClick={() => setVerifyPassPop(false)} >Cancel</button>
            <button id='verify-pass-del-btn'>Verify</button>

          </div>
        </form>
      </div> : ""}

      {deletePopUp == true ? <div className='popup-wrapper'><div className="logout-popup">
        <p>Are your sure?</p>
        <div className="user-selection-btns delete-selection-btns">
          <button onClick={() => setDeletePopup(false)}>
            Cancel
          </button>
          <button onClick={deleteUser}>
            Permanently Delete
          </button>
        </div>
      </div>
      </div> : ""}

      {isFetchingData == true ? <Loader /> : ""}
    </div>
  )
}
