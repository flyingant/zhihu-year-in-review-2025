"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { useToast } from "@/context/toast-context";
import { getAddressInfo, submitAddress, completeRedeemReward, cancelOccupyReward } from "@/api/campaign";
import { useAssets } from "@/context/assets-context";
import { useZA } from '@/hooks/useZA';
import { useZhihuApp } from '@/hooks/useZhihuApp';
import RegionPicker from "./RegionPicker";
import request from '@/lib/request';

interface AddressFormData {
  region: string;
  provinceName: string;
  cityName: string;
  districtName: string;
  detailedAddress: string;
  recipientName: string;
  phoneNumber: string;
}

const phoneRegex = /^1[3-9]\d{9}$/;

interface TaskStatusResponse {
  task_status: number; // 0: 今日已领完, 1: 未领取还有剩余, 2: 已领取未填地址, 3: 已领取并已填地址
}

interface AddressFormProps {
  // Optional props for redeem flow (if provided, will override URL params)
  redeemParams?: {
    rewardId: string;
    rewardPoolId: string;
    requestId: string;
    rewardRightType: string;
    stockOccupyId: string;
  };
  onClose?: () => void; // Callback when form should be closed (for non-redirect flow)
}

export default function AddressForm({ redeemParams, onClose }: AddressFormProps = {}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { trackPageShow, trackPageDisappear, trackEvent } = useZA();
  const { assets } = useAssets();
  const isZhihuApp = useZhihuApp();

  const [formData, setFormData] = useState<AddressFormData>({
    region: "",
    provinceName: "",
    cityName: "",
    districtName: "",
    detailedAddress: "",
    recipientName: "",
    phoneNumber: "",
  });
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof AddressFormData, string>>>({});
  const [hasExistingAddress, setHasExistingAddress] = useState(false);
  const [taskStatus, setTaskStatus] = useState<number | null>(null);
  const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false);

  // Use props if provided, otherwise fall back to URL params
  const rewardId = redeemParams?.rewardId || searchParams.get("rewardId");
  const rewardPoolId = redeemParams?.rewardPoolId || searchParams.get("rewardPoolId");
  const requestId = redeemParams?.requestId || searchParams.get("requestId");
  const rewardRightType = redeemParams?.rewardRightType || searchParams.get("rewardRightType");
  const stockOccupyId = redeemParams?.stockOccupyId || searchParams.get("stockOccupyId");
  const fromRedeem = !!redeemParams || searchParams.get("from") === "redeem";

  useEffect(() => {
    //埋点29
    trackPageShow({ page: { page_id: '60851', page_level: 2 } });
    return () => {
      //埋点30
      trackPageDisappear({ page: { page_id: '60851', page_level: 2 } });
    };
  }, [fromRedeem, trackPageShow, trackPageDisappear]);

  // Hide navigation bar when entering address form in Zhihu App
  useEffect(() => {
    if (isZhihuApp && typeof window !== 'undefined' && window.zhihuHybrid && typeof window.zhihuHybrid === 'function') {
      try {
        // Type assertion for zhihuHybrid new API pattern
        interface ZhihuHybridAction {
          dispatch(params?: Record<string, unknown>): unknown;
        }
        interface ZhihuHybridNewAPI {
          (action: string): ZhihuHybridAction;
        }
        const hybridAction = (window.zhihuHybrid as ZhihuHybridNewAPI)('browser/hideNavigationBar');
        hybridAction.dispatch();
      } catch (error) {
        console.warn('Failed to hide navigation bar via zhihuHybrid:', error);
      }
    }
    // Restore navigation bar when component unmounts
    return () => {
      if (isZhihuApp && typeof window !== 'undefined' && window.zhihuHybrid && typeof window.zhihuHybrid === 'function') {
        try {
          interface ZhihuHybridAction {
            dispatch(params?: Record<string, unknown>): unknown;
          }
          interface ZhihuHybridNewAPI {
            (action: string): ZhihuHybridAction;
          }
          const hybridAction = (window.zhihuHybrid as ZhihuHybridNewAPI)('browser/showNavigationBar');
          hybridAction.dispatch();
        } catch (error) {
          console.warn('Failed to show navigation bar via zhihuHybrid:', error);
        }
      }
    };
  }, [isZhihuApp]);

  const isFormFilled =
    !!formData.region &&
    !!formData.detailedAddress?.trim() &&
    !!formData.recipientName?.trim() &&
    !!formData.phoneNumber?.trim() &&
    phoneRegex.test(formData.phoneNumber?.trim());

  // Check task status and fetch existing address on mount (only for non-redeem scenarios)
  useEffect(() => {
    // Skip fetching in redeem scenario
    if (fromRedeem) {
      setIsLoading(false);
      return;
    }

    const checkTaskStatusAndFetchAddress = async () => {
      try {
        setIsLoading(true);
        
        // First, check task status
        const taskStatusResponse = await request<TaskStatusResponse>({
          url: '/campaigns/v2/2025/lks_gift_task_status',
          method: 'get',
        });
        
        const currentTaskStatus = taskStatusResponse.task_status;
        setTaskStatus(currentTaskStatus);
        
        // Only fetch address if task status is 2 (已领取未填地址) or 3 (已领取并已填地址)
        if (currentTaskStatus === 3) {
          try {
            const addressInfo = await getAddressInfo();
            if (addressInfo) {
              const regionString = `${addressInfo.province_name} ${addressInfo.city_name} ${addressInfo.district_name}`;
              setFormData({
                region: regionString.trim(),
                provinceName: addressInfo.province_name,
                cityName: addressInfo.city_name,
                districtName: addressInfo.district_name,
                detailedAddress: addressInfo.address_detail || "",
                recipientName: addressInfo.receiver || "",
                phoneNumber: addressInfo.mobile || "",
              });
              setHasExistingAddress(true);
            }
          } catch {
            // If address doesn't exist, that's fine - form will be empty
            console.log("No existing address found");
            setHasExistingAddress(false);
          }
        }
      } catch (error) {
        console.error('Error checking task status:', error);
        // On error, still allow form to be shown but disable submit
        setTaskStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkTaskStatusAndFetchAddress();
  }, [fromRedeem]);

  // Prevent body scroll when region picker is open
  useEffect(() => {
    if (showRegionPicker) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showRegionPicker]);

  const handleBack = async () => {
    // If coming from redeem flow, cancel the occupy before going back
    if (fromRedeem && rewardId && rewardPoolId && requestId && rewardRightType && assets?.campaign) {
      try {
        await cancelOccupyReward(assets.campaign.activityId, {
          request_id: parseInt(requestId, 10),
          reward_pool_id: parseInt(rewardPoolId, 10),
          reward_right_id: parseInt(rewardId, 10),
          reward_right_type: rewardRightType,
        });
        console.log('取消预占成功');
      } catch (error) {
        console.error('取消预占失败:', error);
        // Even if cancel fails, still navigate back
      }
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } else {
      // Remove all URL parameters and reload the current page
      setTimeout(() => {
        // pathname from usePathname() already excludes query params, but we ensure clean URL
        const cleanPath = pathname.split('?')[0]; // Remove any query params if present
        window.location.replace(cleanPath);
      }, 500);
    }
  };

  const handleRegionSelect = (region: string) => {
    const parts = region.split(" ");
    setFormData((prev) => ({
      ...prev,
      region,
      provinceName: parts[0] || "",
      cityName: parts[1] || "",
      districtName: parts[2] || "",
    }));
    // Clear region error when region is selected
    setErrors((prev) => ({ ...prev, region: undefined }));
    setShowRegionPicker(false);
  };

  const handleInputChange = (field: keyof AddressFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateField = (field: keyof AddressFormData, value: string): string | undefined => {
    switch (field) {
      case "region":
        if (!value) {
          return "请选择所在地区";
        }
        break;
      case "detailedAddress":
        if (!value.trim()) {
          return "请输入详细地址与门牌号";
        }
        break;
      case "recipientName":
        if (!value.trim()) {
          return "请输入收货人姓名";
        }
        break;
      case "phoneNumber":
        if (!value.trim()) {
          return "请输入手机号";
        }
        if (!phoneRegex.test(value.trim())) {
          return "请输入正确的手机号";
        }
        break;
    }
    return undefined;
  };

  const handleBlur = (field: keyof AddressFormData) => {
    const value = formData[field];
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AddressFormData, string>> = {};
    let isValid = true;

    const regionError = validateField("region", formData.region);
    if (regionError) {
      newErrors.region = regionError;
      isValid = false;
    }

    const detailedAddressError = validateField("detailedAddress", formData.detailedAddress);
    if (detailedAddressError) {
      newErrors.detailedAddress = detailedAddressError;
      isValid = false;
    }

    const recipientNameError = validateField("recipientName", formData.recipientName);
    if (recipientNameError) {
      newErrors.recipientName = recipientNameError;
      isValid = false;
    }

    const phoneNumberError = validateField("phoneNumber", formData.phoneNumber);
    if (phoneNumberError) {
      newErrors.phoneNumber = phoneNumberError;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      // Show toast for the first error
      const firstError = Object.values(newErrors)[0];
      if (firstError) {
        showToast(firstError, "error");
      }
    }

    return isValid;
  };

  const handleSubmit = async () => {
    // Prevent submission if existing address is found
    if (hasExistingAddress) {
      return;
    }
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // 兑换场景：调用完成兑换接口
      if (fromRedeem) {
        // 验证兑换场景所需的参数（stockOccupyId 是必填参数）
        if (!rewardId || !rewardPoolId || !requestId || !rewardRightType || !stockOccupyId || stockOccupyId === 'null' || stockOccupyId === 'undefined') {
          showToast("兑换信息不完整，请重新操作", "error");
          setIsSubmitting(false);
          return;
        }
        
        // 验证 stockOccupyId 是否为有效数字
        const stockOccupyIdNum = parseInt(stockOccupyId, 10);
        if (isNaN(stockOccupyIdNum)) {
          showToast("兑换信息异常，请重新操作", "error");
          setIsSubmitting(false);
          return;
        }

        if (!assets?.campaign) {
          showToast("活动信息加载中，请稍后再试", "error");
          setIsSubmitting(false);
          return;
        }

        //埋点28
        trackEvent('', {
          moduleId: 'kanshan_address_button_2025',
          type: 'Button',
          page: { page_id: '60851', page_level: 2 }
        });

        // 根据API文档，stock_occupy_id 是兑换时接口返回的字段，必须传递
        await completeRedeemReward(assets.campaign.activityId, {
          request_id: parseInt(requestId, 10), // 使用预占接口的原始 request_id
          reward_pool_id: parseInt(rewardPoolId, 10),
          reward_right_id: parseInt(rewardId, 10),
          reward_right_type: rewardRightType,
          stock_occupy_id: stockOccupyIdNum, // 必填：从预占接口返回（已验证为有效数字）
          receive_info: {
            user_info: {
              name: formData.recipientName.trim(),
              mobile: formData.phoneNumber.trim(),
            },
            address: {
              province: formData.provinceName,
              city: formData.cityName,
              district: formData.districtName,
              detail: formData.detailedAddress.trim(),
            },
          },
        });
        showToast("兑换成功，详细请到兑换记录查看", "success");
        setIsSubmittedSuccessfully(true);
      } else {
        // 普通地址提交场景：调用地址提交接口
        const addressData = {
          receiver: formData.recipientName.trim(),
          mobile: formData.phoneNumber.trim(),
          province_name: formData.provinceName,
          city_name: formData.cityName,
          district_name: formData.districtName,
          address_detail: formData.detailedAddress.trim(),
        };
        await submitAddress(addressData);
        showToast("地址提交成功", "success");
        setIsSubmittedSuccessfully(true);
      }
      // If onClose callback is provided, use it (for non-redirect flow)
      // Otherwise, redirect to reward section (for URL-based flow)
      if (onClose) {
        setTimeout(() => {
          onClose();
        }, 500);
      } else {
        // Remove all URL parameters and reload the current page
        setTimeout(() => {
          // pathname from usePathname() already excludes query params, but we ensure clean URL
          const cleanPath = pathname.split('?')[0]; // Remove any query params if present
          window.location.replace(cleanPath);
        }, 500);
      }
    } catch (error) {
      console.error("Failed to submit:", error);
      const errorMessage = (error as { msg?: string; message?: string })?.msg ||
        (error as { msg?: string; message?: string })?.message ||
        "提交失败，请重试";
      showToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div 
        className="sticky top-0 bg-white z-10"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)'
        }}
      >
        <div className="flex items-center justify-center h-[44px] relative">
          <button
            onClick={handleBack}
            className="absolute left-0 min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-gray-600 active:opacity-60 transition-opacity"
            aria-label="返回"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="text-[#056DE8] text-base font-medium">收货地址</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 pt-6 pb-24">
        {/* Region Field */}
        <div className="mb-4 text-sm">
          <button
            type="button"
            onClick={() => {
              if (taskStatus !== 3 && !isSubmittedSuccessfully) {
                setShowRegionPicker(true);
              }
            }}
            disabled={taskStatus === 3 || isSubmittedSuccessfully}
            className={`w-full text-left pb-3 border-b focus:outline-none ${errors.region
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              } ${taskStatus === 3 || isSubmittedSuccessfully ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={
                formData.region
                  ? "text-gray-900"
                  : "text-gray-400"
              }
            >
              {formData.region || "*所在地区"}
            </span>
          </button>
          {errors.region && (
            <p className="text-red-500 text-xs mt-1">{errors.region}</p>
          )}
        </div>

        {/* Detailed Address Field */}
        <div className="mb-4 text-sm">
          <input
            type="text"
            value={formData.detailedAddress}
            onChange={(e) =>
              handleInputChange("detailedAddress", e.target.value)
            }
            onBlur={() => handleBlur("detailedAddress")}
            placeholder="*详细地址与门牌号"
            disabled={taskStatus === 3 || isSubmittedSuccessfully}
            className={`w-full pb-3 border-b focus:outline-none text-gray-900 placeholder:text-gray-400 ${errors.detailedAddress
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              } ${taskStatus === 3 || isSubmittedSuccessfully ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.detailedAddress && (
            <p className="text-red-500 text-xs mt-1">{errors.detailedAddress}</p>
          )}
        </div>

        {/* Recipient Name Field */}
        <div className="mb-4 text-sm">
          <input
            type="text"
            value={formData.recipientName}
            onChange={(e) => handleInputChange("recipientName", e.target.value)}
            onBlur={() => handleBlur("recipientName")}
            placeholder="*收货人姓名"
            disabled={taskStatus === 3 || isSubmittedSuccessfully}
            className={`w-full pb-3 border-b focus:outline-none text-gray-900 placeholder:text-gray-400 ${errors.recipientName
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              } ${taskStatus === 3 || isSubmittedSuccessfully ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.recipientName && (
            <p className="text-red-500 text-xs mt-1">{errors.recipientName}</p>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="mb-4 text-sm">
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            onBlur={() => handleBlur("phoneNumber")}
            placeholder="*手机号"
            maxLength={11}
            disabled={taskStatus === 3 || isSubmittedSuccessfully}
            className={`w-full pb-3 border-b focus:outline-none text-gray-900 placeholder:text-gray-400 ${errors.phoneNumber
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              } ${taskStatus === 3 || isSubmittedSuccessfully ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Notice Text */}
        <p className="text-xs text-gray mb-8">
          收货地址不支持更换,请确保地址准确
        </p>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 pb-safe text-sm">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || isSubmittedSuccessfully || !isFormFilled || hasExistingAddress || (!fromRedeem && taskStatus !== null && taskStatus !== 2)}
          className="w-full bg-blue text-white py-3 rounded-[30px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "提交中..." : isSubmittedSuccessfully ? "已提交" : "确认地址"}
        </button>
      </div>

      {/* Region Picker Modal */}
      {showRegionPicker && (
        <RegionPicker
          selectedRegion={formData.region}
          onSelect={handleRegionSelect}
          onClose={() => {
            setShowRegionPicker(false);
            // Validate region when picker closes if no region is selected
            if (!formData.region) {
              setErrors((prev) => ({ ...prev, region: "请选择所在地区" }));
            }
          }}
        />
      )}
    </div>
  );
}

