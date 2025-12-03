"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useToast } from '@/context/toast-context';

const TOPICS = [
  { id: 'science', name: '科学工程', color: '#33E6F8' },
  { id: 'travel', name: '旅 行', color: '#9DFF7F' },
  { id: 'fitness', name: '运动健身', color: '#C2F654' },
  { id: 'parenting', name: '母婴亲子', color: '#FFE655' },
  { id: 'emotion', name: '心理情感', color: '#FFC46B' },
  { id: 'movie', name: '影视娱乐', color: '#FF7E6B' },
  { id: 'fashion', name: '时 尚', color: '#FF7EAB' },
  { id: 'career', name: '职 场', color: '#FF9EE6' },
  { id: 'game', name: '动漫游戏', color: '#D58DF9' },
  { id: 'home', name: '家居家电', color: '#90D7FF' },
  { id: 'tech', name: '科 技', color: '#7E9FFF' },
  { id: 'edu', name: '教 育', color: '#55E6D7' },
  { id: 'sports', name: '体育竞技', color: '#85FF99' },
];

const generateMockQuestions = () => {
  const questions: Question[] = [];
  let globalId = 1;

  TOPICS.forEach((topic) => {
    const count = Math.floor(Math.random() * 13) + 8;

    for (let i = 0; i < count; i++) {
      questions.push({
        id: globalId++,
        topicId: topic.id,
        title: `2025 年关于 ${topic.name} 领域的年度热门问题测试数据展示 ${i}`,
        url: 'https://www.zhihu.com'
      });
    }
  });

  return questions;
};

const MOCK_QUESTIONS = generateMockQuestions();


// 类型定义
type Question = {
  id: number;
  topicId: string;
  title: string;
  url: string;
};

