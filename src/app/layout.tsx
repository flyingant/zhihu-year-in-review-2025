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

const metadataMap: Record<string, Metadata> = {
  '/zhihu2025': {
    title: '知乎 2025 年度盘点',
    description: '2025，到底什么是真的？',
    icons: {
      icon: 'https://static.zhihu.com/event/zhihu2025/assets/share.png',
    },
    openGraph: {
      title: '知乎 2025 年度盘点',
      description: '2025，到底什么是真的？',
      images: [
        {
          url: 'https://static.zhihu.com/event/zhihu2025/assets/share.png',
          width: 500,
          height: 500,
          alt: '知乎 2025 年度盘点',
        },
      ],
    },
  },

  '/2025': {
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
  },

  '/2025guess': {
    title: '知乎 2025 个人年度报告',
    description: '猜猜哪个是「真的」我 >>',
    icons: {
      icon: process.env.NEXT_PUBLIC_CDN_BASE_URL + 'assets/share-head-img-1221.png'
    },
    openGraph: {
      title: '知乎 2025 个人年度报告',
      description: '猜猜哪个是「真的」我 >>',
      images: [
        {
          url:   process.env.NEXT_PUBLIC_CDN_BASE_URL +
              'assets/share-head-img-1221.png',
          width: 500,
          height: 500,
          alt: '知乎｜2025，我真的 XX 了？',
        },
      ],
    },
  },
}

export const metadata: Metadata = metadataMap[process.env.NEXT_PUBLIC_BASE_URL || '/zhihu2025']

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
