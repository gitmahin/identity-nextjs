"use client"
import Loader from '@/app/components/Loader'
import { ApiResponse } from '@/response/apiResponse'
import { verifyEmailSchema } from '@/zod-schemas/verify-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { cache, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'

const verifyPage = () => {
  const [isVerifing, setIsVerifing] = useState(false)
  const router = useRouter()
  const params = useParams<{ username: string }>()
  const { register, handleSubmit } = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verifyCode: ""
    }
  })


  const onSubmit = async (data: z.infer<typeof verifyEmailSchema>) => {
    try {
      setIsVerifing(true)
      const response = await axios.post("/api/verify-email", {
        username: params.username,
        code: data.verifyCode,
        cache: "no-cache"
      })
      toast.success("Verified successfully")
      router.push("/login")
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response) {
        const status = axiosError.response.status
        switch (status) {
          case 400:
            toast.error("Invalid code")
            break
          case 401:
            toast.error("User is not registered")
            break
          case 410:
            toast.error("Verification code expired")
            break
          case 429:
            toast.error("Too many requests. Please try again after 1 minute")
            break
          default:
            toast.error("Something went wrong")
        }
      } else {
        toast.error("ERR_CONNECTION_TIMED_OUT")
      }
    } finally {
      setIsVerifing(false)
    }
  }
  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="verify-wrapper w-full">
          <div className="verify-container w-full h-fit flex justify-center items-center">
            <div className="verify-box">
              <div className="verify-header">
                <h1>Verify your email</h1>
                <p className='text-white text-center mb-3'>A verification code sent to your email</p>
              </div>
              <div className="verify-code-box">
                <input required type="text" placeholder='Enter 6 digit code' id='verify-code-input' {...register("verifyCode")} />
              </div>
              <button type="submit" id='verify-btn' >{isVerifing == true ? "Verifing..." : "Verify"}</button>
            </div>
          </div>
        </div>
      {isVerifing == true ? <Loader /> : ""}
      </form>

    </div>
  )
}

export default verifyPage