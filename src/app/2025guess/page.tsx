"use client";

import localFont from "next/font/local";
import { UserReportDataProvider } from "@/context/user-report-data-context";
import GridBackground from "@/components/report/effects/GridBackground";
import AuthWrapper from "@/components/layout/AuthWrapper";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import { useState } from "react";
import { summaryFlags } from "@/utils/common";
import BaseScene from "@/components/report/scenes/BaseScene";
import { useEffect } from "react";
import {
  getVoteInfo,
  submitVote,
  VoteInfoResponse,
  VoteOptionInfo,
} from "@/api/report";
import { useSearchParams } from "next/navigation";

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

  const [voteInfo, setVoteInfo] = useState<
    | (VoteInfoResponse & {
        transformedOptions?: Array<VoteOptionInfo & { key: string, optionKeyword: string }>;
      })
    | undefined
  >();

  const extractKeyword = (text: string) => {
    // 匹配 "我真的" 开头，"了" 结尾，中间是任意非"了"字符
    const pattern = /我真的\s*([^了]+)\s*了/;
    const match = text.match(pattern);
    
    if (match && match[1]) {
      return match[1].trim();
    }
    
    return  ''
  }


  useEffect(() => {
    const initPollData = () => {
      if (!pollId) return;
      getVoteInfo(pollId).then((res) => {
        const voteInfoWithTransformed = {
          ...res,
          ...(res.options && {
            transformedOptions: res.options.map((option) => ({
              ...option,
              key:
                summaryFlags.find((flag) => flag.fullText === option.option_name)
                  ?.key || "empty",
              optionKeyword: extractKeyword(option.option_name || ''),
            })),
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
      };
      setVoteInfo(voteInfoWithTransformed);
    });
  };

  return (
    <BaseScene showBottomNextButton={false}>
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={titleOtherAsset.url}
          alt={titleOtherAsset.alt}
          width={titleOtherAsset.width}
          height={titleOtherAsset.height}
          className="relative mx-auto left-0 right-0 pointer-events-none select-none"
          style={{ top: 114 }}
        />
        <div
          className="relative flex items-center justify-center text-center"
          style={{ top: 150 }}
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
        <div className="relative" style={{ top: 131, left: 20, right: 20 }}>
          {voteInfo?.transformedOptions?.map((option) => (
            <div
              className="relative"
              key={`option-${option.key}`}
              style={{ marginTop: 30, height: 95, width: 344 }}
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
                if (voteInfo?.is_vote_correct !== 2 && option.is_correct) {
                  // Show self-active variant if available, otherwise fallback to active
                  bannerAsset = (banner as { selfActive?: typeof banner.active }).selfActive || banner.active;
                } else if (voteInfo?.is_vote_correct !== 2) {
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
                    height={95}
                  />
                );
              })()}
              {option.key === 'empty' && option.optionKeyword && <div className="absolute" style={{
              
                left: 95,
                bottom: 17,
              }}>
              <span style={{ fontSize: 44 }}>{option.optionKeyword}</span>
              <span style={{ fontSize: 22, marginLeft: 2 }}>了</span>
              </div>}
              {(voteInfo?.is_vote_correct !== 2 || voteInfo.is_owner === 1) && option.is_correct === 1 && guessAssets.taOption && (
                <Image
                  src={guessAssets.taOption.url}
                  alt={guessAssets.taOption.alt}
                  width={96}
                  height={19}
                  className="absolute"
                  style={{
                    left: 70,
                    bottom: 4,
                  }}
                />
              )}
              {voteInfo?.is_vote_correct !== 2 && option.is_voted === 1 && (() => {
                const yourOptionAsset = voteInfo?.is_vote_correct === 1 
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
                      bottom: option.is_correct ? 4 : 12,
                    }}
                  />
                ) : null;
              })()}
              {(voteInfo?.is_vote_correct !== 2 || voteInfo?.is_owner === 1) && (
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
              {(voteInfo?.is_vote_correct !== 2 || voteInfo?.is_owner === 1) && (
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
        {voteInfo?.is_vote_correct === 2 && voteInfo?.is_owner !== 1 && (
          <button
            className="absolute left-1/2 -translate-x-1/2  z-60  rounded-full text-white text-lg"
            style={{
              width: 164,
              bottom: 40,
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
        {voteInfo?.is_vote_correct !== 2 && voteInfo?.is_owner !== 1 && (() => {
          const chooseAsset = voteInfo?.is_vote_correct === 1 
            ? guessAssets.chooseSame 
            : guessAssets.chooseDifferent;
          return chooseAsset ? (
            <Image
              className="absolute left-1/2 -translate-x-1/2  z-60"
              width={296}
              height={21}
              style={{ bottom: 40 }}
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
                  bottom: 20,
                }}
                width={200}
                height={15}
                onClick={() => {}}
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
