'use client';

import { useUserReportData } from '@/context/user-report-data-context';
import BaseScene from './BaseScene';
import GlitchLayer from '@/components/report/effects/GlitchLayer';
import { useAssets } from '@/context/assets-context';
import Image from 'next/image';

interface PageProps {
  onNext?: () => void;
  sceneName?: string;
}

const MovieLikeItem = ({
  name,
  url,
  rate,
  fallbackName,
  fallbackUrl,
  fallbackRate,
  className,
  style,
}: {
  name: unknown;
  url: unknown;
  rate: unknown;
  fallbackName?: string;
  fallbackUrl?: string;
  fallbackRate?: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div
      className={`absolute flex flex-col items-center text-center ${
        className || ''
      }`}
      style={style}
    >
      <Image
        src={String(url ?? fallbackUrl)}
        alt={String(name ?? fallbackName)}
        className='object-cover bg-slate-100'
        width={104}
        height={156}
      />
      <div
        className='w-full whitespace-normal'
        style={{ fontSize: 13, marginTop: 12 }}
      >
        <span>《{String(name ?? fallbackName)}》</span>
        <br />
        <span>{String(rate ?? fallbackRate)}% 知友推荐</span>
      </div>
    </div>
  );
};

export default function P24Scene({ onNext, sceneName }: PageProps) {
  const { reportData } = useUserReportData();
  const { assets } = useAssets();

  if (!assets) return null;

  const { liukanshan, film, gif } = assets.report.p24;
  const { mix22_1, mix22_4, mix22_5 } = assets.report.bg;

  // Map context data to component variables according to P24 spec (特殊-影视作品)
  const movieLikeCount = reportData?.movie_like_cnt ?? null;

  // Top 3 movies
  const movieLikeList = [
    {
      name: reportData?.movie_like_name_top1,
      rate: reportData?.movie_like_rate_top1,
      url: reportData?.movie_like_url_top1,
      fallbackName: 'movie_like_name_top1',
      fallbackUrl: 'movie_like_url_top1',
      fallbackRate: 'movie_like_rate_top1',
      style: { top: '280px', left: '6px', width: '137px' },
    },
    {
      name: reportData?.movie_like_name_top2,
      rate: reportData?.movie_like_rate_top2,
      url: reportData?.movie_like_url_top2,
      fallbackName: 'movie_like_name_top2',
      fallbackUrl: 'movie_like_url_top2',
      fallbackRate: 'movie_like_rate_top2',
      style: { top: '332px', left: '123px', width: '137px' },
    },
    {
      name: reportData?.movie_like_name_top3,
      rate: reportData?.movie_like_rate_top3,
      url: reportData?.movie_like_url_top3,
      fallbackName: 'movie_like_name_top3',
      fallbackUrl: 'movie_like_url_top3',
      fallbackRate: 'movie_like_rate_top3',
      style: { top: '280px', left: '240px', width: '137px' },
    },
  ];

  return (
    <BaseScene onNext={onNext} sceneName={sceneName}>
      {/* pixel block */}
      <GlitchLayer>
        {/* 顺序从上到下 */}
        <Image
          src={mix22_1.url}
          alt='{mix22_1.alt}'
          width={mix22_1.width}
          height={mix22_1.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '87px', left: '254px' }}
        />
        <Image
          src={mix22_4.url}
          alt='{mix22_4.alt}'
          width={mix22_4.width}
          height={mix22_4.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '578px', right: '0' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '235px', left: '51px' }}
        />
        <Image
          src={mix22_5.url}
          alt='{mix22_5.alt}'
          width={mix22_5.width}
          height={mix22_5.height}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '736px', left: '24px' }}
        />
      </GlitchLayer>
      {/* images */}
      <div className='z-0'>
        <Image
          src={film.url}
          alt='{film.alt}'
          width={film.width}
          height={film.height}
          className='object-contain absolute pointer-events-none select-none -z-10'
          style={{ top: '17px', left: '0', right: '0' }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gif.url}
          alt={gif.alt}
          width={gif.width / 2}
          height={gif.height / 2}
          className='object-contain absolute pointer-events-none select-none z-1'
          style={{ top: '556px', left: '45px' }}
        />
      </div>
      {/* content */}
      {movieLikeCount && (
        <div
          className='absolute z-0 w-full tracking-wide'
          style={{
            fontSize: 13,
            top: 125,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <div className='text-center'>
            <div className=''>
              你参与了
              <span className='text-r-pink px-[4px]' style={{ fontSize: 20 }}>
                {String(movieLikeCount ?? 'movie_like_cnt')}
              </span>
              次作品评价
            </div>
            <div className='my-5'>
              哪部作品是反射你内心的那面镜子？
              <br />
            </div>
            <div
              className='text-center'
              hidden={
                !movieLikeList[0].name ||
                !movieLikeList[1].name ||
                !movieLikeList[2].name
              }
            >
              你的<span className='text-r-fern'>年度影视作品</span>是
            </div>
          </div>
        </div>
      )}
      {/* top films */}
      {!!movieLikeList[0].name &&
        !!movieLikeList[1].name &&
        !!movieLikeList[2].name && (
          <div className='z-0 w-full tracking-wide' style={{ fontSize: 13 }}>
            {movieLikeList.map(
              (item, index) =>
                item.name && (
                  <MovieLikeItem
                    key={index}
                    name={item.name}
                    url={item.url}
                    rate={item.rate}
                    fallbackName={item.fallbackName}
                    fallbackUrl={item.fallbackUrl}
                    fallbackRate={item.fallbackRate}
                    style={item.style}
                  />
                )
            )}
          </div>
        )}
    </BaseScene>
  );
}
