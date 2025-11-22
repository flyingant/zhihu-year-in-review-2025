import Image from "next/image";
import Head from 'next/head';
import KVSection from '../components/compound/KVSection';
import FolderSection from '../components/compound/FolderSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Head>
        <title>知乎 2025 年度盘点</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>

      <main className="w-full max-w-[500px] mx-auto relative">
        {/* KV 部分 */}
        <KVSection />

        {/* 文件夹交互部分 */}
        <FolderSection />
      </main>
    </div>
  );
}
