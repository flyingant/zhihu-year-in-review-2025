"use client";

import localFont from 'next/font/local';
import { UserReportDataProvider } from '@/context/user-report-data-context';
import GridBackground from "@/components/report/effects/GridBackground";
import SceneManager from "@/components/report/SceneManager";

const tianwangFont = localFont({
  src: '../../../public/fonts/tianwangxingxiangsu.ttf',
  variable: '--font-tianwang',
  display: 'swap',
});

export default function ReportPage() {
  return (
    <main className={`w-full h-screen bg-white text-black ${tianwangFont.variable}`}>
      <UserReportDataProvider>
        <GridBackground />
        <SceneManager />
      </UserReportDataProvider>
    </main>
  );
}
