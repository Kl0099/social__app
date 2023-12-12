const app = require("./app")
const mongoose = require("mongoose")
const { connectDatabase } = require("./config/database")
const cloudinary = require("cloudinary")
// connectDatabase();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

async function main() {
  await mongoose.connect(process.env.MONGO_URL)
}
main().then((con) => console.log(`Database connected `))
main().catch((err) => {
  console.log(err)
})

app.listen(process.env.PORT, () => {
  console.log(`server is listening on ${process.env.PORT}`)
})
