import type { ReactNode } from 'react';
import localFont from 'next/font/local';

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
      {children}
    </div>
  );
}