"use client";

import { useState, useEffect } from "react";
import { ThemeWrapper } from "@/components/ThemeWrapper";
import { SocialPostForm, type Theme } from "@/components/SocialPostForm";

// Home Component - Main entry point of the application
export default function Home() {
  const [theme, setTheme] = useState<Theme>("aurora");

  // The 'mounted' flag is a common pattern in Next.js/React to prevent hydration mismatch errors and to trigger CSS entrance animations only after the client-side bundle is ready.
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
