import { useEffect, useState } from "react";
import api from "../services/api";
import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    loadClubs();
  }, []);

  const loadClubs = async () => {
    const token = localStorage.getItem("accessToken");

    const response = await api.get("/clubs", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setClubs(response.data);
  };

  const selectClub = (club) => {
    localStorage.setItem("clubId", club.clubId);
    router.push("/matchmaking");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-950 to-black p-10 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-5xl font-extrabold mb-3">Select Your Club</h1>

          <p className="text-gray-400 text-lg">
            Choose a pickleball club to generate balanced matches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clubs.map((club) => (
            <div
              key={club.clubId}
              className="group bg-white/10 border border-white/10 rounded-3xl overflow-hidden cursor-pointer backdrop-blur-lg hover:scale-105 transition-all duration-300 shadow-2xl"
              onClick={() => selectClub(club)}
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={
                    club.mediaUrl ||
                    "https://images.unsplash.com/photo-1547347298-4074fc3086f0"
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{club.clubName}</h2>

                <p className="text-gray-300 mb-2">{club.shortAddress}</p>

                <div className="flex items-center justify-between mt-4">
                  <span className="bg-green-500/20 text-green-300 px-4 py-2 rounded-full text-sm">
                    {club.clubMemberCount} Members
                  </span>

                  <span className="text-green-400 font-bold">Open →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
