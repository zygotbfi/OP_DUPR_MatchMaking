const express = require("express");
const router = express.Router();

const { login } = require("../services/duprService");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await login(email, password);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
