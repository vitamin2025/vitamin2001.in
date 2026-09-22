"use client";

import { use, useState, useEffect } from "react";
import { Loader2, Plus, Trash2, CheckCircle2 } from "lucide-react";
import {
  useCreatorProfile,
  useUpdateCreatorProfile,
} from "@/lib/client-admin/creator";

export default function CreatorProfilePage({
  params,
}: {
  params: Promise<{ client_name: string }>;
}) {
  const { client_name: slug } = use(params);

  const { data: profile, isLoading } = useCreatorProfile(slug);
  const updateProfileMutation = useUpdateCreatorProfile(slug);

  const [bio, setBio] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [aboutHtml, setAboutHtml] = useState("");
  const [socialLinks, setSocialLinks] = useState<Array<{ platform: string; url: string }>>([]);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || "");
      setBannerUrl(profile.bannerUrl || "");
      setAboutHtml(profile.aboutHtml || "");
      setSocialLinks(profile.socialLinks || []);
    }
  }, [profile]);

  const handleAddSocial = () => {
    setSocialLinks([...socialLinks, { platform: "twitter", url: "" }]);
  };

  const handleSocialChange = (index: number, field: "platform" | "url", val: string) => {
    const next = [...socialLinks];
    next[index] = { ...next[index], [field]: val };
    setSocialLinks(next);
  };

  const handleRemoveSocial = (index: number) => {
    setSocialLinks(socialLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(false);

    await updateProfileMutation.mutateAsync({
      bio,
      bannerUrl: bannerUrl.trim() || undefined,
      aboutHtml: aboutHtml.trim() || undefined,
      socialLinks: socialLinks.filter((s) => Boolean(s.url.trim())),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Creator Profile & Branding</h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize your public studio presence, banner image, bio, and connected social media profiles.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
        {savedSuccess && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Creator profile updated successfully!</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Studio Bio / Tagline
          </label>
          <textarea
            rows={3}
            placeholder="Tell your supporters about your creative journey..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/banner.jpg"
            value={bannerUrl}
            onChange={(e) => setBannerUrl(e.target.value)}
            className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
          {bannerUrl && (
            <div className="mt-2 h-32 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              <img src={bannerUrl} alt="Banner preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            About the Creator (Detailed HTML or Text)
          </label>
          <textarea
            rows={5}
            placeholder="<p>Full description and story behind your creations...</p>"
            value={aboutHtml}
            onChange={(e) => setAboutHtml(e.target.value)}
            className="w-full text-sm font-mono border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              Social Links
            </label>
            <button
              type="button"
              onClick={handleAddSocial}
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <Plus className="h-3 w-3" /> Add Link
            </button>
          </div>

          <div className="space-y-2">
            {socialLinks.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <select
                  value={item.platform}
                  onChange={(e) => handleSocialChange(idx, "platform", e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs text-slate-700 focus:outline-hidden"
                >
                  <option value="twitter">Twitter / X</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                  <option value="discord">Discord</option>
                  <option value="github">GitHub</option>
                  <option value="website">Website</option>
                </select>
                <input
                  type="url"
                  placeholder="https://..."
                  value={item.url}
                  onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                  className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSocial(idx)}
                  className="p-1.5 text-slate-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={updateProfileMutation.isPending}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs disabled:opacity-50 transition-colors"
          >
            {updateProfileMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
