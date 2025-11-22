import KVSection from "../../components/compound/KVSection";
import FolderSection from "../../components/compound/FolderSection";
import ZhihuLogo from "../../components/ui/ZhihuLogo";

export default function StorybookPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Component Storybook
        </h1>

        {/* Logo Component */}
        <div className="mb-6 mx-2 shrink-0 relative z-0">
          <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
            <h2 className="text-lg font-semibold mb-2 px-2">Zhihu Logo</h2>
            <div className="border border-gray-200 rounded overflow-hidden relative z-0 p-4 flex justify-center">
              <ZhihuLogo />
            </div>
          </div>
        </div>

        {/* Waterfall Layout Container */}
        <div className="flex flex-row items-start relative z-0">
          {/* KV Section Component */}
          <div className="mb-6 mx-2 shrink-0 relative z-0" style={{ width: '375px' }}>
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">KV Section</h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0" style={{ width: '375px' }}>
                <KVSection />
              </div>
            </div>
          </div>

          {/* Folder Section Component */}
          <div className="mb-6 mx-2 shrink-0 relative z-0" style={{ width: '375px' }}>
            <div className="bg-white rounded-lg shadow-md p-2 relative z-0">
              <h2 className="text-lg font-semibold mb-2 px-2">
                Folder Section
              </h2>
              <div className="border border-gray-200 rounded overflow-hidden relative z-0" style={{ width: '375px' }}>
                <FolderSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
