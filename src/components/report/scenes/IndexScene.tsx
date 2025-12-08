// components/report/scenes/SelectionScene.tsx
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function IndexScene({ onNext }: { onNext: (choice: string) => void }) {

  // 选项动画配置
  const cardVariants = {
    hidden: { opacity: 0, y: 50, rotateY: 90 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      rotateY: 0,
      transition: { delay: i * 0.2, duration: 0.8 }
    }),
    hover: { scale: 1.05, rotateZ: 2 }
  };

  return (
    <div className="relative w-full h-full bg-blue-50 overflow-hidden flex flex-col items-center justify-center perspective-1000">
      <motion.div
        className="mb-10 relative z-10"
        animate={{ y: [-10, 10, -10] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Image src="/assets/sidebar_liukanshan.png" alt="floating" width={160} height={160} className="w-40" />
      </motion.div>

      <h2 className="text-2xl font-bold mb-8 z-10">选择一个方向</h2>

      <div className="grid grid-cols-2 gap-4 w-full px-8 max-w-md z-10">
        {['TECH', 'LIFE', 'READ', 'WORK'].map((item, i) => (
          <motion.div
            key={item}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            onClick={() => onNext(item.toLowerCase())} // 传递选择
            className="
              h-32 bg-white/80 backdrop-blur-md border-2 border-white 
              rounded-xl shadow-xl flex items-center justify-center
              cursor-pointer transform-style-3d
            "
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 100%)'
            }}
          >
            <span className="font-bold text-xl text-blue-600">{item}</span>
          </motion.div>
        ))}
      </div>

      <div className="absolute inset-0 z-0 bg-[url('/assets/home_bg@3x.png')] opacity-20 pointer-events-none" />
    </div>
  );
}