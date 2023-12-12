import React, { useState } from 'react'
import "../Header/Header.css"
import { Link } from 'react-router-dom'
import {
  Home,
  HomeOutlined,
  Add,
  AddOutlined,
  SearchOutlined,
  Search,
  AccountCircle,
  AccountCircleOutlined,
} from "@mui/icons-material"

const Header = () => {
  const [tab,setTab] = useState(window.location.pathname);
  return (
    <div className='header'>
    <Link to={"/"} onClick={()=>{setTab("/")}}>
      {
        tab === "/"? <Home/> : <HomeOutlined/>
      }
    </Link>

    <Link to={"/newpost"} onClick={()=>{setTab("/newpost")}}>
      {
        tab === "/newpost"? <Add/> : <AddOutlined/>
      }
    </Link>

    <Link to={"/search"} onClick={()=>{setTab("/search")}}>
      {
        tab === "/search"? <Search/> :<SearchOutlined/>
      }
    </Link>

    <Link to={"/account"} onClick={()=>{setTab("/account")}}>
      {
        tab === "/account" ? <AccountCircle/>: <AccountCircleOutlined/>
      }
    </Link>
    
    </div>
  )
}

export default Header