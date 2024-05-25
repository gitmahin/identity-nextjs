"use client"
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form"
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios'
import { signUpSchema } from '@/zod-schemas/signup-schema';
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounceCallback } from 'usehooks-ts'
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/response/apiResponse';
import Link from 'next/link';
import Loader from '../components/Loader/page';

export default function signupPage() {
  const [username, setUsername] = useState("")
  const [successResponse, setSuccessResponse] = useState(false)
  const [usernameStatus, setUsernameStatus] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debounced = useDebounceCallback(setUsername, 500)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: ""
    }
  })

  useEffect(() => {
    const checkUsername = async () => {
      if (username) {
        setUsernameStatus("")
        try {
          const res = await axios.get(`/api/validate-username?username=${username}`)
          setUsernameStatus(res.data.message)
          setSuccessResponse(true)
        } catch (error) {
          setSuccessResponse(false)
          const axiosError = error as AxiosError<ApiResponse>
          if (axiosError.response) {
            const status = axiosError.response.status
            switch (status) {
              case 403:
                setUsernameStatus("Username already taken")
                break
              case 400:
                setUsernameStatus("Invalid username")
                break
              case 500:
                setUsernameStatus("Try again later")
                break
              default:
                setUsernameStatus("Something went wrong")
            }
          } else {
            setSuccessResponse(false)
            setUsernameStatus("ERR_CONNECTION_TIMED_OUT")
          }
        }
      }
    }

    checkUsername()
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    try {
      setIsSubmitting(true)
      await axios.post<ApiResponse>('/api/signup', data)
      toast.success("Registered Successfully")
      router.push(`/verify-email/${username}`)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      if (axiosError.response) {
        const status = axiosError.response.status;
        switch (status) {
          case 400:
            toast.error("User already existed");
            break;
          case 500:
            toast.error("Server is under maintainance. Please try again later")
            break
          default:
            toast.error(axiosError.response.data.message ?? "Something went wrong");
        }
      } else {
        toast.error("ERR_CONNECTION_TIMED_OUT");
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='wrapper'>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="container flex justify-around items-center">

          <div className="left-container w-[500px]">
            <h1 className='text-[70px] font-semibold self-start'>Sign up</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque blanditiis impedit ullam sit minus consequatur doloremque deserunt nemo iste quam.</p>
          </div>


          <div className="right-container">
            <div className="name-input">
              <div className="fname-input">
                <input required type="text" placeholder='First name' {...register("firstName")} />
                {errors.firstName && <p className="error-status">{errors.firstName.message}</p>}

              </div>
              <div className="lname-input">

                <input required type="text" placeholder='Last name' {...register("lastName")} />
                {errors.lastName && <p className="error-status">{errors.lastName.message}</p>}
              </div>
            </div>
            <div className="input">
              <input required type="text" placeholder='Enter your username' {...register("username")} onChange={(e) => {
                register("username").onChange(e)
                debounced(e.target.value)
              }} />
              {errors.username && <p className="error-status">{errors.username.message}</p>}
              {successResponse == true ? <p className='success-status'>{usernameStatus}</p> : <p className='error-status'>{usernameStatus}</p>}
            </div>
            <div className="input">
              <input required type="text" placeholder='Enter your email' {...register("email")} />
              {errors.email && <p className="error-status">{errors.email.message}</p>}
            </div>
            <div className="input">
              <input required type="password" placeholder='Enter your password' {...register("password")} />
              {errors.password && <p className="error-status">{errors.password.message}</p>}
            </div>
            <button type="submit" id='submit' disabled={isSubmitting == true ? true : false}>
              {isSubmitting == true ? "Loading..." : "Sign up"}
            </button>
          </div>
        </div>
        {isSubmitting == true ? <Loader/> : ""}

      </form>
    </div>
  )
}


