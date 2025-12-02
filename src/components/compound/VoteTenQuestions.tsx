"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useToast } from '@/context/toast-context';

const TOPICS = [
  { id: 'science', name: '科学工程', color: '#33E6F8' }, // 青色
  { id: 'travel', name: '旅 行', color: '#9DFF7F' },     // 绿色
  { id: 'fitness', name: '运动健身', color: '#C2F654' },    // 黄绿色
  { id: 'parenting', name: '母婴亲子', color: '#FFE655' }, // 黄色
  { id: 'emotion', name: '心理情感', color: '#FFC46B' },  // 橙色
  { id: 'movie', name: '影视娱乐', color: '#FF7E6B' },    // 红橙色
  { id: 'fashion', name: '时 尚', color: '#FF7EAB' },     // 粉红色
  { id: 'career', name: '职 场', color: '#FF9EE6' },      // 粉色
  { id: 'game', name: '动漫游戏', color: '#D58DF9' },     // 紫色
  { id: 'home', name: '家居家电', color: '#90D7FF' },     // 浅蓝
  { id: 'tech', name: '科 技', color: '#7E9FFF' },       // 蓝色
  { id: 'edu', name: '教 育', color: '#55E6D7' },        // 青绿
  { id: 'sports', name: '体育竞技', color: '#85FF99' },   // 嫩绿
];

const MOCK_QUESTIONS = [
  { id: 1, topicId: 'science', title: '2024 诺贝尔物理学奖授予人工神经网络学习，为什么会颁给 AI 领域？', url: '...' },
  { id: 2, topicId: 'science', title: '如何看待 2024 年 AI 技术的爆发式增长？', url: '...' },
  { id: 3, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 4, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 5, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 6, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 7, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 8, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 9, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
  { id: 10, topicId: 'travel', title: '2024 年你最难忘的一次旅行是去哪里？', url: '...' },
];


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

  // 状态
  const [activeTopicId, setActiveTopicId] = useState<string>(TOPICS[0].id);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 过滤当前话题下的问题
  const currentQuestions = useMemo(() =>
    MOCK_QUESTIONS.filter(q => q.topicId === activeTopicId),
    [activeTopicId]);

  if (!assets) return null;

  // 获取资源组
  // 假设 assets.vote 包含了所有 vote_xxx_select/unselect 的图片
  // 以及底部按钮背景 btn_bottom_bg
  const voteAssets = assets.vote as any;
  // const modalCloseAsset = assets.vote.modal_close;

  // --- 交互逻辑 ---

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

  return (
    <div className="relative w-full flex flex-col items-center px-4 pb-10">
      <div className="flex flex-wrap justify-center gap-2 mb-6 w-full max-w-[360px]">
        {TOPICS.map((topic) => {
          const isActive = activeTopicId === topic.id;
          return (
            <div
              key={topic.id}
              onClick={() => handleTopicClick(topic.id)}
              className={`
                px-3 py-1 text-xs font-bold cursor-pointer transition-all duration-200
                ${isActive ? 'text-white bg-black scale-105' : 'text-gray-500 bg-[#E0E0E0]'}
              `}
              style={{ borderRadius: '4px' }}
            >
              {topic.name}
            </div>
          );
        })}
      </div>

      {/* 问题列表区 */}
      <div
        className="w-full h-[450px] overflow-y-auto px-1 pb-4 hide-scrollbar"
        style={{ maskImage: 'linear-gradient(to bottom, transparent 0%, black 5%, black 95%, transparent 100%)' }}
      >
        <div className="pt-4 flex flex-col">
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

                <div className="absolute inset-0 z-10 flex items-center justify-between px-5">
                  <div
                    className="flex-1 text-sm font-bold text-[#333] line-clamp-2 mr-4 cursor-pointer leading-tight"
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
  );
};

export default VoteTenQuestions;