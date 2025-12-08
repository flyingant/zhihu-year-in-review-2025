"use client";

import localFont from 'next/font/local';
import { UserReportDataProvider } from '@/context/user-report-data-context';
import GridBackground from "@/components/report/effects/GridBackground";
import SceneManager from "@/components/report/SceneManager";
import ZhihuLogo from "@/components/ui/ZhihuLogo";

const tianwangFont = localFont({
  src: '../../../public/fonts/tianwangxingxiangsu.ttf',
  variable: '--font-tianwang',
  display: 'swap',
});

export default function ReportPage() {
  return (
    <div className={tianwangFont.variable}>
      <UserReportDataProvider>
        <main className="w-full min-h-screen bg-white">
          <GridBackground>
            <div className="mx-auto max-w-[750px] min-w-[375px] relative bg-white">
              <div className="pt-[60px] flex justify-center absolute top-0 left-0 right-0 z-10">
                <ZhihuLogo />
              </div>
              <SceneManager />
            </div>
          </GridBackground>
        </main>
      </UserReportDataProvider>
    </div>
  );
}
