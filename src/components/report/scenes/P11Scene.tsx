'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { motion } from 'framer-motion';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

export default function P11Scene({
  onNext,
  onPrevious,
  onNavigateToScene,
  sceneName,
}: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();
  if (!assets) return null;

  const bgAsset = assets.report.bg;
  const blue10Asset = bgAsset.blue10;
  const mix9Asset = bgAsset.mix9;
  const mix7Asset = bgAsset.mix7;
  const folderAsset = assets.report.p11.folder;
  const liukanshanAsset = assets.report.p11.liukanshan;
  const tableAsset = assets.report.p11.table;
  const greenAsset = assets.report.p11.green;
  const yellowAsset = assets.report.p11.yellow;
  const crownAsset = assets.report.p11.crown;
  const { fileFold, fileOpenBack, fileOpenFront, fileLiukanshan } =
    assets.report.p11;

  // Map context data to component variables according to P11 spec (消费-内容亮点)
  const topCategory1 = (reportData?.browse_most_category_top1 as string) ?? '';
  const topCategory2 = (reportData?.browse_most_category_top2 as string) ?? '';
  const topCategory3 = (reportData?.browse_most_category_top3 as string) ?? '';
  const categoryHours = (reportData?.browse_most_category_hour as number) ?? 0;
  const addCategoryList = (reportData?.add_category_list as string[]) ?? [];
  const reduceCategoryList =
    (reportData?.reduce_category_list as string[]) ?? [];
  const displayAddList = addCategoryList.slice(0, 3);
  const displayReduceList = reduceCategoryList.slice(0, 3);

  const shouldShowTable =
    displayAddList.length > 0 || displayReduceList.length > 0;

  // const addCategoryList = reportData?.add_category_list ?? null; // Not used in JSX
  // const reduceCategoryList = reportData?.reduce_category_list ?? null; // Not used in JSX
  const topCategories = [
    String(topCategory2),
    String(topCategory1),
    String(topCategory3),
  ];
  return (
    <BaseScene
      onNext={onNext}
      onPrevious={onPrevious}
      onNavigateToScene={onNavigateToScene}
      sceneName={sceneName}
    >
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '72px', left: '27px' }}
        />
        <Image
          src={mix7Asset.url}
          alt={mix7Asset.alt}
          width={mix7Asset.width}
          height={mix7Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '284px', right: '0px' }}
        />
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '35px', left: '10px' }}
        />
        <Image
          src={mix9Asset.url}
          alt={mix9Asset.alt}
          width={mix9Asset.width}
          height={mix9Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '0px', right: '6px' }}
        />
      </GlitchLayer>

      <div
        className='text-center'
        style={{ paddingTop: '90px', marginBottom: '40px', fontSize: '22px' }}
      >
        <div>兴趣，让你拥抱一方天地 </div>
        <div style={{ fontSize: '16px' }}>你浏览最多的领域是</div>
      </div>

      {/* 浏览最多的领域 */}
      <div
        className='flex items-center justify-center relative'
        style={{ paddingBottom: '30px', fontSize: '16px' }}
      >
        {/* 1. 文件夹背景大图 */}
        <div className='relative'>
          <Image
            src={folderAsset.url}
            alt={folderAsset.alt}
            width={folderAsset.width}
            height={folderAsset.height}
            className='object-contain'
            style={{ marginBottom: '10px' }}
          />
          <div
            hidden={topCategories[0] === ''}
            className='absolute text-center'
            style={{
              top: '182px',
              left: '10%',
              transform: 'translateX(-50%)',
              fontSize: '18px',
            }}
          >
            <span>{topCategories[0]}</span>
          </div>

          <div
            hidden={topCategories[1] === ''}
            className='absolute text-center'
            style={{
              top: '182px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '21px',
            }}
          >
            <span>{topCategories[1]}</span>
          </div>

          <div
            hidden={topCategories[2] === ''}
            className='absolute text-center'
            style={{
              top: '182px',
              right: '15%',
              transform: 'translateX(50%)',
              fontSize: '18px',
            }}
          >
            <span>{topCategories[2]}</span>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '44%',
              left: '52%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              width: '101px',
              height: '79px',
            }}
          >
            {/* 第一阶段: fileFold 出现然后消失 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 1] }}
              transition={{
                duration: 1.2,
                times: [0, 0.2, 0.6, 1],
              }}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            >
              <Image
                src={fileFold.url}
                alt={fileFold.alt}
                width={fileFold.width}
                height={fileFold.height}
                className='object-contain'
              />
            </motion.div>

            {/* 第二阶段: fileOpenBack (背景层) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
            >
              <Image
                src={fileOpenBack.url}
                alt={fileOpenBack.alt}
                width={fileOpenBack.width}
                height={fileOpenBack.height}
                className='object-contain'
              />
            </motion.div>

            {/* 第三阶段: fileLiukanshan 从下往上滑出 (中间层) */}
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.3,
                ease: 'easeOut',
              }}
              style={{ position: 'absolute', top: -28, left: 24, zIndex: 3 }}
            >
              <Image
                src={fileLiukanshan.url}
                alt={fileLiukanshan.alt}
                width={fileLiukanshan.width}
                height={fileLiukanshan.height}
                className='object-contain'
              />
            </motion.div>

            {/* 第二阶段: fileOpenFront (前景层) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              style={{ position: 'absolute', top: 21, left: 0, zIndex: 4 }}
            >
              <Image
                src={fileOpenFront.url}
                alt={fileOpenFront.alt}
                width={fileOpenFront.width}
                height={fileOpenFront.height}
                className='object-contain'
              />
            </motion.div>
          </div>
          {/* 
          <div
            style={{
              position: 'absolute',
              top: '41%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            <Image
              src={liukanshanAsset.url}
              alt={liukanshanAsset.alt}
              width={liukanshanAsset.width}
              height={liukanshanAsset.height}
              className='object-contain'
            />
          </div> */}
        </div>

        <motion.div
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.0 }}
          className='absolute'
          style={{ top: '215px' }}
          hidden={categoryHours === 0}
        >
          <div className='flex items-center justify-center relative'>
            <Image
              src={crownAsset.url}
              alt={crownAsset.alt}
              width={crownAsset.width}
              height={crownAsset.height}
              className='object-contain'
            />
            <span
              className='text-r-fern'
              style={{
                paddingLeft: '6px',
                paddingRight: '6px',
                fontSize: '16px',
              }}
            >
              {categoryHours} 小时
            </span>
          </div>
        </motion.div>
      </div>

      {shouldShowTable && (
        <div
          className='flex items-center justify-center relative'
          style={{ paddingBottom: '20px' }}
        >
          <Image
            src={tableAsset.url}
            alt={tableAsset.alt}
            width={tableAsset.width}
            height={tableAsset.height}
            className='object-contain z-10'
          />
          <div
            className='absolute bg-white'
            style={{
              top: '3px',
              left: '50%',
              padding: '0 10px',
              transform: 'translateX(-50%)',
              zIndex: 100,
              fontSize: '16px',
              lineHeight: '1.1',
            }}
          >
            2024 ~ 2025
          </div>
          <div
            className='absolute z-20'
            style={{
              top: '27%',
              left: '10%',
              width: '80%',
              height: '55%',
            }}
          >
            <div
              style={{
                textAlign: 'right',
              }}
            >
              <div className='mb-[2px]' style={{ fontSize: '12px' }}>
                增加好奇
              </div>
              {displayReduceList.map((category, index) => (
                <div
                  key={index}
                  className='text-r-blue mb-[2px] absolute text-left'
                  style={{
                    fontSize: '17px',
                    top: `${26 - index * 22}px`,
                    left: 10,
                    width: '120px',
                  }}
                >
                  {category}
                </div>
              ))}
            </div>

            <div
              style={{
                position: 'absolute',
                left: '0',
                bottom: '0',
                textAlign: 'left',
              }}
            >
              {displayAddList.map((category, index) => {
                return (
                  <div
                    key={index}
                    className='text-r-yellow mb-[2px] absolute'
                    style={{
                      fontSize: '17px',
                      textAlign: 'right',
                      bottom: `${50 - index * 22}px`,
                      left: '170px',
                      width: '120px',
                    }}
                  >
                    {category}
                  </div>
                );
              })}
              <div className='mt-[2px]' style={{ fontSize: '12px' }}>
                减少关注
              </div>
            </div>
          </div>

          <Image
            src={greenAsset.url}
            alt={greenAsset.alt}
            width={greenAsset.width}
            height={greenAsset.height}
            className='object-contain absolute z-10'
            style={{ left: '50px', bottom: '53px' }}
          />
          <Image
            src={yellowAsset.url}
            alt={yellowAsset.alt}
            width={yellowAsset.width}
            height={yellowAsset.height}
            className='object-contain absolute z-10'
            style={{ top: '33px', right: '50px' }}
          />
        </div>
      )}
    </BaseScene>
  );
}
