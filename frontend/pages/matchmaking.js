import { useEffect, useState } from "react";
import api from "../services/api";

export default function Matchmaking() {
  const [players, setPlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const token = localStorage.getItem("accessToken");
    const clubId = localStorage.getItem("clubId");

    const response = await api.get(`/clubs/${clubId}/members`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const validPlayers = response.data.filter((p) => p.doubles !== "NR");

    setPlayers(validPlayers);
  };

  const togglePlayer = (player) => {
    const exists = selectedPlayers.find((p) => p.id === player.id);

    if (exists) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
    } else {
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const generateMatches = async () => {
    const response = await api.post("/matchmaking/round-robin", {
      players: selectedPlayers,
    });

    setMatches(response.data);
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Select Present Players</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {players.map((player) => (
          <div key={player.id} className="border p-4 rounded-lg">
            <label className="flex items-center gap-3">
              <input type="checkbox" onChange={() => togglePlayer(player)} />

              <div>
                <div className="font-bold">{player.fullName}</div>

                <div>DUPR: {player.doubles}</div>
              </div>
            </label>
          </div>
        ))}
      </div>

      <button
        onClick={generateMatches}
        className="bg-green-600 text-white px-6 py-3 rounded-lg"
      >
        Generate Round Robin
      </button>

      <div className="mt-10 space-y-6">
        {matches.map((round, roundIndex) => (
          <div key={roundIndex} className="border rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4">Round {round.round}</h2>

            {round.matches.map((match, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold">Team A</div>

                    {match.team1.map((p) => (
                      <div key={p.name}>
                        {p.name} ({p.dupr})
                      </div>
                    ))}

                    <div className="mt-2 font-bold">Avg: {match.avg1}</div>
                  </div>

                  <div>
                    <div className="font-bold">Team B</div>

                    {match.team2.map((p) => (
                      <div key={p.name}>
                        {p.name} ({p.dupr})
                      </div>
                    ))}

                    <div className="mt-2 font-bold">Avg: {match.avg2}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
