const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const path = require("path")

const app = express()

// Middleware
app.use(express.json({ limit: "50mb" })) // Adjust the limit as needed
app.use(express.urlencoded({ extended: true, limit: "50mb" })) // Adjust the limit as needed
app.use(cookieParser())
app.use(cors())
// app.use(express.static(path.join(__dirname, "../Fronend/build")))

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../Fronend/build/index.html"))
// })

//import routes
///api/v1/post/upload
const post = require("./routes/post")
const user = require("./routes/user")

app.use("/api/v1", post)
app.use("/api/v1", user)

module.exports = app
