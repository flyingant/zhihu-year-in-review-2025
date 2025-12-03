import SceneManager from '@/components/report/SceneManager';
import ZhihuLogo from '@/components/ui/ZhihuLogo';

export default function ReportPage() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <div className="pt-[60px] flex justify-center absolute top-0 left-0 right-0">
        <ZhihuLogo />
      </div>
      <SceneManager />
    </main>
  );
}