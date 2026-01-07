"use client";

import { useState, useEffect } from "react";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { SocialPostForm, type Theme } from "@/components/SocialPostForm";

export default function Home() {
  const [theme, setTheme] = useState<Theme>("aurora");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8 sm:py-12">
      <ThemeWrapper theme={theme} mounted={mounted}>
        <SocialPostForm
          theme={theme}
          onThemeChange={setTheme}
          mounted={mounted}
        />
      </ThemeWrapper>
    </main>
  );
}
