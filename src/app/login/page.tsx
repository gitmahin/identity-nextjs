"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast';
import { useForm, SubmitHandler } from "react-hook-form"
import React, { useState } from 'react'
import { ApiResponse } from '@/response/apiResponse';
import { useRouter } from 'next/navigation';
import axios, { AxiosError } from 'axios'
import { loginSchema } from '@/zod-schemas/login-schema';
import { z } from "zod"
import Loader from '../components/Loader';

export default function loginPage(){
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof loginSchema>) =>{
      try {
        setIsSubmitting(true)
        await axios.post("/api/login", data)
        toast.success("Log in successfully")
        router.push("/myinfo")     
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        if(axiosError.response){
          const status = axiosError.response.status
          switch(status){
            case 400:
              toast.error("Invalid credentials")
              break
            case 401:
              toast.error("User is not verified")
              break
            case 500:
              toast.error("Server is under maintainance. Please try again later")
              break
            default:
              toast.error(axiosError.response.data.message ?? "Something went wrong");
          }
        }else{
          toast.error("ERR_CONNECTION_TIMED_OUT")
        }
      }finally{
        setIsSubmitting(false)
      }
  }
  return (
    <div className='wrapper'>

      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="container login-container flex justify-around items-center">

          <div className="left-container login-left-container w-[500px]">
            <h1 className='text-[70px] font-semibold'>Log in</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque blanditiis impedit ullam sit minus consequatur doloremque deserunt nemo iste quam.</p>
          </div>


          <div className="right-container">
            <div className="input">
              <input required type="text" placeholder='Enter your email' {...register("email")} />
              {errors.email && <p className="error-status">{errors.email.message}</p>}
            </div>
            <div className="input">
              <input required type="password" placeholder='Enter your password' {...register("password")} />
              {errors.password && <p className="error-status">{errors.password.message}</p>}
            </div>
            <button type="submit" id='submit' disabled={isSubmitting == true ? true : false}>
              {isSubmitting == true ? "Loading..." : "Login"}
            </button>
          </div>
        </div>
        {isSubmitting == true ? <Loader/> : ""}

      </form>
    </div>
  )
}


