"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P11Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P11 spec (消费-内容亮点)
  const topCategory1 = reportData?.browse_most_category_top1 ?? null;
  const topCategory2 = reportData?.browse_most_category_top2 ?? null;
  const topCategory3 = reportData?.browse_most_category_top3 ?? null;
  const categoryHours = reportData?.browse_most_category_hour ?? null;
  const addCategoryList = reportData?.add_category_list ?? null;
  const reduceCategoryList = reportData?.reduce_category_list ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed mb-[40px]'}>
        兴趣,让你拥抱一方天地
      </div>

      {/* 浏览最多的领域 */}
      <div className="pt-[60px] pb-[30px]">
        <div className="mb-[10px]">
          你浏览最多的领域是
          <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(topCategory1 ?? 'browse_most_category_top1')}</span>
          、<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(topCategory2 ?? 'browse_most_category_top2')}</span>
          、<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(topCategory3 ?? 'browse_most_category_top3')}</span>
        </div>
        <div className="text-sm text-gray-600">
          其中TOP1领域浏览时长为 <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(categoryHours ?? 'browse_most_category_hour')}</span> 小时
        </div>
      </div>

      {/* 新增领域 */}
      <div className="pb-[20px]">
        <div className="text-sm">
          和2024年相比,你增加了对 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(addCategoryList ?? 'add_category_list')}</span> 领域的好奇
        </div>
      </div>

      {/* 减少领域 */}
      <div className="pb-[20px]">
        <div className="text-sm">
          <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(reduceCategoryList ?? 'reduce_category_list')}</span> 领域的内容依旧等待你探索
        </div>
      </div>
    </BaseScene>
  );
}

