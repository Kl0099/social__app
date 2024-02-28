const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(express.static(path.join(__dirname, "../Fronend/build")))

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../Fronend/build/index.html"))
// })

//import routes
///api/v1/post/upload
const post = require("./routes/post");
const user = require("./routes/user");

app.use("/api/v1", post);
app.use("/api/v1", user);

module.exports = app;
