const router = require("express").Router();

// => /api/auth
router.get("/", (req, res) => {
  res.send("Auth");
});

module.exports = router;
