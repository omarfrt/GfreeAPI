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
const User = require("./api/routes/User");

//..................................
const pwddb = "qwert12345A";
mongoose.connect(
  "mongodb+srv://jlo:" +
    pwddb +
    "@gfree-5rmfi.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
  }
);
//..................................

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
// User Routes
app.use("/signin", User.signin);
app.use("/signup", User.signup);
app.use("/requestPasswordChange", User.requestPasswordChange);

// Recipe Routes
app.use("/getNewestRecipesFeed", Recipe.getNewestRecipesFeed);
app.use("/getPopularRecipesFeed", Recipe.getPopularRecipesFeed);
app.use("/findRecipe", Recipe.findRecipes);

// -------Routes that require Authorisation------------
app.use(User.authenticate);
app.use("/getUser", User.getUser);
app.use("/updateProfile", User.updateProfile);
app.use("/resetPassword", User.resetPassword);

//Recipe Routes
app.use("/createRecipe", Recipe.createRecipe);
app.use("/updateRecipe", Recipe.updateRecipe);
app.use("/ArchiveRecipe", Recipe.deleteRecipe);
app.use("/likeRecipe", Recipe.likeRecipe);

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
