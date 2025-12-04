'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SCENES } from '@/data/reportConfig';

export default function SceneManager() {
  // 当前场景 ID，初始为 loading
  const [currentSceneId, setCurrentSceneId] = useState('loading');

  // 获取当前场景的配置
  const currentSceneConfig = SCENES[currentSceneId];

  if (!currentSceneConfig) return <div className="flex items-center justify-center text-center text-2xl text-white">End of Report</div>;

  const Component = currentSceneConfig.component;

  // 这里面放到时候从接口获取到的所有数据
  const fullReportData = {};

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
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      {/* AnimatePresence 处理页面转场 */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentSceneId} // key 变化触发转场
          initial={{ opacity: 0, y: 50 }} // 进场：从下往上淡入
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}   // 离场：往上淡出
          transition={{ duration: 0.5 }}
          className="w-full h-full"
        >
          {/* 渲染当前页面，并传入跳转函数 */}
          <Component onNext={handleNext} {...extraProps} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}