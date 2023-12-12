import React, { useEffect, useState } from "react"
import "./Editprofile.css"
import { Avatar, Typography, Button } from "@mui/material"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { loadUser, registerUser, updateProfile } from "../../Actions/User"
import { useAlert } from "react-alert"
import Loader from "../Loader/Loader"
import { useParams } from "react-router-dom"

const Editprofile = () => {
  const { loading, error, user } = useSelector((state) => state.user)
  const [email, setEmail] = useState(user.email)
  const [avatar, setAvatar] = useState("")
  const [avatarPrev, setAvatarPrev] = useState(user.avatar.url)
  const [name, setName] = useState(user.name)
  const {
    error: updateError,
    loading: updateLoading,
    message,
  } = useSelector((state) => state.like)

  const dispatch = useDispatch()
  const alert = useAlert()
  const params = useParams()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    const Reader = new FileReader()
    Reader.onload = () => {
      if (Reader.readyState === 2) {
        setAvatarPrev(Reader.result)
        setAvatar(Reader.result)
      }
    }
    Reader.onerror = () => {
      // Handle FileReader errors here
      alert.error("Error reading the file")
    }
    Reader.readAsDataURL(file)
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    await dispatch(updateProfile(name, email, avatar))
  }
  useEffect(() => {
    if (error) {
      alert.error(error)
      dispatch({ type: "clearErrors" })
    }
    if (updateError) {
      alert.error(updateError)
      dispatch({ type: "clearErrors" })
    }
    if (message) {
      alert.success(message)
      dispatch({ type: "clearMessages" })
    }
  }, [dispatch, error, alert, updateError, message])

  return loading ? (
    <Loader />
  ) : (
    <div className="updateProfile">
      <form
        action=""
        className="updateProfileForm"
        onSubmit={submitHandler}
      >
        <Typography
          variant="h3"
          style={{ padding: "2vmax" }}
        >
          Social media
        </Typography>
        <Avatar
          src={avatarPrev}
          alt="user"
          sx={{ height: "10vmax", width: "10vmax" }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <input
          className="updateProfileInputs"
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <input
          className="updateProfileInputs"
          value={email}
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => {
            setEmail(e.target.value)
          }}
        />

        <Button
          onClick={submitHandler}
          color="success"
          variant="contained"
          disabled={updateLoading}
        >
          Update
        </Button>
      </form>
    </div>
  )
}

export default Editprofile
