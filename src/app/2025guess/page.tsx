"use client";

import localFont from "next/font/local";
import { UserReportDataProvider } from "@/context/user-report-data-context";
import GridBackground from "@/components/report/effects/GridBackground";
import AuthWrapper from "@/components/layout/AuthWrapper";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import { useState } from "react";
import { extractOptionKeyword, summaryFlags } from "@/utils/common";
import BaseScene from "@/components/report/scenes/BaseScene";
import { useEffect } from "react";
import { useZA } from "@/hooks/useZA"; 
import {
  getVoteInfo,
  submitVote,
  VoteInfoResponse,
  VoteOptionInfo,
} from "@/api/report";
import { useSearchParams } from "next/navigation";
import GlitchLayer from "@/components/report/effects/GlitchLayer";

const tianwangFont = localFont({
  src: "../../../public/fonts/tianwangxingxiangsu.ttf",
  variable: "--font-tianwang",
  display: "swap",
});

function GuessPageScene() {
  const { assets } = useAssets();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pollId = searchParams.get("pollId");
  const { trackPageShow } = useZA();

  const [voteInfo, setVoteInfo] = useState<
    | (VoteInfoResponse & {
        transformedOptions?: Array<VoteOptionInfo & { key: string, optionKeyword: string }>;
        isVoted: boolean,
        isVoteCorrect: boolean
      })
    | undefined
  >();
  
  useEffect(() => {
    trackPageShow({ page: { page_id: '60865' } });
  }, []);

  useEffect(() => {
    const initPollData = () => {
      if (!pollId) return;
      getVoteInfo(pollId).then((res) => {
        const isVoted = !!res.options.find(i => i.is_voted)
        const isVoteCorrect = !!res.options.find(i => i.is_voted && i.is_correct)
        const voteInfoWithTransformed = {
          ...res,
          ...(res.options && {
            transformedOptions: res.options.map((option) => ({
              ...option,
              key:
                summaryFlags.find((flag) => flag.fullText === option.option_name)
                  ?.key || "empty",
            optionKeyword: extractOptionKeyword(option.option_name || ''),
            })),
          isVoted,
          isVoteCorrect,
          }),
        };
        setVoteInfo(voteInfoWithTransformed);
      });
    };
    initPollData();
  }, [pollId]);
  
  if (!assets) return null;
  const p28Assets = assets.report.p28 || {};
  const guessAssets = assets.report.guess || {};
  const titleOtherAsset = p28Assets.titleOther;

  const onSubmit = () => {
    const selectedId = selectedOptionId;
    if (!selectedId) return;
    const option = voteInfo?.transformedOptions?.find(
      (option) => option.option_id.toString() === selectedId
    );
    submitVote({
      vote_id: pollId || "",
      poll_id: pollId || "",
      option_name: option?.option_name || "",
      option_id: selectedId,
    }).then((res) => {
      // Refresh vote info after submitting
      // if (pollId) {
      //   initPollData();
      // }
      const isVoted = !!res.options.find(i => i.is_voted)
      const isVoteCorrect = !!res.options.find(i => i.is_voted && i.is_correct)
      const voteInfoWithTransformed = {
        ...res,
        ...(res.options && {
          transformedOptions: res.options.map((option) => ({
            ...option,
            key:
              summaryFlags.find((flag) => flag.fullText === option.option_name)
                ?.key || "empty",
          })),
        }),
        isVoted,
        isVoteCorrect,
      };
      setVoteInfo(voteInfoWithTransformed);
    });
  };

  return (
    <BaseScene showBottomNextButton={false}>
      <GlitchLayer>
        <Image
          className="absolute"
          style={{ left: 51, top: 28 }}
          src={assets.report.bg.blue0_1.url}
          alt={assets.report.bg.blue0_1.alt}
          width={38}
          height={38}
        />

        <Image
          className="absolute right-0"
          style={{ top: 70 }}
          src={assets.report.bg.mix0_2.url}
          alt={assets.report.bg.mix0_2.alt}
          width={84}
          height={20}
        />

        <Image
          className="absolute left-0"
          style={{ top: 455 }}
          src={p28Assets.bg10.url}
          alt={p28Assets.bg10.alt}
          width={62}
          height={20}
        />

        <Image
          className="absolute"
          style={{ right: 20, bottom: 20 }}
          src={p28Assets.bg6.url}
          alt={p28Assets.bg6.alt}
          width={p28Assets.bg6.width}
          height={p28Assets.bg6.height}
        />
      </GlitchLayer>
      <div className="relative w-full h-full overflow-hidden">
        
        <Image
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: 60 }}
          src={assets.kv.logo.url}
          alt={assets.kv.logo.alt}
          width={92}
          height={18}  
          />
        <Image
          src={titleOtherAsset.url}
          alt={titleOtherAsset.alt}
          width={303}
          height={94}
          className="relative mx-auto left-0 right-0 pointer-events-none select-none"
          style={{ top: 98 }}
        />
        <div
          className="relative flex items-center justify-center text-center"
          style={{ top: 120 }}
        >
          <div
            className="text-[#fff] bg-[#34C2FD]"
            style={{
              borderRadius: 24,
              padding: "4px 10px",
              fontSize: 14,
              alignItems: "center",
            }}
          >
            @{voteInfo?.username}的 2025
          </div>
          <div>「真实关键词」是</div>
        </div>
        <div className="relative" style={{ top: 115, left: 20, right: 20 }}>
          {voteInfo?.transformedOptions?.map((option) => (
            <div
              className="relative"
              key={`option-${option.key}`}
              style={{ marginTop: 20, height: 90, width: 344 }}
              onClick={() => {
                if (voteInfo?.is_vote_correct !== 2) return;
                if (voteInfo?.is_owner) return;
                setSelectedOptionId(String(option.option_id));
              }}
            >
              {(() => {
                const bannerKey = option.key as keyof typeof p28Assets.banners;
                const banner = p28Assets.banners?.[bannerKey];
                if (!banner) return null;
                
                let bannerAsset;
                if (voteInfo?.isVoted && option.is_correct) {
                  // Show self-active variant if available, otherwise fallback to active
                  bannerAsset = (banner as { selfActive?: typeof banner.active }).selfActive || banner.active;
                } else if (voteInfo?.isVoted) {
                  // Show active or grey based on correctness
                  bannerAsset = option.is_correct ? banner.active : banner.grey;
                } else {
                  // Show active or grey based on selection
                  bannerAsset = selectedOptionId === String(option.option_id) ? banner.active : banner.grey;
                }

                if (voteInfo?.is_owner) {
                  bannerAsset =  banner.active
                  if (option.is_correct) {
                    bannerAsset =  (banner as { selfActive?: typeof banner.active }).selfActive
                  }
                }
                
                return (
                  <Image
                    src={bannerAsset?.url || ''}
                    alt={bannerAsset?.alt || ''}
                    width={344}
                    height={90}
                    style={{
                      width: 344,
                      height: 90,
                    }}
                  />
                );
              })()}
              {option.key === 'empty' && option.optionKeyword && <div className="absolute" style={{
                left: 95,
                bottom: 4,
              }}>
              <span style={{ fontSize: 44 }}>{option.optionKeyword}</span>
              <span style={{ fontSize: 22, marginLeft: 2 }}>了</span>
              </div>}
              {(voteInfo?.isVoted || voteInfo.is_owner === 1) && option.is_correct === 1 && guessAssets.taOption && (
                <Image
                  src={guessAssets.taOption.url}
                  alt={guessAssets.taOption.alt}
                  width={96}
                  height={19}
                  className="absolute"
                  style={{
                    left: 70,
                    bottom: -1,
                  }}
                />
              )}
              {voteInfo?.isVoted && voteInfo?.is_owner !==1 && option.is_voted === 1 && (() => {
                const yourOptionAsset = voteInfo?.isVoteCorrect 
                  ? guessAssets.yourOptionCorrect 
                  : guessAssets.yourOption;
                return yourOptionAsset ? (
                  <Image
                    src={yourOptionAsset.url}
                    alt={yourOptionAsset.alt}
                    width={96}
                    height={19}
                    className="absolute"
                    style={{
                      right: 70,
                      bottom: option.is_correct ? -1 : -7,
                    }}
                  />
                ) : null;
              })()}
              {(voteInfo?.isVoted || voteInfo?.is_owner === 1) && (
                <div
                  className="absolute right-0"
                  style={{
                    background: option.is_correct ? '#5cc0f9' : '#adadad',
                    padding: "6px 9px",
                    top: -10,
                    fontSize: 12,
                    lineHeight: "11px",
                    border: "1px solid #000",
                  }}
                >
                  {option?.vote_num}人选择
                </div>
              )}
              {(voteInfo?.isVoted || voteInfo?.is_owner === 1) && (
                <div
                  className="absolute left-0 "
                  style={{
                    top: 20,
                    left: 34,
                    fontSize: 14,
                  }}
                >
                  {option.vote_percent}
                </div>
              )}
            </div>
          ))}
        </div>
        {!voteInfo?.isVoted && voteInfo?.is_owner !== 1 && (
          <button
            className="absolute left-1/2 -translate-x-1/2  z-60  rounded-full text-white text-lg"
            style={{
              width: 164,
              bottom: 82,
              height: 32,
              background: selectedOptionId ? "#5cc0f9" : "#adadad",
              border: "1px solid #000",
            }}
            disabled={!selectedOptionId}
            onClick={onSubmit}
          >
            确认选择
          </button>
        )}
        {voteInfo?.isVoted && voteInfo?.is_owner !== 1 && (() => {
          const chooseAsset = voteInfo?.isVoteCorrect 
            ? guessAssets.chooseSame 
            : guessAssets.chooseDifferent;
          return chooseAsset ? (
            <Image
              className="absolute left-1/2 -translate-x-1/2  z-60"
              width={296}
              height={21}
              style={{ bottom: 90 }}
              src={chooseAsset.url}
              alt={chooseAsset.alt}
            />
          ) : null;
        })()}

        <div>
          {(() => {
            const goAsset = voteInfo?.is_owner === 1 ? guessAssets.goAgain : guessAssets.go;
            return goAsset ? (
              <Image
                src={goAsset.url}
                alt={goAsset.alt}
                className="absolute left-1/2 -translate-x-1/2 "
                style={{
                  bottom: 60,
                }}
                width={200}
                height={15}
                onClick={() => {
                  const redirectUrl = `${process.env.NEXT_PUBLIC_BASE_SHARE_URL}/2025/`;
                  window.location.href = redirectUrl;
                }}
              />
            ) : null;
          })()}
        </div>
      </div>
    </BaseScene>
  );
}

export default function GuessPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <main
        className={`w-full h-screen bg-white text-black ${tianwangFont.variable}`}
      >
        <UserReportDataProvider>
          <GridBackground />
          <GuessPageScene />
        </UserReportDataProvider>
      </main>
    </AuthWrapper>
  );
}
