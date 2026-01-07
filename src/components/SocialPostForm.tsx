"use client";

import { useMemo, useState, useEffect } from "react";

export type Platform = "telegram" | "instagram";
export type Theme = "aurora" | "midnight" | "minimal";

interface PublishResponse {
    ok: boolean;
    message?: string;
    error?: string;
}

interface SocialPostFormProps {
    theme: Theme;
    onThemeChange: (theme: Theme) => void;
    mounted: boolean;
}

export function SocialPostForm({ theme, onThemeChange, mounted }: SocialPostFormProps) {
    const [platform, setPlatform] = useState<Platform>("telegram");
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<PublishResponse | null>(null);

    const isMidnight = theme === "midnight";
    const isMinimal = theme === "minimal";

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

    return (
        <>
            {/* Theme Switcher */}
            <div className={`mb-6 flex flex-col items-end gap-2 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isMidnight ? "text-slate-500" : "text-slate-400"}`}>
                    System Interface
                </span>
                <div className={`inline-flex rounded-xl border p-1 shadow-sm backdrop-blur-md transition-all duration-500 ${isMidnight
                    ? "border-slate-700/50 bg-slate-800/40"
                    : "border-slate-200/60 bg-white/40"
                    }`}>
                    {([
                        { id: "aurora", label: "Aurora" },
                        { id: "midnight", label: "Midnight" },
                        { id: "minimal", label: "Minimal" }
                    ] as const).map((t) => (
                        <button
                            key={t.id}
                            onClick={() => onThemeChange(t.id)}
                            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 ${theme === t.id
                                ? isMidnight
                                    ? "bg-slate-700 text-white shadow-lg border border-slate-600/50"
                                    : isMinimal
                                        ? "bg-blue-600 text-white shadow-lg"
                                        : "bg-purple-600 text-white shadow-lg"
                                : isMidnight
                                    ? "text-slate-400 hover:bg-slate-800/60 hover:text-slate-300"
                                    : "text-slate-600 hover:bg-white/60"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className={`flex flex-col gap-3 mb-8 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`}>
                <div className="flex items-center gap-2">
                    <div className={`h-1 w-12 rounded-full ${isMidnight ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500" :
                        isMinimal ? "bg-gradient-to-r from-blue-400 to-indigo-400" :
                            "bg-gradient-to-r from-purple-500 to-pink-500"
                        }`} />
                    <p className={`text-xs font-bold uppercase tracking-widest ${isMidnight ? "text-slate-400" : isMinimal ? "text-blue-600" : "text-purple-600"
                        }`}>
                        Social Media Auto-Poster
                    </p>
                </div>
                <h1 className={`text-3xl font-bold sm:text-4xl md:text-5xl ${isMidnight
                    ? "text-white"
                    : isMinimal
                        ? "text-slate-900"
                        : "bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent"
                    }`}>
                    {isMidnight ? (
                        <>
                            <span className="text-white">Publish Instantly</span>
                            <br />
                            <span className="text-slate-300">Share Everywhere</span>
                        </>
                    ) : (
                        "Publish to Social Media"
                    )}
                </h1>
                <p className={`text-sm sm:text-base ${isMidnight ? "text-slate-400" : isMinimal ? "text-slate-600" : "text-slate-600"
                    }`}>
                    {isMidnight
                        ? "Craft your message, choose your platform, and reach your audience in seconds."
                        : "Craft your message, pick a platform, and post with a single click."
                    }
                </p>
            </div>

            <form onSubmit={handlePublish} className="space-y-6">
                {/* Message Input */}
                <div className={`space-y-2 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                    <label className={`text-sm font-semibold flex items-center gap-2 ${isMidnight ? "text-slate-200" : "text-slate-700"
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isMidnight ? "bg-slate-500" :
                            isMinimal ? "bg-blue-400" :
                                "bg-purple-500"
                            }`} />
                        Message
                    </label>
                    <textarea
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        placeholder="Share your update, release note, or announcement..."
                        rows={4}
                        className={`w-full rounded-xl border px-5 py-4 transition-all duration-300 placeholder:text-slate-400 focus:outline-none ${isMidnight
                            ? "border-slate-700/50 bg-slate-800/40 text-slate-200 backdrop-blur-sm focus:border-slate-600 focus:bg-slate-800/60 focus:ring-1 focus:ring-slate-600/30 hover:border-slate-700"
                            : isMinimal
                                ? "border-slate-200 bg-white text-slate-900 shadow-lg focus:border-blue-400 focus:shadow-xl focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                                : "border-2 border-slate-200 bg-white/80 text-slate-900 backdrop-blur-sm shadow-lg focus:border-purple-400 focus:bg-white focus:shadow-xl focus:ring-4 focus:ring-purple-100 hover:border-slate-300"
                            }`}
                    />
                    <div className={`flex items-center gap-2 text-xs ${isMidnight ? "text-slate-400" : "text-slate-500"
                        }`}>
                        <span className="h-1 w-1 rounded-full bg-slate-400" />
                        {message.length} characters
                    </div>
                </div>

                {/* Platform Selection */}
                <div className={`space-y-3 ${mounted ? 'animate-fade-in opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
                    <p className={`text-sm font-semibold flex items-center gap-2 ${isMidnight ? "text-slate-200" : "text-slate-700"
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${isMidnight ? "bg-slate-500" :
                            isMinimal ? "bg-blue-400" :
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
                                    className={`group relative flex cursor-pointer items-center justify-between overflow-hidden rounded-xl border px-5 py-4 transition-all duration-300 ${isSelected
                                        ? isMidnight
                                            ? isTelegram
                                                ? "border-indigo-500/50 bg-slate-800/80 text-white shadow-lg shadow-indigo-500/20 scale-[1.02] ring-1 ring-indigo-500/30"
                                                : "border-purple-500/50 bg-slate-800/80 text-white shadow-lg shadow-purple-500/20 scale-[1.02] ring-1 ring-purple-500/30"
                                            : isMinimal
                                                ? isTelegram
                                                    ? "border-blue-400 bg-blue-50 text-blue-900 shadow-md scale-105"
                                                    : "border-purple-400 bg-purple-50 text-purple-900 shadow-md scale-105"
                                                : "border-purple-500 bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/50 scale-105"
                                        : isMidnight
                                            ? "border-slate-700/50 bg-slate-800/40 text-slate-300 hover:border-slate-600/50 hover:bg-slate-800/60 hover:scale-[1.01]"
                                            : isMinimal
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
                                    <div className={`relative h-5 w-5 rounded-full border transition-all ${isSelected
                                        ? isMidnight
                                            ? isTelegram
                                                ? "border-indigo-400 bg-indigo-500/20 ring-1 ring-indigo-400/30"
                                                : "border-purple-400 bg-purple-500/20 ring-1 ring-purple-400/30"
                                            : isMinimal
                                                ? isTelegram
                                                    ? "border-blue-500 bg-blue-500"
                                                    : "border-purple-500 bg-purple-500"
                                                : "border-white bg-white"
                                        : isMidnight
                                            ? "border-slate-600 group-hover:border-slate-500"
                                            : "border-slate-300 group-hover:border-purple-400"
                                        }`}>
                                        {isSelected && (
                                            <div className={`absolute inset-0 m-auto rounded-full animate-scale-in ${isMidnight
                                                ? isTelegram
                                                    ? "h-2.5 w-2.5 bg-indigo-400"
                                                    : "h-2.5 w-2.5 bg-purple-400"
                                                : isMinimal ? "h-2.5 w-2.5 bg-white" : "h-2.5 w-2.5 bg-purple-500"
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
                        <label className={`text-sm font-semibold flex items-center gap-2 ${isMidnight ? "text-slate-200" : "text-slate-700"
                            }`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${isMidnight ? "bg-gradient-to-r from-purple-400 to-pink-400" :
                                isMinimal ? "bg-blue-400" :
                                    "bg-purple-500"
                                }`} />
                            Image URL (required by Instagram Graph API)
                        </label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(event) => setImageUrl(event.target.value)}
                            placeholder="https://images.example.com/announcement.jpg"
                            className={`w-full rounded-xl border px-5 py-3 transition-all duration-300 placeholder:text-slate-400 focus:outline-none ${isMidnight
                                ? "border-slate-700/50 bg-slate-800/40 text-slate-200 backdrop-blur-sm focus:border-slate-600 focus:bg-slate-800/60 focus:ring-1 focus:ring-slate-600/30 hover:border-slate-700"
                                : isMinimal
                                    ? "border-slate-200 bg-white text-slate-900 shadow-lg focus:border-blue-400 focus:shadow-xl focus:ring-4 focus:ring-blue-100 hover:border-slate-300"
                                    : "border-2 border-slate-200 bg-white/80 text-slate-900 backdrop-blur-sm shadow-lg focus:border-purple-400 focus:bg-white focus:shadow-xl focus:ring-4 focus:ring-purple-100 hover:border-slate-300"
                                }`}
                        />
                        <p className={`flex items-start gap-2 text-xs ${isMidnight ? "text-slate-400" : "text-slate-500"
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
                        className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 focus:outline-none ${isMidnight
                            ? "bg-slate-800 border border-slate-700/50 shadow-lg shadow-black/20 hover:bg-slate-700 hover:border-slate-600/50 hover:shadow-xl hover:shadow-black/30 focus:ring-2 focus:ring-slate-600/50"
                            : isMinimal
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
                    className={`mt-6 animate-fade-in rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${result.ok
                        ? isMidnight
                            ? "border-emerald-500/50 bg-gradient-to-r from-emerald-900/40 to-green-900/40 text-emerald-200 backdrop-blur-sm"
                            : "border-emerald-200 bg-emerald-50 text-emerald-900"
                        : isMidnight
                            ? "border-rose-500/50 bg-gradient-to-r from-rose-900/40 to-red-900/40 text-rose-200 backdrop-blur-sm"
                            : "border-rose-200 bg-rose-50 text-rose-900"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {result.ok ? (
                            <>
                                <svg className={`h-5 w-5 ${isMidnight ? "text-emerald-400" : "text-emerald-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{result.message ?? "Published successfully!"}</span>
                            </>
                        ) : (
                            <>
                                <svg className={`h-5 w-5 ${isMidnight ? "text-rose-400" : "text-rose-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
}
