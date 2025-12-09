'use client';

import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SCENES } from '@/data/reportConfig';

export default function SceneManager() {
  // 从 URL hash 获取初始场景的懒加载函数
  const getInitialSceneId = (): string => {
    if (typeof window === 'undefined') return 'loading';
    const hash = window.location.hash.slice(1);
    return (hash && SCENES[hash]) ? hash : 'loading';
  };

  // 当前场景 ID，使用懒加载初始化
  const [currentSceneId, setCurrentSceneId] = useState(getInitialSceneId);
  const isInitializedRef = useRef(false);

  // 客户端挂载后：标记为已初始化，并同步 URL hash（仅在挂载时运行一次）
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // 检查 URL hash 是否与当前状态匹配（处理直接访问带 hash 的 URL 或 SSR 场景）
    const hash = window.location.hash.slice(1);
    if (hash && SCENES[hash] && hash !== currentSceneId) {
      // 延迟更新以避免在 effect 中直接 setState 的警告
      requestAnimationFrame(() => {
        setCurrentSceneId(hash);
      });
    }
    
    // 标记为已初始化（避免在初始化时更新 URL hash）
    isInitializedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 只在挂载时运行一次

  // 监听 URL hash 变化（浏览器前进/后退）
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitializedRef.current) return;

    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash && SCENES[hash] && hash !== currentSceneId) {
        setCurrentSceneId(hash);
      } else if (!hash) {
        // 如果 hash 被清除，回到默认场景
        setCurrentSceneId('loading');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [currentSceneId]);

  // 当场景变化时更新 URL hash（但不在初始化时更新，避免覆盖 URL 中的 hash）
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitializedRef.current) return;

    const newHash = `#${currentSceneId}`;
    const currentHash = window.location.hash;
    
    // 只在 hash 不同时更新，避免不必要的历史记录
    if (currentHash !== newHash) {
      // Ensure trailing slash for consistency with Next.js trailingSlash: true config
      let pathname = window.location.pathname;
      if (pathname !== '/' && !pathname.endsWith('/')) {
        pathname = `${pathname}/`;
      }
      window.history.replaceState(null, '', `${pathname}${newHash}`);
    }
  }, [currentSceneId]);

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

    if (typeof nextLogic === 'string') {
      // 直接跳转
      setCurrentSceneId(nextLogic);
    } else if (typeof nextLogic === 'function') {
      // 分支逻辑跳转
      const nextId = nextLogic(choice);
      setCurrentSceneId(nextId);
    }

    // 埋点逻辑
    console.log(`Navigating from ${currentSceneId} to next with choice: ${choice}`);
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
          <Component onNext={handleNext} sceneName={currentSceneId} {...extraProps} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}