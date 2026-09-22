"use client";

import { use, useState } from "react";
import {
  Users,
  Shield,
  ShieldAlert,
  Loader2,
  UserCheck,
  Search,
  Filter,
} from "lucide-react";
import {
  useCreatorPatrons,
  useCreatorTiers,
  useGrantPatronTier,
  useRevokePatronTier,
  type Patron,
} from "@/lib/client-admin/creator";
import { GrantTierDialog } from "@/components/creator/grant-tier-dialog";

export default function CreatorPatronsPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const [statusFilter, setStatusFilter] = useState<string>("");
  const { data, isLoading } = useCreatorPatrons(slug, {
    status: statusFilter || undefined,
  });
  const { data: tiers = [] } = useCreatorTiers(slug);

  const grantTierMutation = useGrantPatronTier(slug);
  const revokeTierMutation = useRevokePatronTier(slug);

  const [selectedPatron, setSelectedPatron] = useState<Patron | null>(null);
  const [grantDialogOpen, setGrantDialogOpen] = useState(false);

  const patrons = data?.patrons || [];

  const handleGrant = async (tierId: string) => {
    if (!selectedPatron) return;
    await grantTierMutation.mutateAsync({
      patronId: selectedPatron.id,
      tierId,
    });
  };

  const handleRevoke = async (patron: Patron) => {
    if (confirm(`Revoke tier access for ${patron.user?.name || patron.userId}?`)) {
      await revokeTierMutation.mutateAsync(patron.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Patron Roster</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your fan community, manually grant tier upgrades, and view subscription statuses.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["", "active", "cancelled", "expired"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"
              }`}
            >
              {st || "All Patrons"}
            </button>
          ))}
        </div>
      </div>

      {patrons.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Supporter</th>
                  <th className="px-6 py-3.5">Membership Tier</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Subscribed On</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patrons.map((patron) => (
                  <tr key={patron.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">
                        {patron.user?.name || patron.userId}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {patron.user?.email || "No email"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {patron.tier?.name || (patron.tierRank === 0 ? "Free Follower" : `Level ${patron.tierRank}`)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          patron.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : patron.status === "cancelled"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {patron.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-slate-500">
                      {new Date(patron.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPatron(patron);
                          setGrantDialogOpen(true);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors border border-indigo-200"
                      >
                        Grant Tier
                      </button>

                      {patron.tierRank > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRevoke(patron)}
                          disabled={revokeTierMutation.isPending}
                          className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white">
          <Users className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No patrons found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {statusFilter
              ? `No supporters with '${statusFilter}' status.`
              : "As fans follow or subscribe, their memberships and statuses will appear here."}
          </p>
        </div>
      )}

      <GrantTierDialog
        isOpen={grantDialogOpen}
        onClose={() => {
          setGrantDialogOpen(false);
          setSelectedPatron(null);
        }}
        onGrant={handleGrant}
        patron={selectedPatron}
        tiers={tiers}
      />
    </div>
  );
}
