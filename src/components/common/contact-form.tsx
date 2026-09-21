"use client";

import React, { useState } from "react";
import { isAxiosError } from "axios";
import { apiClient } from "@/lib/axios";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }

    setStatus("loading");
    setErrorMessage(null);

    try {
      await apiClient.post("/contact", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err: unknown) {
      console.error("Failed to submit contact form:", err);
      let serverMessage: unknown =
        "Failed to send your inquiry. Please try again or email us directly at contact@vitamin2001.in.";
      if (isAxiosError(err) && err.response?.data?.message) {
        serverMessage = err.response.data.message;
      }
      setErrorMessage(
        Array.isArray(serverMessage)
          ? serverMessage.join(", ")
          : typeof serverMessage === "string"
            ? serverMessage
            : "Failed to send inquiry."
      );
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Message Sent Successfully!</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Thank you for reaching out to <strong>vitamin2001.in</strong>. Our engineering and consulting
            team will review your inquiry and respond within 24 hours.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setStatus("idle")}
          className="border-emerald-300 text-emerald-800 hover:bg-emerald-100"
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {errorMessage && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700">
            Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            maxLength={100}
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            maxLength={255}
            placeholder="john@company.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700">
          Project or Requirement Details <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          maxLength={3000}
          placeholder="Tell us about your project requirements, expected timeline, or questions..."
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 text-sm text-slate-900 placeholder:text-slate-400 bg-white resize-y min-h-[100px]"
        />
      </div>

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold gap-2 px-6 py-2.5 shadow-sm"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Sending Inquiry...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Submit Inquiry</span>
          </>
        )}
      </Button>
    </form>
  );
}
