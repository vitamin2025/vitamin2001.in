"use client";

import { useState } from "react";
import { X, Loader2, ShieldCheck } from "lucide-react";
import type { CreatorTier, Patron } from "@/lib/client-admin/creator";

interface GrantTierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGrant: (tierId: string) => Promise<void>;
  patron: Patron | null;
  tiers: CreatorTier[];
}

export function GrantTierDialog({
  isOpen,
  onClose,
  onGrant,
  patron,
  tiers,
}: GrantTierDialogProps) {
  const [selectedTierId, setSelectedTierId] = useState<string>(
    tiers[0]?.id || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !patron) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierId) {
      setError("Please select a tier to grant.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onGrant(selectedTierId);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to grant tier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Grant Tier Access</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1">
            <p>
              <span className="font-semibold text-slate-800">Patron:</span>{" "}
              {patron.user?.name || patron.userId}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Email:</span>{" "}
              {patron.user?.email || "No email on record"}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Current Tier:</span>{" "}
              {patron.tier?.name || (patron.tierRank === 0 ? "Free Follower" : "None")}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select New Tier to Grant *
            </label>
            <select
              value={selectedTierId}
              onChange={(e) => setSelectedTierId(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              {tiers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (Level {t.rank} • ₹{(t.priceMinor / 100).toFixed(2)})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Manual tier grants activate immediate full access to all posts at or below this tier level.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-2xs disabled:opacity-50 transition-colors"
            >
              {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Grant Access
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
