import KVSection from '../components/compound/KVSection';
import FolderSection from '../components/compound/FolderSection';
import SectionLayout from '../components/layout/SectionLayout';
import ZhihuLogo from '../components/ui/ZhihuLogo';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full max-w-[500px] mx-auto relative">
        {/* Logo */}
        <div className="pt-5 pb-2 flex justify-center">
          <ZhihuLogo />
        </div>

        {/* KV 部分 */}
        <SectionLayout topOffset={0} id="kv-section">
          <KVSection />
        </SectionLayout>

        {/* 文件夹交互部分 */}
        <SectionLayout topOffset={0} id="folder-section">
          <FolderSection />
        </SectionLayout>
      </main>
    </div>
  );
}
