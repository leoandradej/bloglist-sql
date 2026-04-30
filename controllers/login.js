const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const { SECRET } = require("../utils/config");
const { Session, User } = require("../models");
const { tokenExtractor } = require("../utils/middleware");

router.post("/", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  const passwordCorrect = user
    ? await bcrypt.compare(password, user.passwordHash)
    : false;

  if (!(user && passwordCorrect)) {
    return res.status(401).json({ error: "invalid username or password" });
  }

  if (user.disabled) {
    return res
      .status(401)
      .json({ error: "account disabled, please contact admin" });
  }

  const userForToken = {
    username: user.username,
    id: user.id,
    random: Math.random(),
  };
  const token = jwt.sign(userForToken, SECRET);

  await Session.create({ token, userId: user.id });

  res.status(200).send({ token, username: user.username, name: user.name });
});

// router.delete("/", tokenExtractor, async (req, res) => {
//   const authorization = req.get("authorization");
//   const token = authorization.substring(7);
//   await Session.destroy({ where: { token } });
//   res.status(204).end();
// });

module.exports = router;
