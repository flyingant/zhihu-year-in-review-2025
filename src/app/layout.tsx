import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/context/auth-context';
import { UserDataProvider } from '@/context/user-data-context';
import { ToastProvider } from '@/context/toast-context';
import { AssetsProvider } from '@/context/assets-context';
import { AudioProvider } from '@/context/audio-context';
import { ErrorBoundary } from '@/components/layout/ErrorBoundary';
import ErrorHandlingInit from '@/components/layout/ErrorHandlingInit';
import ZhihuHybridScript from '@/components/layout/ZhihuHybridScript';
import './globals.css';
          
export const metadata: Metadata = {
  title: '知乎 2025 个人年度报告',
  description: '回顾这一年，我真的____？点击加载真实 >>',
  icons: {
    icon: process.env.NEXT_PUBLIC_CDN_BASE_URL + 'assets/share-head-img-1221.png'
  },
  openGraph: {
    title: '知乎｜2025 个人年度报告',
    description: '回顾这一年，我真的____？点击加载真实 >>',
    images: [
      {
        url:   process.env.NEXT_PUBLIC_CDN_BASE_URL +
            'assets/share-head-img-1221.png',
        width: 500,
        height: 500,
        alt: '知乎｜2025 个人年度报告',
      },
    ],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover', // Enable safe area insets for iOS
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='antialiased'>
        <ErrorHandlingInit />
        <ErrorBoundary>
          <AuthProvider>
            <UserDataProvider>
              <AssetsProvider>
                <AudioProvider>
                  <ToastProvider>{children}</ToastProvider>
                </AudioProvider>
              </AssetsProvider>
            </UserDataProvider>
          </AuthProvider>
        </ErrorBoundary>
        {/* Load zhihuHybrid SDK - typically injected by Zhihu App WebView, but load script as fallback */}
        <ZhihuHybridScript />
      </body>
    </html>
  );
}
