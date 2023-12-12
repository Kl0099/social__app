import React, { useEffect, useState } from "react"
import "./Login.css"
import { Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loginUser } from "../../Actions/User"
import { useAlert } from "react-alert"
// import e from 'express'

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { error } = useSelector((state) => state.user)
  const { message } = useSelector((state) => state.like)
  const dispatch = useDispatch()
  const alert = useAlert()
  const loginHandler = (e) => {
    e.preventDefault()
    dispatch(loginUser(email, password))
  }
  useEffect(() => {
    if (error) {
      // console.log(error);
      // alert.error(error);
      dispatch({ type: "clearError" })
    }
    if (message) {
      // alert.success(message)
      dispatch({ type: "clearMessages" })
    }
  }, [alert, message, error, dispatch])
  return (
    <div className="login">
      <form
        className="loginForm"
        onSubmit={loginHandler}
      >
        <Typography
          variant="h3"
          style={{ padding: "2vmax" }}
        >
          Social media
        </Typography>
        <input
          value={email}
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <input
          value={password}
          type="password"
          placeholder="password"
          required
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />

        <Button type="submit">Login</Button>
        <Link to={"/register"}>
          <Typography>New User?</Typography>
        </Link>
      </form>
    </div>
  )
}

export default Login
