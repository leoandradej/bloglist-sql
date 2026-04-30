const { Session } = require("../models");
const { tokenExtractor } = require("../utils/middleware");

const router = require("express").Router();

router.delete("/", tokenExtractor, async (req, res) => {
  await Session.destroy({ where: { userId: req.decodedToken.id } });
  res.status(204).end();
});

module.exports = router;
