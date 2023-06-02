const validator = require("validator");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    mobile: { type: String, default: "000-000-0000" },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    createAt: { type: Date, default: Date.now },
  },
  {
    collection: "user",
    versionKey: false,
  }
);

const UserModel = mongoose.model("user", UserSchema);
module.exports = { UserModel }; /** Schema export  */
