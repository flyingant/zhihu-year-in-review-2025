'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import FlipCounter from '@/components/ui/FlipCounter';

interface PageProps {
  onNext?: () => void;
  onPrevious?: () => void;
  onNavigateToScene?: (sceneId: string) => void;
  sceneName?: string;
}

const formatNumber = (num: number | string | null | undefined) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
};

export default function P10Scene({
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
  const mix8Asset = bgAsset.mix8;
  const group1Asset = assets.report.p10.group1;
  const group2Asset = assets.report.p10.group2;
  const group3Asset = assets.report.p10.group3;
  const group4Asset = assets.report.p10.group4;
  const wordsAsset = assets.report.p10.words;

  const toNumberOrNull = (value: unknown): number | null =>
    typeof value === 'number' ? value : null;

  // Map context data to component variables according to P10 spec
  const questionCount = formatNumber(
    toNumberOrNull(reportData?.consume_question_cnt)
  );
  const answerCount = formatNumber(
    toNumberOrNull(reportData?.consume_answer_cnt)
  );
  const articleCount = formatNumber(
    toNumberOrNull(reportData?.consume_article_cnt)
  );
  const pinCount = formatNumber(toNumberOrNull(reportData?.consume_pin_cnt));
  const wordCount = toNumberOrNull(reportData?.consume_word_cnt);

  // Map word count to equivalent reading achievement
  const getEquivalentReading = (
    words: number | null
  ): { number: string; unit: string; work: string } | null => {
    if (!words || words === 0) return null;

    const w = words;

    if (w < 10000) {
      return null; // P10 placeholder - no equivalent shown
    } else if (w >= 10000 && w < 20000) {
      return { number: '1', unit: '本', work: '散文集《野草》' };
    } else if (w >= 20000 && w < 50000) {
      return { number: '1', unit: '本', work: '《悉达多》' };
    } else if (w >= 50000 && w < 100000) {
      return { number: '半', unit: '部', work: '《人间词话》' };
    } else if (w >= 100000 && w < 150000) {
      return { number: '1', unit: '本', work: '《活着》' };
    } else if (w >= 150000 && w < 200000) {
      return { number: '1', unit: '本', work: '《献给阿尔吉侬的花束》' };
    } else if (w >= 200000 && w < 300000) {
      return { number: '1', unit: '本', work: '《杀死一只知更鸟》' };
    } else if (w >= 300000 && w < 500000) {
      return { number: '1', unit: '部', work: '《人类简史》' };
    } else if (w >= 500000 && w < 750000) {
      return { number: '1', unit: '部', work: '《红楼梦》' };
    } else if (w >= 750000 && w < 1000000) {
      return { number: '1', unit: '部', work: '《三体》三部曲' };
    } else if (w >= 1000000 && w < 1500000) {
      return { number: '1', unit: '部', work: '《四世同堂》' };
    } else if (w >= 1500000 && w < 2000000) {
      return { number: '1', unit: '部', work: '《平凡的世界》' };
    } else if (w >= 2000000 && w < 3000000) {
      return { number: '1', unit: '套', work: '《追忆似水年华》全卷' };
    } else if (w >= 3000000 && w < 4000000) {
      return { number: '1', unit: '遍', work: '四大名著' };
    } else if (w >= 4000000 && w < 5000000) {
      return { number: '10', unit: '遍', work: '《史记》' };
    } else if (w >= 5000000 && w < 7000000) {
      return { number: '10', unit: '遍', work: '「四书五经」' };
    } else if (w >= 7000000 && w < 10000000) {
      return { number: '1', unit: '整套', work: '《金庸全集》' };
    } else if (w >= 10000000 && w < 15000000) {
      return { number: '1', unit: '遍', work: '最长版本的《中国通史》' };
    } else if (w >= 15000000 && w < 20000000) {
      return { number: '100', unit: '遍', work: '《时间简史》' };
    } else if (w >= 20000000 && w < 30000000) {
      return { number: '100', unit: '遍', work: '《百年孤独》' };
    } else if (w >= 30000000 && w < 50000000) {
      return { number: '30', unit: '遍', work: '《战争与和平》' };
    } else if (w >= 50000000 && w < 100000000) {
      return { number: '200', unit: '遍', work: '马尔克斯的《活着为了讲述》' };
    } else {
      // 100000000+
      return { number: '', unit: '', work: '在脑海中建成一座「真实图书馆」' };
    }
  };

  const equivalentReading = getEquivalentReading(wordCount);

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
          src={mix7Asset.url}
          alt={mix7Asset.alt}
          width={mix7Asset.width}
          height={mix7Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '70px', right: '0px' }}
        />
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '152px', left: '27px' }}
        />
        <Image
          src={mix8Asset.url}
          alt={mix8Asset.alt}
          width={mix8Asset.width}
          height={mix8Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '308px', left: '0px' }}
        />
        <Image
          src={blue10Asset.url}
          alt={blue10Asset.alt}
          width={blue10Asset.width}
          height={blue10Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ bottom: '220px', right: '21px' }}
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
        className={'text-center'}
        style={{ paddingTop: '100px', paddingBottom: '24px', fontSize: '22px' }}
      >
        <div>阅读，开启你与世界的沉浸对话</div>
        <div style={{ fontSize: '16px' }}>今年，你看过</div>
      </div>

      <div className='tracking-widest'>
        {/* Group 1: 问题 */}
        <div
          hidden={!questionCount}
          className='relative'
          style={{
            width: '223px',
            height: '127px',
            marginLeft: 'auto',
            marginRight: '24px',
          }}
        >
          <Image
            src={group2Asset.url}
            alt={group2Asset.alt}
            width={group2Asset.width}
            height={group2Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
          />
          <div
            className='absolute flex items-center justify-center'
            style={{
              top: '50%',
              left: '45%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              className='text-r-pink font-bold pixel-font'
              style={{ fontSize: '34px', textShadow: '3px 3px 0px #000000' }}
            >
              {questionCount}
            </span>
          </div>
        </div>

        {/* Group 2: 回答 */}
        <div
          hidden={!answerCount}
          className='relative'
          style={{
            width: '223px',
            height: '127px',
            marginRight: 'auto',
            marginLeft: '24px',
            marginTop: '-40px',
          }}
        >
          <Image
            src={group1Asset.url}
            alt={group1Asset.alt}
            width={group1Asset.width}
            height={group1Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
          />
          <div
            className='absolute flex items-center justify-center'
            style={{
              top: '50%',
              left: '45%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              className='text-r-fern font-bold pixel-font'
              style={{ fontSize: '34px', textShadow: '3px 3px 0px #000000' }}
            >
              {answerCount}
            </span>
          </div>
        </div>

        {/* Group 3: 文章数 */}
        <div
          hidden={!articleCount}
          className='relative'
          style={{
            width: '223px',
            height: '127px',
            marginLeft: 'auto',
            marginRight: '40px',
            marginTop: '-40px',
          }}
        >
          <Image
            src={group3Asset.url}
            alt={group3Asset.alt}
            width={group3Asset.width}
            height={group3Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
          />
          <div
            className='absolute flex items-center justify-center'
            style={{
              top: '50%',
              left: '45%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              className='text-r-green font-bold pixel-font'
              style={{ fontSize: '34px', textShadow: '3px 3px 0px #000000' }}
            >
              {articleCount}
            </span>
          </div>
        </div>

        {/* Group 4: 想法 */}
        <div
          hidden={!pinCount}
          className='relative'
          style={{
            width: '223px',
            height: '127px',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '-40px',
          }}
        >
          <Image
            src={group4Asset.url}
            alt={group4Asset.alt}
            width={group4Asset.width}
            height={group4Asset.height}
            className='object-contain absolute pointer-events-none select-none z-1'
          />
          <div
            className='absolute flex items-center justify-center'
            style={{
              top: '50%',
              left: '45%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span
              className='text-r-yellow font-bold pixel-font'
              style={{ fontSize: '34px', textShadow: '3px 3px 0px #000000' }}
            >
              {pinCount}
            </span>
          </div>
        </div>
      </div>

      {/* 总计阅读字数 / 等效书本 */}
      <div
        className='flex flex-col items-center justify-center'
        style={{
          paddingTop: '190px',
          paddingBottom: '20px',
          marginTop: '-150px',
        }}
      >
        <div
          className='flex items-center justify-center'
          style={{ marginBottom: '20px' }}
          hidden={!wordCount}
        >
          <div>阅读&nbsp;</div>
          <FlipCounter
            value={Number(wordCount)}
            className={`text-r-purple`}
            style={{
              paddingLeft: '6px',
              paddingRight: '6px',
              fontSize: '44px',
            }}
          />
          <div>&nbsp;个字</div>
        </div>
        {equivalentReading && (
          <div>
            {equivalentReading.number && equivalentReading.unit ? (
              <>
                相当于读完
                <span
                  className='text-r-yellow'
                  style={{
                    paddingLeft: '6px',
                    paddingRight: '6px',
                    fontSize: '18px',
                  }}
                >
                  {equivalentReading.number}
                </span>
                {equivalentReading.unit}
                <span
                  className='text-r-yellow'
                  style={{
                    fontSize: '18px',
                  }}
                >
                  {equivalentReading.work}
                </span>
              </>
            ) : (
              <span
                className='text-r-yellow'
                style={{
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: '18px',
                }}
              >
                {equivalentReading.work}
              </span>
            )}
          </div>
        )}
      </div>
    </BaseScene>
  );
}
