"use client";

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useAssets } from '@/context/assets-context';
import { useToast } from '@/context/toast-context';
import { useZA } from '@/hooks/useZA';
import {
  getAnnualQuestionList,
  generateAnnualQuestionPoster,
  getAnnualQuestionPosterInfo,
  type AnnualQuestion,
  type AnnualQuestionPosterInfo
} from '@/api/campaign';
import { isZhihuApp } from '@/lib/zhihu-detection';
import { useZhihuHybrid } from '@/hooks/useZhihuHybrid';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/context/auth-context';

const useLoadingDots = (baseText: string, speed = 300, isActive: boolean) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!isActive) return;

    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 4;
      setDots('.'.repeat(count));
    }, speed);

    return () => {
      clearInterval(interval);
      setDots('');
    };
  }, [speed, isActive]);

  return `${baseText}${dots}`;
};

const TOPICS = [
  { id: 'scienceHealth', name: '科学健康', color: '#8EFFA4' },
  { id: 'techDigital', name: '科技数码', color: '#68E1FD' },
  { id: 'carHome', name: '汽车', color: '#55F8CE' },
  { id: 'game', name: '游戏电竞', color: '#6B90FF' },
  { id: 'entertainment', name: '影音娱乐', color: '#FFB84F' },
  { id: 'sports', name: '体育竞技', color: '#FF8A72' },
  
  { id: 'militaryPolitics', name: '社会经济', color: '#C8F667' }, 
  { id: 'education', name: '教育', color: '#A5FF93' },
  { id: 'career', name: '职场', color: '#F6A8FF' },
  { id: 'parenting', name: '母婴亲子', color: '#FF97D6' },
  { id: 'psychology', name: '心理学', color: '#56E9FF' },
  { id: 'humanities', name: '人文', color: '#FFEB55' },
  { id: 'lifestyle', name: '趣生活', color: '#FF6EA9' },
  
];

// 类型定义
type Question = {
  id: number;
  topicId: string;
  title: string;
  url: string;
  category: string;
};

