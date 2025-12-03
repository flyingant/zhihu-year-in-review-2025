"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "@/context/toast-context";
import { getAddressInfo, submitAddress, completeRedeemReward } from "@/api/campaign";
import { useAssets } from "@/context/assets-context";
import { useZA } from '@/hooks/useZA';
import RegionPicker from "./RegionPicker";

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

export default function AddressForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { showToast } = useToast();
  const { trackPageShow, trackPageDisappear, trackEvent } = useZA();
  const { assets } = useAssets();

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

  const rewardId = searchParams.get("rewardId");
  const rewardPoolId = searchParams.get("rewardPoolId");
  const requestId = searchParams.get("requestId");
  const rewardRightType = searchParams.get("rewardRightType");
  const stockOccupyId = searchParams.get("stockOccupyId");
  const fromRedeem = searchParams.get("from") === "redeem";

  useEffect(() => {
    if (!fromRedeem) trackPageShow();
    return () => {
      if (!fromRedeem) trackPageDisappear();
    };
  }, [fromRedeem]);

  const isFormFilled =
    !!formData.region &&
    !!formData.detailedAddress?.trim() &&
    !!formData.recipientName?.trim() &&
    !!formData.phoneNumber?.trim() &&
    phoneRegex.test(formData.phoneNumber?.trim());

  // Fetch existing address on mount (only for non-redeem scenarios)
  useEffect(() => {
    // Skip fetching address in redeem scenario
    if (fromRedeem) {
      setIsLoading(false);
      return;
    }

    const fetchExistingAddress = async () => {
      try {
        setIsLoading(true);
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
        }
      } catch {
        // If address doesn't exist, that's fine - form will be empty
        console.log("No existing address found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingAddress();
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

  const handleBack = () => {
    router.back();
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
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    try {
      // 兑换场景：调用完成兑换接口
      if (fromRedeem) {
        // 验证兑换场景所需的参数（stockOccupyId 是必填参数）
        if (!rewardId || !rewardPoolId || !requestId || !rewardRightType || !stockOccupyId) {
          showToast("兑换信息不完整，请重新操作", "error");
          setIsSubmitting(false);
          return;
        }

        if (!assets?.campaign) {
          showToast("活动信息加载中，请稍后再试", "error");
          setIsSubmitting(false);
          return;
        }
        
        // 根据API文档，stock_occupy_id 是兑换时接口返回的字段，必须传递
        await completeRedeemReward(assets.campaign.activityId, {
          request_id: parseInt(requestId, 10), // 使用预占接口的原始 request_id
          reward_pool_id: parseInt(rewardPoolId, 10),
          reward_right_id: parseInt(rewardId, 10),
          reward_right_type: rewardRightType,
          stock_occupy_id: parseInt(stockOccupyId, 10), // 必填：从预占接口返回
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
      } else {
        //埋点28
        //只有liukanshan收货地址点击确认才有
        trackEvent('', {
          moduleId: 'kanshan_address_button_2025',
          type: 'Button'
        });
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
      }
      // Redirect back after successful submission
      setTimeout(() => {
        router.push(pathname);
      }, 1500);
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
      <div className="sticky top-0 bg-white z-10">
        <div className="flex items-center justify-center h-[44px] relative">
          <button
            onClick={handleBack}
            className="absolute left-4 p-2 -ml-2 text-gray-600"
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
            onClick={() => setShowRegionPicker(true)}
            className={`w-full text-left pb-3 border-b focus:outline-none ${errors.region
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              }`}
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
            className={`w-full pb-3 border-b focus:outline-none text-gray-900 placeholder:text-gray-400 ${errors.detailedAddress
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              }`}
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
            className={`w-full pb-3 border-b focus:outline-none text-gray-900 placeholder:text-gray-400 ${errors.recipientName
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              }`}
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
            className={`w-full pb-3 border-b focus:outline-none text-gray-900 placeholder:text-gray-400 ${errors.phoneNumber
              ? "border-red-500"
              : "border-gray-200 focus:border-blue-500"
              }`}
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
          disabled={isSubmitting || !isFormFilled}
          className="w-full bg-blue text-white py-3 rounded-[30px] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "提交中..." : "确认地址"}
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

