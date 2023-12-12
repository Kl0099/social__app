const path = require("path")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Assuming your config.env is in the root of your project
dotenv.config({ path: path.join(__dirname, "config.env") })

exports.connectDatabase = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then((con) => console.log(`Database Connected: ${con.connection.host}`))
    .catch((err) => console.log(err))
}
