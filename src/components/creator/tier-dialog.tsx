"use client";

import { useState, useEffect } from "react";
import { X, Plus, Trash2, Loader2 } from "lucide-react";
import type { CreatorTier } from "@/lib/client-admin/creator";

interface TierDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tierData: any) => Promise<void>;
  tier?: CreatorTier | null;
  defaultRank?: number;
}

export function TierDialog({
  isOpen,
  onClose,
  onSubmit,
  tier,
  defaultRank = 1,
}: TierDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rank, setRank] = useState(defaultRank);
  const [priceRupees, setPriceRupees] = useState("299");
  const [currency, setCurrency] = useState("INR");
  const [interval, setInterval] = useState("monthly");
  const [allowsDm, setAllowsDm] = useState(false);
  const [benefits, setBenefits] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tier) {
      setName(tier.name);
      setDescription(tier.description || "");
      setRank(tier.rank);
      setPriceRupees(String(tier.priceMinor / 100));
      setCurrency(tier.currency || "INR");
      setInterval(tier.interval || "monthly");
      setAllowsDm(Boolean(tier.allowsDm));
      setBenefits(tier.benefits?.length ? tier.benefits : [""]);
    } else {
      setName("");
      setDescription("");
      setRank(defaultRank);
      setPriceRupees("299");
      setCurrency("INR");
      setInterval("monthly");
      setAllowsDm(false);
      setBenefits([""]);
    }
    setError(null);
  }, [tier, defaultRank, isOpen]);

  if (!isOpen) return null;

  const handleAddBenefit = () => setBenefits([...benefits, ""]);
  const handleBenefitChange = (index: number, val: string) => {
    const next = [...benefits];
    next[index] = val;
    setBenefits(next);
  };
  const handleRemoveBenefit = (index: number) => {
    setBenefits(benefits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Tier name is required.");
      return;
    }
    const priceMinor = Math.round(parseFloat(priceRupees || "0") * 100);
    if (isNaN(priceMinor) || priceMinor < 0) {
      setError("Valid price is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim() || undefined,
        rank: Number(rank),
        priceMinor,
        currency,
        interval,
        allowsDm,
        benefits: benefits.map((b) => b.trim()).filter(Boolean),
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Failed to save tier.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {tier ? "Edit Membership Tier" : "Create New Tier"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tier Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Supporter, VIP Collector"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Brief overview of who this tier is for"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tier Rank (Level) *
              </label>
              <input
                type="number"
                min={0}
                required
                value={rank}
                onChange={(e) => setRank(parseInt(e.target.value, 10))}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400 mt-1">Higher rank unlocks lower rank posts</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Price *
              </label>
              <div className="flex">
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 px-2.5 py-2 text-xs font-medium text-slate-600 focus:outline-hidden"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                </select>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={priceRupees}
                  onChange={(e) => setPriceRupees(e.target.value)}
                  className="w-full rounded-r-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Billing Interval
            </label>
            <select
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={allowsDm}
                onChange={(e) => setAllowsDm(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm font-medium text-slate-800">
                Allow Direct 1-to-1 Messaging with Creator
              </span>
            </label>
            <p className="text-xs text-slate-400 ml-6 mt-0.5">
              Patrons on this tier can send direct messages to the creator
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Tier Perks & Benefits
              </label>
              <button
                type="button"
                onClick={handleAddBenefit}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
              >
                <Plus className="h-3 w-3" /> Add Perk
              </button>
            </div>
            <div className="space-y-2">
              {benefits.map((b, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Full access to exclusive WIP sketches"
                    value={b}
                    onChange={(e) => handleBenefitChange(idx, e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-md px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                  {benefits.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveBenefit(idx)}
                      className="p-1 text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
              {tier ? "Update Tier" : "Create Tier"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
