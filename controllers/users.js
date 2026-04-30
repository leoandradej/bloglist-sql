const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User, Blog } = require("../models");

router.get("/", async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      attributes: { exclude: ["userId"] },
    },
  });
  res.json(users);
});

router.post("/", async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const user = await User.create({ ...req.body, passwordHash });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res) => {
  const where = {};

  if (req.query.read !== undefined) {
    where.read = req.query.read === "true";
  }

  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ["passwordHash"] },
    include: {
      model: Blog,
      as: "readings",
      attributes: { exclude: ["userId"] },
      through: {
        attributes: ["read", "id"],
        where,
      },
    },
  });

  if (!user) return res.status(404).end();

  res.json(user);
});

router.put("/:username", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { username: req.params.username },
    });
    if (!user) return res.status(404).end();
    user.name = req.body.name;
    await user.save();
    const { passwordHash, ...userWithoutPassword } = user.toJSON();
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
