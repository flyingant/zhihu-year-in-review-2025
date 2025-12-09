"use client";

import Image from "next/image";
import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import { useAssets } from '@/context/assets-context';
import BaseScene from "./BaseScene";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P15Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { blue15, mix15, mix15_1, mix15_2 } = assets.report.bg;
  const { ladder } = assets.report.p15;

  // Map context data to component variables according to P15 spec (社交-关注我的)
  const newFollowCount = reportData?.new_follow_cnt ?? null;
  const mostUpvoteMemberName = reportData?.most_upvote_member_name ?? null;
  const mostUpvoteMemberUpvote = reportData?.most_upvote_member_upvote ?? null;
  const interactionMostMemberName = reportData?.interaction_most_member_name ?? null;
  const thanksInvitationDate = reportData?.thanks_invitation_date ?? null;
  const thanksInvitationQuestionTitle = reportData?.thanks_invitation_question_title ?? null;
  const thanksInvitationMemberName = reportData?.thanks_invitation_member_name ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <div className="z-0">
        <Image src={blue15.url} alt={blue15.alt} width={blue15.width} height={blue15.height}
          className="object-contain absolute -top-[33px] left-0 pointer-events-none select-none z-0" />
        <Image src={ladder.url} alt={ladder.alt} width={ladder.width} height={ladder.height}
          className="object-contain absolute top-[47px] left-0 right-0 pointer-events-none select-none z-0" />
        <Image src={blue15.url} alt={blue15.alt} width={blue15.width} height={blue15.height}
          className="object-contain rotate-90 absolute top-[120px] right-[21px] pointer-events-none select-none z-0" />
        <Image src={blue15.url} alt={blue15.alt} width={blue15.width} height={blue15.height}
          className="object-contain rotate-90 absolute top-[575px] left-[10px] pointer-events-none select-none z-0" />
        <Image src={mix15.url} alt={mix15.alt} width={mix15.width} height={mix15.height}
          className="object-contain absolute bottom-[22px] right-0 pointer-events-none select-none z-1" />
        <Image src={mix15_1.url} alt={mix15_1.alt} width={mix15_1.width} height={mix15_1.height}
          className="object-contain absolute top-[363px] right-[19px] pointer-events-none select-none z-1" />
        <Image src={mix15_2.url} alt={mix15_2.alt} width={mix15_2.width} height={mix15_2.height}
          className="object-contain absolute top-[379px] right-0 pointer-events-none select-none z-1" />
      </div>

      <div className="z-0">
        <div className={typographyClass('title') + ' leading-relaxed  left-[32px]'}>
          真实的连接,从点滴开启
        </div>

        <div className="absolute left-[120px] pt-[20px]">
          <div className="flex items-center gap-1">
            <span className={`${colorClass('pink')} ${typographyClass('subtitle')}`}>2025 </span>
            年
          </div>
          有
          <span className={`${colorClass('green')} ${typographyClass('title')} px-[2px]`}>{String(newFollowCount ?? 'new_follow_cnt')}</span> 位知友选择关注你
        </div>

        <div className="absolute pt-[190px] left-[19px]">
          <div className="">
            最懂你的是 <span className={`${colorClass('yellow')} ${typographyClass('subtitle')} px-[2px]`}>@{String(mostUpvoteMemberName ?? 'most_upvote_member_name')}</span>
          </div>
          <div className="text-sm">
            TA用 <span className={`${colorClass('fern')} ${typographyClass('subtitle')} px-[2px]`}>{String(mostUpvoteMemberUpvote ?? 'most_upvote_member_upvote')}</span> 个赞同回应你的表达
          </div>
          <div className="text-sm">
            和你互动最多的，是<span className={`${colorClass('pink')} ${typographyClass('subtitle')} px-[2px]`}>{String(interactionMostMemberName ?? 'interaction_most_member_name')}</span>
          </div>
        </div>

        <div className="absolute top-[411px] left-[114px] right-[20px] text-sm">
          <div className="mb-[10px] wrap-break-word">
            <span className={`${colorClass('green')} ${typographyClass('subtitle')} px-[2px]`}>{String(thanksInvitationDate ?? 'thanks_invitation_date')}</span> 
            你在 <span className={`${colorClass('blue')} ${typographyClass('subtitle')} px-[2px]`}>@{String(thanksInvitationMemberName ?? 'thanks_invitation_member_name')}</span>
            <span className={`${colorClass('yellow')} ${typographyClass('subtitle')} px-[2px] wrap-break-word`}>{String(thanksInvitationQuestionTitle ?? 'thanks_invitation_question')}</span>
          </div>
          <div>
            回应了 <span className={`${colorClass('purple')} ${typographyClass('subtitle')} px-[2px]`}>@{String(thanksInvitationMemberName ?? 'thanks_invitation_member_name')}</span> 的热情, <br />
            写下今年的第一个「谢邀」
          </div>
        </div>
      </div>

    </BaseScene>
  );
}

