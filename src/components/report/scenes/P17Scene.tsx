"use client";

import { useUserReportData } from "@/context/user-report-data-context";
import { colorClass, typographyClass } from "@/hooks/useSceneTheme";
import BaseScene from "./BaseScene";
import { useAssets } from "@/context/assets-context";
import Image from "next/image";
import { motion } from "framer-motion";

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

export default function P17Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { city, pointer1, pointer2, pointer3, pointer4, pointer5 } =
    assets.report.p17;
  const { blue15, blue16, mix15_1, mix15_2, mix16_1, mix16_2, mix17 } =
    assets.report.bg;

  // Map context data to component variables according to P17 spec (社交-互动内容)
  const followQuestionFriend = reportData?.follow_question_friend ?? null;
  const followQuestionFriendQuestionTitle =
    reportData?.follow_question_friend_question_title ?? null;
  const upvoteHotAnswerMemberName =
    reportData?.upvote_hot_answer_member_name ?? null;
  const upvoteHotAnswerTitle = reportData?.upvote_hot_answer_title ?? null;
  const upvoteHotAnswerUpvoteCount =
    reportData?.upvote_hot_answer_upvote_cnt ?? null;
  const upvoteHotAnswerUserCount =
    reportData?.upvote_hot_answer_user_cnt ?? null;

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* background */}
      <div className="z-0">
        <Image
          src={mix16_1.url}
          alt={mix16_1.alt}
          width={mix16_1.width}
          height={mix16_1.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "191px", left: "0", width: "55px", height: "16px" }}
        />
        <Image
          src={blue16.url}
          alt={blue16.alt}
          width={blue16.width}
          height={blue16.height}
          className="object-contain absolute pointer-events-none select-none z-0"
          style={{ top: "41px", left: "13px", width: "27px", height: "27px" }}
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain rotate-90 absolute pointer-events-none select-none z-0"
          style={{ top: "181px", right: "11px", width: "35px", height: "35px" }}
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain rotate-90 absolute pointer-events-none select-none z-0"
          style={{ top: "753px", left: "72px" }}
        />
        <Image
          src={blue15.url}
          alt={blue15.alt}
          width={blue15.width}
          height={blue15.height}
          className="object-contain absolute pointer-events-none select-none z-0"
          style={{ top: "531px", left: "-6px" }}
        />
        <Image
          src={mix15_1.url}
          alt={mix15_1.alt}
          width={mix15_1.width}
          height={mix15_1.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "699px", left: "0", width: "124px", height: "30px" }}
        />
        <Image
          src={mix15_2.url}
          alt={mix15_2.alt}
          width={mix15_2.width}
          height={mix15_2.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "345px", right: "0", width: "71px", height: "16px" }}
        />
        <Image
          src={mix16_2.url}
          alt={mix16_2.alt}
          width={mix16_2.width}
          height={mix16_2.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "714px", left: "-4px", width: "134px", height: "70px" }}
        />
        <Image
          src={city.url}
          alt={city.alt}
          width={city.width}
          height={city.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "552px", right: "0" }}
        />
        <Image
          src={mix17.url}
          alt={mix17.alt}
          width={mix17.width}
          height={mix17.height}
          className="object-contain absolute pointer-events-none select-none z-1"
          style={{ top: "575px", right: "0" }}
        />
        <motion.div
          className="relative z-10"
          animate={{ y: [-2, 10, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Image
            src={pointer1.url}
            alt={pointer1.alt}
            width={pointer1.width}
            height={pointer1.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "103px", left: "49px" }}
          />
        </motion.div>
        <motion.div
          className="relative z-10"
          animate={{ y: [-2, 10, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Image
            src={pointer2.url}
            alt={pointer2.alt}
            width={pointer2.width}
            height={pointer2.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "117px", left: "251px" }}
          />
        </motion.div>
        <motion.div
          className="relative z-10"
          animate={{ y: [-2, 10, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Image
            src={pointer3.url}
            alt={pointer3.alt}
            width={pointer3.width}
            height={pointer3.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "520px", left: "292px" }}
          />
        </motion.div>
        <motion.div
          className="relative z-10"
          animate={{ y: [-2, 10, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Image
            src={pointer4.url}
            alt={pointer4.alt}
            width={pointer4.width}
            height={pointer4.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "688px", left: "259px" }}
          />
        </motion.div>
        <motion.div
          className="relative z-10"
          animate={{ y: [-2, 10, -2] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <Image
            src={pointer5.url}
            alt={pointer5.alt}
            width={pointer5.width}
            height={pointer5.height}
            className="object-contain absolute pointer-events-none select-none z-1"
            style={{ top: "531px", left: "41px" }}
          />
        </motion.div>
      </div>
      {/* content */}
      <div
        className="z-0 absolute"
        style={{ fontSize: 14, top: "233px", left: "35px", right: "37px" }}
      >
        <div className="">
          <div style={{ marginBottom: "10px" }}>
            你和
            <span className={`text-r-pink px-[7px]`} style={{ fontSize: 24 }}>
              {String(followQuestionFriend ?? "follow_question_friend")}
            </span>
            位好友共同关注着一个问题
          </div>
          <div style={{ marginBottom: "43px" }}>
            <span className={`text-r-green px-[2px]`} style={{ fontSize: 17 }}>
              「
              {String(
                followQuestionFriendQuestionTitle ??
                  "follow_question_friend_question_title"
              )}
              」
            </span>
          </div>
        </div>

        <div className="z-0">
          <div style={{ fontSize: 14, marginBottom: "10px" }}>
            你赞同了
            <span className={`text-r-yellow px-[7px]`} style={{ fontSize: 17 }}>
              @
              {String(
                upvoteHotAnswerMemberName ?? "upvote_hot_answer_member_name"
              )}
            </span>
            在
            <br />
            <p style={{ marginTop: "5px" }}>
              <span className={`text-r-blue px-[2px]`} style={{ fontSize: 17 }}>
                「{String(upvoteHotAnswerTitle ?? "upvote_hot_answer_title")}」
              </span>
              <span className={`text-r-blue px-[2px]`} style={{ fontSize: 13 }}>
                问题下的回答
              </span>
            </p>
          </div>
          <div style={{ fontSize: 13 }}>
            <span className={`text-r-purple pr-[7px]`} style={{ fontSize: 24 }}>
              {String(upvoteHotAnswerUserCount ?? "upvote_hot_answer_user_cnt")}
            </span>
            位知友也在此和你对上了频率
          </div>
        </div>
      </div>
    </BaseScene>
  );
}
