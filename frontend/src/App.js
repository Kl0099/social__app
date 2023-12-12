import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"
import Header from "./Components/Header/Header"
import Login from "./Components/Login/Login"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { loadUser } from "./Actions/User"
import Home from "./Components/Home/Home"
import Account from "./Components/Account/Account"
import NewPost from "./Components/NewPost/NewPost"
import Register from "./Components/Register/Register"
import Editprofile from "./Components/Editprofile/Editprofile"

import UserProfile from "./Components/UserProfile/UserProfile"
import Search from "./Components/Search/Search"
import NotFound from "./Components/NotFound/NotFound"

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    // console.log("useEffect of app.js")
    dispatch(loadUser())
  }, [dispatch])
  const { isAuthenticated } = useSelector((state) => state.user)
  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Login />}
        />
        <Route
          path="/account"
          element={isAuthenticated ? <Account /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <Account /> : <Register />}
        />

        <Route
          path="/newpost"
          element={isAuthenticated ? <NewPost /> : <Login />}
        />
        <Route
          path="/user/:id"
          element={isAuthenticated ? <UserProfile /> : <Login />}
        />
        <Route
          path="/update/profile"
          element={isAuthenticated ? <Editprofile /> : <Login />}
        />

        <Route
          path="/search"
          element={isAuthenticated ? <Search /> : <Login />}
        />
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </Router>
  )
}

export default App
