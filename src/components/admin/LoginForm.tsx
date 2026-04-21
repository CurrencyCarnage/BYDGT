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
        <label className="text-xs font-medium text-text-secondary uppercase tracking-widest">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className="bg-bg-tertiary border border-glass-border rounded-button px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-gt-green transition-colors duration-200"
          placeholder="Enter username"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-text-secondary uppercase tracking-widest">
          Password
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="bg-bg-tertiary border border-glass-border rounded-button px-4 py-3 text-text-primary placeholder-text-muted focus:outline-none focus:border-gt-green transition-colors duration-200"
          placeholder="Enter password"
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-error/10 border border-error/20 rounded-button px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 bg-gt-green text-bg-primary font-semibold py-3 px-6 rounded-button hover:bg-gt-green/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-glow-green"
      >
        {loading ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}
