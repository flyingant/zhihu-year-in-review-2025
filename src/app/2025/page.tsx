"use client";

import { useEffect } from "react";
import localFont from "next/font/local";
import { UserReportDataProvider } from "@/context/user-report-data-context";
import GridBackground from "@/components/report/effects/GridBackground";
import SceneManager from "@/components/report/SceneManager";
import AuthWrapper from "@/components/layout/AuthWrapper";
import { useZhihuHybrid } from "@/hooks/useZhihuHybrid";

const tianwangFont = localFont({
  src: "../../../public/fonts/tianwangxingxiangsu.ttf",
  variable: "--font-tianwang",
  display: "swap",
});

// Type for Zhihu Hybrid SDK
interface ZhihuHybridAction {
  dispatch(params: Record<string, unknown>): Promise<unknown>;
}
interface ZhihuHybridNewAPI {
  (action: string): ZhihuHybridAction;
}

export default function ReportPage() {
  const {
    isAvailable: isHybridAvailable,
  } = useZhihuHybrid();
  
  useEffect(() => {
    const setupVConsole = async () => {
      const VConsole = (await import("vconsole")).default;
      new VConsole();
    };
    if (window.location.href.includes("debugger")) {
      setupVConsole();
    }

    if (isHybridAvailable && window.zhihuHybrid) {
      try {
        const link =  process.env.NEXT_PUBLIC_BASE_SHARE_URL +  '/2025/'
        const shareHeadImg =
          process.env.NEXT_PUBLIC_CDN_BASE_URL +
          'assets/share-head-img-1221.png';
        const setShareInfoAction = (window.zhihuHybrid as ZhihuHybridNewAPI)(
          'share/setShareInfo'
        );

        setShareInfoAction.dispatch({
          zhihuMessage: {
            content: '知乎｜2025 个人年度报告 \n 这一年，我真的____？\n 2025 我的「真实源文件」加载中 >> 快来查看吧 \n' + link,
            link,
          },
          wechatTimeline: {
            title: '知乎｜2025 个人年度报告',
            link: link,
            imgUrl: shareHeadImg,
          },
          wechatMessage: {
            title: '知乎｜2025 个人年度报告',
            desc: '回顾这一年，我真的____？点击加载真实 >>',
            link: link,
            imgUrl: shareHeadImg,
          },
          QQ: {
            url: link,
            title: '知乎｜2025 个人年度报告',
            content: '回顾这一年，我真的____？点击加载真实 >>',
            imageURL: shareHeadImg,
          },
          weibo: {
            url: link,
            title: '知乎｜2025 个人年度报告',
            content: '回顾这一年，我真的____？点击加载真实 >>',
            imageURL: shareHeadImg,
          },
          Qzone: {
            url: link,
            title: '知乎｜2025 个人年度报告',
            content: '回顾这一年，我真的____？点击加载真实 >>',
            imageURL: shareHeadImg,
          }
        });
      } catch (error) {
        console.error('Report Page Failed to share via zhihuHybrid:', error);
      
      }
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
