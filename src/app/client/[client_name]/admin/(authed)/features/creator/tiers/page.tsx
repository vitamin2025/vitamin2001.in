"use client";

import { use, useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  GripVertical,
  Check,
  MessageSquare,
  Power,
  Pencil,
  Loader2,
  Layers,
} from "lucide-react";
import {
  useCreatorTiers,
  useCreateCreatorTier,
  useUpdateCreatorTier,
  useDeactivateCreatorTier,
  useReorderCreatorTiers,
  type CreatorTier,
} from "@/lib/client-admin/creator";
import { TierDialog } from "@/components/creator/tier-dialog";

interface SortableTierRowProps {
  tier: CreatorTier;
  onEdit: (tier: CreatorTier) => void;
  onToggleActive: (tier: CreatorTier) => void;
  isDeactivating: boolean;
}

function SortableTierRow({
  tier,
  onEdit,
  onToggleActive,
  isDeactivating,
}: SortableTierRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: tier.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  const isFree = tier.rank === 0 || tier.priceMinor === 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 rounded-xl border bg-white shadow-2xs transition-all ${
        tier.isActive
          ? "border-slate-200"
          : "border-slate-200 bg-slate-50/60 opacity-60"
      }`}
    >
      {/* Drag Handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 rounded"
        title="Drag to reorder rank"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Rank Badge */}
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs">
        {tier.rank}
      </div>

      {/* Tier Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-slate-900 truncate">{tier.name}</h3>
          {!tier.isActive && (
            <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
              Inactive
            </span>
          )}
          {tier.allowsDm && (
            <span className="inline-flex items-center gap-1 text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold border border-purple-200">
              <MessageSquare className="h-2.5 w-2.5" /> DMs
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500 truncate mt-0.5">
          {tier.description || "No description"}
        </p>
      </div>

      {/* Pricing */}
      <div className="text-right">
        <p className="text-sm font-extrabold text-slate-900">
          {isFree ? "Free" : `₹${(tier.priceMinor / 100).toFixed(0)}`}
        </p>
        <p className="text-[11px] text-slate-400 capitalize">{tier.interval}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
        <button
          type="button"
          onClick={() => onEdit(tier)}
          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Edit tier"
        >
          <Pencil className="h-4 w-4" />
        </button>

        <button
          type="button"
          disabled={isDeactivating}
          onClick={() => onToggleActive(tier)}
          className={`p-1.5 rounded-lg transition-colors ${
            tier.isActive
              ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50"
              : "text-emerald-600 hover:bg-emerald-50"
          }`}
          title={tier.isActive ? "Deactivate tier" : "Reactivate tier"}
        >
          <Power className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function CreatorTiersPage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const { data: tiers = [], isLoading } = useCreatorTiers(slug);
  const createTierMutation = useCreateCreatorTier(slug);
  const updateTierMutation = useUpdateCreatorTier(slug);
  const deactivateTierMutation = useDeactivateCreatorTier(slug);
  const reorderTiersMutation = useReorderCreatorTiers(slug);

  const [items, setItems] = useState<CreatorTier[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<CreatorTier | null>(null);

  useEffect(() => {
    if (tiers) {
      setItems(tiers);
    }
  }, [tiers]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    const reordered = arrayMove(items, oldIndex, newIndex);
    setItems(reordered);

    const tierIds = reordered.map((t) => t.id);
    await reorderTiersMutation.mutateAsync(tierIds);
  };

  const handleCreateOrUpdate = async (dto: any) => {
    if (editingTier) {
      await updateTierMutation.mutateAsync({
        tierId: editingTier.id,
        dto,
      });
    } else {
      await createTierMutation.mutateAsync(dto);
    }
  };

  const handleToggleActive = async (tier: CreatorTier) => {
    if (tier.isActive) {
      await deactivateTierMutation.mutateAsync(tier.id);
    } else {
      await updateTierMutation.mutateAsync({
        tierId: tier.id,
        dto: { isActive: true },
      });
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
          <h2 className="text-lg font-bold text-slate-900">Membership Tiers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure subscription levels. Drag and drop rows to adjust priority rank ordering.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTier(null);
            setDialogOpen(true);
          }}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="h-4 w-4" /> Create Tier
        </button>
      </div>

      {items.length > 0 ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            <div className="space-y-3">
              {items.map((tier) => (
                <SortableTierRow
                  key={tier.id}
                  tier={tier}
                  onEdit={(t) => {
                    setEditingTier(t);
                    setDialogOpen(true);
                  }}
                  onToggleActive={handleToggleActive}
                  isDeactivating={deactivateTierMutation.isPending}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      ) : (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center bg-white">
          <Layers className="h-10 w-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No tiers created yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Create membership tiers (e.g. Free Follower, Supporter, VIP) to begin gating exclusive content.
          </p>
          <button
            type="button"
            onClick={() => {
              setEditingTier(null);
              setDialogOpen(true);
            }}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" /> Create First Tier
          </button>
        </div>
      )}

      <TierDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreateOrUpdate}
        tier={editingTier}
        defaultRank={items.length}
      />
    </div>
  );
}
