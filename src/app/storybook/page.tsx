import KVSection from "../../components/compound/KVSection";
import FolderSection from "../../components/compound/FolderSection";
import ZhihuLogo from "../../components/ui/ZhihuLogo";
import QinZiDa2025 from "../../components/ui/QinZiDa2025";
import LiuKanShanBianLiDian from "../../components/ui/LiuKanShanBianLiDian";
import ZaiZhiHuLianJieZhenShi from "../../components/ui/ZaiZhiHuLianJieZhenShi";
import QiangXianYuGao from "../../components/ui/QiangXianYuGao";
import ZheXieZhenDeKeYi from "../../components/ui/ZheXieZhenDeKeYi";
import QiangXianYuGaoSection from "../../components/compound/QiangXianYuGaoSection";
import QinZiDa2025Section from "../../components/compound/QinZiDa2025Section";
import ZaiZhiHuLianJieZhenShiSection from "../../components/compound/ZaiZhiHuLianJieZhenShiSection";
import ZheXieZhenDeKeYiSection from "../../components/compound/ZheXieZhenDeKeYiSection";

export default function StorybookPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Component Storybook
        </h1>

        {/* Waterfall Layout Container */}
        <div className="flex flex-row flex-wrap items-start relative z-0">
          {/* Logo Component */}
          <div className="mb-6 mx-2 shrink-0 relative z-0">
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">Zhihu Logo</h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
                <ZhihuLogo />
              </div>
            </div>
          </div>

          {/* KV Section Component */}
          <div
            className="mb-6 mx-2 shrink-0 relative z-0"
            style={{ width: "375px" }}
          >
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">KV Section</h2>
              <div
                className="border border-gray-200 rounded overflow-hidden relative z-0"
                style={{ width: "375px" }}
              >
                <KVSection />
              </div>
            </div>
          </div>

          {/* Folder Section Component */}
          <div
            className="mb-6 mx-2 shrink-0 relative z-0"
            style={{ width: "375px" }}
          >
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                Folder Section
              </h2>
              <div
                className="border border-gray-200 rounded overflow-hidden relative z-0"
                style={{ width: "375px" }}
              >
                <FolderSection />
              </div>
            </div>
          </div>

          {/* New Image Components */}
          <div className="mb-6 mx-2 shrink-0 relative z-0">
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">QinZiDa2025</h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
                <QinZiDa2025 />
              </div>
            </div>
          </div>

          <div className="mb-6 mx-2 shrink-0 relative z-0">
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                LiuKanShanBianLiDian
              </h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
                <LiuKanShanBianLiDian />
              </div>
            </div>
          </div>

          <div className="mb-6 mx-2 shrink-0 relative z-0">
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                ZaiZhiHuLianJieZhenShi
              </h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
                <ZaiZhiHuLianJieZhenShi />
              </div>
            </div>
          </div>

          <div className="mb-6 mx-2 shrink-0 relative z-0">
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                QiangXianYuGao
              </h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
                <QiangXianYuGao />
              </div>
            </div>
          </div>

          <div className="mb-6 mx-2 shrink-0 relative z-0">
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                ZheXieZhenDeKeYi
              </h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
                <ZheXieZhenDeKeYi />
              </div>
            </div>
          </div>

          {/* QiangXianYuGao Section Component */}
          <div
            className="mb-6 mx-2 shrink-0 relative z-0"
            style={{ width: "375px" }}
          >
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                QiangXianYuGao Section
              </h2>
              <div
                className="border border-gray-200 rounded overflow-hidden relative z-0"
                style={{ width: "375px" }}
              >
                <QiangXianYuGaoSection />
              </div>
            </div>
          </div>

          {/* QinZiDa2025 Section Component */}
          <div
            className="mb-6 mx-2 shrink-0 relative z-0"
            style={{ width: "375px" }}
          >
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                QinZiDa2025 Section
              </h2>
              <div
                className="border border-gray-200 rounded overflow-hidden relative z-0"
                style={{ width: "375px" }}
              >
                <QinZiDa2025Section />
              </div>
            </div>
          </div>

          {/* ZaiZhiHuLianJieZhenShi Section Component */}
          <div
            className="mb-6 mx-2 shrink-0 relative z-0"
            style={{ width: "375px" }}
          >
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                ZaiZhiHuLianJieZhenShi Section
              </h2>
              <div
                className="border border-gray-200 rounded overflow-hidden relative z-0"
                style={{ width: "375px" }}
              >
                <ZaiZhiHuLianJieZhenShiSection />
              </div>
            </div>
          </div>

          {/* ZheXieZhenDeKeYi Section Component */}
          <div
            className="mb-6 mx-2 shrink-0 relative z-0"
            style={{ width: "375px" }}
          >
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                ZheXieZhenDeKeYi Section
              </h2>
              <div
                className="border border-gray-200 rounded overflow-hidden relative z-0"
                style={{ width: "375px" }}
              >
                <ZheXieZhenDeKeYiSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
