const bcrypt = require("bcrypt");
const User = require("../models/User");
const mongoose = require("mongoose");

const setPassword = ({ password }) =>
  new Promise((resolve, reject) => {
    bcrypt.hash(password, 11, function (err, hash) {
      if (err) reject(err);
      resolve(hash);
    });
  });

const validatePassword = ({ password, hash }) =>
  bcrypt.compareSync(password, hash);

const findUser = ({ email }) => User.findOne({ email }).exec();
const findUserById = ({ _id }) =>
  User.findById(_id)
    .populate("recipes")
    .populate("stories")
    .populate("discussions")
    .exec();

const updateUser = (_id, { email, fullname, about, profilePicture, links }) =>
  User.updateOne(
    { _id },
    {
      email,
      fullname,
      about,
      profilePicture,
      links,
    }
  );

const changePassword = (_id, { hashedPassword }) =>
  User.updateOne(
    { _id },
    {
      password: hashedPassword,
    }
  );

const createUser = ({ email, password, fullname }) =>
  new User({
    _id: new mongoose.Types.ObjectId(),
    email,
    password,
    fullname,
  }).save();

const findUsers = () => User.find().exec();

// Recipe Related
const updateLikedRecipe = ({ recipeId, _id, likes }) =>
  User.findByIdAndUpdate(
    { _id },
    {
      $set: { "likedRecipes.$[elem].likes": +likes },
    },
    {
      arrayFilters: [{ "elem.recipe": recipeId }],
    }
  );

const likeRecipe = ({ recipe, _id, likes }) =>
  User.updateOne(
    { _id },
    {
      $push: { likedRecipes: [{ recipe, likes }] },
    }
  );

const addCreatedRecipe = ({ _id, recipeId }) =>
  User.updateOne(
    { _id },
    {
      $push: { recipes: recipeId },
    }
  );

// Story Related
const updateLikedStory = ({ storyId, _id, likes }) =>
  User.findByIdAndUpdate(
    { _id },
    {
      $set: { "likedStories.$[elem].likes": +likes },
    },
    {
      arrayFilters: [{ "elem.story": storyId }],
    }
  );

const likeStory = ({ story, _id, likes }) =>
  User.updateOne(
    { _id },
    {
      $push: { likedStories: [{ story, likes }] },
    }
  );
const addCreatedStory = ({ _id, storyId }) =>
  User.updateOne(
    { _id },
    {
      $push: { stories: storyId },
    }
  );

// Discussion Related
const updateLikedDiscussion = ({ discussionId, _id, likes }) =>
  User.findByIdAndUpdate(
    { _id },
    {
      $set: { "likedDiscussions.$[elem].likes": +likes },
    },
    {
      arrayFilters: [{ "elem.discussion": discussionId }],
    }
  );

const likeDiscussion = ({ discussion, _id, likes }) =>
  User.updateOne(
    { _id },
    {
      $push: { likedDiscussions: [{ discussion, likes }] },
    }
  );
const addCreatedDiscussion = ({ _id, discussionId }) =>
  User.updateOne(
    { _id },
    {
      $push: { discussions: discussionId },
    }
  );

module.exports = {
  setPassword,
  validatePassword,
  findUser,
  createUser,
  updateUser,
  findUsers,
  changePassword,
  findUserById,
  addCreatedRecipe,
  likeRecipe,
  updateLikedRecipe,
  addCreatedStory,
  likeStory,
  updateLikedStory,
  addCreatedDiscussion,
  likeDiscussion,
  updateLikedDiscussion,
};