const VoteTenQuestions = () => {
  const { assets } = useAssets();
  const { showToast } = useToast();

  const [activeTopicId, setActiveTopicId] = useState<string>(TOPICS[0].id);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const currentQuestions = useMemo(() =>
    MOCK_QUESTIONS.filter(q => q.topicId === activeTopicId),
    [activeTopicId]);

  if (!assets) return null;

  const titleAsset = assets.vote.title;
  const voteAssets = assets.vote as any;
  const listBgAsset = voteAssets.listBg;
  const btnBgAsset = voteAssets.btnBg;
  const cancelBtnAsset = voteAssets.cancelBtn;
  const panelBgAsset = voteAssets.panelBg;


  const handleTopicClick = (id: string) => {
    setActiveTopicId(id);
  };

  const handleToggleSelect = (question: Question) => {
    const isSelected = selectedQuestions.some(q => q.id === question.id);

    if (isSelected) {
      setSelectedQuestions(prev => prev.filter(q => q.id !== question.id));
    } else {
      if (selectedQuestions.length >= 10) {
        showToast('最多只能选择 10 个问题哦', 'info');
        return;
      }
      setSelectedQuestions(prev => [...prev, question]);
    }
  };

  const handleRemove = (id: number) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleQuestionClick = (url: string) => {
    window.open(url, '_blank');
  };

  const topRowTopics = TOPICS.slice(0, 7);
  const bottomRowTopics = TOPICS.slice(7);
  const renderTab = (topic: typeof TOPICS[0]) => {
    const isActive = activeTopicId === topic.id;
    const tabImg = isActive
      ? voteAssets[topic.id]?.categorySelect
      : voteAssets[topic.id]?.categoryUnselect;

    if (!tabImg) return null;

    return (
      <div
        key={topic.id}
        onClick={() => handleTopicClick(topic.id)}
        className={`
          relative cursor-pointer transition-all duration-200 shrink-0 mr-[14px] w-[61px] h-[24px]
          ${isActive ? 'top-[-1px]' : ''}
        `}
      >
        <Image
          src={tabImg.url}
          alt={tabImg.alt}
          width={tabImg.width}
          height={tabImg.height}
          className="object-contain"
        />
      </div>
    );
  };


  return (
    <div className="relative w-full flex flex-col items-center pb-10">
      <Image
        src={titleAsset.url}
        alt={titleAsset.alt}
        width={titleAsset.width}
        height={titleAsset.height}
        className="relative z-10 w-full h-auto object-contain pr-[20px] pb-[13px]"
        priority
      />
      <div className="w-full overflow-x-auto hide-scrollbar mb-2 px-[16px]">
        <div className="flex flex-col gap-y-3 w-max">
          <div className="flex flex-nowrap items-center">
            {topRowTopics.map(renderTab)}
          </div>
          <div className="flex flex-nowrap">
            {bottomRowTopics.map(renderTab)}
          </div>
        </div>
      </div>


      {/* 问题列表区 */}
      <div className="relative w-full w-[375px] h-[382px] mt-2 ">
        {/* 列表背景图 */}
        <div className="absolute inset-0 z-0 left-0 right-0">
          <Image
            src={listBgAsset.url}
            alt="bg"
            fill
            className="object-fill"
          />
        </div>
        <div
          className="relative w-full h-[370px] overflow-y-auto my-2 hide-scrollbar">
          <div className="pt-2 flex flex-col justify-center items-center">
            {currentQuestions.map((q) => {
              const isSelected = selectedQuestions.some(sq => sq.id === q.id);

              const bgAsset = voteAssets[activeTopicId][isSelected ? 'select' : 'unselect'];

              if (!bgAsset) return null;

              return (
                <div
                  key={q.id}
                  className="relative w-[343px] h-[56px] transition-transform mb-[14px]"
                >
                  <div className="absolute inset-0 z-0">
                    <Image
                      src={bgAsset.url}
                      alt="bg"
                      fill
                      className="object-fill"
                    />
                  </div>

                  <div className="absolute inset-0 z-10 flex items-center justify-between px-4">
                    <div
                      className="flex-1 text-[14px] font-bold text-[#333] line-clamp-2 mr-4 cursor-pointer leading-tight"
                      onClick={() => handleQuestionClick(q.url)}
                    >
                      {q.title}
                    </div>

                    <div
                      onClick={() => handleToggleSelect(q)}
                      className="relative w-[60px] h-[32px] flex items-center justify-center cursor-pointer"
                    >
                    </div>
                  </div>
                </div>
              );
            })}

            {currentQuestions.length === 0 && (
              <div className="text-center text-gray-400 py-10">该话题下暂无问题</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full px-[16px] mt-4 gap-3">
        <div
          onClick={() => setIsModalOpen(true)}
          className="relative flex-1 h-[48px] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <Image src={btnBgAsset.url} alt="btn" fill className="object-fill" />
          <span className="relative z-10 text-white font-bold text-[15px] pixel-font drop-shadow-md">
            已选问题 {selectedQuestions.length}/10 个
          </span>
        </div>
        <div
          className="relative flex-1 h-[48px] flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
        >
          <Image src={btnBgAsset.url} alt="btn" fill className="object-fill" />
          <span className="relative z-10 text-white font-bold text-[15px] pixel-font drop-shadow-md">
            生成海报并发想法
          </span>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end">
          <div
            className="absolute inset-0 bg-black/60 animate-overlayShow"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative w-full animate-slide-up h-[80vh] flex flex-col z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[1160px] z-0">
              <Image
                src={panelBgAsset.url}
                alt={panelBgAsset.alt}
                width={panelBgAsset.width}
                height={panelBgAsset.height}
                className="object-fill"
              />
            </div>
            <div className="relative z-10 flex flex-col w-full h-full pt-[20px] px-[24px] pb-[32px]">
              <div className="text-center text-base font-bold mb-4 relative pixel-font">
                已选问题 {selectedQuestions.length} 个
                <div
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer opacity-60 hover:opacity-100 w-[30px] h-[30px] flex items-center justify-center"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L13 13M1 13L13 1" stroke="#999" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto hide-scrollbar flex flex-col pb-8">
                {selectedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="flex items-center justify-between bg-white border-b-[1px] border-gray-200 py-[14px]"
                  >
                    <div className="flex-1 text-[14px] line-clamp-2 mr-2 max-w-[220px]">
                      {q.title}
                    </div>
                    <div
                      onClick={() => handleRemove(q.id)}
                      className="relative px-3 py-1 flex items-center justify-center cursor-pointer"
                    >
                      <Image src={cancelBtnAsset.url} alt={cancelBtnAsset.alt} width={cancelBtnAsset.width} height={cancelBtnAsset.height} />
                    </div>
                  </div>
                ))}
                {selectedQuestions.length === 0 && (
                  <div className="text-center text-gray-400 py-10 text-sm">还没选择任何问题哦</div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default VoteTenQuestions;