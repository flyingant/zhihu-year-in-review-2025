"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import { UserReportDataProvider } from "@/context/user-report-data-context";
import GridBackground from "@/components/report/effects/GridBackground";
import SceneManager from "@/components/report/SceneManager";
import AuthWrapper from "@/components/layout/AuthWrapper";

const tianwangFont = localFont({
  src: "../../../public/fonts/tianwangxingxiangsu.ttf",
  variable: "--font-tianwang",
  display: "swap",
});

export default function ReportPage() {
  useEffect(() => {
    const setupVConsole = async () => {
      const VConsole = (await import("vconsole")).default;
      new VConsole();
    };
    if (window.location.href.includes("debugger")) {
      setupVConsole();
    }
  }, []);
  return (
    <AuthWrapper requireAuth={true}>
      <main
        className={`w-full h-screen bg-white text-black ${tianwangFont.variable}`}
      >
        <UserReportDataProvider>
          <GridBackground />
          <SceneManager />
        </UserReportDataProvider>
      </main>
    </AuthWrapper>
  );
}
