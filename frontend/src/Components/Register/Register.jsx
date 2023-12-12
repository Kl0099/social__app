import React, { useEffect, useState } from "react"
import "./register.css"
import { Avatar, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { registerUser } from "../../Actions/User"
import { useAlert } from "react-alert"

const Register = () => {
  const [email, setEmail] = useState("")
  const [avatar, setAvatar] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const dispatch = useDispatch()
  const alert = useAlert()
  const { loading, error } = useSelector((state) => state.user)
  const handleImageChange = (e) => {
    const file = e.target.files[0]

    const Reader = new FileReader()
    Reader.readAsDataURL(file)

    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatar(Reader.result)
      }
    }
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(registerUser(name, email, password, avatar))
  }
  useEffect(() => {
    if (error) {
      alert.error(error)
      console.log(error)
      dispatch({ type: "clearError" })
    }
  }, [dispatch, error, alert])

  return (
    <div className="register">
      <form
        action=""
        className="registerForm"
        onSubmit={submitHandler}
      >
        <Typography
          variant="h3"
          style={{ padding: "2vmax" }}
        >
          Social media
        </Typography>
        <Avatar
          src={avatar}
          alt="user"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input
          required
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          required
          className="registerInputs"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <input
          className="registerInputs"
          value={email}
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />
        <input
          className="registerInputs"
          value={password}
          type="password"
          placeholder="password"
          required
          onChange={(e) => {
            setPassword(e.target.value)
          }}
        />
        <Link to="/">
          <Typography>Already signUp?Login Now</Typography>
        </Link>
        <Button
          disabled={loading}
          type="submit"
        >
          SignUp
        </Button>
      </form>
    </div>
  )
}

export default Register
