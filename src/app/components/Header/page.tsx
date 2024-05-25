"use client";
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation'
import axios from 'axios';

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const userStatus = async () => {
        try {
            await axios.post("/api/logInStatus")
            setIsLoggedIn(true)
        } catch (error) {
            setIsLoggedIn(false)
        }
    }

    useEffect(() => {
        userStatus()
    }, [userStatus])

    const pathname = usePathname();

    return (
        <header>
            <div className="header-wrapper">
                <div className="header">
                    <div className="head-left">
                        <h1 className='text-2xl text-[#2760ff] font-semibold'>identity</h1>
                    </div>
                    <div className="head-right">
                        <div className="header-menu">
                            <ul>
                                <Link className={`a ${pathname == "/" ? "active" : ""}`} href={"/"}>
                                    <li>Home</li>
                                </Link>
                                <Link className={`a ${pathname == "/public-users" ? "active" : ""}`} href={"/public-users"}>
                                    <li>Public Users</li>
                                </Link>
                                {isLoggedIn == true ? <Link className={`a ${pathname == "/myinfo" ? "active" : ""}`} href={"/myinfo"}>
                                    <li>My info</li>
                                </Link> : ""}


                            </ul>
                            {isLoggedIn == true ? "" : <div className="auth-options">
                                <Link className={`auth-btns-menu signup-link-btn ${pathname == "/sign-up" ?
                                    "signup-active" :
                                    ""
                                    }`} href={'/sign-up'}>Sign up</Link>
                                <Link className={`auth-btns-menu login-link-btn ${pathname == "/login" ? "active-login" : ""}`} href={'/login'}>Login</Link>
                            </div>}

                        </div>
                    </div>
                </div>

            </div>
        </header>
    );
};

export default Header;