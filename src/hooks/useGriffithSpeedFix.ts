import { useEffect, RefObject } from 'react';

/**
 * 修复 Griffith 播放器显示 "倍速" 而不是 "1.0x" 的问题
 * @param containerRef 播放器外层容器的 Ref
 * @param deps 触发重新绑定的依赖项 (例如 videoUrl)，可选
 */
export const useGriffithSpeedFix = (
  containerRef: RefObject<HTMLElement | null>, 
  deps: any[] = []
) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observerCallback = () => {
      // 查找容器内所有末级节点
      const elements = container.querySelectorAll('*');
      
      elements.forEach((el) => {
        // 判断是否是包含文本的叶子节点
        // Griffith 的按钮通常是 span 或 div，里面直接包含文本
        if (el.children.length === 0) {
          const text = el.textContent?.trim();
          
          if (text === '倍速') {
            // 发现目标，添加样式类
            if (!el.classList.contains('custom-speed-1x')) {
              el.classList.add('custom-speed-1x');
            }
          } else if (el.classList.contains('custom-speed-1x')) {
            // 文本变了 (如变成 1.5x)，移除样式类
            if (text !== '倍速') {
              el.classList.remove('custom-speed-1x');
            }
          }
        }
      });
    };

    const observer = new MutationObserver(observerCallback);

    // 配置监听选项
    observer.observe(container, {
      childList: true,      // 监听子元素增删
      subtree: true,        // 监听深层后代
      characterData: true,  // 监听文字改变
      attributes: false     // 不监听属性，提高性能且防止死循环
    });

    // 初始化执行一次
    observerCallback();

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerRef, ...deps]);
};