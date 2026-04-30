const { Blog, User, ReadingList } = require("../models");
const { tokenExtractor } = require("../utils/middleware");

const router = require("express").Router();

router.post("/", async (req, res) => {
  try {
    const { blogId, userId } = req.body;

    if (!blogId) return res.status(400).json({ error: "blogId is required" });
    if (!userId) return res.status(400).json({ error: "userId is required" });

    const blog = await Blog.findByPk(blogId);
    const user = await User.findByPk(userId);

    if (!blog) return res.status(404).json({ error: "blog not found" });
    if (!user) return res.status(404).json({ error: "user not found" });

    const readingList = await ReadingList.create({ blogId, userId });
    const json = readingList.toJSON();
    res.json({
      id: json.id,
      blog_id: json.blogId,
      user_id: json.userId,
      read: json.read,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put("/:id", tokenExtractor, async (req, res) => {
  const readingList = await ReadingList.findByPk(req.params.id);

  if (!readingList) return res.status(404).end();

  if (readingList.userId !== req.decodedToken.id) {
    return res.status(401).json({ error: "not authorized" });
  }

  readingList.read = req.body.read;
  await readingList.save();
  res.json(readingList);
});

module.exports = router;
