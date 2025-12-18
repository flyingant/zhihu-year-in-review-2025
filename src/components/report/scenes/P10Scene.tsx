'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import { colorClass, typographyClass } from '@/hooks/useSceneTheme';
import BaseScene from './BaseScene';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import FlipCounter from '@/components/ui/FlipCounter';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

const formatNumber = (num: number | string | null | undefined) => {
  if (num === null || num === undefined) return '0';
  return Number(num).toLocaleString('en-US');
};

export default function P10Scene({ onNext, sceneName }: PageProps) {
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

  // Calculate equivalent books
  const calculateEquivalentBooks = (words: number | null): number => {
    if (!words || words === 0) return 0;
    return Math.round(words / 200000);
  };

  const equivalentBooks = calculateEquivalentBooks(wordCount);

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix7Asset.url}
          alt={mix7Asset.alt}
          width={mix7Asset.width}
          height={mix7Asset.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '40px', right: '0px' }}
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
        style={{ paddingTop: '120px', paddingBottom: '24px', fontSize: '22px' }}
      >
        <div>阅读，开启你与世界的沉浸对话</div>
        <div>今年，你看过</div>
      </div>

      <div>
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
              right: '50%',
              transform: 'translate(50%, -50%)',
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
              left: '46%',
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
              right: '50%',
              transform: 'translate(50%, -50%)',
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
              left: '46%',
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
          paddingTop: '210px',
          paddingBottom: '20px',
          marginTop: '-150px',
        }}
      >
        <div
          className='flex items-center justify-center'
          style={{ marginBottom: '20px' }}
          hidden={!wordCount}
        >
          <div>总计阅读</div>
          <FlipCounter
            value={Number(wordCount)}
            className={`text-r-purple`}
            style={{
              paddingLeft: '4px',
              paddingRight: '4px',
              fontSize: '44px',
            }}
          />
          <div>个字</div>
        </div>

        <div hidden={!equivalentBooks}>
          相当于读完
          <span
            className='text-r-yellow'
            style={{
              paddingLeft: '2px',
              paddingRight: '2px',
              fontSize: '18px',
            }}
          >
            {equivalentBooks}
          </span>
          本书
        </div>
      </div>
    </BaseScene>
  );
}
