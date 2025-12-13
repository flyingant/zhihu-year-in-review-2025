"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import GlitchLayer from "@/components/report/effects/GlitchLayer";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P24Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, film } = assets.report.p24;
  const { mix22_1, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P24 spec (特殊-影视作品)
  const movieLikeCount = reportData?.movie_like_cnt ?? null;

  // Top 3 movies
  const movieLikeName1 = reportData?.movie_like_name_top1 ?? null;
  const movieLikeRate1 = reportData?.movie_like_rate_top1 ?? null;
  const movieLikeUrl1 = reportData?.movie_like_url_top1 ?? null;

  const movieLikeName2 = reportData?.movie_like_name_top2 ?? null;
  const movieLikeRate2 = reportData?.movie_like_rate_top2 ?? null;
  const movieLikeUrl2 = reportData?.movie_like_url_top2 ?? null;

  const movieLikeName3 = reportData?.movie_like_name_top3 ?? null;
  const movieLikeRate3 = reportData?.movie_like_rate_top3 ?? null;
  const movieLikeUrl3 = reportData?.movie_like_url_top3 ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_1.url}
          alt="{mix22_1.alt}"
          width={mix22_1.width}
          height={mix22_1.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "87px", left: "254px" }}
        />
        <Image
          src={mix22_4.url}
          alt="{mix22_4.alt}"
          width={mix22_4.width}
          height={mix22_4.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "578px", right: "0" }}
        />
        <Image
          src={mix22_5.url}
          alt="{mix22_5.alt}"
          width={mix22_5.width}
          height={mix22_5.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "235px", left: "51px" }}
        />
        <Image
          src={mix22_5.url}
          alt="{mix22_5.alt}"
          width={mix22_5.width}
          height={mix22_5.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "736px", left: "24px" }}
        />
      </GlitchLayer>
      {/* images */}
      <div className="z-0">
        <Image
          src={film.url}
          alt="{film.alt}"
          width={film.width}
          height={film.height}
          className="object-contain absolute pointer-events-none select-none -z-10"
          style={{ top: "17px", left: "0", right: "0" }}
        />
        <Image
          src={liukanshan.url}
          alt="{liukanshan.alt}"
          width={liukanshan.width}
          height={liukanshan.height}
          className="object-contain absolute pointer-events-none select-none -z-10"
          style={{ top: "578px", left: "45px" }}
        />
      </div>
      {/* content */}
      <div className="z-0">
        <div className="pt-[125px] pb-[30px] text-center">
          <div className="mb-[10px]">
            你参与了{" "}
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(movieLikeCount ?? "movie_like_cnt")}
            </span>{" "}
            次作品评价
          </div>
          <div className="mb-[10px]">
            用自己的直觉与品味，为作品发声
            <br />
            <span
              className={`${colorClass("pink")} ${typographyClass(
                "subtitle"
              )} px-[2px]`}
            >
              {String(movieLikeCount ?? "movie_like_cnt")}
            </span>{" "}
            次作品评价
          </div>
          <div className="text-center">
            你<span className={colorClass("green")}>的年度影视作品</span>是
          </div>
        </div>

        {/* top films */}
        <div className="z-0 w-full">
          <div
            className="absolute text-center w-[137px]"
            style={{ top: "280px", left: "19px" }}
          >
            <Image
              src={String(movieLikeUrl1 ?? "movie_like_url_top1")}
              alt={String(movieLikeName1 ?? "movie_like_name_top1")}
              className="object-cover bg-red-500"
              width={104}
              height={156}
            />
            <div className="flex flex-col items-center w-full whitespace-normal">
              <div>
                《
                <span
                  className={`${colorClass("blue")} ${typographyClass(
                    "subtitle"
                  )} px-[2px]`}
                >
                  {String(movieLikeName1 ?? "movie_like_name_top1")}
                </span>
                》,{" "}
                <span
                  className={`${colorClass("fern")} ${typographyClass(
                    "subtitle"
                  )} px-[2px]`}
                >
                  {String(movieLikeRate1 ?? "movie_like_rate_top1")}
                </span>
                % 知友推荐
              </div>
            </div>
          </div>
          <div
            className="absolute top-[332px] left-[135px] text-center w-[137px]"
            style={{ top: "332px", left: "135px" }}
          >
            <Image
              src={String(movieLikeUrl2 ?? "movie_like_url_top2")}
              alt={String(movieLikeName2 ?? "movie_like_name_top2")}
              className="object-cover bg-yellow-500"
              width={104}
              height={156}
            />
            <div className="flex flex-col items-center w-full whitespace-normal">
              <div>
                《
                <span
                  className={`${colorClass("blue")} ${typographyClass(
                    "subtitle"
                  )} px-[2px]`}
                >
                  {String(movieLikeName2 ?? "movie_like_name_top2")}
                </span>
                》,{" "}
                <span
                  className={`${colorClass("fern")} ${typographyClass(
                    "subtitle"
                  )} px-[2px]`}
                >
                  {String(movieLikeRate2 ?? "movie_like_rate_top2")}
                </span>
                % 知友推荐
              </div>
            </div>
          </div>
          <div
            className="absolute top-[280px] left-[250px] text-center w-[137px]"
            style={{ top: "280px", left: "250px" }}
          >
            <Image
              src={String(movieLikeUrl3 ?? "movie_like_url_top3")}
              alt={String(movieLikeName3 ?? "movie_like_name_top3")}
              className="object-cover bg-green-500"
              width={104}
              height={156}
            />
            <div className="flex flex-col items-center w-full whitespace-normal">
              <div>
                《
                <span
                  className={`${colorClass("blue")} ${typographyClass(
                    "subtitle"
                  )} px-[2px]`}
                >
                  {String(movieLikeName3 ?? "movie_like_name_top3")}
                </span>
                》,{" "}
                <span
                  className={`${colorClass("fern")} ${typographyClass(
                    "subtitle"
                  )} px-[2px]`}
                >
                  {String(movieLikeRate3 ?? "movie_like_rate_top3")}
                </span>
                % 知友推荐
              </div>
            </div>
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
