"use client";

import { ReactNode } from "react";

type Theme = "aurora" | "midnight" | "minimal";

interface ThemeWrapperProps {
    theme: Theme;
    mounted: boolean;
    children: ReactNode;
}

export function ThemeWrapper({ theme, mounted, children }: ThemeWrapperProps) {
    if (theme === "minimal") {
        return (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/50" />
                <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
                </div>
                <div className={`w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-8 shadow-lg sm:p-10 transition-all duration-500 ${mounted ? 'animate-scale-in opacity-100' : 'opacity-0'}`}>
                    {children}
                </div>
            </>
        );
    }

    if (theme === "midnight") {
        return (
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
                <div className={`relative w-full max-w-3xl rounded-2xl border border-slate-800/50 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl sm:p-8 md:p-10 transition-all duration-500 ${mounted ? 'animate-scale-in opacity-100' : 'opacity-0'}`}
                    style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.85) 100%)',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                    }}>
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </>
        );
    }

    // Aurora Theme
    return (
        <>
            <div className="gradient-bg absolute inset-0 -z-10" />
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-purple-300 opacity-20 blur-3xl animate-pulse-slow" />
            <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-blue-300 opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
            <div className="absolute left-1/2 top-1/4 h-64 w-64 rounded-full bg-pink-300 opacity-20 blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
            <div className={`w-full max-w-3xl glass rounded-3xl p-6 shadow-2xl sm:p-8 md:p-10 transition-all duration-500 ${mounted ? 'animate-scale-in opacity-100' : 'opacity-0'}`}>
                {children}
            </div>
        </>
    );
}
