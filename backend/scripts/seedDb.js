require("dotenv").config();
require("../models/User");
require("../models/Item");
require("../models/Comment");
const mongoose = require("mongoose");
const Comment = mongoose.model("Comment");
const Item = mongoose.model("Item");
const { createUser } = require("../services/users");

function generateEntities(createEntity, count = 100) {
  let entities = [];
  for (let i = 0; i < count; i++) {
    entities.push(createEntity(i));
  }
  return entities;
}

function createUserPayload(number) {
  const username = `user${number}`;
  return { username, email: `${username}@mail.com`, password: "password" };
}

function createItemPayload(number) {
  return { slug: `item${number}` };
}

function createCommentPayload(number) {
  return { body: `body${number}` };
}

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
  await mongoose.connect(process.env.MONGODB_URI);
  return mongoose.connection.db;
}

async function clearDb(dbConnection) {
  await dbConnection.collection("comments").deleteMany({});
  await dbConnection.collection("users").deleteMany({});
  await dbConnection.collection("items").deleteMany({});
}

async function disconnectDb() {
  await mongoose.disconnect();
}

async function seedEntities() {
  await Promise.all([
    ...generateEntities(createUserPayload, 100).map((user) => {
      return createUser(user.username, user.email, user.password);
    }),
    ...generateEntities(createItemPayload, 100).map((item) => {
      return Item.create(item);
    }),
    ...generateEntities(createCommentPayload, 100).map((comment) => {
      return Comment.create(comment);
    }),
  ]);
}

seedDb();