const VoteTenQuestions = () => {
  const { assets } = useAssets();
  const { showToast } = useToast();
  const { downloadImage: downloadImageViaHybrid } = useZhihuHybrid();
  const { trackEvent } = useZA();
  const isMobile = useMobile();
  const { isAuthenticated, login } = useAuth();

  const [activeTopicId, setActiveTopicId] = useState<string>(TOPICS[0].id);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [posterInfo, setPosterInfo] = useState<AnnualQuestionPosterInfo | null>(null);
  const [isLoadingPosterInfo, setIsLoadingPosterInfo] = useState(true);

  // Map category name to topic ID
  const categoryToTopicId = useMemo(() => {
    const map: Record<string, string> = {};
    TOPICS.forEach(topic => {
      map[topic.name] = topic.id;
    });
    return map;
  }, []);

  // Fetch poster info first
  useEffect(() => {
    const fetchPosterInfo = async () => {
      try {
        setIsLoadingPosterInfo(true);
        const info = await getAnnualQuestionPosterInfo();
        console.log('Annual Question Poster Info:', info);
        setPosterInfo(info);
      } catch (error) {
        console.error('Failed to fetch poster info:', error);
        setPosterInfo(null);
      } finally {
        setIsLoadingPosterInfo(false);
      }
    };

    fetchPosterInfo();
  }, []);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoadingQuestions(true);
        const results = await getAnnualQuestionList();
        const categories = results.list;
        const allQuestions: Question[] = [];
        let globalId = 1;

        categories.forEach((category) => {
          category.question_list.forEach((q) => {
            const topicId = categoryToTopicId[category.category] || categoryToTopicId[q.category] || TOPICS[0].id;
            allQuestions.push({
              id: globalId++,
              topicId,
              title: q.question_text,
              url: q.question_url,
              category: category.category || q.category,
            });
          });
        });

        setQuestions(allQuestions);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
        const errorMessage = error && typeof error === 'object' && 'msg' in error
          ? String(error.msg)
          : '获取问题列表失败，请稍后重试';
        showToast(errorMessage, 'error');
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryToTopicId]);

  const currentQuestions = useMemo(() =>
    questions.filter(q => q.topicId === activeTopicId),
    [activeTopicId, questions]);

  const loadingText = useLoadingDots("海报生成中", 400, isGeneratingPoster);

  if (!assets) return null;

  // Check if we should show the poster instead of the original UI
  const shouldShowPoster = posterInfo?.poster_generate_status === 1 && posterInfo?.poster_image_url;

  const titleAsset = assets.vote.title;
  const voteAssets = assets.vote as any;
  const listBgAsset = voteAssets.listBg;
  const btnBgAsset = voteAssets.btnBg;
  const cancelBtnAsset = voteAssets.cancelBtn;
  const panelBgAsset = voteAssets.panelBg;
  const liukanshanAsset = assets.games.liukanshan;

  const downloadImageStandard = async (imageUrl: string) => {
    try {
      const tryCanvasMethod = (): Promise<Blob> => {
        return new Promise<Blob>((resolve, reject) => {
          const img = document.createElement('img');
          img.crossOrigin = 'anonymous';

          img.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              canvas.width = img.naturalWidth || img.width;
              canvas.height = img.naturalHeight || img.height;

              const ctx = canvas.getContext('2d');
              if (!ctx) {
                reject(new Error('Failed to get canvas context'));
                return;
              }

              ctx.drawImage(img, 0, 0);

              canvas.toBlob((blob) => {
                if (blob) {
                  resolve(blob);
                } else {
                  reject(new Error('Failed to convert canvas to blob'));
                }
              }, 'image/png');
            } catch (error) {
              reject(error);
            }
          };

          img.onerror = () => reject(new Error('Failed to load image with CORS'));
          img.src = imageUrl;
        });
      };

      const tryFetchMethod = async (): Promise<Blob> => {
        const response = await fetch(imageUrl, {
          mode: 'cors',
          credentials: 'omit',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch image');
        }

        return await response.blob();
      };

      const tryDirectDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `poster-${Date.now()}.png`;
        link.target = '_blank';
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      let blob: Blob;

      try {
        blob = await tryCanvasMethod();
      } catch (canvasError) {
        console.warn('Canvas method failed, trying fetch:', canvasError);
        try {
          blob = await tryFetchMethod();
        } catch (fetchError) {
          console.warn('Fetch method failed, using direct download:', fetchError);
          tryDirectDownload();
          return;
        }
      }

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `poster-${Date.now()}.png`;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 100);

      showToast('图片保存成功', 'success');
    } catch (error) {
      console.error('Failed to download image:', error);
      showToast('保存失败，请稍后重试', 'error');
    }
  };

  const handleSavePosterImage = async (imageUrl: string) => {
    // Redirect to Zhihu App if not in app and on mobile
    if (!isZhihuApp() && isMobile && assets?.urls?.inAppRedirectionURL) {
      window.location.href = assets.urls.inAppRedirectionURL;
      return;
    }
    
    if (isZhihuApp()) {
      try {
        await downloadImageViaHybrid(imageUrl);
      } catch (error) {
        console.error('Failed to save image via zhihuHybrid:', error);
        await downloadImageStandard(imageUrl);
      }
    } else {
      await downloadImageStandard(imageUrl);
    }
  };

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

  // 处理未认证用户点击输入区域 - 跳转到登录页
  const handleAuthOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const signinBase = assets?.urls?.signinBase;
    login(signinBase);
  };

  const handleGeneratePoster = async () => {
    if (selectedQuestions.length === 0) {
      showToast('请至少选择一个问题', 'info');
      return;
    }

    if (selectedQuestions.length < 10) {
      showToast('请选择 10 个问题', 'info');
      return;
    }

    // phase2埋点7
    trackEvent('', {
      moduleId: 'annual_report_publish_pin_2025',
      type: 'Button',
      page: { page_id: '60850' }
    });

    setIsGeneratingPoster(true);
    try {
      // Convert selected questions to API format
      // to mayi 这个就是我们要传给后端的格式
      const apiQuestions: AnnualQuestion[] = selectedQuestions.map(q => ({
        question_text: q.title,
        question_url: q.url,
        category: q.category,
      }));

      const response = await generateAnnualQuestionPoster(apiQuestions);

      if (response.poster_generate_status === 1) {
        // Fetch the poster info to get the image URL
        const newPosterInfo = await getAnnualQuestionPosterInfo();
        setPosterInfo(newPosterInfo);

        if (response.publish_pin_status === 1) {
          showToast('海报生成并发布成功', 'success');
        } else {
          showToast('海报生成成功', 'success');
        }
      } else {
        showToast('海报生成失败，请稍后重试', 'error');
      }
    } catch (error) {
      console.error('Failed to generate poster:', error);
      const errorMessage = error && typeof error === 'object' && 'msg' in error
        ? String(error.msg)
        : '海报生成失败，请稍后重试';
      showToast(errorMessage, 'error');
    } finally {
      setIsGeneratingPoster(false);
    }
  };


  const topRowTopics = TOPICS.slice(0, 6);
  const bottomRowTopics = TOPICS.slice(6);
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


  // If poster is available, show only the poster image
  if (isLoadingPosterInfo) {
    return (
      <div className="relative w-full flex flex-col items-center pb-10">
        <div className="text-center text-gray-400 py-10">加载中...</div>
      </div>
    );
  }

  if (shouldShowPoster && posterInfo?.poster_image_url) {
    return (
      <div className="relative w-full flex flex-col items-center pb-10">
        <div className="relative w-full flex flex-col items-center mt-4">
          <div className="relative w-full">
            <Image
              src={posterInfo.poster_image_url}
              alt="Generated poster"
              width={343}
              height={600}
              className="w-full h-auto object-contain"
              unoptimized
            />
            <div className="absolute bottom-0 left-0 right-0 bg-white flex flex-col gap-2 w-full px-2 py-2">
              <div
                onClick={() => handleSavePosterImage(posterInfo.poster_image_url)}
                className="flex justify-center items-center w-full cursor-pointer"
              >
                {assets.vote.save && (
                  <Image
                    src={assets.vote.save.url}
                    alt={assets.vote.save.alt}
                    width={assets.vote.save.width}
                    height={assets.vote.save.height}
                    className="object-contain"
                    unoptimized
                  />
                )}
              </div>
              {assets.vote.saveBottom && (
                <div className="flex justify-center items-center w-full">
                  <Image
                    src={assets.vote.saveBottom.url}
                    alt={assets.vote.saveBottom.alt}
                    width={assets.vote.saveBottom.width}
                    height={assets.vote.saveBottom.height}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

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


      {/* 问题列表和按钮区域 */}
      <div className="relative w-full">
        {/* 未认证用户透明遮罩层 */}
        {!isAuthenticated && (
          <div
            onClick={handleAuthOverlayClick}
            onMouseDown={handleAuthOverlayClick}
            className="absolute inset-0 z-[70] cursor-pointer"
            style={{
              backgroundColor: 'rgba(0,0,0,0.01)',
              pointerEvents: 'auto',
              minHeight: '100%'
            }}
          />
        )}
        {/* 问题列表区 */}
        <div className="relative w-full w-[375px] h-[382px] mt-2 ">
          {/* 列表背景图 */}
          <div className="absolute inset-0 z-0">
            <Image
              src={listBgAsset.url}
              alt="bg"
              fill
              className="object-fill"
            />
          </div>
          <div
            className="absolute z-10 overflow-y-auto hide-scrollbar py-[12px]
              top-[4px] bottom-[4px] left-[6px] right-[6px]">
            <div className="flex flex-col justify-center items-center">
              {isLoadingQuestions ? (
                <div className="text-center text-gray-400 py-10">加载中...</div>
              ) : (
                <>
                  {currentQuestions.map((q) => {
                    const isSelected = selectedQuestions.some(sq => sq.id === q.id);

                    const bgAsset = voteAssets[activeTopicId][isSelected ? 'select' : 'unselect'];

                    if (!bgAsset) return null;

                    return (
                      <div
                        key={q.id}
                        className="relative w-[343px] h-[56px] transition-transform mb-[14px] last:mb-0"
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
                </>
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
          onClick={handleGeneratePoster}
          className="relative flex-1 h-[48px] flex items-center justify-center cursor-pointer active:scale-95 transition-transform disabled:opacity-50"
        >
          <Image src={btnBgAsset.url} alt="btn" fill className="object-fill" />
          <span className="relative z-10 text-white font-bold text-[15px] pixel-font drop-shadow-md">
            {isGeneratingPoster ? '生成中...' : '生成海报并发想法'}
          </span>
        </div>
      </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col justify-end" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div
            className="absolute inset-0 bg-black/60 animate-overlayShow"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative w-full animate-slide-up h-[80vh] flex flex-col z-10 overflow-hidden" >
            <div className="absolute top-0 left-0 w-full h-[1160px] z-0">
              <Image
                src={panelBgAsset.url}
                alt={panelBgAsset.alt}
                width={panelBgAsset.width}
                height={panelBgAsset.height}
                className="object-fill"
              />
            </div>
            <div className="relative z-10 flex flex-col h-full pt-[20px] px-[24px] pb-[32px]">
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
                    className="flex items-center justify-between bg-white border-b-[1px] border-[#e8eaed] py-[14px]"
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
      {/* 生成中弹框 */}
      {isGeneratingPoster && (
        <div className="fixed z-[9999] inset-0 h-screen bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center">
          <div className="relative w-[74px] h-[104px]">
            <Image
              src={liukanshanAsset.url}
              alt="Loading"
              fill
              className="object-contain"
            />
          </div>
          <div className="mt-4 text-cyan-400 text-xl font-bold tracking-widest h-[30px]">
            {loadingText}
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteTenQuestions;