"use client";

import { useState } from "react";
import { ExternalLink, Palette, Save, Sparkles, User, Globe2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { ColorPicker } from "@/components/ui/color-picker";
import { LoadingSpinner } from "@/components/common/loading-spinner";
import { MediaUploadField } from "@/components/storage/media-upload-field";
import {
  clientAdminRoutes,
  useClientDashboard,
  useLinktreePage,
  useLinktreePageCommands,
  type LinktreeButtonStyle,
  type LinktreePage,
} from "@/lib/client-admin";

const FONT_OPTIONS = [
  { value: "Inter", label: "Inter (Modern Sans)" },
  { value: "Poppins", label: "Poppins (Friendly & Rounded)" },
  { value: "Roboto", label: "Roboto (Clean & Classic)" },
  { value: "Playfair Display", label: "Playfair Display (Elegant Serif)" },
  { value: "Space Grotesk", label: "Space Grotesk (Tech & Geometric)" },
];

function SettingsForm({ page }: { page: LinktreePage | null }) {
  const dashboard = useClientDashboard();
  const slug = dashboard.organization.slug;
  const { updatePage, unpublish } = useLinktreePageCommands();

  // Form states initialized directly from page props
  const [title, setTitle] = useState(page?.title || "");
  const [bio, setBio] = useState(page?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(page?.avatarUrl || "");

  // Appearance
  const [backgroundColor, setBackgroundColor] = useState(page?.theme?.backgroundColor || "#0f172a");
  const [buttonColor, setButtonColor] = useState(page?.theme?.buttonColor || "#4f46e5");
  const [buttonStyle, setButtonStyle] = useState<LinktreeButtonStyle>(page?.theme?.buttonStyle || "pill");
  const [fontFamily, setFontFamily] = useState(page?.theme?.fontFamily || "Inter");

  // SEO / OpenGraph
  const [ogTitle, setOgTitle] = useState(page?.ogTitle || "");
  const [ogDescription, setOgDescription] = useState(page?.ogDescription || "");
  const [ogImage, setOgImage] = useState(page?.ogImage || "");

  const isSaving = updatePage.state.status === "running";

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePage.run({
      title,
      bio: bio || null,
      avatarUrl: avatarUrl || null,
      ogTitle: ogTitle || null,
      ogDescription: ogDescription || null,
      ogImage: ogImage || null,
      theme: {
        backgroundColor,
        buttonColor,
        buttonStyle,
        fontFamily,
      },
    });
  };

  const getButtonRadiusClass = () => {
    if (buttonStyle === "square") return "rounded-none";
    if (buttonStyle === "rounded") return "rounded-lg";
    return "rounded-full";
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Settings Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base">Profile & Branding</CardTitle>
              </div>
              <CardDescription>
                Customize your page name, description, and avatar seen at the top of your bio link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="page-title" className="text-xs font-semibold text-slate-700">
                  Page Display Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="page-title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Runachain Official Links"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="page-bio" className="text-xs font-semibold text-slate-700">
                  Bio / Tagline
                </Label>
                <Textarea
                  id="page-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell visitors who you are and what you do..."
                />
              </div>

              <MediaUploadField
                label="Avatar / Logo Image"
                description="Square profile image shown on your bio link"
                value={avatarUrl}
                onChange={setAvatarUrl}
                category="avatars"
                aspectRatio="square"
                clientId={slug}
              />

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Public Address: </span>
                <a
                  href={clientAdminRoutes.publicLinks(slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-indigo-600 hover:underline"
                >
                  /public/links
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Appearance Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base">Appearance & Theme</CardTitle>
              </div>
              <CardDescription>
                Customize colors, button styles, and typography for your public bio page.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Page Background Color
                </Label>
                <ColorPicker
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Link Button Color
                </Label>
                <ColorPicker
                  value={buttonColor}
                  onChange={setButtonColor}
                  presetColors={[
                    "#4f46e5",
                    "#2563eb",
                    "#0284c7",
                    "#059669",
                    "#e11d48",
                    "#d97706",
                    "#7c3aed",
                    "#111827",
                    "#ffffff",
                  ]}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="button-style" className="text-xs font-semibold text-slate-700">
                    Button Shape
                  </Label>
                  <Select
                    id="button-style"
                    value={buttonStyle}
                    onChange={(e) => setButtonStyle(e.target.value as LinktreeButtonStyle)}
                  >
                    <option value="pill">Pill (Full Rounded)</option>
                    <option value="rounded">Rounded Corners</option>
                    <option value="square">Square (No Radius)</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="font-family" className="text-xs font-semibold text-slate-700">
                    Font Family
                  </Label>
                  <Select
                    id="font-family"
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                  >
                    {FONT_OPTIONS.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-indigo-600" />
                <CardTitle className="text-base">Social Sharing & SEO (OpenGraph)</CardTitle>
              </div>
              <CardDescription>
                Control how your Linktree page appears when shared on iMessage, Twitter, WhatsApp, and social media.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="og-title" className="text-xs font-semibold text-slate-700">
                  OpenGraph Title
                </Label>
                <Input
                  id="og-title"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  placeholder="Defaults to Page Display Name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="og-desc" className="text-xs font-semibold text-slate-700">
                  OpenGraph Description
                </Label>
                <Textarea
                  id="og-desc"
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  placeholder="Defaults to Bio"
                />
              </div>

              <MediaUploadField
                label="OpenGraph Share Banner"
                description="Recommended size: 1200x630 (aspect ratio 1.91:1)"
                value={ogImage}
                onChange={setOgImage}
                category="banners"
                aspectRatio="banner"
                clientId={slug}
                placeholder="https://example.com/banner-1200x630.png"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Live Card Theme Preview & Danger Zone */}
        <div className="space-y-6">
          <Card className="sticky top-6 overflow-hidden">
            <CardHeader className="bg-slate-50 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <CardTitle className="text-sm">Theme Preview</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Interactive preview of your page style
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {/* Phone style mockup card */}
              <div
                className="relative flex flex-col items-center rounded-2xl p-6 text-center shadow-inner transition-colors duration-200"
                style={{
                  background: backgroundColor,
                  fontFamily: fontFamily,
                }}
              >
                <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-white/20 shadow-md">
                  {avatarUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/20 text-white font-bold">
                      {title ? title.slice(0, 1).toUpperCase() : "A"}
                    </div>
                  )}
                </div>

                <p className="mt-3 text-sm font-bold text-white drop-shadow-xs truncate max-w-full">
                  {title || "Your Name"}
                </p>
                <p className="mt-1 text-[11px] text-white/80 line-clamp-2">
                  {bio || "Your bio and short description will show here."}
                </p>

                {/* Sample Buttons */}
                <div className="mt-5 w-full space-y-2">
                  <div
                    className={`flex h-9 w-full items-center justify-center text-xs font-semibold text-white shadow-sm transition-all ${getButtonRadiusClass()}`}
                    style={{ backgroundColor: buttonColor }}
                  >
                    Official Website
                  </div>
                  <div
                    className={`flex h-9 w-full items-center justify-center text-xs font-semibold text-white shadow-sm opacity-90 ${getButtonRadiusClass()}`}
                    style={{ backgroundColor: buttonColor }}
                  >
                    Join Discord Server
                  </div>
                </div>

                <div className="mt-6 text-[10px] text-white/50">
                  Powered by Vitamin
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          {page?.isPublished && (
            <Card className="border-red-100 bg-red-50/20">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <CardTitle className="text-sm">Unpublish Page</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-1">
                <p className="text-xs text-slate-600">
                  Unpublishing will make your public bio page return a 404. You can publish it again anytime.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={unpublish.state.status === "running"}
                  onClick={() => void unpublish.run()}
                  className="w-full border-red-200 text-xs text-red-600 hover:bg-red-50"
                >
                  {unpublish.state.status === "running" ? "Unpublishing..." : "Unpublish Page"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Floating or Bottom Save Bar */}
      <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
        <Button
          type="submit"
          disabled={isSaving}
          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving Settings..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}

export default function LinktreeSettingsPage() {
  const { item: page, status } = useLinktreePage();

  if (status === "loading") {
    return <LoadingSpinner text="Loading settings..." />;
  }

  return (
    <SettingsForm
      key={page?.updatedAt || page?.id || "empty"}
      page={page}
    />
  );
}
