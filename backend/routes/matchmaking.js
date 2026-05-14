const express = require("express");
const router = express.Router();

function average(team) {
  return (team.reduce((sum, p) => sum + p.dupr, 0) / team.length).toFixed(2);
}

function generateRoundRobin(players) {
  const validPlayers = players
    .map((p) => ({
      id: p.id,
      name: p.fullName,
      dupr: parseFloat(p.doubles),
    }))
    .sort((a, b) => b.dupr - a.dupr);

  const rounds = [];
  const partnerHistory = new Set();

  const totalRounds = validPlayers.length - 1;

  for (let round = 0; round < totalRounds; round++) {
    const used = new Set();
    const matches = [];

    for (let i = 0; i < validPlayers.length; i++) {
      if (used.has(validPlayers[i].id)) continue;

      for (let j = i + 1; j < validPlayers.length; j++) {
        if (used.has(validPlayers[j].id)) continue;

        const partnerKey = [validPlayers[i].id, validPlayers[j].id]
          .sort()
          .join("-");

        if (partnerHistory.has(partnerKey)) continue;

        used.add(validPlayers[i].id);
        used.add(validPlayers[j].id);

        partnerHistory.add(partnerKey);

        const team1 = [validPlayers[i], validPlayers[j]];

        let opponents = [];

        for (let k = 0; k < validPlayers.length; k++) {
          if (!used.has(validPlayers[k].id)) {
            opponents.push(validPlayers[k]);
          }

          if (opponents.length === 2) break;
        }

        if (opponents.length < 2) continue;

        used.add(opponents[0].id);
        used.add(opponents[1].id);

        const avg1 = average(team1);
        const avg2 = average(opponents);

        matches.push({
          team1,
          team2: opponents,
          avg1,
          avg2,
          difference: Math.abs(avg1 - avg2).toFixed(2),
        });

        break;
      }
    }

    if (matches.length > 0) {
      rounds.push({
        round: round + 1,
        matches,
      });
    }
  }

  return rounds;
}

router.post("/round-robin", (req, res) => {
  try {
    const { players } = req.body;

    const rounds = generateRoundRobin(players);

    res.json(rounds);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;
