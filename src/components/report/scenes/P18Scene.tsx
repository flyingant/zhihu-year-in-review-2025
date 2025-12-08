"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P18Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  
  // Map context data to component variables according to P18 spec (社交-圈子主理人)
  const clubAdminTop1Name = reportData?.club_admin_top1_name ?? null;
  const clubAdminTop1MemberCount = reportData?.club_admin_top1_member_cnt ?? null;
  const clubAdminTop1ContentCount = reportData?.club_admin_top1_content_cnt ?? null;
  const clubAdminTop1PinCount = reportData?.club_admin_top1_pin_cnt ?? null;
  const clubAdminTop1InteractionCount = reportData?.club_admin_top1_interaction_cnt ?? null;
  const clubAdminTop2Name = reportData?.club_admin_top2_name ?? null;
  const clubAdminTop2MemberCount = reportData?.club_admin_top2_member_cnt ?? null;
  const clubAdminTop2ContentCount = reportData?.club_admin_top2_content_cnt ?? null;
  const clubAdminTop2PinCount = reportData?.club_admin_top2_pin_cnt ?? null;
  const clubAdminTop2InteractionCount = reportData?.club_admin_top2_interaction_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className={typographyClass('title') + ' leading-relaxed'}>
        感谢有你,圈子一直在发光
      </div>

      <div className="pt-[60px] pb-[20px]">
        「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop1Name ?? 'club_admin_top1_name')}</span>」圈的主理人,你好
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          2025年, <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop1MemberCount ?? 'club_admin_top1_member_cnt')}</span> 位圈友在你的带领下相聚
        </div>
        <div>
          共同创造了 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop1ContentCount ?? 'club_admin_top1_content_cnt')}</span> 条真实、滚烫的讨论
        </div>
      </div>

      <div className="pb-[30px]">
        <div className="mb-[10px]">
          作为引路人,你在圈内发言 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop1PinCount ?? 'club_admin_top1_pin_cnt')}</span> 次
        </div>
        <div>
          与 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop1InteractionCount ?? 'club_admin_top1_interaction_cnt')}</span> 位圈友交换了想法
        </div>
      </div>

      {/* 第二个圈子 */}
      <div className="pt-[40px] pb-[20px]">
        <div className="mb-[10px]">
          「<span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop2Name ?? 'club_admin_top2_name')}</span>」圈的主理人,你好
        </div>
        <div className="pb-[20px]">
          <div className="mb-[10px]">
            2025年, <span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop2MemberCount ?? 'club_admin_top2_member_cnt')}</span> 位圈友在你的带领下相聚
          </div>
          <div>
            共同创造了 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop2ContentCount ?? 'club_admin_top2_content_cnt')}</span> 条真实、滚烫的讨论
          </div>
        </div>
        <div>
          <div className="mb-[10px]">
            作为引路人,你在圈内发言 <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop2PinCount ?? 'club_admin_top2_pin_cnt')}</span> 次
          </div>
          <div>
            与 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>{String(clubAdminTop2InteractionCount ?? 'club_admin_top2_interaction_cnt')}</span> 位圈友交换了想法
          </div>
        </div>
      </div>
    </BaseScene>
  );
}

