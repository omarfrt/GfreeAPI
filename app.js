const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");

//Passport config
require("./api/config/passport");
const Debugger = require("./lib/DebugMiddle");
const Recipe = require("./api/routes/Recipe");
const Story = require("./api/routes/Story");
const Discussion = require("./api/routes/Discussion");
const User = require("./api/routes/User");
const Feed = require("./api/routes/Feed");
// const Aws = require("./api/routes/AWS");
//..................................
const pwddb = "qwert12345A";
process.env.NODE_ENV !== "test" &&
  mongoose.connect(
    "mongodb+srv://jlo:" +
      pwddb +
      "@gfree.5rmfi.mongodb.net/test?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: true,
    }
  );
//..................................
// Disable Cache
app.disable("etag");

app.use(morgan("dev"));
app.use("/images", express.static("images"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
app.use(passport.initialize());
//cors handelling
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origins,X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

// ------------- Routes --------------

// Feed Routes
app.use("/getHomeFeed", Feed.getHomeFeed);

// User Routes
app.use("/signin", User.signin);
app.use("/signup", User.signup);
app.use("/getProfile", User.getProfile);
app.use("/requestPasswordChange", User.requestPasswordChange);

// Recipe Routes
app.use("/getNewestRecipesFeed", Recipe.getNewestRecipesFeed);
app.use("/getNewestRecipesByTag", Recipe.getNewestRecipesByTag);
app.use("/getPopularRecipesFeed", Recipe.getPopularRecipesFeed);
app.use("/getRecipesPopularIn", Recipe.getPopularIn);
app.use("/getRecipePopularByTag", Recipe.getPopularInByTag);
app.use("/findRecipes", Recipe.findRecipes);
app.use("/getRecipe", Recipe.getRecipe);
app.use("/getRecommandedRecipes", Recipe.getRecommandedRecipes);
app.use("/getAllRecipesTitle", Recipe.getAllRecipesTitle);

// Story Routes
app.use("/getNewestStoriesFeed", Story.getNewestStoriesFeed);
app.use("/getNewestStoriesByTag", Story.getNewestStoriesByTag);
app.use("/getPopularStoriesFeed", Story.getPopularStoriesFeed);
app.use("/getStoriesPopularIn", Story.getPopularIn);
app.use("/getStoriesPopularByTag", Story.getPopularInByTag);
app.use("/findStories", Story.findStories);
app.use("/getStory", Story.getStory);
app.use("/getRecommandedStories", Story.getRecommandedStories);
app.use("/getAllStoriesTitle", Story.getAllStoriesTitle);

// Discussion Routes
app.use("/getNewestDiscussionsFeed", Discussion.getNewestDiscussionsFeed);
app.use("/getNewestDiscussionsByTag", Discussion.getNewestDiscussionsByTag);
app.use("/getPopularDiscussionsFeed", Discussion.getPopularDiscussionsFeed);
app.use("/getDiscussionsPopularIn", Discussion.getPopularIn);
app.use("/getDiscussionsPopularByTag", Discussion.getPopularInByTag);
app.use("/findDiscussions", Discussion.findDiscussions);
app.use("/getDiscussion", Discussion.getDiscussion);
app.use("/getRecommandedDiscussions", Discussion.getRecommandedDiscussions);
app.use("/getAllDiscussionsTitle", Discussion.getAllDiscussionsTitle);

// -------Routes that require Authorisation------------
app.use(User.authenticate);
app.use("/getUser", User.getUser);
app.use("/updateProfile", User.updateProfile);
app.use("/resetPassword", User.resetPassword);

//Recipe Routes
app.use("/createRecipe", Recipe.createRecipe);
app.use("/updateRecipe", Recipe.updateRecipe);
app.use("/deleteRecipe", Recipe.deleteRecipe);
app.use("/likeRecipe", Recipe.likeRecipe);
app.use("/addComment", Recipe.comment);
app.use("/updateRecipeComment", Recipe.updateComment);
app.use("/deleteRecipeComment", Recipe.deleteComment);

//Story Routes
app.use("/createStory", Story.createStory);
app.use("/updateStory", Story.updateStory);
app.use("/deleteStory", Story.deleteStory);
app.use("/likeStory", Story.likeStory);
app.use("/addCommentToStory", Story.comment);
app.use("/updateStoryComment", Story.updateComment);
app.use("/deleteStoryComment", Story.deleteComment);

//Discussion Routes
app.use("/createDiscussion", Discussion.createDiscussion);
app.use("/updateDiscussion", Discussion.updateDiscussion);
app.use("/deleteDiscussion", Discussion.deleteDiscussion);
app.use("/likeDiscussion", Discussion.likeDiscussion);
app.use("/addCommentToDiscussion", Discussion.comment);
app.use("/updateDiscussionComment", Discussion.updateComment);
app.use("/deleteDiscussionComment", Discussion.deleteComment);

//Aws Routes
// app.use("/getS3Signature", Aws.sendUploadSignature);

//handling errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
