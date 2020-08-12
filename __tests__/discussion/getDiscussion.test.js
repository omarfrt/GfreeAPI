const request = require("supertest");
const User = require("../../api/controllers/User");
const app = require("../../app");
const { setupDB } = require("../../test-setup");
setupDB();

const newDiscussion = {
  title: "Understand the Superpower of Optional Chaining in JavaScript",
  body:
    "Optional chaining will eliminate the need for manually checking if a property is available in an object . With optional chaining the checking will be done internally.",
  tags: ["home", "bro"],
};

describe("/getDiscussion endpoint", () => {
  it.only("Should get a Discussion Successfully", async (done) => {
    const user = {
      email: "jvm@gmail.com",
      password: "allo1234",
      fullname: "Test man",
    };
    // Register User
    await request(app).post("/signup").send({
      user,
    });
    // Login User to get Token
    const {
      body: { token },
    } = await request(app)
      .post("/signin")
      .send({
        user: {
          email: user.email,
          password: user.password,
        },
      });

    // Create a Discussion
    const {
      body: {
        discussion: { _id: discussionId },
      },
    } = await request(app)
      .post("/createDiscussion")
      .set("Authorization", `Bearer ${token}`)
      .send({
        discussion: newDiscussion,
      });

    // Retrive a Discussion
    const res = await request(app)
      .post("/getDiscussion")
      .send({
        discussion: {
          _id:discussionId,
        },
      });

    const discussion = res.body.discussion;

    expect(res.statusCode).toEqual(200);
    Object.keys(newDiscussion).forEach((key) => {
      expect(newDiscussion[key]).toEqual(discussion[key]);
    });

    done();
  });
});
