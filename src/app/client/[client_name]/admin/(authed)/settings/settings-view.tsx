"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  AdminPageHeader,
  ErrorState,
  Field,
} from "@/components/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaUploadField } from "@/components/storage/media-upload-field";
import { ColorPicker } from "@/components/ui/color-picker";
import {
  useClientSettings,
  useClientSettingsCommands,
  useClientAdmin,
  useClientAdminAuthCommands,
  shopAccentColor,
} from "@/lib/client-admin";
import { useClientShop } from "@/lib/shop/client-shop";
import {
  Building2,
  KeyRound,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
  Lock,
  ShoppingBag,
} from "lucide-react";

function ClientSettingsForm({
  item,
}: {
  item: NonNullable<ReturnType<typeof useClientSettings>["item"]>;
}) {
  const { update } = useClientSettingsCommands();
  const [logoUrl, setLogoUrl] = useState(item.logoUrl ?? "");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const formError =
    update.fieldErrors?._form?.[0] ??
    (update.state.status === "failed" ? update.state.error.message : null);

  return (
    <form
      className="space-y-4 max-w-lg"
      onSubmit={async (event) => {
        event.preventDefault();
        setSavedSuccess(false);
        const form = new FormData(event.currentTarget);
        try {
          await update.run({
            name: String(form.get("name") ?? ""),
            logoUrl: logoUrl || "",
          });
          setSavedSuccess(true);
        } catch {
          // Handled by update.state
        }
      }}
    >
      <Field label="Organization Display Name" error={update.fieldErrors?.name?.[0]}>
        <Input
          name="name"
          defaultValue={item.name}
          placeholder="e.g. Acme Studio"
          required
        />
      </Field>

      <MediaUploadField
        label="Organization Logo"
        value={logoUrl}
        onChange={setLogoUrl}
        category="avatars"
        clientId={item.slug}
        error={update.fieldErrors?.logo?.[0]}
      />

      {savedSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Organization settings saved successfully.</span>
        </div>
      )}

      {formError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={update.state.status === "running"}
        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
      >
        {update.state.status === "running" ? "Saving Changes..." : "Save Organization Settings"}
      </Button>
    </form>
  );
}

/** The shared storefront's default accent colour (indigo), as in src/styles/shop.css. */
const DEFAULT_SHOP_ACCENT = "#4f46e5";
const SHOP_ACCENT_PRESETS = [
  "#4f46e5",
  "#0f766e",
  "#15803d",
  "#b45309",
  "#be123c",
  "#7e22ce",
  "#0369a1",
  "#1e293b",
];

