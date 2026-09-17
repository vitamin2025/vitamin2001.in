"use client";

import { useEffect, useState } from "react";
import { Check, Copy, Download, Loader2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { fetchLinkQrCode, type LinktreeLink, type QrCodeResult } from "@/lib/client-admin";

interface QrCodeDialogProps {
  link: LinktreeLink | null;
  open: boolean;
  onClose: () => void;
}

export function QrCodeDialog({ link, open, onClose }: QrCodeDialogProps) {
  const [loading, setLoading] = useState(false);
  const [qrData, setQrData] = useState<QrCodeResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const linkId = link?.id;
  const shortUrl = link?.shortUrl;
  const originalUrl = link?.originalUrl;

  useEffect(() => {
    if (!open || !linkId) {
      return;
    }

    let active = true;

    fetchLinkQrCode(linkId)
      .then((res) => {
        if (active) {
          setQrData(res);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          const target = shortUrl || originalUrl || "";
          const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(target)}`;
          setQrData({
            qrCodeUrl: fallbackUrl,
            shortUrl: target,
          });
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [open, linkId, shortUrl, originalUrl]);

  const targetUrl = qrData?.shortUrl || link?.shortUrl || link?.originalUrl || "";

  const handleClose = () => {
    setQrData(null);
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleCopy = async () => {
    if (!targetUrl) return;
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    if (!qrData?.qrCodeUrl && !qrData?.qrCodeSvg) return;
    const downloadUrl = qrData.qrCodeUrl || `data:image/svg+xml;utf8,${encodeURIComponent(qrData.qrCodeSvg || "")}`;
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `qr-${link?.title.toLowerCase().replace(/\s+/g, "-") || "link"}.png`;
    if (targetUrl) {
      a.setAttribute("target", "_blank");
    }
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title={link ? `QR Code: ${link.title}` : "QR Code"}
      footer={
        <div className="flex w-full items-center justify-between">
          <Button variant="outline" size="sm" onClick={handleClose}>
            Close
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!targetUrl}
              className="gap-1.5"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy Link"}
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleDownload}
              disabled={loading || !qrData}
              className="gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <Download className="h-3.5 w-3.5" />
              Download
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col items-center justify-center p-4 text-center">
        {loading ? (
          <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-500">Generating QR code...</p>
          </div>
        ) : qrData ? (
          <div className="space-y-4">
            <div className="mx-auto flex h-60 w-60 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
              {qrData.qrCodeSvg ? (
                <div
                  className="h-full w-full"
                  dangerouslySetInnerHTML={{ __html: qrData.qrCodeSvg }}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={qrData.qrCodeUrl}
                  alt={`QR Code for ${link?.title}`}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
            {targetUrl && (
              <p className="font-mono text-xs text-slate-600 break-all">
                {targetUrl}
              </p>
            )}
          </div>
        ) : (
          <div className="flex h-56 w-56 flex-col items-center justify-center gap-2 rounded-xl border border-slate-100 bg-slate-50">
            <QrCode className="h-10 w-10 text-slate-400" />
            <p className="text-xs text-slate-500">
              {error || "Unable to generate QR code"}
            </p>
          </div>
        )}
      </div>
    </Dialog>
  );
}
