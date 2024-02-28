const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "please Enter a name"],
  },
  email: {
    type: String,
    // required: [true, "please Enter an email address"],
    // unique: [true, "Email  already exists"],
  },
  password: {
    type: String,
    // required: [true, "please Enter a password"],
    // minlength: [6, "Please enter at least 6 characters"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1695718948137-1f4d1d5ba889?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  following: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

// userSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });
userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      if (!this.password) {
        throw new Error("Password is missing");
      }
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});
userSchema.methods.matchPassword = async function (password) {
  //match this.password and password
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.ganerateToken = function () {
  return jwt.sign({ _id: this._id }, process.env.SECRET_JWT);
};
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  // console.log(resetToken);
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
