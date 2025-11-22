import KVSection from '../components/compound/KVSection';
import FolderSection from '../components/compound/FolderSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main className="w-full max-w-[500px] mx-auto relative">
        {/* KV 部分 */}
        <KVSection />

        {/* 文件夹交互部分 */}
        <FolderSection />
      </main>
    </div>
  );
}
