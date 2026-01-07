"use client";

import { useMemo, useState, useEffect } from "react";

type Platform = "telegram" | "instagram";
type Theme = "v1" | "v2" | "v3";

type PublishResponse = {
  ok: boolean;
  message?: string;
  error?: string;
};

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("telegram");
  const [message, setMessage] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<PublishResponse | null>(null);
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("v1");

  useEffect(() => {
    setMounted(true);
  }, []);

  const canSubmit = useMemo(
    () => message.trim().length > 0 && !isSubmitting,
    [message, isSubmitting],
  );

  async function handlePublish(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          platform,
          imageUrl: imageUrl.trim() || undefined,
        }),
      });

      const payload: PublishResponse = await response.json();
      setResult(payload);
      
      if (payload.ok) {
        setTimeout(() => {
          setMessage("");
          setImageUrl("");
        }, 500);
      }
    } catch (error) {
      setResult({
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Unexpected error while publishing post.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Theme V1 - Light with animated gradient
  const renderThemeV1 = () => (
    <>
      <div className="gradient-bg absolute inset-0 -z-10" />
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-purple-300 opacity-20 blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute left-1/2 top-1/4 h-64 w-64 rounded-full bg-pink-300 opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className={`w-full max-w-3xl glass rounded-3xl p-6 shadow-2xl sm:p-8 md:p-10 ${mounted ? 'animate-scale-in' : 'opacity-0'}`}>
        {renderForm("v1")}
      </div>
    </>
  );

  // Theme V2 - Dark with animated SVG
  const renderThemeV2 = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
      <div className="absolute inset-0 opacity-[0.15]">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(148, 163, 184, 0.2)" strokeWidth="0.5" />
            </pattern>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(139, 92, 246, 0.2)" />
              <stop offset="50%" stopColor="rgba(168, 85, 247, 0.15)" />
              <stop offset="100%" stopColor="rgba(99, 102, 241, 0.2)" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="10%" cy="20%" r="2" fill="url(#gradient)" className="animate-float" />
          <circle cx="90%" cy="30%" r="2.5" fill="url(#gradient)" className="animate-float" style={{ animationDelay: '2s' }} />
          <circle cx="50%" cy="10%" r="1.5" fill="url(#gradient)" className="animate-float" style={{ animationDelay: '4s' }} />
        </svg>
      </div>
      <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl animate-float-slow" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl animate-float-slow" style={{ animationDelay: '3s' }} />
      <div className={`relative w-full max-w-3xl rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10 ${mounted ? 'animate-scale-in' : 'opacity-0'}`}
        style={{ 
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
        }}>
        <div className="relative z-10">
          {renderForm("v2")}
        </div>
      </div>
    </>
  );

  // Theme V3 - Minimalist clean theme
  const renderThemeV3 = () => (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/50" />
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>
      <div className={`w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10 ${mounted ? 'animate-scale-in opacity-100' : 'opacity-0'}`}>
        {renderForm("v3")}
      </div>
    </>
  );

  // Form component that adapts to theme
  const renderForm = (currentTheme: Theme) => {
    const isV2 = currentTheme === "v2";
    const isV3 = currentTheme === "v3";
    
    return (
      <>
        {/* Theme Switcher */}
        <div className="mb-6 flex justify-end">
          <div className={`inline-flex rounded-lg border p-1 shadow-sm backdrop-blur-sm ${
            isV2 
              ? "border-slate-700/50 bg-slate-800/40" 
              : "border-slate-200 bg-white/50"
          }`}>
            {(["v1", "v2", "v3"] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  theme === t
                    ? isV2
                      ? "bg-slate-700 text-white shadow-md border border-slate-600/50"
                      : isV3
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-purple-600 text-white shadow-md"
                    : isV2
                    ? "text-slate-400 hover:bg-slate-800/60 hover:text-slate-300"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Header */}
        <div className={`flex flex-col gap-3 mb-8 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <div className={`h-1 w-12 rounded-full ${
              isV2 ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" :
              isV3 ? "bg-gradient-to-r from-blue-400 to-indigo-400" :
              "bg-gradient-to-r from-purple-500 to-pink-500"
            }`} />
            <p className={`text-xs font-bold uppercase tracking-widest ${
              isV2 ? "text-slate-400" : isV3 ? "text-blue-600" : "text-purple-600"
            }`}>
              Social Media Auto-Poster
            </p>
          </div>
            <h1 className={`text-3xl font-bold sm:text-4xl md:text-5xl ${
            isV2 
              ? "text-white"
              : isV3
              ? "text-slate-900"
              : "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent"
          }`}>
            {isV2 ? (
              <>
                <span className="text-white">Publish Instantly</span>
                <br />
                <span className="text-slate-300">
                  Share Everywhere
                </span>
              </>
            ) : (
              "Publish to Social Media"
            )}
          </h1>
          <p className={`text-sm sm:text-base ${
            isV2 ? "text-slate-400" : isV3 ? "text-slate-600" : "text-slate-600"
          }`}>
            {isV2 
              ? "Craft your message, choose your platform, and reach your audience in seconds."
              : "Craft your message, pick a platform, and post with a single click."
            }
          </p>
        </div>

        <form onSubmit={handlePublish} className="space-y-6">
          {/* Message Input */}
          <div className={`space-y-2 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
            <label className={`text-sm font-semibold flex items-center gap-2 ${
              isV2 ? "text-slate-200" : "text-slate-700"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                isV2 ? "bg-slate-500" :
                isV3 ? "bg-blue-400" :
                "bg-purple-500"
              }`} />
              Message
            </label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Share your update, release note, or announcement..."
              rows={4}
              className={`w-full rounded-xl border px-5 py-4 transition-all duration-300 placeholder:text-slate-400 focus:outline-none ${
                isV2
                  ? "border-slate-700/50 bg-slate-800/40 text-slate-200 backdrop-blur-sm focus:border-slate-600 focus:bg-slate-800/60 focus:ring-1 focus:ring-slate-600/30 hover:border-slate-700"
                  : isV3
                  ? "border-slate-200 bg-white text-slate-900 shadow-lg focus:border-blue-400 focus:shadow-xl focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                  : "border-2 border-slate-200 bg-white/80 text-slate-900 backdrop-blur-sm shadow-lg focus:border-purple-400 focus:bg-white focus:shadow-xl focus:ring-4 focus:ring-purple-100 hover:border-slate-300"
              }`}
            />
            <div className={`flex items-center gap-2 text-xs ${
              isV2 ? "text-slate-400" : "text-slate-500"
            }`}>
              <span className="h-1 w-1 rounded-full bg-slate-400" />
              {message.length} characters
            </div>
          </div>

          {/* Platform Selection */}
          <div className={`space-y-3 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
            <p className={`text-sm font-semibold flex items-center gap-2 ${
              isV2 ? "text-slate-200" : "text-slate-700"
            }`}>
              <span className={`h-1.5 w-1.5 rounded-full ${
                isV2 ? "bg-slate-500" :
                isV3 ? "bg-blue-400" :
                "bg-purple-500"
              }`} />
              Platform
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { value: "telegram", label: "Telegram", icon: "✈️" },
                { value: "instagram", label: "Instagram", icon: "📷" },
              ].map((option, index) => {
                const isSelected = platform === option.value;
                const isTelegram = option.value === "telegram";
                return (
                  <label
                    key={option.value}
                    className={`group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border px-5 py-4 transition-all duration-300 ${
                      isSelected
                        ? isV2
                          ? isTelegram
                            ? "border-indigo-500/50 bg-slate-800/80 text-white shadow-lg shadow-indigo-500/20 scale-[1.02] ring-1 ring-indigo-500/30"
                            : "border-purple-500/50 bg-slate-800/80 text-white shadow-lg shadow-purple-500/20 scale-[1.02] ring-1 ring-purple-500/30"
                          : isV3
                          ? isTelegram
                            ? "border-blue-400 bg-blue-50 text-blue-900 shadow-md scale-105"
                            : "border-purple-400 bg-purple-50 text-purple-900 shadow-md scale-105"
                          : "border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/50 scale-105"
                        : isV2
                        ? "border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/60 hover:scale-[1.01]"
                        : isV3
                        ? "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:shadow-xl hover:scale-[1.02]"
                        : "border-slate-200 bg-white/80 hover:border-purple-300 hover:shadow-xl hover:scale-[1.02]"
                    } ${mounted ? 'animate-slide-in opacity-100' : 'opacity-0'}`}
                    style={{ animationDelay: `${0.3 + index * 0.1}s` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transition-transform group-hover:scale-110">{option.icon}</span>
                      <span className="text-sm font-semibold capitalize">
                        {option.label}
                      </span>
                    </div>
                    <div className={`relative h-5 w-5 rounded-full border transition-all ${
                      isSelected
                        ? isV2
                          ? isTelegram
                            ? "border-indigo-400 bg-indigo-500/20 ring-1 ring-indigo-400/30"
                            : "border-purple-400 bg-purple-500/20 ring-1 ring-purple-400/30"
                          : isV3
                          ? isTelegram
                            ? "border-blue-500 bg-blue-500"
                            : "border-purple-500 bg-purple-500"
                          : "border-white bg-white"
                        : isV2
                        ? "border-slate-600 group-hover:border-slate-500"
                        : "border-slate-300 group-hover:border-purple-400"
                    }`}>
                      {isSelected && (
                        <div className={`absolute inset-0 m-auto rounded-full animate-scale-in ${
                          isV2 
                            ? isTelegram
                              ? "h-2.5 w-2.5 bg-indigo-400"
                              : "h-2.5 w-2.5 bg-purple-400"
                            : isV3 ? "h-2.5 w-2.5 bg-white" : "h-2.5 w-2.5 bg-purple-500"
                        }`} />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="platform"
                      value={option.value}
                      checked={isSelected}
                      onChange={() => setPlatform(option.value as Platform)}
                      className="sr-only"
                    />
                  </label>
                );
              })}
            </div>
          </div>

          {/* Instagram Image URL */}
          {platform === "instagram" && (
            <div className={`space-y-2 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <label className={`text-sm font-semibold flex items-center gap-2 ${
                isV2 ? "text-slate-200" : "text-slate-700"
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  isV2 ? "bg-gradient-to-r from-purple-400 to-pink-400" :
                  isV3 ? "bg-blue-400" :
                  "bg-purple-500"
                }`} />
                Image URL (required by Instagram Graph API)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="https://images.example.com/announcement.jpg"
                className={`w-full rounded-xl border px-5 py-3 transition-all duration-300 placeholder:text-slate-400 focus:outline-none ${
                  isV2
                    ? "border-slate-700/50 bg-slate-800/40 text-slate-200 backdrop-blur-sm focus:border-slate-600 focus:bg-slate-800/60 focus:ring-1 focus:ring-slate-600/30 hover:border-slate-700"
                    : isV3
                    ? "border-slate-200 bg-white text-slate-900 shadow-lg focus:border-blue-400 focus:shadow-xl focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                    : "border-2 border-slate-200 bg-white/80 text-slate-900 backdrop-blur-sm shadow-lg focus:border-purple-400 focus:bg-white focus:shadow-xl focus:ring-4 focus:ring-purple-100 hover:border-slate-300"
                }`}
              />
              <p className={`flex items-start gap-2 text-xs ${
                isV2 ? "text-slate-400" : "text-slate-500"
              }`}>
                <span className="mt-1.5 h-1 w-1 rounded-full bg-slate-400" />
                Instagram&apos;s API needs a publicly reachable image. Store a default URL in `IG_DEFAULT_IMAGE_URL` if you don&apos;t want to enter it each time.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className={`flex pt-4 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
            <button
              type="submit"
              disabled={!canSubmit}
              className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus:outline-none ${
                isV2
                  ? "bg-slate-800 border border-slate-700/50 shadow-lg shadow-black/20 hover:bg-slate-700 hover:border-slate-600/50 hover:shadow-xl hover:shadow-black/30 focus:ring-2 focus:ring-slate-600/50"
                  : isV3
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg focus:ring-4 focus:ring-blue-300"
                  : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl focus:ring-4 focus:ring-purple-300"
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <span>Publish</span>
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Result Message */}
        {result && (
          <div
            className={`mt-6 animate-fade-in rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${
              result.ok
                ? isV2
                  ? "border-emerald-500/50 bg-gradient-to-r from-emerald-900/40 to-green-900/40 text-emerald-200 backdrop-blur-sm"
                  : "border-emerald-200 bg-emerald-50 text-emerald-900"
                : isV2
                ? "border-rose-500/50 bg-gradient-to-r from-rose-900/40 to-red-900/40 text-rose-200 backdrop-blur-sm"
                : "border-rose-200 bg-rose-50 text-rose-900"
            }`}
          >
            <div className="flex items-center gap-3">
              {result.ok ? (
                <>
                  <svg className={`h-5 w-5 ${isV2 ? "text-emerald-400" : "text-emerald-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{result.message ?? "Published successfully!"}</span>
                </>
              ) : (
                <>
                  <svg className={`h-5 w-5 ${isV2 ? "text-rose-400" : "text-rose-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>{result.error ?? "Unable to publish."}</span>
                </>
              )}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      {theme === "v1" && renderThemeV1()}
      {theme === "v2" && renderThemeV2()}
      {theme === "v3" && renderThemeV3()}
    </main>
  );
}
