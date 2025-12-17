"use client";

import localFont from "next/font/local";
import { UserReportDataProvider } from "@/context/user-report-data-context";
import GridBackground from "@/components/report/effects/GridBackground";
import AuthWrapper from "@/components/layout/AuthWrapper";
import { useUserReportData } from "@/context/user-report-data-context";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import { useState } from "react";
import { summaryFlags } from "@/utils/common";
import BaseScene from "@/components/report/scenes/BaseScene";
import { useEffect } from "react";
import { getVoteInfo, submitVote, VoteInfoResponse, VoteOptionInfo } from "@/api/report";
import { useSearchParams } from "next/navigation";

const tianwangFont = localFont({
  src: "../../../public/fonts/tianwangxingxiangsu.ttf",
  variable: "--font-tianwang",
  display: "swap",
});

function GuessPageScene() {
  const { summaryPoster } = useUserReportData();
  const { assets } = useAssets();
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pollId = searchParams.get("pollId");
  const isSelfView = searchParams.get("selfView") !== undefined;
  const [voteInfo, setVoteInfo] = useState<VoteInfoResponse & { transformedOptions?: Array<VoteOptionInfo & { key: string }> } | undefined>();

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
          })),
        }),
      };

      setVoteInfo(voteInfoWithTransformed);
    });
  };

  useEffect(() => {
    initPollData();
  }, []);
  if (!assets) return null;
  const p28Assets = assets.report.p28 || {};
  const titleOtherAsset = p28Assets.titleOther;

  const onSubmit = () => {
    const selectedId = selectedOptionId ? Number(selectedOptionId) : undefined;
    if (!selectedId || !voteInfo?.poster_id) return;
    
    submitVote({
      poster_id: voteInfo.poster_id,
      option_id: selectedId,
    }).then((res) => {
      // Refresh vote info after submitting
      if (pollId) {
        initPollData();
      }
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
                if (isSelfView) return;
                setSelectedOptionId(String(option.option_id));
              }}
            >
              <Image
                src={`/assets/2025-28-banner-${option.key}${
                  voteInfo?.is_vote_correct !== 2 && option.is_correct
                    ? "-self"
                    : ""
                }-${
                  voteInfo?.is_vote_correct !== 2
                    ? option.is_correct
                      ? "active"
                      : "grey"
                    : selectedOptionId === String(option.option_id)
                    ? "active"
                    : "grey"
                }.png`}
                width={344}
                height={95}
                alt="banner"
              />
              {voteInfo?.is_vote_correct !== 2 && option.is_correct === 1 && (
                <Image
                  src="/assets/guess-ta-option.png"
                  width={96}
                  height={19}
                  alt="ta-option"
                  className="absolute"
                  style={{
                    left: 70,
                    bottom: 4,
                  }}
                />
              )}
              {voteInfo?.is_vote_correct !== 2 && option.is_voted === 1 && (
                <Image
                  src={`/assets/guess-your-option${
                    voteInfo?.is_vote_correct === 1 ? "-correct" : ""
                  }.png`}
                  width={96}
                  height={19}
                  alt="ta-option"
                  className="absolute"
                  style={{
                    right: 70,
                    bottom: 4,
                  }}
                />
              )}
              {(voteInfo?.is_vote_correct !== 2 || isSelfView) && (
                <div
                  className="absolute right-0 bg-[#5cc0f9]"
                  style={{
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
              {(voteInfo?.is_vote_correct !== 2 || isSelfView) && (
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
        {voteInfo?.is_vote_correct === 2 && !isSelfView && (
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
        {voteInfo?.is_vote_correct !== 2 && !isSelfView && (
          <Image
            className="absolute left-1/2 -translate-x-1/2  z-60"
            width={296}
            height={21}
            style={{ bottom: 40 }}
            src={`/assets/guess-${
              voteInfo?.is_vote_correct === 1
                ? "choose-same"
                : "choose-different"
            }.png`}
            alt="result"
          />
        )}

        <div>
          <Image
            src={`/assets/guess-${isSelfView ? "go-again" : "go"}.png`}
            className="absolute left-1/2 -translate-x-1/2 "
            style={{
              bottom: 15,
            }}
            width={200}
            height={15}
            alt="go"
            onClick={() => {}}
          />
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
