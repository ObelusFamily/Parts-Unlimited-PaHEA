require("dotenv").config();
require("../models/User");
require("../models/Item");
require("../models/Comment");
const mongoose = require("mongoose");
const Item = mongoose.model("Item");
const { createUser } = require("../services/users");

const users = [
  { username: "john", email: "john@email.com", password: "password" },
  { username: "lisa", email: "lisa@email.com", password: "password" },
  { username: "abcd", email: "abcd@email.com", password: "password" },
  { username: "bcde", email: "bcde@email.com", password: "password" },
  { username: "cdef", email: "cdef@email.com", password: "password" },
  { username: "defg", email: "defg@email.com", password: "password" },
  { username: "efgh", email: "efgh@email.com", password: "password" },
  { username: "fghi", email: "fghi@email.com", password: "password" },
  { username: "ghij", email: "ghij@email.com", password: "password" },
  { username: "hijk", email: "hijk@email.com", password: "password" },
];

const items = [
  { slug: "ItemA" },
  { slug: "ItemB" },
  { slug: "ItemC" },
  { slug: "ItemD" },
  { slug: "ItemE" },
  { slug: "ItemF" },
  { slug: "ItemG" },
];

async function seedDb() {
  const dbConnection = await connectDb();
  await clearDb(dbConnection);
  await seedEntities();
  await disconnectDb();
}

async function connectDb() {
  if (!process.env.MONGODB_URI) {
    console.warn("Missing MONGODB_URI in env, please add it to your .env file");
    process.exit(1);
  }
  mongoose.set("debug", true);
  await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection.db;
}

async function clearDb(dbConnection) {
  await dbConnection.collection("users").deleteMany({});
  await dbConnection.collection("items").deleteMany({});
}

async function disconnectDb() {
  await mongoose.disconnect();
}

async function seedEntities() {
  await Promise.all([
    ...users.map((user) => {
      return createUser(user.username, user.email, user.password);
    }),
    ...items.map((item) => {
      return Item.create(item);
    }),
  ]);
}

seedDb();
