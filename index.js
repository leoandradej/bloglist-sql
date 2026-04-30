const express = require("express");
const app = express();

const { PORT } = require("./utils/config");
const { connectToDatabase } = require("./utils/db");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");
const readingListsRouter = require("./controllers/reading_lists");
const logoutRouter = require("./controllers/logout");
const { errorHandler } = require("./utils/middleware");
const { Blog, User, Session, ReadingList } = require("./models");
const { fn, col } = require("sequelize");

app.use(express.json());

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);
app.use("/api/readinglists", readingListsRouter);
app.use("/api/logout", logoutRouter);

app.get("/", (req, res) => {
  res.status(200).send("ok");
});

app.post("/api/reset", async (req, res) => {
  await Session.destroy({ where: {} });
  await ReadingList.destroy({ where: {} });
  await Blog.destroy({ where: {} });
  await User.destroy({ where: {} });
  res.status(204).end();
});

app.get("/api/authors", async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      "author",
      [fn("COUNT", col("id")), "blogs"],
      [fn("SUM", col("likes")), "likes"],
    ],
    group: ["author"],
    order: [[fn("SUM", col("likes")), "DESC"]],
  });
  res.json(authors);
});

app.use(errorHandler);

const start = async () => {
  await connectToDatabase();
  app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
};

start();
