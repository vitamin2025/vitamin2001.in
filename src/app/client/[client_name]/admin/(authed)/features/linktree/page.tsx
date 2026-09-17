"use client";

import { useState } from "react";
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
} from "@dnd-kit/sortable";
import { Link2, Plus, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { EmptyState } from "@/components/admin/empty-state";
import {
  LinkCard,
  LinkDialog,
  QrCodeDialog,
  SocialLinkCard,
  SocialLinkDialog,
} from "@/components/client-admin/linktree";
import {
  useClientDashboard,
  useLinktreeLinkCommands,
  useLinktreePage,
  useLinktreePageCommands,
  useLinktreeSocialLinkCommands,
  type LinktreeLink,
  type LinktreeSocialLink,
} from "@/lib/client-admin";

export default function LinktreeAdminPage() {
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;

  const { item: page, status, reload } = useLinktreePage();
  const { createPage } = useLinktreePageCommands();
  const { reorderLinks } = useLinktreeLinkCommands();
  const { reorderSocialLinks } = useLinktreeSocialLinkCommands();

  // Dialog states
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<LinktreeLink | null>(null);

  const [socialDialogOpen, setSocialDialogOpen] = useState(false);
  const [editingSocialLink, setEditingSocialLink] = useState<LinktreeSocialLink | null>(null);

  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrLink, setQrLink] = useState<LinktreeLink | null>(null);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  if (status === "loading") {
    return <LoadingSpinner text="Loading linktree..." />;
  }

  // If no page exists yet, prompt to initialize
  if (!page && status === "ready") {
    return (
      <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Set Up Your Linktree Page
        </h2>
        <p className="mt-1.5 max-w-md text-sm text-slate-500">
          You don&apos;t have a Linktree bio page configured for{" "}
          <span className="font-semibold text-slate-800">{dashboard.organization.name}</span>{" "}
          yet. Initialize it with one click to start creating and sharing your links.
        </p>
        <Button
          onClick={() => {
            void createPage.run({
              slug,
              title: dashboard.organization.name,
              bio: `Welcome to the official links page for ${dashboard.organization.name}.`,
            });
          }}
          disabled={createPage.state.status === "running"}
          className="mt-6 gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Sparkles className="h-4 w-4" />
          {createPage.state.status === "running"
            ? "Creating Page..."
            : "Initialize Linktree Page"}
        </Button>
      </div>
    );
  }

  const links = page?.links ? [...page.links].sort((a, b) => a.position - b.position) : [];
  const socialLinks = page?.socialLinks
    ? [...page.socialLinks].sort((a, b) => a.position - b.position)
    : [];

  // Drag handlers
  const handleLinkDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex((item) => item.id === active.id);
    const newIndex = links.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(links, oldIndex, newIndex);
    void reorderLinks.run({ orderedIds: reordered.map((l) => l.id) });
  };

  const handleSocialDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = socialLinks.findIndex((item) => item.id === active.id);
    const newIndex = socialLinks.findIndex((item) => item.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(socialLinks, oldIndex, newIndex);
    void reorderSocialLinks.run({ orderedIds: reordered.map((s) => s.id) });
  };

  // Button move handlers
  const moveLink = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const reordered = arrayMove(links, index, targetIndex);
    void reorderLinks.run({ orderedIds: reordered.map((l) => l.id) });
  };

  const moveSocial = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= socialLinks.length) return;
    const reordered = arrayMove(socialLinks, index, targetIndex);
    void reorderSocialLinks.run({ orderedIds: reordered.map((s) => s.id) });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="links" className="w-full">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
          <TabsList>
            <TabsTrigger value="links" className="gap-2">
              <Link2 className="h-4 w-4" />
              <span>Bio Links ({links.length})</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span>Social Profiles ({socialLinks.length})</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setEditingLink(null);
                setLinkDialogOpen(true);
              }}
              size="sm"
              className="gap-1.5 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </Button>
            <Button
              onClick={() => {
                setEditingSocialLink(null);
                setSocialDialogOpen(true);
              }}
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs text-slate-700"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Social Profile
            </Button>
          </div>
        </div>

        {/* Links Tab Content */}
        <TabsContent value="links" className="space-y-4 pt-2">
          {links.length === 0 ? (
            <EmptyState>
              <div className="space-y-3">
                <p className="font-semibold text-slate-700">No links added yet</p>
                <p className="text-xs text-slate-500">
                  Add your website, store, portfolio, or latest articles to your bio link page.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingLink(null);
                    setLinkDialogOpen(true);
                  }}
                  className="mt-2 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add First Link
                </Button>
              </div>
            </EmptyState>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleLinkDragEnd}
            >
              <SortableContext
                items={links.map((l) => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2.5">
                  {links.map((link, idx) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onEdit={(l) => {
                        setEditingLink(l);
                        setLinkDialogOpen(true);
                      }}
                      onQr={(l) => {
                        setQrLink(l);
                        setQrDialogOpen(true);
                      }}
                      onMoveUp={() => moveLink(idx, -1)}
                      onMoveDown={() => moveLink(idx, 1)}
                      isFirst={idx === 0}
                      isLast={idx === links.length - 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabsContent>

        {/* Social Links Tab Content */}
        <TabsContent value="social" className="space-y-4 pt-2">
          {socialLinks.length === 0 ? (
            <EmptyState>
              <div className="space-y-3">
                <p className="font-semibold text-slate-700">No social links connected</p>
                <p className="text-xs text-slate-500">
                  Connect your social profiles so visitors can find you across platforms.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setEditingSocialLink(null);
                    setSocialDialogOpen(true);
                  }}
                  className="mt-2 bg-indigo-600 text-xs text-white hover:bg-indigo-700"
                >
                  <Plus className="mr-1 h-3.5 w-3.5" />
                  Add Social Link
                </Button>
              </div>
            </EmptyState>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSocialDragEnd}
            >
              <SortableContext
                items={socialLinks.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2.5">
                  {socialLinks.map((social, idx) => (
                    <SocialLinkCard
                      key={social.id}
                      socialLink={social}
                      onEdit={(s) => {
                        setEditingSocialLink(s);
                        setSocialDialogOpen(true);
                      }}
                      onMoveUp={() => moveSocial(idx, -1)}
                      onMoveDown={() => moveSocial(idx, 1)}
                      isFirst={idx === 0}
                      isLast={idx === socialLinks.length - 1}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialog Modals */}
      <LinkDialog
        open={linkDialogOpen}
        onClose={() => {
          setLinkDialogOpen(false);
          setEditingLink(null);
          reload();
        }}
        link={editingLink}
      />

      <SocialLinkDialog
        open={socialDialogOpen}
        onClose={() => {
          setSocialDialogOpen(false);
          setEditingSocialLink(null);
          reload();
        }}
        socialLink={editingSocialLink}
      />

      <QrCodeDialog
        open={qrDialogOpen}
        onClose={() => {
          setQrDialogOpen(false);
          setQrLink(null);
        }}
        link={qrLink}
      />
    </div>
  );
}
