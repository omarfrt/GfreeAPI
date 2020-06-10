const mongoose = require("mongoose");

const Recipe = require("../models/Recipe");
const ArchivedRecipe = require("../models/ArchivedRecipe");

const getPopularRecipesFeed = ({ count, page }) =>
  Recipe.find()
    .sort({ Likes: -1 })
    .limit(+count)
    .skip(count * (page - 1))
    .exec();

const getPopularIn = ({ count, page, time }) =>
  Recipe.find({
    createdAt: {
      $gte:
        new Date(new Date() - new Date().getTimezoneOffset()).getTime() - time,
    },
  })
    .populate("author")
    .sort({ Likes: -1 })
    .limit(+count)
    .skip(count * (page - 1))
    .exec();

const getNewestRecipesFeed = ({ count, page, time }) =>
  Recipe.find()
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(+count)
    .skip(count * (page - 1))
    .exec();

const getPopularInByTag = ({ count, page, time, tag }) =>
  Recipe.find({
    createdAt: {
      $gte:
        new Date(new Date() - new Date().getTimezoneOffset()).getTime() - time,
    },
    tags: tag,
  })
    .populate("author")
    .sort({ Likes: -1 })
    .limit(+count)
    .skip(count * (page - 1))
    .exec();

const getNewestRecipesByTag = ({ count, page, tag }) =>
  Recipe.find({
    tags: tag,
  })
    .populate("author")
    .sort({ createdAt: -1 })
    .limit(+count)
    .skip(count * (page - 1))
    .exec();

const getRecipe = ({ _id }) =>
  Recipe.findOne({ _id }).populate("author").populate("comments.author").exec();

const findRecipes = ({ count, page, query }) =>
  Recipe.find({ title: query })
    .limit(+count)
    .skip(count * (page - 1))
    .exec();

const createArchivedRecipe = ({
  _id,
  title,
  description,
  body,
  cookingTime,
  thumbnail,
  author,
}) =>
  new ArchivedRecipe({
    title,
    description,
    body,
    cookingTime,
    thumbnail,
    author,
    _id: new mongoose.Types.ObjectId(),
  }).save();

const addComment = ({ recipeId, comment: { author, comment } }) =>
  Recipe.updateOne(
    { _id: recipeId },
    {
      $push: { comments: [{ author, comment: comment }] },
    }
  ).exec();

const createRecipe = ({ recipe }) =>
  new Recipe({
    _id: new mongoose.Types.ObjectId(),
    comments: [],
    likedBy: [],
    likes: 0,
    ...recipe,
  }).save();

const updateRecipe = ({
  _id,
  recipe: { title, body, thumbnail, cookingTime, description, tags },
}) =>
  Recipe.findOneAndUpdate(
    { _id },
    {
      $set: {
        title,
        body,
        thumbnail,
        cookingTime,
        description,
        tags,
      },
    },
    { new: true }
  ).exec();

const deleteRecipe = ({ _id }) => Recipe.remove({ _id }).exec();

const like = ({ author, recipeId, likes, totalLikes }) =>
  Recipe.updateOne(
    { _id: recipeId },
    { $push: { likedBy: [{ author, likes }] }, likes: totalLikes }
  ).exec();

const updateLike = ({ authorId, recipeId, likes, totalLikes }) =>
  Recipe.findByIdAndUpdate(
    {
      _id: recipeId,
    },
    {
      $set: { "likedBy.$[elem].likes": +likes },
      likes: totalLikes,
    },
    {
      arrayFilters: [{ "elem.author": authorId }],
    }
  );

module.exports = {
  getNewestRecipesFeed,
  getPopularRecipesFeed,
  getNewestRecipesByTag,
  getPopularInByTag,
  getPopularIn,
  findRecipes,
  getRecipe,
  createArchivedRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  like,
  updateLike,
  addComment,
};
