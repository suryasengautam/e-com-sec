import React, { useEffect } from 'react'
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../firebase/auth'
import {Link} from "react-router-dom"
import "./login.css"
import {signIn} from "../firebase/auth"


function Login() {
    const {signIn,user} = useAuth()
    const navigate = useNavigate()
    const handleSignIn = async(e) => {
        e.preventDefault()
        const {username,password} = e.target;
        await signIn(username.value,password.value)
        navigate("/")
    }
    return (
        <div className='login'>
            <form onSubmit = {handleSignIn}>
                <h2 className='heading'>E-com</h2>
                <section>
                    <label htmlFor="username"><strong>Username </strong></label>
                    <input type="text" name = "username" id = "username" />
                </section>
                <section>
                    <label htmlFor="password"><strong>password</strong> </label>
                    <input type="password" name='password' id = "password" />
                </section>
                <button type='submit'>Sign in</button>
                <section>
                    <p> new user? <Link to = "/login">sign up</Link></p>
                </section>
            </form>
        </div>
    )
}
export default Login