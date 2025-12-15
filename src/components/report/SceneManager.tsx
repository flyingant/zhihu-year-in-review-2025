'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SCENES } from '@/data/reportConfig';

export default function SceneManager() {
  const searchParams = useSearchParams();
  
  // 从 URL 参数获取场景 ID（仅用于初始页面）
  const getInitialSceneId = () => {
    const sceneParam = searchParams.get('scene');
    if (sceneParam && SCENES[sceneParam]) {
      return sceneParam;
    }
    return null;
  };
  
  // 初始化：使用 URL 参数作为初始场景（如果存在），否则使用默认值
  // URL 参数只在首次加载时生效，后续导航使用内部状态
  const [internalSceneId, setInternalSceneId] = useState(() => {
    const initialSceneId = getInitialSceneId();
    return initialSceneId || 'loading';
  });
  
  // 当前场景 ID：始终使用内部状态（URL 参数仅在初始化时使用）
  const currentSceneId = internalSceneId;
  // 获取当前场景的配置
  const currentSceneConfig = SCENES[currentSceneId];
  if (!currentSceneConfig) return <div className="flex items-center justify-center text-center text-2xl text-white">End of Report</div>;
  const Component = currentSceneConfig.component;
  // 这里面放到时候从接口获取到的所有数据
  const fullReportData: Record<string, unknown> = {};
  const extraProps = currentSceneConfig.prepareProps
    ? currentSceneConfig.prepareProps(fullReportData)
    : {};

  // 处理跳转逻辑
  const handleNext = (choice?: string) => {
    const nextLogic = currentSceneConfig.next;
    let nextId: string | null = null;
    
    if (typeof nextLogic === 'string') {
      // 直接跳转
      nextId = nextLogic;
    } else if (typeof nextLogic === 'function') {
      // 分支逻辑跳转
      nextId = nextLogic(choice);
    }
    
    if (nextId && SCENES[nextId]) {
      setInternalSceneId(nextId);
      // 埋点逻辑
      console.log(`Navigating from ${currentSceneId} to ${nextId} with choice: ${choice}`);
    }
  };

  // 直接导航到指定场景（用于调试面板等场景）
  const handleNavigateToScene = (sceneId: string) => {
    if (SCENES[sceneId]) {
      setInternalSceneId(sceneId);
      console.log(`Navigating directly to scene: ${sceneId}`);
    }
  };

  return (
    <div className="relative w-full h-full flex justify-center items-center z-20">
      {/* AnimatePresence 处理页面转场 */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSceneId} // key 变化触发转场
          initial={{ opacity: 0, y: 50 }} // 进场：从下往上淡入
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}   // 离场：往上淡出
          transition={{ duration: 0.5 }}
          className="h-full"
        >
          {/* 渲染当前页面，并传入跳转函数 */}
          <Component onNext={handleNext} onNavigateToScene={handleNavigateToScene} sceneName={currentSceneId} {...extraProps} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}