'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SCENES } from '@/data/reportConfig';
import {
  useUserReportData,
  UserReportData,
} from '@/context/user-report-data-context';

// Determine the next valid scene ID recursively, checking for skip conditions
const getNextValidSceneId = (
  nextId: string | null | undefined,
  data: UserReportData | null
): string | null => {
  if (!nextId || !SCENES[nextId]) return null;

  console.log('getNextValidSceneId', nextId, data);

  const sceneConfig = SCENES[nextId];
  if (sceneConfig.shouldSkip?.(data)) {
    console.warn(`Skipping Scene ${nextId} based on skip condition`);
    // Recursively check the next scene after the skipped one
    const nextNextLogic = sceneConfig.next;
    const nextNextId =
      typeof nextNextLogic === 'function'
        ? nextNextLogic() // Assumption: skipped scenes usually don't have complex choice logic for their *next* step when skipped
        : nextNextLogic;
    return getNextValidSceneId(nextNextId, data);
  }

  return nextId;
};

// Find the previous valid scene from history, checking for skip conditions
const getPreviousValidSceneId = (
  history: string[],
  data: UserReportData | null
): { sceneId: string; newHistory: string[] } | null => {
  if (history.length <= 1) return null;

  // Work backwards through history to find a valid scene
  const newHistory = [...history];

  // Remove current scene from history
  newHistory.pop();

  // Keep going back until we find a scene that shouldn't be skipped
  while (newHistory.length > 0) {
    const candidateSceneId = newHistory[newHistory.length - 1];
    const sceneConfig = SCENES[candidateSceneId];

    if (!sceneConfig) {
      // Invalid scene in history, remove it and continue
      newHistory.pop();
      continue;
    }

    if (sceneConfig.shouldSkip?.(data)) {
      console.warn(
        `Skipping Scene ${candidateSceneId} in history based on skip condition`
      );
      // This scene should be skipped, remove it and continue
      newHistory.pop();
      continue;
    }

    // Found a valid scene
    return { sceneId: candidateSceneId, newHistory };
  }

  return null;
};

export default function SceneManager() {
  const searchParams = useSearchParams();
  const { reportData, isLoadingReport } = useUserReportData();

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

  // Track navigation history for going back
  // History contains all visited scenes INCLUDING the current one
  const [sceneHistory, setSceneHistory] = useState<string[]>(() => {
    const initialSceneId = getInitialSceneId();
    return initialSceneId ? [initialSceneId] : ['loading'];
  });

  // 当前场景 ID：始终使用内部状态（URL 参数仅在初始化时使用）
  const currentSceneId = internalSceneId;
  // 获取当前场景的配置
  const currentSceneConfig = SCENES[currentSceneId];

  // Check if current scene should be skipped when data is loaded
  useEffect(() => {
    if (isLoadingReport || !reportData) return;

    const sceneConfig = SCENES[currentSceneId];
    if (sceneConfig?.shouldSkip?.(reportData)) {
      console.warn(
        `Current scene ${currentSceneId} should be skipped based on data`
      );
      const nextValidId = getNextValidSceneId(currentSceneId, reportData);

      if (
        nextValidId &&
        nextValidId !== currentSceneId &&
        SCENES[nextValidId]
      ) {
        console.log(`Redirecting from ${currentSceneId} to ${nextValidId}`);
        // eslint-disable-next-line
        setInternalSceneId(nextValidId);
      }
    }
  }, [currentSceneId, reportData, isLoadingReport]);

  // 处理跳转逻辑
  const handleNext = (choice?: string) => {
    if (!currentSceneConfig) return;
    const nextLogic = currentSceneConfig.next;
    let initialNextId: string | null = null;

    if (typeof nextLogic === 'string') {
      initialNextId = nextLogic;
    } else if (typeof nextLogic === 'function') {
      initialNextId = nextLogic(choice);
    }

    const finalNextId = getNextValidSceneId(initialNextId, reportData);

    if (finalNextId && SCENES[finalNextId]) {
      // Add the NEW scene to history (not the current one)
      setSceneHistory((prev) => [...prev, finalNextId]);
      setInternalSceneId(finalNextId);
      // 埋点逻辑
      console.log(
        `Navigating from ${currentSceneId} to ${finalNextId} (initial: ${initialNextId}) with choice: ${choice}`
      );
    }
  };

  // 处理返回逻辑
  const handlePrevious = () => {
    const result = getPreviousValidSceneId(sceneHistory, reportData);

    if (!result) {
      // Already at the first scene or no valid previous scene
      console.log(
        'Already at the first scene or no valid previous scene, cannot go back'
      );
      return;
    }

    const { sceneId: previousSceneId, newHistory } = result;

    setSceneHistory(newHistory);
    setInternalSceneId(previousSceneId);
    console.log(`Navigating back from ${currentSceneId} to ${previousSceneId}`);
  };

  // 直接导航到指定场景（用于调试面板等场景）
  const handleNavigateToScene = (sceneId: string) => {
    if (SCENES[sceneId]) {
      // Add the NEW scene to history (consistent with handleNext)
      setSceneHistory((prev) => [...prev, sceneId]);
      setInternalSceneId(sceneId);
      console.log(`Navigating directly to scene: ${sceneId}`);
    }
  };

  if (!currentSceneConfig)
    return (
      <div className='flex items-center justify-center text-center text-2xl text-white'>
        End of Report
      </div>
    );
  const Component = currentSceneConfig.component;
  // 这里面放到时候从接口获取到的所有数据
  const fullReportData: Record<string, unknown> = {};
  const extraProps = currentSceneConfig.prepareProps
    ? currentSceneConfig.prepareProps(fullReportData)
    : {};

  return (
    <div className='relative w-full h-full flex justify-center items-center z-20'>
      {/* AnimatePresence 处理页面转场 */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSceneId} // key 变化触发转场
          initial={{ opacity: 0, y: 50 }} // 进场：从下往上淡入
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }} // 离场：往上淡出
          transition={{ duration: 0.5 }}
          className='h-full'
        >
          {/* 渲染当前页面，并传入跳转函数 */}
          <Component
            onNext={handleNext}
            onPrevious={handlePrevious}
            onNavigateToScene={handleNavigateToScene}
            sceneName={currentSceneId}
            {...extraProps}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
