"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid username or password.");
    } else {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/60 uppercase tracking-widest">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="bg-[#2C2F30] border border-glass-border px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-byd-red transition-colors duration-200"
          placeholder="Enter username"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-white/60 uppercase tracking-widest">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-[#2C2F30] border border-glass-border px-4 py-3 text-white placeholder-text-muted focus:outline-none focus:border-byd-red transition-colors duration-200"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-error/10 border border-error/20 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-byd-red text-white font-semibold py-3 px-6 hover:bg-byd-red/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
