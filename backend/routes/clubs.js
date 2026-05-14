const express = require("express");
const router = express.Router();

const { getClubs, getMembers } = require("../services/duprService");

router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const clubs = await getClubs(token.replace("Bearer ", ""));

    res.json(clubs);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

router.get("/:clubId/members", async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { clubId } = req.params;

    const members = await getMembers(token.replace("Bearer ", ""), clubId);

    res.json(members);
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
