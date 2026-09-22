"use client";

import React, { useState, useEffect } from "react";
import { X, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [orgInput, setOrgInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Clean subdomain slug: alphanumeric and hyphens only
  const cleanSubdomain = orgInput
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "");

  const handleClose = React.useCallback(() => {
    setOrgInput("");
    setError(null);
    onClose();
  }, [onClose]);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const handleLoginRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cleanSubdomain) {
      setError("Please enter your organization identifier");
      return;
    }

    const prodDomain =
      process.env.NEXT_PUBLIC_PRODUCTION_DOMAIN || "vitamin2001.in";

    const isLocalhost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1");

    // In local development, redirect to client subdomain on localhost or path
    const targetUrl = isLocalhost
      ? `http://${cleanSubdomain}.localhost:${window.location.port || "3000"}/user/login`
      : `https://${cleanSubdomain}.${prodDomain}/user/login`;

    window.location.href = targetUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all z-10"
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-slate-900">
                Client Portal Login
              </h2>
              <p className="text-xs text-slate-500">
                Access your organization&apos;s isolated tenant instance
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLoginRedirect} className="p-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="org-name"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
            >
              Organization Name or Subdomain
            </label>
            <div className="relative">
              <input
                id="org-name"
                type="text"
                value={orgInput}
                onChange={(e) => {
                  setOrgInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="e.g. acme or runachan"
                autoFocus
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 text-sm font-medium"
              />
            </div>
            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          </div>

          {/* Subdomain Preview Box */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Target Login Subdomain</span>
            </div>
            <p className="font-mono text-sm font-bold text-slate-800 break-all">
              {cleanSubdomain ? (
                <>
                  <span className="text-blue-600 font-semibold">{cleanSubdomain}</span>
                  <span>.vitamin2001.in/user/login</span>
                </>
              ) : (
                <span className="text-slate-400 font-normal">
                  [your-org].vitamin2001.in/user/login
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="text-slate-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-1.5 shadow-sm"
            >
              <span>Go to Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
