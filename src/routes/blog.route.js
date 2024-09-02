const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.send("Blog is here");
});

module.exports = router;
