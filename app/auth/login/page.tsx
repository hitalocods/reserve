"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";

// Mock login for now (replace with real auth later)
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock check (admin@example.com / admin)
    if (email === "admin@example.com" && password === "admin") {
      // Set a simple cookie for now (replace with proper auth later)
      document.cookie = "auth=loggedin; path=/; max-age=86400";
      router.push("/admin/dashboard");
    } else {
      setError("Credenciais inválidas");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/logo.jpg" alt="Atlas Reserve" className="h-20 w-auto mb-4 rounded-xl shadow-md border border-neutral-800" />
          <h1 className="text-3xl font-bold mb-1">Painel Administrativo</h1>
          <p className="text-neutral-500 font-medium">Atlas Reserve</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                placeholder="admin@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Senha</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold"
                placeholder="••••••••"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