function ShopBrandingForm({
  item,
}: {
  item: NonNullable<ReturnType<typeof useClientSettings>["item"]>;
}) {
  const { updateShopAccent } = useClientSettingsCommands();
  const saved = shopAccentColor(item);
  const [color, setColor] = useState(saved ?? DEFAULT_SHOP_ACCENT);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const valid = /^#[0-9a-f]{6}$/i.test(color);
  const running = updateShopAccent.state.status === "running";
  const formError =
    updateShopAccent.fieldErrors?.shopAccentColor?.[0] ??
    updateShopAccent.fieldErrors?._form?.[0] ??
    (updateShopAccent.state.status === "failed" ? updateShopAccent.state.error.message : null);

  const save = async (next: string | null) => {
    setSavedSuccess(false);
    try {
      await updateShopAccent.run({ color: next });
      if (!next) setColor(DEFAULT_SHOP_ACCENT);
      setSavedSuccess(true);
    } catch {
      // Handled by updateShopAccent.state
    }
  };

  return (
    <form
      className="space-y-4 max-w-lg"
      onSubmit={(event) => {
        event.preventDefault();
        if (valid) void save(color.toLowerCase());
      }}
    >
      <Field label="Accent colour" error={!valid ? "Use a colour like #0f766e." : undefined}>
        <ColorPicker
          value={color}
          onChange={(value) => {
            setColor(value);
            setSavedSuccess(false);
          }}
          presetColors={SHOP_ACCENT_PRESETS}
          disabled={running}
        />
      </Field>

      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <span
          className="inline-flex h-9 items-center rounded-full px-4 text-xs font-semibold text-white shadow-xs"
          style={{ backgroundColor: valid ? color : DEFAULT_SHOP_ACCENT }}
        >
          Add to cart
        </span>
        <span
          className="inline-flex h-7 items-center rounded-full border px-3 text-xs font-medium"
          style={valid ? { borderColor: color, color } : undefined}
        >
          60 caps
        </span>
        <span className="text-xs text-slate-500">Preview</span>
      </div>
      <p className="text-xs text-slate-500">
        Buttons, links and highlights in your shop use this colour. Changes show in your shop within
        about two minutes.
      </p>

      {savedSuccess && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>Shop colour saved.</span>
        </div>
      )}
      {formError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{formError}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={!valid || running}
          className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
        >
          {running ? "Saving..." : "Save Shop Colour"}
        </Button>
        {saved && (
          <Button
            type="button"
            variant="outline"
            disabled={running}
            onClick={() => void save(null)}
            className="text-xs"
          >
            Use the default colour
          </Button>
        )}
        <a
          href={`/client/${encodeURIComponent(item.slug)}/shop`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-indigo-600 hover:underline"
        >
          View your shop
        </a>
      </div>
    </form>
  );
}

function UserPasswordChangeForm() {
  const { changePassword } = useClientAdminAuthCommands();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [clientError, setClientError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setClientError(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setClientError("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setClientError("New password and confirmation password do not match.");
      return;
    }

    try {
      await changePassword.run({
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Your password has been changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      // Error handled by command state
    }
  };

  const isRunning = changePassword.state.status === "running";
  const serverError =
    changePassword.state.status === "failed"
      ? changePassword.state.error.message || "Failed to change password. Please check your current password."
      : null;

  return (
    <form className="space-y-4 max-w-lg" onSubmit={handleSubmit}>
      <Field label="Current Password">
        <Input
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
      </Field>

      <Field label="New Password">
        <Input
          type="password"
          name="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Minimum 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </Field>

      <Field label="Confirm New Password">
        <Input
          type="password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-type new password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </Field>

      {clientError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{clientError}</span>
        </div>
      )}

      {serverError && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isRunning}
        className="text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
      >
        {isRunning ? "Changing Password..." : "Change Password"}
      </Button>
    </form>
  );
}

export function SettingsView() {
  const settings = useClientSettings();
  const { actor, dashboard } = useClientAdmin();
  const item = settings.item;
  const shop = useClientShop(dashboard.organization.slug);
  const hasShop = Boolean(item?.features.includes("shop") || shop.data);

  if (settings.status === "failed" && settings.error) {
    return <ErrorState error={settings.error} onRetry={settings.reload} />;
  }

  if (!item) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="space-y-8 pb-12">
      <AdminPageHeader
        title="Settings"
        description="Manage workspace organization branding and your administrator account credentials."
      />

      <div className="space-y-8">
        {/* Section 1: Organization Settings */}
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  1. Organization Settings
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Update this organization&apos;s public display name and avatar logo.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ClientSettingsForm key={item.id} item={item} />
          </CardContent>
        </Card>

        {hasShop && (
          <Card className="border-slate-200 bg-white shadow-2xs">
            <CardHeader className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-slate-900">Shop Branding</CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Choose the colour of your shop. Its logo and banner come from your shop profile.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <ShopBrandingForm key={item.id} item={item} />
            </CardContent>
          </Card>
        )}

        {/* Section 2: User Settings & Security */}
        <Card className="border-slate-200 bg-white shadow-2xs">
          <CardHeader className="border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-base font-bold text-slate-900">
                  2. User Settings & Security
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Manage the administrator account currently signed into this workspace.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* User Profile Context Details */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Logged in as
                </p>
                <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-slate-500" />
                  <span>{actor.name || "Administrator"}</span>
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Email Address
                </p>
                <p className="text-sm font-medium text-slate-700 mt-0.5">
                  {actor.email}
                </p>
              </div>
            </div>

            {/* Change Password Form Sub-section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <KeyRound className="h-4 w-4 text-indigo-600" />
                <span>Change Account Password</span>
              </div>
              <p className="text-xs text-slate-500">
                Enter your existing password and choose a secure new password of at least 8 characters.
              </p>
              <UserPasswordChangeForm />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
