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
  const questionCount = toNumberOrNull(reportData?.consume_question_cnt) ?? 0;
  const answerCount = toNumberOrNull(reportData?.consume_answer_cnt) ?? 0;
  const articleCount = toNumberOrNull(reportData?.consume_article_cnt) ?? 0;
  const pinCount = toNumberOrNull(reportData?.consume_pin_cnt) ?? 0;
  const wordCount = toNumberOrNull(reportData?.consume_word_cnt) ?? 0;


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
      return { number: '1', unit: '章', work: '《人类群星闪耀时》' };
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
        {[
          {
            count: questionCount,
            asset: group2Asset,
            color: 'text-r-pink',
            style: { marginLeft: 'auto', marginRight: '24px' },
          },
          {
            count: answerCount,
            asset: group1Asset,
            color: 'text-r-fern',
            style: { marginRight: 'auto', marginLeft: '24px' },
          },
          {
            count: articleCount,
            asset: group3Asset,
            color: 'text-r-green',
            style: { marginLeft: 'auto', marginRight: '40px' },
          },
          {
            count: pinCount,
            asset: group4Asset,
            color: 'text-r-yellow',
            style: { marginLeft: 'auto', marginRight: 'auto' },
          },
        ]
          .filter((card) => !!card.count)
          .map((card, index) => (
            <div
              key={card.asset.url}
              className='relative'
              style={{
                width: '223px',
                height: '127px',
                marginTop: index === 0 ? '0px' : '-40px',
                ...card.style,
              }}
            >
              <Image
                src={card.asset.url}
                alt={card.asset.alt}
                width={card.asset.width}
                height={card.asset.height}
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
                  className={`${card.color} font-bold pixel-font`}
                  style={{ fontSize: '34px', textShadow: '3px 3px 0px #000000' }}
                >
                  {formatNumber(card.count)}
                </span>
              </div>
            </div>
          ))}
      </div>

      {/* 总计阅读字数 / 等效书本 */}
      {!!wordCount && <div
        className='absolute flex flex-col items-center justify-center'
        style={{
          top: '620px',
          left: 0,
          right: 0,
          margin: 'auto',
        }}
      >
        <div
          className='flex items-center justify-center'
          style={{ marginBottom: '20px' }}
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
      </div>}
    </BaseScene>
  );
}
