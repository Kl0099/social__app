// const app = require("./app")
// const mongoose = require("mongoose")
// const { connectDatabase } = require("./config/database")
// const cloudinary = require("cloudinary")
// const dotenv = require("dotenv")
// connectDatabase()
// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_API_SECRET,
// })

// async function main() {
//   try {
//     await mongoose.connect(process.env.MONGO_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     })
//     console.log("Database connected")
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error.message)
//     // You may want to handle the error in a way that makes sense for your application
//     // For example, you might want to exit the process if the database connection fails
//     process.exit(1)
//   }
// }

// main()

// app.listen(process.env.PORT, () => {
//   console.log(`Server is listening on ${process.env.PORT}`)
// })
const app = require("./app")
const { connectDatabase } = require("./config/database")
const cloudinary = require("cloudinary")
const dotenv = require("dotenv")
connectDatabase()
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`)
})
