const express = require("express");
const router = express.Router();

const Story = require("../../controllers/Story");

const updateComment = router.post("/", async (req, res, next) => {
  const {
    body: {
      story: { _id, commentId, updatedComment },
    },
  } = req;

  await Story.updateComment({ _id, commentId, updatedComment });
  res.status(201).send({ message: "Comment has been updated" });
});

module.exports = updateComment;
