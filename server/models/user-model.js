const mongoose =require('mongoose');
const validator=require('validator');
const bcrypt =require('bcryptjs');
const JWT = require('jsonwebtoken');
//schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name Is Require"],
    },
    // lastName: {
    //   type: String,
    // },
    email: {
      type: String,
      required: [true, " Email is Require"],
      unique: true,
      validate: validator.isEmail,      //validator used here
    },
    password: {
      type: String,
      required: [true, "password is require"],
      minlength: [5, "Password length should be greater than 5 character"],
      select: true,
    },
    location: {
      type: String,
      default: "India",
    },
  },
  { timestamps: true }
);

// middelwares
// userSchema.pre("save", async function () {
//   if (!this.isModified) return;
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

//compare password
// userSchema.methods.comparePassword = async function (userPassword) {
//   const isMatch = await bcrypt.compare(userPassword, this.password);
//   return isMatch;
// };

//JSON WEBTOKEN
userSchema.methods.createJWT = function () {     //name => createJWT
  return JWT.sign({ userId: this._id.toString() , email: this.email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const User=mongoose.model("User", userSchema);

module.exports=User;