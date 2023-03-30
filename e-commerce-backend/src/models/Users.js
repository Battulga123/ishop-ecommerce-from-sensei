const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    require: [true, "enter the Frist name"],
  },
  lastname: {
    type: String,
    required: [true, "enter the Last name"],
  },
  email: {
    type: String,
    require: [true, "please provide an email"],
    uniqie: [true, "email exist"],
  },
  password: {
    type: String,
    require: [true, "please provide a password"],
  },
  phone: {
    type: Number,
    minimum: 0,
  },
  address: {
    type: String,
    required: [true, "enter the address"],
  },
  userrole: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserRole",
  },
});

const Users = mongoose.model("Users", userSchema);

module.exports = Users;
