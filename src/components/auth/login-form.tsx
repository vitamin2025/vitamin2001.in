"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { login } from "@/lib/auth";
import { Lock, Mail } from "lucide-react";

interface LoginFormProps {
  clientName: string;
  clientDisplayName?: string;
}

export function LoginForm({ clientName, clientDisplayName }: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(`admin@${clientName}.vitamin2001.in`);
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password, client: clientName });
      // Redirect to the client's admin dashboard
      router.push(`/client/${clientName}/admin`);
    } catch {
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-slate-200">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-indigo-600 mb-1">
          <Lock className="w-5 h-5" />
          <span className="text-xs uppercase font-bold tracking-wider">
            {clientDisplayName || clientName} Admin Portal
          </span>
        </div>
        <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
        <CardDescription>
          Enter your credentials to access the {clientDisplayName || clientName}{" "}
          administrative console.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="pl-9"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pl-9"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="rounded-md bg-slate-50 p-3 text-xs text-slate-500 border border-slate-100">
            <strong>Boilerplate Note:</strong> Pre-configured with demo admin credentials. Click below to sign in. Easily integrable with Better Auth later.
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
            {loading ? "Authenticating..." : "Sign In to Admin Panel"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
