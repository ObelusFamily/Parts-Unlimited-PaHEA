const mongoose = require("mongoose");

const User = mongoose.model("User");

module.exports.createUser = async function (username, email, password) {
  const user = new User();
  user.username = username;
  user.email = email;
  user.setPassword(password);
  await user.save();
  return user;
};
