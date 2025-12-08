import type { ReactNode } from 'react';
import localFont from 'next/font/local';
import { UserReportDataProvider } from '@/context/user-report-data-context';

const tianwangFont = localFont({
  src: '../../../public/fonts/tianwangxingxiangsu.ttf',
  variable: '--font-tianwang',
  display: 'swap',
});

export default function Report2025Layout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className={tianwangFont.variable}>
      <UserReportDataProvider>
        {children}
      </UserReportDataProvider>
    </div>
  );
}