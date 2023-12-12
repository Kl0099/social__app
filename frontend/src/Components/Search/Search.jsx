import React, { useState } from "react"
import "./Search.css"
import { Avatar, Typography, Button } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { getAllusers } from "../../Actions/User"
import User from "../User/User"
const Search = () => {
  const [name, setName] = useState("")
  const { users, loading: usersLoading } = useSelector(
    (state) => state.allUsers
  )
  const dispatch = useDispatch()
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(getAllusers(name))
  }

  return (
    <div className="search">
      <form
        action=""
        className="searchForm"
        onSubmit={submitHandler}
      >
        <input
          className="updateProfileInputs"
          type="text"
          placeholder="Search...user"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />

        <Button
          type="submit"
          color="success"
          variant="contained"
        >
          search
        </Button>
        <div className="searchResults">
          {users &&
            users.map((user) => (
              <User
                key={user._id}
                userId={user._id}
                name={user.name}
                avatar={user.avatar.url}
              />
            ))}
        </div>
      </form>
    </div>
  )
}

export default Search
