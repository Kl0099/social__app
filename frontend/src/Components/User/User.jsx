import React from "react"
import { Link } from "react-router-dom"
import { Typography, Avatar } from "@mui/material"

const User = ({ userId, name, avatar }) => {
  return (
    <div>
      <Link
        to={`/user/${userId}`}
        className="homeUser"
      >
        <Avatar
          src={avatar}
          alt={name}
        />

        <Typography>{name}</Typography>
      </Link>
    </div>
  )
}

export default User
