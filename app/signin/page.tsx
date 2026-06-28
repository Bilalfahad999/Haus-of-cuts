"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInCard } from "@/components/ui/sign-in-card-2";

type Mode = "login" | "register";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const session = sessionStorage.getItem("client_session");
    if (session) router.replace("/appointments");
  }, [router]);

  const handleModeChange = (m: Mode) => {
    setMode(m);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const body =
        mode === "login"
          ? { action: "login", email, password }
          : { action: "register", email, password, name };
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      sessionStorage.setItem(
        "client_session",
        JSON.stringify({ email, name: data.name })
      );
      const redirect = new URLSearchParams(window.location.search).get("redirect");
      router.push(redirect === "booking" ? "/#booking" : "/appointments");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignInCard
      mode={mode}
      onModeChange={handleModeChange}
      onSubmit={handleSubmit}
      name={name}
      onNameChange={setName}
      email={email}
      onEmailChange={setEmail}
      password={password}
      onPasswordChange={setPassword}
      isLoading={loading}
      error={error}
    />
  );
}
