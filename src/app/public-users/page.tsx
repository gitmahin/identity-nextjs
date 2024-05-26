"use client"
import { ApiResponse } from '@/response/apiResponse'
import axios, { AxiosError } from 'axios'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Loader from '../components/Loader/page'
import Link from 'next/link'

interface User {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    accountCreatedAt: string;
    isVerified: boolean
    _id: string

}

export default function publicUsersPage() {

    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    const getAllUsers = async () => {

        try {
            setLoading(true)
            const response = await axios.get("/api/public-users")
            setUsers(response.data.data)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            if (axiosError.response) {
                const status = axiosError.response.status
                switch (status) {
                    case 500:
                        toast.error("Server is under maintainance. Please try again later")
                        break
                    default:
                        toast.error("Something went wrong")
                }
            } else {
                toast.error("ERR_CONNECTION_TIMED_OUT")
            }
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getAllUsers()
    }, [])

    return (
        <div className='wrapper'>
            <div className='pub-container'>
                <div className="pub-list-box">
                    <ul>
                        {users.map((user) => {
                            return <Link href={`/public-users/user/${user._id}`}>
                                <li >
                                    <div className="pub-left">
                                        <h2>{user.firstName} {user.lastName}</h2>
                                        <p>@{user.username}</p>
                                        <p>Joined: {user.accountCreatedAt}</p>
                                    </div>
                                    <div className="pub-right">
                                        <p>{user.email}</p>
                                        <p className={user.isVerified == true ? "verified" : "unverified"}>{user.isVerified == true ? "Verified" : "Unverified"}</p>
                                    </div>

                                </li>
                            </Link>

                        })}
                    </ul>
                </div>
            </div>
            {loading == true ? <Loader /> : ""}
        </div>
    )
}


