import { useState } from "react";
import api from "../services/api";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", response.data.accessToken);

      router.push("/dashboard");
    } catch (error) {
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-green-700 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517649763962-0c623066013b')] bg-cover bg-center opacity-20"></div>

      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-10 w-full max-w-md text-white">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold mb-3">DUPR Matchmaker</h1>

          <p className="text-gray-300">
            Smart Pickleball Round Robin Generator
          </p>
        </div>

        <div className="space-y-4">
          <input
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="DUPR Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="DUPR Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={login}
            className="w-full bg-green-500 hover:bg-green-400 transition-all duration-300 py-4 rounded-xl font-bold text-lg shadow-lg"
          >
            {loading ? "Logging in..." : "Login with DUPR"}
          </button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-300">
          Create balanced teams instantly.
        </div>
      </div>
    </div>
  );
}
